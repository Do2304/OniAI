import { Badge } from '@/components/ui/badge';

export default function MessageFromUser({ content }: { content: string }) {
  return (
    <Badge
      variant="outline"
      className="text-base ml-2 bg-gray-100 p-3 pl-6 pr-6 mr-3 rounded-full whitespace-normal border border-none"
    >
      <span className="block text-gray-800">{content}</span>
    </Badge>
  );
}
