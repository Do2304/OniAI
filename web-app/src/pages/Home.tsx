import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/api/userService';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getListConversationId } from '@/api/conversationService';

interface TokenPayload {
  id: number;
}

const Home = () => {
  const [listConversationId, setListConversationId] = useState([]);
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

  useEffect(() => {
    const getListConversation = async () => {
      try {
        const listConversationId = await getListConversationId();
        setListConversationId(listConversationId.listConversationId);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    };
    getListConversation();
  }, []);

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
    navigate(`/chat`);
  };
  const handleChooseConversationId = async (id) => {
    navigate(`/chat/${id}`);
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
      <div>
        <h1>
          <strong>List Conversation:</strong>
        </h1>
        {listConversationId.map((list, index) => (
          <Button
            className="m-1"
            onClick={() => handleChooseConversationId(list.id)}
            key={index}
          >
            {list.id}
          </Button>
        ))}
      </div>
      <Button className="mt-5" onClick={handleStartConversation}>
        Bắt đầu cuộc trò chuyện mới
      </Button>
    </div>
  );
};

export default Home;
