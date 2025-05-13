import { createContext, useContext, useState } from 'react';

const ConversationContext = createContext(null);

export const useConversation = () => {
  return useContext(ConversationContext);
};

export const ConversationProvider = ({ children }) => {
  const [updateKey, setUpdateKey] = useState(0);

  const triggerUpdate = () => {
    setUpdateKey((prev) => prev + 1);
  };

  return (
    <ConversationContext.Provider value={{ updateKey, triggerUpdate }}>
      {children}
    </ConversationContext.Provider>
  );
};
