import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getListModels: 'v1/models',
};

export const getListModelOpenRouter = async () => {
  const response = await axiosInstance.get(apiPath.getListModels);
  return response.data;
};
