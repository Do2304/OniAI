import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getListConversation: 'v1/conversation',
  renameTittle: 'v1/rename-conversation',
  delConversation: 'v1/conversation/:id',
};

export const getListConversationId = async () => {
  const response = await axiosInstance.get(apiPath.getListConversation);
  return response.data;
};

export const renameTittleConversation = async (
  id: string,
  newTitle: string,
) => {
  const response = await axiosInstance.put(apiPath.renameTittle, {
    id,
    newTitle,
  });
  return response.data;
};

export const deleteConservation = async (id: string) => {
  const response = await axiosInstance.delete(
    apiPath.delConversation.replace(':id', id),
  );
  return response.data;
};
