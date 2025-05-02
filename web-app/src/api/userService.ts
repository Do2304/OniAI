import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getUser: '/v1/users/:id',
  login: '/v1/login',
  chat: '/v1/chat',
};

export const getUserInfo = async (id: number) => {
  const response = await axiosInstance.get(apiPath.getUser.replace(':id', id));
  return response.data;
};

export const loginUser = async (email: string, name: string) => {
  const response = await axiosInstance.post(apiPath.login, { email, name });
  return response.data;
};

export const chatUser = async (messages: string) => {
  const response = await axiosInstance.post(apiPath.chat, {
    model: 'gpt-3.5-turbo',
    messages: messages,
  });
  return response.data;
};
