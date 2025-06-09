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
      const newMessage: Message = {
        id: currentMessagesId,
        role: 'assistant',
        content: messageContent,
        model,
      };

      const lastMessage = prevMessages[prevMessages.length - 1];

      if (
        !lastMessage ||
        lastMessage.model !== model ||
        lastMessage.id !== currentMessagesId
      ) {
        return [...prevMessages, newMessage];
      } else {
        return [
          ...prevMessages.slice(0, -1),
          {
            ...lastMessage,
            content: lastMessage.content + ' ' + messageContent,
          },
        ];
      }
    });
  }
};
