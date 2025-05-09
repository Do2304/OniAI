import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const currentMessagesId = uuidv4();

    const query = encodeURIComponent(JSON.stringify(newMessages));
    const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}`;
    const eventSource = new EventSource(apiChat);

    eventSource.onmessage = (event) =>
      processStreamEvent(event, setMessages, currentMessagesId);

    eventSource.onerror = (error) => {
      // console.error('Error occurred:', error);
      eventSource.close();
    };

    setInput('');
  };
  console.log('mess:', messages);

  return (
    <div className="max-w-md mx-auto p-4">
      <strong className="pb-2.5">CHAT WITH ONI-AI</strong>
      <div className="max-h-96 border border-gray-300 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === 'user' ? 'Luli:' : 'Bot:'}</strong>{' '}
            {msg.content}
            {/* {msg.role === 'assistant' ? assistantResponse : msg.content} */}
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
