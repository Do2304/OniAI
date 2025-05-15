import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
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
        <SidebarTrigger onClick={handleTriggerClick} />
        <strong>App OniAI</strong>
        <IoCreate
          className="cursor-pointer"
          onClick={handleStartConversation}
          size={24}
        />
      </div>
    </SidebarHeader>
  );
};

export default SidebarHeaderLayout;
