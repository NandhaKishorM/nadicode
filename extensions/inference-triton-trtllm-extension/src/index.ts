/**
 * @file This file exports a class that implements the InferenceExtension interface from the @janhq/core package.
 * The class provides methods for initializing and stopping a model, and for making inference requests.
 * It also subscribes to events emitted by the @janhq/core package and handles new message requests.
 * @version 1.0.0
 * @module inference-nvidia-triton-trt-llm-extension/src/index
 */

import {
  ChatCompletionRole,
  ContentType,
  EventName,
  MessageRequest,
  MessageStatus,
  ModelSettingParams,
  ExtensionType,
  ThreadContent,
  ThreadMessage,
  events,
  fs,
  Model,
} from "@janhq/core";
import { InferenceExtension } from "@janhq/core";
import { requestInference } from "./helpers/sse";
import { ulid } from "ulid";
import { join } from "path";
import { EngineSettings } from "./@types/global";

/**
 * A class that implements the InferenceExtension interface from the @janhq/core package.
 * The class provides methods for initializing and stopping a model, and for making inference requests.
 * It also subscribes to events emitted by the @janhq/core package and handles new message requests.
 */
export default class JanInferenceTritonTrtLLMExtension
  implements InferenceExtension
{
  private static readonly _homeDir = "file://engines";
  private static readonly _engineMetadataFileName = "triton_trtllm.json";

  static _currentModel: Model;

  static _engineSettings: EngineSettings = {
    base_url: "",
  };

  controller = new AbortController();
  isCancelled = false;

  /**
   * Returns the type of the extension.
   * @returns {ExtensionType} The type of the extension.
   */
  // TODO: To fix
  type(): ExtensionType {
    return undefined;
  }
  /**
   * Subscribes to events emitted by the @janhq/core package.
   */
  async onLoad() {
    if (!(await fs.existsSync(JanInferenceTritonTrtLLMExtension._homeDir)))
      JanInferenceTritonTrtLLMExtension.writeDefaultEngineSettings();

    // Events subscription
    events.on(EventName.OnMessageSent, (data) =>
      JanInferenceTritonTrtLLMExtension.handleMessageRequest(data, this)
    );

    events.on(EventName.OnModelInit, (model: Model) => {
      JanInferenceTritonTrtLLMExtension.handleModelInit(model);
    });

    events.on(EventName.OnModelStop, (model: Model) => {
      JanInferenceTritonTrtLLMExtension.handleModelStop(model);
    });
  }

  /**
   * Stops the model inference.
   */
  onUnload(): void {}

  /**
   * Initializes the model with the specified file name.
   * @param {string} modelId - The ID of the model to initialize.
   * @returns {Promise<void>} A promise that resolves when the model is initialized.
   */
  async initModel(
    modelId: string,
    settings?: ModelSettingParams
  ): Promise<void> {
    return;
  }

  static async writeDefaultEngineSettings() {
    try {
      const engine_json = join(
        JanInferenceTritonTrtLLMExtension._homeDir,
        JanInferenceTritonTrtLLMExtension._engineMetadataFileName
      );
      if (await fs.existsSync(engine_json)) {
        const engine = await fs.readFileSync(engine_json, "utf-8");
        JanInferenceTritonTrtLLMExtension._engineSettings =
          typeof engine === "object" ? engine : JSON.parse(engine);
      } else {
        await fs.writeFileSync(
          engine_json,
          JSON.stringify(
            JanInferenceTritonTrtLLMExtension._engineSettings,
            null,
            2
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Stops the model.
   * @returns {Promise<void>} A promise that resolves when the model is stopped.
   */
  async stopModel(): Promise<void> {}

  /**
   * Stops streaming inference.
   * @returns {Promise<void>} A promise that resolves when the streaming is stopped.
   */
  async stopInference(): Promise<void> {
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
      requestInference(
        data.messages ?? [],
        JanInferenceTritonTrtLLMExtension._engineSettings,
        JanInferenceTritonTrtLLMExtension._currentModel
      ).subscribe({
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

  private static async handleModelInit(model: Model) {
    if (model.engine !== "triton_trtllm") {
      return;
    } else {
      JanInferenceTritonTrtLLMExtension._currentModel = model;
      JanInferenceTritonTrtLLMExtension.writeDefaultEngineSettings();
      // Todo: Check model list with API key
      events.emit(EventName.OnModelReady, model);
      // events.emit(EventName.OnModelFail, model)
    }
  }

  private static async handleModelStop(model: Model) {
    if (model.engine !== "triton_trtllm") {
      return;
    }
    events.emit(EventName.OnModelStopped, model);
  }

  /**
   * Handles a new message request by making an inference request and emitting events.
   * Function registered in event manager, should be static to avoid binding issues.
   * Pass instance as a reference.
   * @param {MessageRequest} data - The data for the new message request.
   */
  private static async handleMessageRequest(
    data: MessageRequest,
    instance: JanInferenceTritonTrtLLMExtension
  ) {
    if (data.model.engine !== "triton_trtllm") {
      return;
    }

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

    instance.isCancelled = false;
    instance.controller = new AbortController();

    requestInference(
      data?.messages ?? [],
      this._engineSettings,
      {
        ...JanInferenceTritonTrtLLMExtension._currentModel,
        parameters: data.model.parameters,
      },
      instance.controller
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
        if (instance.isCancelled || message.content.length) {
          message.status = MessageStatus.Error;
          events.emit(EventName.OnMessageUpdate, message);
          return;
        }
        const messageContent: ThreadContent = {
          type: ContentType.Text,
          text: {
            value: "Error occurred: " + err.message,
            annotations: [],
          },
        };
        message.content = [messageContent];
        message.status = MessageStatus.Ready;
        events.emit(EventName.OnMessageUpdate, message);
      },
    });
  }
}
