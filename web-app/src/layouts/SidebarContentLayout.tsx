import {
  deleteConservation,
  getListConversationId,
  renameTittleConversation,
} from '@/api/conversationService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useConversation } from '@/utils/ConversationContext';

interface Conversation {
  id: string;
  title: string;
}

const SidebarContentLayout = () => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [editingId, setEditingId] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [listConversationId, setListConversationId] = useState<Conversation[]>(
    [],
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const location = useLocation();
  const reloadLocation = location.pathname.replace('/chat/', '');
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { updateKey } = useConversation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { listConversationId } = await getListConversationId();
        setListConversationId(listConversationId);
        setNewTitle(listConversationId.title);
        setReload(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [updateKey, reload]);

  useEffect(() => {
    if (editingId) {
      handleFocusConversation(editingId);
    } else {
      handleFocusConversation(reloadLocation);
    }
  }, [editingId, reloadLocation]);

  const handleFocusConversation = (id: string) => {
    inputRefs.current[id]?.focus();
    setFocusedId(id);
  };

  const handleChooseConversationId = (id: string) => {
    navigate(`/chat/${id}`);
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

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {listConversationId.map((item) => (
            <DropdownMenu key={item.id}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      handleChooseConversationId(item.id);
                      handleFocusConversation(item.id);
                    }}
                    isActive={focusedId === item.id}
                  >
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => handleSaveRename(item.id)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleSaveRename(item.id)
                        }
                      />
                    ) : (
                      <span>{item.title}</span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="ml-auto" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side={isMobile ? 'bottom' : 'right'}
                        align={isMobile ? 'end' : 'start'}
                        className="min-w-56 rounded-lg"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            handleRenameConversation(item.id, item.title)
                          }
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </SidebarMenuItem>
            </DropdownMenu>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarContentLayout;
