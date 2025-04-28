import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/api/userService';

const Home = () => {
  const {
    data: infoUser,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
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
