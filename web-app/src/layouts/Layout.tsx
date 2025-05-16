import {
  SidebarProvider,
  Sidebar,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  deleteConservation,
  getListConversationId,
  renameTittleConversation,
} from '@/api/conversationService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useConversation } from '@/utils/ConversationContext';
import { toast } from 'sonner';
import SidebarHeaderLayout from './SidebarHeaderLayout';
import SidebarContentLayout from './SidebarContentLayout';
import SidebarFooterLayout from './SidebarFooterLayout';
import { useTheme } from '@/components/theme-provider';
import { FaSun, FaMoon } from 'react-icons/fa';

interface Conversation {
  id: string;
  title: string;
}

export default function Layout() {
  const [listConversationId, setListConversationId] = useState<Conversation[]>(
    [],
  );
  const [infoUserCurrent, setInfoUserCurrent] = useState<string>('');
  const [showSecondTrigger, setShowSecondTrigger] = useState(true);
  const [editingId, setEditingId] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const { updateKey } = useConversation();
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState('light');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { listConversationId, infoUser } = await getListConversationId();
        setListConversationId(listConversationId);
        setNewTitle(listConversationId.title);
        setInfoUserCurrent(infoUser.name);
        setReload(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [updateKey, reload]);

  const handleChooseConversationId = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleStartConversation = () => {
    navigate(`/chat`);
  };

  const handleTriggerClick = () => {
    setShowSecondTrigger(!showSecondTrigger);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  const handleRenameConversation = async (id: string, title: string) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const handleSaveRename = async (id: string) => {
    if (newTitle) {
      try {
        const res = await renameTittleConversation(id, newTitle);
        if (res) {
          const updatedList = listConversationId.map((item) =>
            item.id === id ? { ...item, title: newTitle } : item,
          );
          toast('Đổi tên thành công.');
          setListConversationId(updatedList);
        } else {
          toast.error('Có lỗi xảy ra khi đổi tên đoạn chat.');
          console.error('Failed to rename conversation');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đổi tên đoạn chat.');
        console.error('Error:', error);
      } finally {
        setEditingId('');
        setNewTitle('');
      }
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteConservation(id);
      console.log(response);

      if (response) {
        toast('Xoá đoạn chat thành công.');
        navigate(`/chat`);
        setReload(!reload);
        console.log('Item deleted successfully');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xoá đoạn chat.');
      console.error('Error deleting item:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = darkMode === 'light' ? 'dark' : 'light';
    setDarkMode(newTheme);
    setTheme(newTheme);
  };
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeaderLayout
          handleTriggerClick={handleTriggerClick}
          handleStartConversation={handleStartConversation}
        />
        <SidebarContentLayout
          listConversationId={listConversationId}
          editingId={editingId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleSaveRename={handleSaveRename}
          handleChooseConversationId={handleChooseConversationId}
          handleRenameConversation={handleRenameConversation}
          handleDelete={handleDelete}
        />
        <SidebarFooterLayout
          infoUserCurrent={infoUserCurrent}
          handleLogout={handleLogout}
        />
        <SidebarRail />
      </Sidebar>
      <main>
        <SidebarTrigger className="ml-1 mt-4 " />
        <button onClick={toggleTheme}>
          {darkMode === 'light' ? <FaMoon /> : <FaSun />}{' '}
        </button>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
