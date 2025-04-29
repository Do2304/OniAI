import { useState } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import { auth, provider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { loginUser } from './api/userService';

function App() {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    try {
      const resultLoginWithGoogle = await signInWithPopup(auth, provider);
      setUser(resultLoginWithGoogle.user);
      const responseLoginUser = await loginUser(
        resultLoginWithGoogle.user.email,
        resultLoginWithGoogle.user.displayName,
      );

      localStorage.setItem('token', responseLoginUser.token);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert('Error logging in with Google. Please try again.');
    }
  };

  return (
    <Router>
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-svh">
          <Button onClick={loginWithGoogle}>Đăng Nhập Bằng GOOGLE</Button>
        </div>
      ) : (
        <Navigate to="/home" />
      )}
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
