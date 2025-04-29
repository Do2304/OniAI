import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/api/userService';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
}

const Home = () => {
  const token = localStorage.getItem('token');
  let userId: number | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  } else {
    console.log('No token found');
  }

  const {
    data: infoUser,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['userInfo', userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId,
  });

  return (
    <div>
      <h1>Đây là Trang Chính sau khi bạn đăng nhập!</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching users: {error.message}</p>}
      {infoUser && (
        <>
          <h1>InfoUser: {infoUser.name}</h1>
          <h1>Email: {infoUser.email}</h1>
        </>
      )}
    </div>
  );
};

export default Home;
