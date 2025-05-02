import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatUser } from '@/api/userService';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    const responseChat = await chatUser(newMessages);
    console.log('responseChat', responseChat);

    const query = encodeURIComponent(JSON.stringify(newMessages));
    console.log(query);

    const eventSource = new EventSource(
      `http://localhost:3001/v1/chat/stream?messages=${query}`,
    );

    eventSource.onmessage = (event) => {
      const messageContent = event.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: messageContent },
      ]);
    };

    eventSource.onerror = (error) => {
      console.error('Error occurred:', error);
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
            <strong>{msg.role === 'user' ? 'Luli:' : 'Bot:'}</strong>{' '}
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
