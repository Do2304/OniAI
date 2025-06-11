import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: string;
  content: string;
  model?: string;
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({ messages, messagesEndRef }: MessageListProps) => {
  const userBadgeClassName = 'bg-gray-100 p-3 pl-6 pr-6 mr-3 rounded-full';
  return (
    <div className={`${messages && 'flex-1'}`}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 ${msg.role === 'User' ? 'text-right' : 'text-left'}`}
        >
          <Badge
            variant="outline"
            className={`text-base ml-2 ${msg.role === 'User' && userBadgeClassName} whitespace-normal border border-none`}
          >
            <span className={`block ${msg.role === 'User' && 'text-gray-800'}`}>
              {msg.content}
            </span>
            {msg.model && (
              <div className="text-xs text-gray-500">{msg.model}</div>
            )}
          </Badge>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
