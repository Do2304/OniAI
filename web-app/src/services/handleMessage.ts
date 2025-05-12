export const processStreamEvent = (event, setMessages, currentMessagesId) => {
  // console.log(event);
  // console.log(event.data);
  const messageContent = event.data;

  if (messageContent) {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.id === currentMessagesId) {
        return [
          ...prevMessages.slice(0, -1),
          { ...lastMessage, content: lastMessage.content + messageContent },
        ];
      } else {
        return [
          ...prevMessages,
          { id: currentMessagesId, role: 'assistant', content: messageContent },
        ];
      }
    });
  }
};
