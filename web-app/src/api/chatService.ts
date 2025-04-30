import axiosInstance from '@/config/axiosOpenAiConfig';

const apiPath = {
  chatUser: '/chat/completions',
};

export const chatUser = async (messages: string) => {
  const response = await axiosInstance.post(apiPath.chatUser, {
    model: 'gpt-3.5-turbo',
    messages,
  });
  return response.data;
};
