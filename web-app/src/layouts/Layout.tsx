import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  deleteConservation,
  getListConversationId,
  renameTittleConversation,
} from '@/api/conversationService';
import {
  Sidebar,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useConversation } from '@/utils/ConversationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp, User2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import SidebarHeaderLayout from './SidebarHeaderLayout';
import SidebarContentLayout from './SidebarContentLayout';

export default function Layout() {
  const [listConversationId, setListConversationId] = useState([]);
  const [infoUserCurrent, setInfoUserCurrent] = useState();
  const [showSecondTrigger, setShowSecondTrigger] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const { updateKey } = useConversation();

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

  const handleChooseConversationId = (id) => {
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

  const handleRenameConversation = async (id, title) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const handleSaveRename = async (id) => {
    if (newTitle) {
      try {
        const res = await renameTittleConversation(id, newTitle);
        if (res) {
          const updatedList = listConversationId.map((item) =>
            item.id === id ? { ...item, title: newTitle } : item,
          );
          setListConversationId(updatedList);
        } else {
          console.error('Failed to rename conversation');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setEditingId(null);
        setNewTitle('');
      }
    }
  };
  const handleDelete = async (id) => {
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
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {infoUserCurrent}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-full">
                  <DropdownMenuItem className="w-full">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span
                          className="block text-left w-[200px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Sign out
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {infoUserCurrent} có muốn đăng xuất khỏi App OniAi
                            không?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bấm "Yes", bạn sẽ đăng xuất...
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleLogout();
                              navigate('/login');
                            }}
                          >
                            Yes
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main>
        {!showSecondTrigger && (
          <SidebarTrigger
            onClick={handleTriggerClick}
            className="absolute left-2 top-4"
          />
        )}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
