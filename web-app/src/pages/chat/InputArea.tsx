import InputAction from './inputAction/InputAction';
import InputChat from './InputChat';

interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}
interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  selectedModel: string[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSelectedModel: (model: string[]) => void;
  handleSend: () => Promise<void>;
}

const InputArea = ({
  input,
  setInput,
  selectedModel,
  setMessages,
  setSelectedModel,
  handleSend,
}: InputAreaProps) => {
  return (
    <>
      <InputChat
        input={input}
        setInput={setInput}
        selectedModel={selectedModel}
        setMessages={setMessages}
      />
      <div style={{ height: '48px' }}></div>
      <InputAction
        setSelectedModel={setSelectedModel}
        handleSend={handleSend}
      />
    </>
  );
};

export default InputArea;
