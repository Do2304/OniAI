import { getUsageTotalToken } from '@/api/tokenService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useUserId from '@/utils/useUserId';
import { Siren } from 'lucide-react';

const ButtonCountUseToken = () => {
  const userInfo = useUserId();
  const handleFetchTokenUsage = async () => {
    try {
      const getTotalToken = await getUsageTotalToken(userInfo);
      console.log('123', getTotalToken);
    } catch (err) {
      console.log('Could not fetch token usage', err);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleFetchTokenUsage}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-2 ml-1 rounded-full">
          <Siren /> <span className="hidden lg:inline">Analysis</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Total Tokens:
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Used:
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Remaining Tokens:
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonCountUseToken;
