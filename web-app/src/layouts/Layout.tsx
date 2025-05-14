import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { getListConversationId } from '@/api/conversationService';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IoCreate } from 'react-icons/io5';
import { useConversation } from '@/utils/ConversationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp, User2 } from 'lucide-react';

export default function Layout() {
  const [listConversationId, setListConversationId] = useState([]);
  const [infoUserCurrent, setInfoUserCurrent] = useState();
  const [showSecondTrigger, setShowSecondTrigger] = useState(true);
  const navigate = useNavigate();
  const { updateKey } = useConversation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { listConversationId, infoUser } = await getListConversationId();
        setListConversationId(listConversationId);
        setInfoUserCurrent(infoUser.name);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [updateKey]);

  const handleChooseConversationId = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleStartConversation = () => {
    navigate(`/chat`);
  };

  const handleTriggerClick = () => {
    setShowSecondTrigger(!showSecondTrigger);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between space-x-4">
            <SidebarTrigger onClick={handleTriggerClick} />
            <strong>App OniAI</strong>
            <IoCreate
              className="cursor-pointer"
              onClick={handleStartConversation}
              size={24}
            />
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-hidden">
          <SidebarGroupLabel>Các conversation:</SidebarGroupLabel>
          <SidebarGroupContent>
            {listConversationId.map((list, index) => (
              <SidebarMenuButton key={index} asChild>
                <Button
                  className="m-1"
                  onClick={() => handleChooseConversationId(list.id)}
                >
                  {list.id}
                </Button>
              </SidebarMenuButton>
            ))}
          </SidebarGroupContent>
        </SidebarContent>
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
                    <span className="block text-left w-[200px]">Sign out</span>
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
            className="absolute left-2 top-8"
          />
        )}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
