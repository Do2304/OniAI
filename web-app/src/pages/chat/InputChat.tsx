import { Input } from '@/components/ui/input';

interface InputChatProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

const InputChat = ({ input, setInput, handleSend }: InputChatProps) => {
  return (
    <>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        className="h-[100px] rounded-4xl pb-10 pl-5"
        placeholder="Ask anything..."
      />
    </>
  );
};

export default InputChat;
