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

enum AIModels {
  GPT_4_1 = 'gpt-4.1',
  GPT_4_1_NANO = 'gpt-4.1-nano',
  GPT_4O = 'gpt-4o',
  O4_MINI = 'o4-mini',
  CLAUDE_OPUS_4 = 'claude-opus-4',
  CLAUDE_SONNET_4 = 'claude-sonnet-4',
  CLAUDE_SONNET_3_7 = 'claude-sonnet-3.7',
  CLAUDE_HAIKU_3_5 = 'claude-haiku-3.5',
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
}

const getModelIcon = (modelId: string): string => {
  if (modelId.startsWith('claude')) return '/model-icons/claude-color.png';
  else if (modelId.startsWith('gemini')) return '/model-icons/gemini-color.png';
  else {
    return '/model-icons/openai.png';
  }
};

const ModelAI = ({ onModelChange }: ModelAIProps) => {
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4.1']);
  // const [models, setModels] = useState<{ id: string; name: string }[]>([]);
  const models = [
    { label: 'GPT-4.1', value: AIModels.GPT_4_1 },
    { label: 'GPT-4.1-nano', value: AIModels.GPT_4_1_NANO },
    { label: 'GPT-4o', value: AIModels.GPT_4O },
    { label: 'o4-mini', value: AIModels.O4_MINI },
    { label: 'Claude Opus 4', value: AIModels.CLAUDE_OPUS_4 },
    { label: 'Claude Sonnet 4', value: AIModels.CLAUDE_SONNET_4 },
    { label: 'Claude Sonnet 3.7', value: AIModels.CLAUDE_SONNET_3_7 },
    { label: 'Claude Haiku 3.5', value: AIModels.CLAUDE_HAIKU_3_5 },
    { label: 'Gemini 2.5 Pro', value: AIModels.GEMINI_2_5_PRO },
    { label: 'Gemini 2.5 Flash', value: AIModels.GEMINI_2_5_FLASH },
  ];

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
                    <div key={modelId}>
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
            <label key={model.value} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedModels.includes(model.value)}
                onChange={() => handleModelChange(model.value)}
              />
              <img
                src={getModelIcon(model.value)}
                alt="Model Icon"
                className="w-6 h-6 rounded mr-1 ml-2 object-cover"
              />
              <span className="ml-2">{model.value}</span>
            </label>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ModelAI;
