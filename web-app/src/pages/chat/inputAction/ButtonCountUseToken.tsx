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
import { Siren } from 'lucide-react';

const ButtonCountUseToken = () => {
  const handleFetchTokenUsage = async () => {
    try {
      console.log('LẤY TOKEN');
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
