import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationUser, getHistoryConversation } from '@/api/chatService';
import { useConversation } from '@/utils/ConversationContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { triggerUpdate } = useConversation();

  useEffect(() => {
    const fetchInitialMessages = async () => {
      setMessages([]);
      if (conversationId) {
        try {
          const historyMessages = await getHistoryConversation(conversationId);
          setMessages(historyMessages.messages);
        } catch (error) {
          console.error('Error fetching initial messages:', error);
        }
      }
    };
    fetchInitialMessages();
  }, [conversationId]);

  const handleSend = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: 'User', content: input }];
    setMessages(newMessages);
    const currentMessagesId = uuidv4();
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userInfo = decoded.id;

    const query = encodeURIComponent(JSON.stringify(input));
    let startConversationId;
    if (!conversationId) {
      const response = await conversationUser();
      startConversationId = response.conversationId;
      navigate(`/chat/${response.conversationId}`);
    }

    const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId || startConversationId}&userId=${userInfo}`;
    const eventSource = new EventSource(apiChat);
    triggerUpdate();
    eventSource.onmessage = (event) =>
      processStreamEvent(event, setMessages, currentMessagesId);

    eventSource.onerror = () => {
      eventSource.close();
    };

    setInput('');
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 mt-4 text-blue-600">
        CHAT WITH ONI-AI
      </h1>
      <div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <ScrollToBottom className=" w-200 h-[550px] border border-gray-300 rounded-lg p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`m-2 ${msg.role === 'User' ? 'text-right' : 'text-left'}`}
              >
                <strong
                  className={`block ${msg.role === 'User' ? 'text-blue-500' : 'text-gray-700'}`}
                >
                  {msg.role === 'User' ? 'Luli:' : 'Bot:'}
                </strong>
                <Badge
                  variant="outline"
                  className={`text-base p-2 ${msg.role === 'User' ? 'bg-blue-500' : 'bg-gray-100'} whitespace-normal`}
                >
                  <span
                    className={`block ${msg.role === 'User' ? 'text-white' : 'text-gray-800'} `}
                  >
                    {msg.content}
                  </span>
                </Badge>
              </div>
            ))}
          </ScrollToBottom>
          <div className="flex mt-4 ">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-[70px] mr-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi bất kỳ điều gì..."
            />
            <Button className="h-[70px]" onClick={handleSend}>
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
