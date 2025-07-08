interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}

export const processStreamEvent = (
  event: MessageEvent,
  addOrUpdateMessage: (message: Message) => void,
  currentMessagesId: string,
  model: string,
) => {
  const messageContent = event.data;

  if (!messageContent) return;

  addOrUpdateMessage({
    id: currentMessagesId,
    role: 'assistant',
    content: messageContent,
    model,
  });
};
