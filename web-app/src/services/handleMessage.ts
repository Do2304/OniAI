interface Citation {
  title: string;
  link: string;
  context: string;
}

interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
  citations?: Citation[];
}

export const processStreamEvent = (
  event: MessageEvent,
  addOrUpdateMessage: (message: Message) => void,
  currentMessagesId: string,
  model: string,
) => {
  const messageData = JSON.parse(event.data);
  const messageContent = messageData.message;
  const citations = messageData.citations;
  console.log('messageContent----', messageContent);

  if (!messageContent) return;

  addOrUpdateMessage({
    id: currentMessagesId,
    role: 'assistant',
    content: messageContent,
    model,
    citations,
  });
};
