import { createContext, useContext, useState, ReactNode } from 'react';

interface ConversationContextType {
  updateKey: number;
  triggerUpdate: () => void;
}

interface ConversationProviderProps {
  children: ReactNode;
}

const defaultContext: ConversationContextType = {
  updateKey: 0,
  triggerUpdate: () => {},
};

const ConversationContext =
  createContext<ConversationContextType>(defaultContext);

export const useConversation = () => {
  return useContext(ConversationContext);
};

export const ConversationProvider = ({
  children,
}: ConversationProviderProps) => {
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
