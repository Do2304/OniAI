import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  conversationUser: 'v1/chat/start-conversation',
  getHistoryUser: 'v1/chat/:conservation',
  getFirstConversation: 'v1/chat/stream',
};

export const createConversation = async () => {
  const response = await axiosInstance.post(apiPath.conversationUser);
  return response.data;
};

export const getHistoryConversation = async (conservation: string) => {
  const response = await axiosInstance.get(
    apiPath.getHistoryUser.replace(':conservation', conservation),
  );
  return response.data;
};
