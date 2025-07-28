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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ModelAIProps {
  onModelChange: (models: string[]) => void;
}

const getModelIcon = (modelId: string): string => {
  if (modelId.startsWith('openai/')) return '/model-icons/openai.png';
  else if (modelId.startsWith('google/'))
    return '/model-icons/gemini-color.png';
  else {
    return '/model-icons/deepseek-color.png';
  }
};

const ModelAI = ({ onModelChange }: ModelAIProps) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getListModelOpenRouter();
        const allModels = data.models;
        // console.log('allModels', allModels);

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
            {/* <span className="hidden lg:inline">Select Models</span> */}
            <span className="flex items-center ">
              {selectedModels.length > 0
                ? selectedModels.map((modelId) => (
                    <div>
                      <Avatar className="h-5 w-5 ml-1">
                        <AvatarImage src={getModelIcon(modelId)} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                  ))
                : 'Select model'}
            </span>
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
              <img
                src={getModelIcon(model.id)}
                alt="Model Icon"
                className="w-6 h-6 rounded mr-1 ml-2 object-cover"
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
