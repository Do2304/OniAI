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

interface ModelAIProps {
  onModelChange: (models: string[]) => void;
}

const ModelAI = ({ onModelChange }: ModelAIProps) => {
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4o']);
  const models = [
    { label: 'GPT-4.1', value: 'gpt-4.1' },
    { label: 'GPT-4.1-nano', value: 'gpt-4.1-nano' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'o4-mini', value: 'o4-mini' },
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
    console.log('Selected Models:', selectedModels);
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
            <label key={model.value} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedModels.includes(model.value)}
                onChange={() => handleModelChange(model.value)}
              />
              <span className="ml-2">{model.label}</span>
            </label>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ModelAI;
