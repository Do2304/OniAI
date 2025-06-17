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
import Chat from './pages/chat/Chat.tsx';
import Layout from './layouts/Layout.tsx';
import { ConversationProvider } from './utils/ConversationContext.tsx';

function App() {
  return (
    <ConversationProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/chat/" element={<Chat />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConversationProvider>
  );
}

export default App;
