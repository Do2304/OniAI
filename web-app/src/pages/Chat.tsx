import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatUser } from '@/api/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!input) return;
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(newMessages);

    try {
      const response = await chatUser(newMessages);
      const botMessage = response.choices[0].message.content;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: botMessage },
      ]);
    } catch (error) {
      console.error('Error fetching data from OpenAI:', error);
    }

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
