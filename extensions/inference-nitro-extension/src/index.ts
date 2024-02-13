/**
 * @file This file exports a class that implements the InferenceExtension interface from the @janhq/core package.
 * The class provides methods for initializing and stopping a model, and for making inference requests.
 * It also subscribes to events emitted by the @janhq/core package and handles new message requests.
 * @version 1.0.0
 * @module inference-extension/src/index
 */

import {
  ChatCompletionRole,
  ContentType,
  EventName,
  MessageRequest,
  MessageStatus,
  ExtensionType,
  ThreadContent,
  ThreadMessage,
  events,
  executeOnMain,
  fs,
  Model,
  joinPath,
  InferenceExtension,
  log,
} from "@janhq/core";
import { requestInference } from "./helpers/sse";
import { ulid } from "ulid";
import { join } from "path";

/**
 * A class that implements the InferenceExtension interface from the @janhq/core package.
 * The class provides methods for initializing and stopping a model, and for making inference requests.
 * It also subscribes to events emitted by the @janhq/core package and handles new message requests.
 */
export default class JanInferenceNitroExtension implements InferenceExtension {
  private static readonly _homeDir = "file://engines";
  private static readonly _settingsDir = "file://settings";
  private static readonly _engineMetadataFileName = "nitro.json";

  /**
   * Checking the health for Nitro's process each 5 secs.
   */
  private static readonly _intervalHealthCheck = 5 * 1000;

  private _currentModel: Model;

  private _engineSettings: EngineSettings = {
    ctx_len: 2048,
    ngl: 30,
    cpu_threads: 1,
    cont_batching: false,
    embedding: false,
  };

  controller = new AbortController();
  isCancelled = false;

  /**
   * The interval id for the health check. Used to stop the health check.
   */
  private getNitroProcesHealthIntervalId: NodeJS.Timeout | undefined =
    undefined;

  /**
   * Tracking the current state of nitro process.
   */
  private nitroProcessInfo: any = undefined;

  /**
   * Returns the type of the extension.
   * @returns {ExtensionType} The type of the extension.
   */
  type(): ExtensionType {
    return ExtensionType.Inference;
  }

  /**
   * Subscribes to events emitted by the @janhq/core package.
   */
  async onLoad() {
    if (!(await fs.existsSync(JanInferenceNitroExtension._homeDir))) {
      await fs
        .mkdirSync(JanInferenceNitroExtension._homeDir)
        .catch((err) => console.debug(err));
    }

    if (!(await fs.existsSync(JanInferenceNitroExtension._settingsDir)))
      await fs.mkdirSync(JanInferenceNitroExtension._settingsDir);
    this.writeDefaultEngineSettings();

    // Events subscription
    events.on(EventName.OnMessageSent, (data) => this.onMessageRequest(data));

    events.on(EventName.OnModelInit, (model: Model) => this.onModelInit(model));

    events.on(EventName.OnModelStop, (model: Model) => this.onModelStop(model));

    events.on(EventName.OnInferenceStopped, () => this.onInferenceStopped());

    // Attempt to fetch nvidia info
    await executeOnMain(MODULE, "updateNvidiaInfo", {});
  }

  /**
   * Stops the model inference.
   */
  onUnload(): void {}

