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
import { useEffect, useRef } from 'react';
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
  // const [focusedId, setFocusedId] = useState<string | null>(null);
  const location = useLocation();
  const reloadLocation = location.pathname.replace('/chat/', '');
  const { isMobile } = useSidebar();

  useEffect(() => {
    if (editingId) {
      handleFocusConversation(editingId);
    } else {
      handleFocusConversation(reloadLocation);
    }
  }, [listConversationId, editingId, reloadLocation]);

  const handleFocusConversation = (id: string) => {
    inputRefs.current[id]?.focus();
    // setFocusedId(id);
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
                    className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground`}
                  >
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        // ref={(el) => (inputRefs.current[item.id] = el)}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => handleSaveRename(item.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(item.id);
                          }
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          handleChooseConversationId(item.id);
                          handleFocusConversation(item.id);
                        }}
                      >
                        {item.title}
                      </span>
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
