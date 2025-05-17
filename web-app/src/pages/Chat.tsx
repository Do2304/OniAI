import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationUser, getHistoryConversation } from '@/api/chatService';
import { useConversation } from '@/utils/ConversationContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, Globe, Mic, Plus, Siren } from 'lucide-react';

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
    <>
      <h1 className="text-center text-3xl font-bold w-3/4">CHAT WITH ONI-AI</h1>
      <div className="w-3/5 mt-10 mx-auto flex flex-col">
        <div className={`${messages && 'flex-1'}`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === 'User' ? 'text-right' : 'text-left'}`}
            >
              <Badge
                variant="outline"
                className={`text-base ml-2 ${msg.role === 'User' && 'bg-gray-100 p-3 pl-6 pr-6 mr-3 rounded-full'} whitespace-normal border border-none`}
              >
                <span
                  className={`block ${msg.role === 'User' && 'text-gray-800'}`}
                >
                  {msg.content}
                </span>
              </Badge>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="relative flex w-full items-end px-3 py-3">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="h-[100px] rounded-4xl"
            placeholder="Hỏi bất kỳ điều gì..."
          />
          <div style={{ height: '48px' }}></div>

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
                <Button variant="outline" className="p-2 ml-1 rounded-full">
                  <Globe />
                  Search
                </Button>
                <Button variant="outline" className="p-2 ml-1 rounded-full">
                  <Siren /> Analysis
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  className="p-2 rounded-full"
                >
                  <Mic />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="p-2 mr-8 ml-1 rounded-full"
                >
                  <ArrowUp />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
