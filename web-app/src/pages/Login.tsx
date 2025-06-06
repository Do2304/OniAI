import { Button } from '@/components/ui/button';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/firebaseConfig';
import { loginUser } from '@/api/userService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const resultLoginWithGoogle = await signInWithPopup(auth, provider);
      //   setUser(resultLoginWithGoogle.user);
      const responseLoginUser = await loginUser(
        resultLoginWithGoogle.user.email!,
        resultLoginWithGoogle.user.displayName!,
        resultLoginWithGoogle.user.photoURL!,
      );
      navigate('/home');
      localStorage.setItem('token', responseLoginUser.token);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert('Error logging in with Google. Please try again.');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button onClick={loginWithGoogle}>Sign In With GOOGLE</Button>
      </div>
    </>
  );
};

export default Login;
