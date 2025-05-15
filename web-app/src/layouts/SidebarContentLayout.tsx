import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

interface SidebarContentProps {
  listConversationId: Array<{ id: string; title: string }>;
  editingId: string | null;
  newTitle: string;
  setNewTitle: (value: string) => void;
  handleSaveRename: (id: string) => void;
  handleChooseConversationId: (id: string) => void;
  handleRenameConversation: (id: string, title: string) => void;
  handleDelete: (id: string) => void;
}

const SidebarContentLayout = ({
  listConversationId,
  editingId,
  newTitle,
  setNewTitle,
  handleSaveRename,
  handleChooseConversationId,
  handleRenameConversation,
  handleDelete,
}: SidebarContentProps) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const location = useLocation();
  const reloadLocation = location.pathname.replace('/chat/', '');

  useEffect(() => {
    if (editingId) {
      handleFocusConversation(editingId);
    } else {
      handleFocusConversation(reloadLocation);
    }
  }, [listConversationId, editingId, reloadLocation]);

  const handleFocusConversation = (id: string) => {
    inputRefs.current[id]?.focus();
    setFocusedId(id);
  };

  return (
    <SidebarContent className="overflow-hidden">
      <SidebarGroupLabel>Các conversation:</SidebarGroupLabel>
      <SidebarGroupContent>
        {listConversationId.map((list, index) => (
          <SidebarMenuButton
            className={`w-[240px] m-2 hover:bg-gray-400 ${focusedId === list.id ? 'bg-gray-400' : ''}`}
            key={index}
            asChild
          >
            <div className={`flex items-center bg-gray-200`}>
              {editingId === list.id ? (
                <input
                  type="text"
                  value={newTitle}
                  ref={(el) => (inputRefs.current[list.id] = el)}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleSaveRename(list.id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveRename(list.id);
                    }
                  }}
                  className="flex-1 ml-3 border border-gray-300 rounded"
                />
              ) : (
                <span
                  className="flex-1 ml-3"
                  onClick={() => {
                    handleChooseConversationId(list.id);
                    handleFocusConversation(list.id);
                  }}
                >
                  {list.title}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    <FaEllipsisH />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      handleRenameConversation(list.id, list.title)
                    }
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(list.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarMenuButton>
        ))}
      </SidebarGroupContent>
    </SidebarContent>
  );
};

export default SidebarContentLayout;
