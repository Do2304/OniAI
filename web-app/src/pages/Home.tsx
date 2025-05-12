import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/api/userService';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { conversationUser } from '@/api/chatService';

interface TokenPayload {
  id: number;
}

const Home = () => {
  const token = localStorage.getItem('token');
  let userId: number | null = null;
  const navigate = useNavigate();

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
  const handleStartConversation = async () => {
    // const response = await conversationUser();
    // console.log('info', response.infoUser);
    // const initialResponse = await fetch(
    //   `${import.meta.env.VITE_API_BASE_URL}/v1/chat/stream`,
    // );
    // const conversationId = initialResponse.headers.get('X-Conversation-Id');
    // console.log('conversationId', conversationId);
    navigate(`/chat`);
  };

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
      <Button onClick={handleStartConversation}>Bắt đầu cuộc trò chuyện</Button>
    </div>
  );
};

export default Home;
