import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';

const Home = () => {
  const [infoUser, setInfoUser] = useState(null);
  const token = localStorage.getItem('token');
  console.log('token', token);

  const handClick = async () => {
    try {
      const responseGetUser = await axios.get(
        'http://localhost:3001/users/getUser',
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        },
      );
      setInfoUser(responseGetUser.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div>
      <h1>Đây là Trang Chính sau khi bạn đăng nhập!</h1>
      <Button
        style={{ marginTop: '20px', marginBottom: '20px' }}
        onClick={handClick}
      >
        Xem thông tin{' '}
      </Button>
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
