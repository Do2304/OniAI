import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  // const [userId, setUserId] = useState('');
  // const [conversationId2, setconversationId2] = useState('');
  const { conversationId } = useParams<{ conversationId: string }>();
  // const { infoUser } = location.state || {};
  // console.log(conversationId);
  // console.log('infoUserId', infoUserId);

  // useEffect(() => {
  //   const fetchInitialMessages = async () => {
  //     try {
  //       const historyMessages = await getHistoryConversation(conversationId);
  //       // console.log(historyMessages);
  //       setMessages(historyMessages.messages);
  //       setInfoUserId(historyMessages.infoUser.id.toString());
  //     } catch (error) {
  //       console.error('Error fetching initial messages:', error);
  //     }
  //   };
  //   fetchInitialMessages();
  // }, [conversationId, infoUserId]);

  const handleSend = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const currentMessagesId = uuidv4();
    // console.log('input', input);
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    let userInfo = decoded.id;

    // console.log('userInfo', userInfo);

    const query = encodeURIComponent(JSON.stringify(input));
    // const initialResponse = await fetch(
    //   `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId2}&userId=${userInfo}`,
    // );

    // const conversationId = initialResponse.headers.get('X-Conversation-Id');
    // // console.log('conversationId', conversationId);
    // setconversationId2(conversationId);

    // if (!conversationId) {
    //   console.error('Conversation ID not found in headers');
    //   return;
    // }
    const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId ? conversationId : ''}&userId=${userInfo}`;

    const eventSource = new EventSource(apiChat);
    console.log('eventSource', eventSource);

    eventSource.onmessage = (event) =>
      processStreamEvent(event, setMessages, currentMessagesId);

    eventSource.onerror = () => {
      // console.error('Error occurred:', error);
      eventSource.close();
    };

    setInput('');
  };

  // console.log('mess:', messages);

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
