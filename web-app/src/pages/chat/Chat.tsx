import { useEffect, useMemo, useRef, useState } from 'react';
import { processStreamEvent } from '@/services/handleMessage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { createConversation, getHistoryConversation } from '@/api/chatService';
import { useConversation } from '@/utils/ConversationContext';
import useUserId from '@/utils/useUserId';
import MessagesList from './listMessages/MessagesList';
import { useQuery } from '@tanstack/react-query';
import InputArea from './InputArea';
import { getUsageTotalToken } from '@/api/tokenService';
import { useMessagesStore } from '@/store/useMessagesStore';

interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}

const Chat = () => {
  const [selectedModel, setSelectedModel] = useState<string[]>(['gpt-4o']);
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { triggerUpdate } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInfo = useUserId();
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const messagesByConversation = useMessagesStore(
    (state) => state.messagesByConversation,
  );

  const messages = useMemo(() => {
    return messagesByConversation.get(conversationId || '') || [];
  }, [messagesByConversation, conversationId]);

  const addOrUpdateMessage = useMessagesStore(
    (state) => state.addOrUpdateMessage,
  );

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
    enabled: !!conversationId && messages.length <= 0,
  });

  const { data, refetch } = useQuery({
    queryKey: ['tokenUsage'],
    queryFn: () => getUsageTotalToken(userInfo),
    enabled: !!userInfo,
  });

  useEffect(() => {
    if (fetchedMessages && conversationId && messages.length <= 0) {
      fetchedMessages.forEach((msg: Message) => {
        addMessage(conversationId, msg);
      });
    }
  }, [fetchedMessages, conversationId, messages.length, addMessage]);

  if (isLoading)
    return <div className="text-center">Loading conversation...</div>;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  const handleSend = async (input: string, onClear: () => void) => {
    if (!input) return;
    console.log(data.used);

    // if (data.used >= 6000) {
    //   alert('You have run out of tokens. Cannot send more messages.');
    //   return;
    // }

    const query = encodeURIComponent(JSON.stringify(input));
    let startConversationId: string;
    if (!conversationId) {
      const response = await createConversation();
      startConversationId = response.conversationId;
      triggerUpdate();
      navigate(`/chat/${response.conversationId}`);
    } else {
      startConversationId = conversationId;
    }
    const currentMessagesUserId = uuidv4();
    addMessage(startConversationId, {
      id: currentMessagesUserId,
      role: 'User',
      content: input,
    });

    selectedModel.forEach((model) => {
      const currentMessagesId = uuidv4();
      const apiChat = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream?messages=${query}&conversationId=${conversationId || startConversationId}&userId=${userInfo}&model=${model}&isSearchWeb=${isSearchEnabled}`;
      const eventSource = new EventSource(apiChat);
      eventSource.onmessage = (event) =>
        processStreamEvent(
          event,
          (msg) => {
            addOrUpdateMessage(startConversationId, msg);
          },
          currentMessagesId,
          model,
        );

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
    onClear();
  };
  console.log('enabled', isSearchEnabled);

  return (
    <>
      <h1 className="text-center text-3xl font-bold w-3/4">CHAT WITH ONI-AI</h1>
      <div
        className={`flex flex-col w-full sm:w-3/5 mt-10 mx-auto flex-1
    ${messages.length === 0 ? 'justify-center' : 'justify-end'}`}
      >
        {messages.length > 0 && (
          <MessagesList
            messages={messages}
            messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
          />
        )}
        <div className="relative flex w-full items-end px-3 py-3">
          <InputArea
            setSelectedModel={setSelectedModel}
            handleSend={handleSend}
            onSearchToggle={(enabled) => {
              setIsSearchEnabled(enabled);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
