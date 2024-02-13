import { Model } from '@janhq/core';

export const modelBinFileName = (model: Model) => {
  const modelFormatExt = '.gguf';
  const urlval = "https://nocodeai.s3.amazonaws.com//mnt/batch/tasks/shared/LS_root/mounts/clusters/number4a100/code/Users/nandakishor/final_weights_new/Nadi_Tesseract_V11.gguf";
  const extractedFileName = urlval.split('/').pop() ?? model.id;
  const fileName = extractedFileName.toLowerCase().endsWith(modelFormatExt)
    ? extractedFileName
    : model.id;
  return fileName;
};
