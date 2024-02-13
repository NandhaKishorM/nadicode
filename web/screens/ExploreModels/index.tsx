import { useState } from 'react';
import { openExternalUrl } from '@janhq/core';
import { Input, ScrollArea, Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@janhq/uikit';
import { SearchIcon } from 'lucide-react';
import Loader from '@/containers/Loader';
import ExploreModelList from './ExploreModelList';

const ExploreModelsScreen = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortSelected, setSortSelected] = useState('All Models');
  const sortMenu = ['All Models', 'Recommended', 'Downloaded'];

  // Directly using the provided JSON
  const sampleModel =  {
    "source_url": "https://nocodeai.s3.amazonaws.com//mnt/batch/tasks/shared/LS_root/mounts/clusters/number4a100/code/Users/nandakishor/final_weights_new/Nadi_Tesseract_V11.gguf",
    "id": "nadi-tesseract-v11",
    "object": "model",
    "name": "Nadi Tesseract V1.1",
    "version": 1.1,
    "created":1455667895,
    "description": "Nadi Tesseract V1.1 is a fine tuned quantized LLM for coding capabilities",
    "format": "gguf",
    "settings": {
      "ctx_len": 4096,
      "prompt_template": "### Instruction:\n{prompt}\n### Response:"
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "max_tokens": 4096,
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "Convai Innovations",
      "tags": ["Tiny", "Foundational Model"],
      "size": 776066240
    },
    "engine": "nitro"
  }
  
  
  const filteredModels = [sampleModel]; // Use the provided JSON directly

  const onHowToImportModelClick = () => {
    openExternalUrl('https://jan.ai/guides/using-models/import-manually/');
  };

  return (
    <div className="flex h-full w-full overflow-y-auto bg-background">
      <div className="h-full w-full p-4">
        <div className="h-full" data-test-id="testid-explore-models">
          <ScrollArea>
            <div className="relative">
              <img src="./images/hub-banner.png" alt="Hub Banner" className="w-full object-cover" />
              <div className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <SearchIcon
                    size={20}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search models"
                    className="bg-white pl-9 dark:bg-background"
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mx-auto w-4/5 py-6">
              <div className="flex items-center justify-end">
                <Select
                  value={sortSelected}
                  onValueChange={(value) => {
                    setSortSelected(value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort By"></SelectValue>
                  </SelectTrigger>
                  <SelectContent className="right-0 block w-full min-w-[200px] pr-0">
                    <SelectGroup>
                      {sortMenu.map((x, i) => (
                        <SelectItem key={i} value={x}>
                          <span className="line-clamp-1 block">{x}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-6">
                <ExploreModelList models={filteredModels} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ExploreModelsScreen;
