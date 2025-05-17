import { createContext, useContext, useState } from 'react';

interface ConversationContextType {
  updateKey: number;
  triggerUpdate: () => void;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

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
