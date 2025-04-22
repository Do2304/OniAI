import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAaEhAgflkHfZUeD63nEKOHFc71if1ql-4',
  authDomain: 'apponi-6c0fc.firebaseapp.com',
  projectId: 'apponi-6c0fc',
  storageBucket: 'apponi-6c0fc.firebasestorage.app',
  messagingSenderId: '573703309847',
  appId: '1:573703309847:web:97a94e060a80f8e30caa52',
  measurementId: 'G-BS8D0GMVFZ',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
