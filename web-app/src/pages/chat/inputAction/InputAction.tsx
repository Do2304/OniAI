import { Button } from '@/components/ui/button';
import { ArrowUp, Globe, Mic, Plus } from 'lucide-react';
import ModelAI from '../../ModelAI';
import ButtonCountUseToken from './ButtonCountUseToken';

interface InputActionsProps {
  setSelectedModel: (model: string[]) => void;
  handleSend: () => Promise<void>;
}

const InputAction = ({ setSelectedModel, handleSend }: InputActionsProps) => {
  return (
    <div className="absolute start-3 end-0 bottom-6 z-2 flex items-center">
      <div className="w-full flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            size="icon"
            className="p-2 ml-4 rounded-full"
          >
            <Plus />
          </Button>
          <ModelAI onModelChange={setSelectedModel} />
          <Button variant="outline" className="p-2 ml-1 rounded-full">
            <Globe />
            <span className="hidden lg:inline">Search</span>
          </Button>
          <ButtonCountUseToken />
        </div>
        <div>
          <Button variant="outline" size="icon" className="p-2 rounded-full">
            <Mic />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-2 mr-8 ml-1 rounded-full z-[50]"
            onClick={handleSend}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputAction;
