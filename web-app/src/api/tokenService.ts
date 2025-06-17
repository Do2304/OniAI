import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getTotalToken: '/v1/token/:id',
};

export const getUsageTotalToken = async (id: string) => {
  const response = await axiosInstance.get(
    apiPath.getTotalToken.replace(':id', id),
  );
  return response.data;
};
