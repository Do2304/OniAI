import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
}

const useUserId = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log('No token found');
    }
  }, []);

  return userId;
};

export default useUserId;
