import axiosInstance from '@/config/axiosConfig';

const apiPath = {
  getUser: '/v1/users/:id',
  login: '/v1/login',
};

export const getUserInfo = async (id: string) => {
  const response = await axiosInstance.get(apiPath.getUser.replace(':id', id));
  return response.data;
};

export const loginUser = async (
  email: string,
  name: string,
  photoURL: string,
) => {
  const response = await axiosInstance.post(apiPath.login, {
    email,
    name,
    photoURL,
  });
  return response.data;
};
