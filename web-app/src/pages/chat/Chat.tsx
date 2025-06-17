import { useEffect, useRef, useState } from 'react';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { createConversation, getHistoryConversation } from '@/api/chatService';
import { useConversation } from '@/utils/ConversationContext';
import useUserId from '@/utils/useUserId';
import MessagesList from './MessagesList';
import { useQuery } from '@tanstack/react-query';
import InputArea from './InputArea';
import { getUsageTotalToken } from '@/api/tokenService';

interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<string[]>(['gpt-4o']);
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { triggerUpdate } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInfo = useUserId();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const {
    data: fetchedMessages,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['getMessages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await getHistoryConversation(conversationId);
      return res.messages;
    },
    enabled: !!conversationId,
  });

  const { data, refetch } = useQuery({
    queryKey: ['tokenUsage'],
    queryFn: () => getUsageTotalToken(userInfo),
    enabled: !!userInfo,
  });

  useEffect(() => {
    setMessages([]);
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);
  if (isLoading)
    return <div className="text-center">Loading conversation...</div>;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  const handleSend = async () => {
    if (!input) return;
    console.log(data.used);

    // if (data.used >= 6000) {
    //   alert('You have run out of tokens. Cannot send more messages.');
    //   return;
    // }

    const newMessages: Message = { id: '', role: 'User', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessages]);

    const query = encodeURIComponent(JSON.stringify(input));
    let startConversationId: string;
    if (!conversationId) {
      const response = await createConversation();
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

      eventSource.addEventListener('end', async () => {
        eventSource.close();
        try {
          const { data: newData } = await refetch();
          if (newData?.used != null) {
            console.log('Updated token usage:', newData.used);
          }
        } catch (err) {
          console.error(' Error during refetch:', err);
        }
      });

      eventSource.onerror = () => {
        eventSource.close();
      };
    });

    setInput('');
  };

  return (
    <>
      <h1 className="text-center text-3xl font-bold w-3/4">CHAT WITH ONI-AI</h1>
      <div className="w-full sm:w-3/5 mt-10 mx-auto flex flex-col">
        <MessagesList
          messages={messages}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
        />
        <div className="relative flex w-full items-end px-3 py-3">
          <InputArea
            input={input}
            setInput={setInput}
            setSelectedModel={setSelectedModel}
            handleSend={handleSend}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
