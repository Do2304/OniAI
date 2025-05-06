export const processStreamEvent = (event, setMessages, currentMessagesId) => {
  const jsonData = event.data.startsWith('data: ')
    ? event.data.substring(6)
    : event.data;
  const messageData = JSON.parse(jsonData);
  const messageContent = messageData.choices[0].delta.content;
  const messageContentFinish = messageData.choices[0].finish_reason;

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
  if (messageContentFinish === 'stop') {
    eventSource.close();
  }
};
