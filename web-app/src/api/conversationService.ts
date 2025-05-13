import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getListConversation: 'v1/conversation',
};

export const getListConversationId = async () => {
  const response = await axiosInstance.get(apiPath.getListConversation);
  return response.data;
};
