import InputAction from './inputAction/InputAction';
import InputChat from './InputChat';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  setSelectedModel: (model: string[]) => void;
  handleSend: () => Promise<void>;
}

const InputArea = ({
  input,
  setInput,
  setSelectedModel,
  handleSend,
}: InputAreaProps) => {
  return (
    <>
      <InputChat input={input} setInput={setInput} handleSend={handleSend} />
      <div style={{ height: '48px' }}></div>
      <InputAction
        setSelectedModel={setSelectedModel}
        handleSend={handleSend}
      />
    </>
  );
};

export default InputArea;
