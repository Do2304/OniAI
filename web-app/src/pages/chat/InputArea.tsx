import { useState } from 'react';
import InputAction from './inputAction/InputAction';
import InputChat from './InputChat';

interface InputAreaProps {
  setSelectedModel: (model: string[]) => void;
  handleSend: (input: string, onClear: () => void) => Promise<void>;
}

const InputArea = ({ setSelectedModel, handleSend }: InputAreaProps) => {
  const [input, setInput] = useState('');
  const onSubmit = () => {
    handleSend(input, () => {
      setInput('');
    });
  };
  return (
    <>
      <InputChat input={input} setInput={setInput} handleSend={onSubmit} />
      <div style={{ height: '48px' }}></div>
      <InputAction setSelectedModel={setSelectedModel} handleSend={onSubmit} />
    </>
  );
};

export default InputArea;
