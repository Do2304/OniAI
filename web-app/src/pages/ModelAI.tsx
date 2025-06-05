import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-react';

const ModelAI = () => {
  return (
    <>
      <Button variant="outline" className="p-2 ml-1 rounded-full">
        <SquarePlus />
        <span className="hidden lg:inline">Basic Model</span>
      </Button>
    </>
  );
};
export default ModelAI;
