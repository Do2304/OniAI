import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationUser, getHistoryConversation } from '@/api/chatService';
import { useConversation } from '@/utils/ConversationContext';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'User' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { triggerUpdate } = useConversation();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      triggerUpdate();
      navigate(`/chat/${response.conversationId}`);
    }

    const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId || startConversationId}&userId=${userInfo}`;
    const eventSource = new EventSource(apiChat);
    eventSource.onmessage = (event) =>
      processStreamEvent(event, setMessages, currentMessagesId);

    eventSource.onerror = () => {
      eventSource.close();
    };

    setInput('');
  };

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-center text-3xl font-bold mb-4 mt-4 w-3/4">
        CHAT WITH ONI-AI
      </h1>
      <div className="w-3/4 mt-10 mx-auto flex flex-col">
        <div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === 'User' ? 'text-right' : 'text-left'}`}
            >
              <Badge
                variant="outline"
                className={`text-base p-2 ${msg.role === 'User' ? 'bg-gray-100' : 'bg-gray-300'} whitespace-normal`}
              >
                <span
                  className={`block ${msg.role === 'User' ? 'text-gray-800' : 'text-gray-800'}`}
                >
                  {msg.content}
                </span>
              </Badge>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-[70px] mr-2 mb-8 mt-4 font-medium text-xl w-full "
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
};

export default Chat;
