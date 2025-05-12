import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoutes from './utils/ProtectedRoutes.tsx';
import Chat from './pages/Chat.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/chat/" element={<Chat />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
