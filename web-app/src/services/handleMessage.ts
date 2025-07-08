interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}

export const processStreamEvent = (
  event: MessageEvent,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  currentMessagesId: string,
  model: string,
) => {
  const messageContent = event.data;

  if (messageContent) {
    setMessages((prevMessages) => {
      const existingIndex = prevMessages.findIndex(
        (msg) => msg.id === currentMessagesId,
      );

      if (existingIndex === -1) {
        const newMessage: Message = {
          id: currentMessagesId,
          role: 'assistant',
          content: messageContent,
          model,
        };
        return [...prevMessages, newMessage];
      } else {
        const updatedMessages = [...prevMessages];
        updatedMessages[existingIndex] = {
          ...updatedMessages[existingIndex],
          content: updatedMessages[existingIndex].content + messageContent,
        };
        return updatedMessages;
      }
    });
  }
};
