import { ExtensionType, fs, Assistant } from "@janhq/core";
import { AssistantExtension } from "@janhq/core";
import { join } from "path";

export default class JanAssistantExtension implements AssistantExtension {
  private static readonly _homeDir = "file://assistants";

  type(): ExtensionType {
    return ExtensionType.Assistant;
  }

  async onLoad() {
    // making the assistant directory
    if (!(await fs.existsSync(JanAssistantExtension._homeDir)))
      fs.mkdirSync(JanAssistantExtension._homeDir).then(() => {
        this.createJanAssistant();
      });
  }

  /**
   * Called when the extension is unloaded.
   */
  onUnload(): void {}

  async createAssistant(assistant: Assistant): Promise<void> {
    const assistantDir = join(JanAssistantExtension._homeDir, assistant.id);
    if (!(await fs.existsSync(assistantDir))) await fs.mkdirSync(assistantDir);

    // store the assistant metadata json
    const assistantMetadataPath = join(assistantDir, "assistant.json");
    try {
      await fs.writeFileSync(
        assistantMetadataPath,
        JSON.stringify(assistant, null, 2)
      );
    } catch (err) {
      console.error(err);
    }
  }

  async getAssistants(): Promise<Assistant[]> {
    // get all the assistant directories
    // get all the assistant metadata json
    const results: Assistant[] = [];
    const allFileName: string[] = await fs.readdirSync(
      JanAssistantExtension._homeDir
    );
    for (const fileName of allFileName) {
      const filePath = join(JanAssistantExtension._homeDir, fileName);

      if (filePath.includes(".DS_Store")) continue;
      const jsonFiles: string[] = (await fs.readdirSync(filePath)).filter(
        (file: string) => file === "assistant.json"
      );

      if (jsonFiles.length !== 1) {
        // has more than one assistant file -> ignore
        continue;
      }

      const content = await fs.readFileSync(
        join(filePath, jsonFiles[0]),
        "utf-8"
      );
      const assistant: Assistant =
        typeof content === "object" ? content : JSON.parse(content);

      results.push(assistant);
    }

    return results;
  }

  async deleteAssistant(assistant: Assistant): Promise<void> {
    if (assistant.id === "Nadi") {
      return Promise.reject("Cannot delete Nadi Assistant");
    }

    // remove the directory
    const assistantDir = join(JanAssistantExtension._homeDir, assistant.id);
    await fs.rmdirSync(assistantDir);
    return Promise.resolve();
  }

  private async createJanAssistant(): Promise<void> {
    const janAssistant: Assistant = {
      avatar: "",
      thread_location: undefined,
      id: "Nadi",
      object: "assistant",
      created_at: Date.now(),
      name: "Nadi",
      description: "A default assistant that can use all downloaded models",
      model: "*",
      instructions: "",
      tools: undefined,
      file_ids: [],
      metadata: undefined,
    };

    await this.createAssistant(janAssistant);
  }
}
