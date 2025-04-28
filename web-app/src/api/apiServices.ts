import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getUser: '/users/getUser',
  login: '/users/login',
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get(apiPath.getUser);
  return response.data;
};

export const loginUser = async (email, name) => {
  const response = await axiosInstance.post(apiPath.login, { email, name });
  return response.data;
};
