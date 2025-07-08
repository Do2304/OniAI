import { create } from 'zustand';

interface Message {
  id: string;
  role: 'User' | 'assistant';
  content: string;
  model?: string;
}

interface MessagesState {
  messagesByConversation: Map<string, Message[]>;
  addMessage: (conversationId: string, message: Message) => void;
  addOrUpdateMessage: (conversationId: string, message: Message) => void;
  clearMessages: (conversationId: string) => void;
  getMessages: (conversationId: string) => Message[];
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messagesByConversation: new Map(),

  addMessage: (conversationId, message) => {
    set((state) => {
      const map = new Map(state.messagesByConversation);
      const existing = map.get(conversationId) || [];
      map.set(conversationId, [...existing, message]);
      return { messagesByConversation: map };
    });
  },

  addOrUpdateMessage: (conversationId, message) => {
    set((state) => {
      const map = new Map(state.messagesByConversation);
      const existing = map.get(conversationId) || [];
      const index = existing.findIndex((m) => m.id === message.id);

      const updated =
        index === -1
          ? [...existing, message]
          : [
              ...existing.slice(0, index),
              {
                ...existing[index],
                content: existing[index].content + message.content,
              },
              ...existing.slice(index + 1),
            ];

      map.set(conversationId, updated);
      return { messagesByConversation: map };
    });
  },

  clearMessages: (conversationId) => {
    set((state) => {
      const map = new Map(state.messagesByConversation);
      map.delete(conversationId);
      return { messagesByConversation: map };
    });
  },

  getMessages: (conversationId) => {
    return get().messagesByConversation.get(conversationId) || [];
  },
}));
