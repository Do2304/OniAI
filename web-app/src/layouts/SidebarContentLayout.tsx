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
import { FaEllipsisH } from 'react-icons/fa';

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
  return (
    <SidebarContent className="overflow-hidden">
      <SidebarGroupLabel>Các conversation:</SidebarGroupLabel>
      <SidebarGroupContent>
        {listConversationId.map((list, index) => (
          <SidebarMenuButton className="w-[240px] m-2" key={index} asChild>
            <div className="flex items-center">
              {editingId === list.id ? (
                <input
                  type="text"
                  value={newTitle}
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
                  onClick={() => handleChooseConversationId(list.id)}
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
