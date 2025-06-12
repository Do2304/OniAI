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
import { useQuery } from '@tanstack/react-query';

const ButtonCountUseToken = () => {
  const userInfo = useUserId();
  const totals = 1000;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tokenUsage', userInfo],
    queryFn: async () => {
      const getTotalToken = await getUsageTotalToken(userInfo);
      return getTotalToken;
    },
    enabled: !!userInfo,
  });
  const handleFetchTokenUsage = () => {
    refetch();
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
            <DropdownMenuShortcut>
              ⌘{isLoading ? 'Loading...' : data?.used}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Remaining Tokens:
            <DropdownMenuShortcut>
              ⌘{isLoading ? 'Loading...' : data?.remaining}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isError && <DropdownMenuItem>Error: {error.message}</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonCountUseToken;
