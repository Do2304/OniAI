import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  chatUser: '/chat/completions',
  conversationUser: 'v1/chat/start-conversation',
  getHistoryUser: 'v1/chat/:conservation',
};

export const chatUser = async (messages: string) => {
  const response = await axiosInstance.post(apiPath.chatUser, {
    model: 'gpt-3.5-turbo',
    messages,
  });
  return response.data;
};

export const conversationUser = async () => {
  const response = await axiosInstance.post(apiPath.conversationUser);
  return response.data;
};

export const getHistoryConversation = async (conservation: string) => {
  const response = await axiosInstance.get(
    apiPath.getHistoryUser.replace(':conservation', conservation),
  );
  return response.data;
};
