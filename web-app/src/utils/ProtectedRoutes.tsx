import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
