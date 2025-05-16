import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GalleryVerticalEnd } from 'lucide-react';
import { IoCreate } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const SidebarHeaderLayout = () => {
  const navigate = useNavigate();

  const handleStartConversation = () => {
    navigate(`/chat`);
  };

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="#">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">App OniAI</span>
                <span className="">v1.0.0</span>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <IoCreate
                        className="cursor-pointer"
                        onClick={handleStartConversation}
                        size={32}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tạo đoạn chat mới</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default SidebarHeaderLayout;
