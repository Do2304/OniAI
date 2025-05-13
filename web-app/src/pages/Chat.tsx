import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationUser, getHistoryConversation } from '@/api/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const historyMessages = await getHistoryConversation(conversationId);
        setMessages(historyMessages.messages);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    };
    fetchInitialMessages();
  }, []);

  const handleSend = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: 'User', content: input }];
    setMessages(newMessages);
    const currentMessagesId = uuidv4();
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    let userInfo = decoded.id;

    const query = encodeURIComponent(JSON.stringify(input));
    console.log('123', conversationId);
    let startConversationId;
    if (!conversationId) {
      const response = await conversationUser();
      startConversationId = response.conversationId;
      navigate(`/chat/${response.conversationId}`);
    }
    console.log('start', startConversationId);

    const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId ? conversationId : startConversationId}&userId=${userInfo}`;
    const eventSource = new EventSource(apiChat);

    console.log('eventSource', eventSource);

    eventSource.onmessage = (event) =>
      processStreamEvent(event, setMessages, currentMessagesId);

    eventSource.onerror = () => {
      eventSource.close();
    };

    setInput('');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <strong className="pb-2.5">CHAT WITH ONI-AI</strong>
      <div className="max-h-96 border border-gray-300 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === 'User' ? 'Luli:' : 'Bot:'}</strong>{' '}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow mr-2"
          placeholder="Nhập tin nhắn..."
        />
        <Button onClick={handleSend}>Gửi</Button>
      </div>
    </div>
  );
};

export default Chat;
