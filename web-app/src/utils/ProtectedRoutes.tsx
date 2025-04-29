import { useUser } from '@/App';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
  const { isLogin } = useUser();
  console.log('isLogin', isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
