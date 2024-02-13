import { SettingComponentData } from './settingComponentBuilder'

export const presetConfiguration: Record<string, SettingComponentData> = {
 /*
  prompt_template: {
    name: 'prompt_template',
    title: 'Prompt template',
    description: 'The prompt to use for internal configuration.',
    controllerType: 'input',
    controllerData: {
      placeholder: 'Prompt template',
      value: 'You are a helpful assistant',
    },
  },
  stop: {
    name: 'stop',
    title: 'Stop',
    description:
      'Defines specific tokens or phrases at which the model will stop generating further output.	',
    controllerType: 'input',
    controllerData: {
      placeholder: 'Stop',
      value: "",
    },
  },
  */
  
  ctx_len: {
    name: 'ctx_len',
    title: 'Context Length',
    description:
      'The context length for model operations varies; the maximum depends on the specific model used.',
    controllerType: 'slider',
    controllerData: {
      min: 0,
      max: 4096,
      step: 128,
      value: 1024,
    },
  },
  max_tokens: {
    name: 'max_tokens',
    title: 'Max Tokens',
    description:
      'The maximum number of tokens the model will generate in a single response.',
    controllerType: 'slider',
    controllerData: {
      min: 128,
      max: 4096,
      step: 128,
      value: 2048,
    },
  },
  ngl: {
    name: 'ngl',
    title: 'Number of GPU layers (ngl)',
    description: 'The number of layers to load onto the GPU for acceleration.',
    controllerType: 'slider',
    controllerData: {
      min: 1,
      max: 100,
      step: 1,
      value: 10,
    },
  },
  embedding: {
    name: 'embedding',
    title: 'Embedding',
    description: 'Whether to enable embedding.',
    controllerType: 'checkbox',
    controllerData: {
      checked: true,
    },
  },
  stream: {
    name: 'stream',
    title: 'Stream',
    description: 'Enable real-time data processing for faster predictions.',
    controllerType: 'checkbox',
    controllerData: {
      checked: false,
    },
  },
  temperature: {
    name: 'temperature',
    title: 'Temperature',
    description: 'Controls the randomness of the model’s output.',
    controllerType: 'slider',
    controllerData: {
      min: 0,
      max: 2,
      step: 0.1,
      value: 0.7,
    },
  },
  frequency_penalty: {
    name: 'frequency_penalty',
    title: 'Frequency Penalty',
    description:
      'Adjusts the likelihood of the model repeating words or phrases in its output.	',
    controllerType: 'slider',
    controllerData: {
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.5,
    },
  },
  presence_penalty: {
    name: 'presence_penalty',
    title: 'Presence Penalty',
    description:
      'Influences the generation of new and varied concepts in the model’s output.	',
    controllerType: 'slider',
    controllerData: {
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.5,
    },
  },
  top_p: {
    name: 'top_p',
    title: 'Top P',
    description: 'Set probability threshold for more relevant outputs.',
    controllerType: 'slider',
    controllerData: {
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.2,
    },
  },
  n_parallel: {
    name: 'n_parallel',
    title: 'N Parallel',
    description:
      'The number of parallel operations. Only set when enable continuous batching.	',
    controllerType: 'slider',
    controllerData: {
      min: 0,
      max: 4,
      step: 1,
      value: 1,
    },
  },
}
