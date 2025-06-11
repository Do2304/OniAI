import { useNavigate, useParams } from 'react-router-dom';
import { conversationUser } from '@/api/chatService';
import { useConversation } from '@/utils/ConversationContext';
import { v4 as uuidv4 } from 'uuid';
import { processStreamEvent } from '@/services/handleMessage';
import { Input } from '@/components/ui/input';
import useUserId from '@/utils/useUserId';

interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}
interface InputChatProps {
  input: string;
  setInput: (value: string) => void;
  selectedModel: string[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const InputChat = ({
  input,
  setInput,
  selectedModel,
  setMessages,
}: InputChatProps) => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { triggerUpdate } = useConversation();
  const userInfo = useUserId();

  const handleSend = async () => {
    if (!input) return;

    const newMessages: Message = { id: '', role: 'User', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessages]);

    const query = encodeURIComponent(JSON.stringify(input));
    let startConversationId: string;
    if (!conversationId) {
      const response = await conversationUser();
      startConversationId = response.conversationId;
      triggerUpdate();
      navigate(`/chat/${response.conversationId}`);
    }

    selectedModel.forEach((model) => {
      const currentMessagesId = uuidv4();
      const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId || startConversationId}&userId=${userInfo}&model=${model}`;
      const eventSource = new EventSource(apiChat);
      eventSource.onmessage = (event) =>
        processStreamEvent(event, setMessages, currentMessagesId, model);

      eventSource.onerror = () => {
        eventSource.close();
      };
    });

    setInput('');
  };
  return (
    <>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        className="h-[100px] rounded-4xl pb-10 pl-5"
        placeholder="Hỏi bất kỳ điều gì..."
      />
    </>
  );
};

export default InputChat;
