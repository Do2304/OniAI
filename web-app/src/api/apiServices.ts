import axiosInstance from '@/config/axiosConfig';

export const getUserInfo = async () => {
  const response = await axiosInstance.get('/users/getUser');
  return response.data;
};

export const loginUser = async (email, name) => {
  const response = await axiosInstance.post('/users/login', { email, name });
  return response.data;
};
