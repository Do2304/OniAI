import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getListConversation: 'v1/conversation',
  renameTittle: 'v1/rename-conversation',
};

export const getListConversationId = async () => {
  const response = await axiosInstance.get(apiPath.getListConversation);
  return response.data;
};

export const renameTittleConversation = async (id, newTitle) => {
  const response = await axiosInstance.put(apiPath.renameTittle, {
    id,
    newTitle,
  });
  return response.data;
};
