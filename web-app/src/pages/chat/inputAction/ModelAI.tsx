import { getListModelOpenRouter } from '@/api/modelService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SquarePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

// enum AIModels {
//   GPT_4O = 'openai/gpt-4o',
//   CODEX_MINI = 'openai/codex-mini',
//   CLAUDE_OPUS = 'anthropic/claude-3-opus-20240229',
//   CLAUDE_SONNET = 'anthropic/claude-3-sonnet-20240229',
//   CLAUDE_HAIKU = 'anthropic/claude-3-haiku-20240307',
//   GEMINI_PRO = 'google/gemini-2.5-pro',
//   GEMINI_FLASH = 'google/gemini-2.5-flash',
//   GEMINI_FLASH_LITE = 'google/gemini-2.5-flash-lite-preview-06-17',
//   DEEPSEEK_R1T2 = 'tngtech/deepseek-r1t2-chimera:free',
// }

interface ModelAIProps {
  onModelChange: (models: string[]) => void;
}

const ModelAI = ({ onModelChange }: ModelAIProps) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  // const models = [
  //   { label: 'GPT-4o', value: AIModels.GPT_4O },
  //   { label: 'Codex Mini', value: AIModels.CODEX_MINI },
  //   { label: 'Claude Opus', value: AIModels.CLAUDE_OPUS },
  //   { label: 'Claude Sonnet', value: AIModels.CLAUDE_SONNET },
  //   { label: 'Claude Haiku', value: AIModels.CLAUDE_HAIKU },
  //   { label: 'Gemini 2.5 Pro', value: AIModels.GEMINI_PRO },
  //   { label: 'Gemini 2.5 Flash', value: AIModels.GEMINI_FLASH },
  //   { label: 'Gemini 2.5 Flash_lite', value: AIModels.GEMINI_FLASH_LITE },
  //   { label: 'Deepseek R1T2', value: AIModels.DEEPSEEK_R1T2 },
  // ];
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getListModelOpenRouter();
        const allModels = data.models;
        console.log('allModels', allModels);

        const getTopModelsByPrefix = (
          models: { id: string; name: string }[],
          prefix: string,
          limit = 10,
        ) => {
          return models
            .filter((model) => model.id.startsWith(prefix))
            .slice(0, limit);
        };

        const topOpenAI = getTopModelsByPrefix(allModels, 'openai/');
        const topGemini = getTopModelsByPrefix(allModels, 'google/');
        const topDeepSeek = getTopModelsByPrefix(allModels, 'deepseek/');

        setModels([...topOpenAI, ...topGemini, ...topDeepSeek]);
        const finalModels = [...topOpenAI, ...topGemini, ...topDeepSeek];
        setSelectedModels((prev) => {
          if (prev.length === 0 && finalModels.length > 0) {
            return [finalModels[1].id];
          }
          return prev;
        });
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };
    fetchModels();
  }, []);

  const handleModelChange = (value: string) => {
    setSelectedModels((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((model) => model !== value);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, value];
      }
      return prevSelected;
    });
  };

  useEffect(() => {
    // console.log('Selected Models:', selectedModels);
    onModelChange(selectedModels);
  }, [selectedModels, onModelChange]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-2 ml-1 rounded-full">
            <SquarePlus />
            <span className="hidden lg:inline">Select Models</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="top" align="center">
          <DropdownMenuLabel>Choose Models (Max 3)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <label key={model.id} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedModels.includes(model.id)}
                onChange={() => handleModelChange(model.id)}
              />
              <span className="ml-2">{model.name}</span>
            </label>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ModelAI;
