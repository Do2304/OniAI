import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/api/userService';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useUserId from '@/utils/useUserId';

const Home = () => {
  const userId = useUserId();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Welcome to chat Oni-Ai!
      </h1>
      {isLoading && (
        <p className="text-lg">Loading information, please wait...</p>
      )}
      {error && (
        <p className="text-lg text-red-500">
          An error occurred: {error.message}
        </p>
      )}
      {infoUser && (
        <div className="bg-white shadow-md rounded-lg p-5 mt-5 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            User information:
          </h2>
          <p className="text-lg text-gray-700">User: {infoUser.name}</p>
          <p className="text-lg text-gray-700">Email: {infoUser.email}</p>
        </div>
      )}

      <Button
        className="mt-8 bg-black text-white hover:bg-gray-500 transition duration-300 py-2 px-4 rounded cursor-pointer"
        onClick={handleStartConversation}
      >
        Bắt đầu cuộc trò chuyện mới
      </Button>
    </div>
  );
};

export default Home;
