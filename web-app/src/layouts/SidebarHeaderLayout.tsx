import { Button } from '@/components/ui/button';
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
import { GalleryVerticalEnd, SquarePen } from 'lucide-react';
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
            <a href="#" className="flex items-center justify-between">
              <div className="flex flex-row">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col ml-2 justify-end gap-0.5 leading-none">
                  <span className="font-semibold">App OniAI</span>
                  <span className="">v1.0.0</span>
                </div>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SquarePen
                        className="cursor-pointer"
                        onClick={handleStartConversation}
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