  private async writeDefaultEngineSettings() {
    try {
      const engineFile = join(
        JanInferenceNitroExtension._homeDir,
        JanInferenceNitroExtension._engineMetadataFileName
      );
      if (await fs.existsSync(engineFile)) {
        const engine = await fs.readFileSync(engineFile, "utf-8");
        this._engineSettings =
          typeof engine === "object" ? engine : JSON.parse(engine);
      } else {
        await fs.writeFileSync(
          engineFile,
          JSON.stringify(this._engineSettings, null, 2)
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async onModelInit(model: Model) {
    if (model.engine !== "nitro") return;

    const modelFullPath = await joinPath(["models", model.id]);

    const nitroInitResult = await executeOnMain(MODULE, "initModel", {
      modelFullPath: modelFullPath,
      model: model,
    });

    if (nitroInitResult.error === null) {
      events.emit(EventName.OnModelFail, model);
      return;
    }

    this._currentModel = model;
    events.emit(EventName.OnModelReady, model);

    this.getNitroProcesHealthIntervalId = setInterval(
      () => this.periodicallyGetNitroHealth(),
      JanInferenceNitroExtension._intervalHealthCheck
    );
  }

  private async onModelStop(model: Model) {
    if (model.engine !== "nitro") return;

    await executeOnMain(MODULE, "stopModel");
    events.emit(EventName.OnModelStopped, {});

    // stop the periocally health check
    if (this.getNitroProcesHealthIntervalId) {
      console.debug("Stop calling Nitro process health check");
      clearInterval(this.getNitroProcesHealthIntervalId);
      this.getNitroProcesHealthIntervalId = undefined;
    }
  }

  /**
   * Periodically check for nitro process's health.
   */
  private async periodicallyGetNitroHealth(): Promise<void> {
    const health = await executeOnMain(MODULE, "getCurrentNitroProcessInfo");

    const isRunning = this.nitroProcessInfo?.isRunning ?? false;
    if (isRunning && health.isRunning === false) {
      console.debug("Nitro process is stopped");
      events.emit(EventName.OnModelStopped, {});
    }
    this.nitroProcessInfo = health;
  }

  private async onInferenceStopped() {
    this.isCancelled = true;
    this.controller?.abort();
  }

  /**
   * Makes a single response inference request.
   * @param {MessageRequest} data - The data for the inference request.
   * @returns {Promise<any>} A promise that resolves with the inference response.
   */
  async inference(data: MessageRequest): Promise<ThreadMessage> {
    const timestamp = Date.now();
    const message: ThreadMessage = {
      thread_id: data.threadId,
      created: timestamp,
      updated: timestamp,
      status: MessageStatus.Ready,
      id: "",
      role: ChatCompletionRole.Assistant,
      object: "thread.message",
      content: [],
    };

    return new Promise(async (resolve, reject) => {
      requestInference(data.messages ?? [], this._currentModel).subscribe({
        next: (_content) => {},
        complete: async () => {
          resolve(message);
        },
        error: async (err) => {
          reject(err);
        },
      });
    });
  }

  /**
   * Handles a new message request by making an inference request and emitting events.
   * Function registered in event manager, should be static to avoid binding issues.
   * Pass instance as a reference.
   * @param {MessageRequest} data - The data for the new message request.
   */
  private async onMessageRequest(data: MessageRequest) {
    if (data.model.engine !== "nitro") return;

    const timestamp = Date.now();
    const message: ThreadMessage = {
      id: ulid(),
      thread_id: data.threadId,
      assistant_id: data.assistantId,
      role: ChatCompletionRole.Assistant,
      content: [],
      status: MessageStatus.Pending,
      created: timestamp,
      updated: timestamp,
      object: "thread.message",
    };
    events.emit(EventName.OnMessageResponse, message);

    this.isCancelled = false;
    this.controller = new AbortController();

    requestInference(
      data.messages ?? [],
      { ...this._currentModel, ...data.model },
      this.controller
    ).subscribe({
      next: (content) => {
        const messageContent: ThreadContent = {
          type: ContentType.Text,
          text: {
            value: content.trim(),
            annotations: [],
          },
        };
        message.content = [messageContent];
        events.emit(EventName.OnMessageUpdate, message);
      },
      complete: async () => {
        message.status = message.content.length
          ? MessageStatus.Ready
          : MessageStatus.Error;
        events.emit(EventName.OnMessageUpdate, message);
      },
      error: async (err) => {
        if (this.isCancelled || message.content.length) {
          message.status = MessageStatus.Stopped;
          events.emit(EventName.OnMessageUpdate, message);
          return;
        }
        message.status = MessageStatus.Error;
        events.emit(EventName.OnMessageUpdate, message);
        log(`[APP]::Error: ${err.message}`);
      },
    });
  }
}
