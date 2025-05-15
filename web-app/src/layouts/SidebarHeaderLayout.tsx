import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IoCreate } from 'react-icons/io5';

interface SidebarHeaderProps {
  handleTriggerClick: () => void;
  handleStartConversation: () => void;
}

const SidebarHeaderLayout = ({
  handleTriggerClick,
  handleStartConversation,
}: SidebarHeaderProps) => {
  return (
    <SidebarHeader>
      <div className="flex items-center justify-between space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <SidebarTrigger onClick={handleTriggerClick} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Đóng Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <strong>App OniAI</strong>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoCreate
                className="cursor-pointer"
                onClick={handleStartConversation}
                size={24}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tạo đoạn chat mới</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </SidebarHeader>
  );
};

export default SidebarHeaderLayout;
