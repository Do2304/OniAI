import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SquarePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModelAIProps {
  onModelChange: (model: string) => void;
}

const ModelAI = ({ onModelChange }: ModelAIProps) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const models = [
    { label: 'GPT-4.1', value: 'gpt-4.1' },
    { label: 'GPT-4.1-nano', value: 'gpt-4.1-nano' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'o4-mini', value: 'o4-mini' },
    // { label: 'whisper', value: 'whisper' },
    // { label: 'Image-GPT-1', value: 'image-gpt-1' },
    // { label: 'GPT-4.5', value: 'gpt-4.5' },
    // { label: 'sora', value: 'sora' },
  ];

  useEffect(() => {
    console.log('Selected Model:', selectedModel);
    onModelChange(selectedModel);
  }, [selectedModel, onModelChange]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-2 ml-1 rounded-full">
            <SquarePlus />
            <span className="hidden lg:inline">Basic Model</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="top" align="center">
          <DropdownMenuLabel>Choose Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            {models.map((model) => (
              <DropdownMenuRadioItem key={model.value} value={model.value}>
                {model.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
export default ModelAI;
