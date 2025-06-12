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
import { useState } from 'react';

const ButtonCountUseToken = () => {
  const [usedToken, setUsedToken] = useState<number>(0);
  const totals = 1000;
  const userInfo = useUserId();
  const handleFetchTokenUsage = async () => {
    try {
      const getTotalToken = await getUsageTotalToken(userInfo);
      console.log('123', getTotalToken);
      setUsedToken(getTotalToken.used);
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
            <DropdownMenuShortcut>⌘{totals}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Used:
            <DropdownMenuShortcut>⌘{usedToken}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Remaining Tokens:
            <DropdownMenuShortcut>⌘{totals - usedToken}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonCountUseToken;
