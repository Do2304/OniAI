import { SidebarProvider } from '@/components/ui/sidebar';
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

export default function Layout() {
  const [listConversationId, setListConversationId] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getListConversation = async () => {
      try {
        if (listConversationId.length === 0) {
          const listConversationId = await getListConversationId();
          setListConversationId(listConversationId.listConversationId);
        }
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    };
    getListConversation();
  }, [listConversationId]);
  const handleChooseConversationId = async (id) => {
    navigate(`/chat/${id}`);
  };
  const handleStartConversation = async () => {
    navigate(`/chat`);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between space-x-4">
            <SidebarTrigger />
            <strong>App OniAI</strong>
            <IoCreate
              className="cursor-pointer"
              onClick={handleStartConversation}
              size={24}
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroupLabel>Các conversation:</SidebarGroupLabel>
          <SidebarGroupContent>
            {listConversationId.map((list, index) => (
              <SidebarMenuButton key={index} asChild>
                <Button
                  className="m-1"
                  onClick={() => handleChooseConversationId(list.id)}
                  key={index}
                >
                  {list.id}
                </Button>
              </SidebarMenuButton>
            ))}
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
