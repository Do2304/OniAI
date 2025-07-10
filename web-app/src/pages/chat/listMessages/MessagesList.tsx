import MessageFromUser from './MessageFromUser';
import MessageFromAssistant from './MessageFromAssistant';

interface Citation {
  title: string;
  link: string;
  context: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  model?: string;
  citations?: Citation[];
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
    <div className={`${messages && 'flex-1'}`}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-2 ${msg.role === 'User' ? 'text-right' : 'text-left'}`}
        >
          {msg.role === 'User' ? (
            <MessageFromUser content={msg.content} />
          ) : (
            <MessageFromAssistant
              content={msg.content}
              model={msg.model}
              citations={msg.citations}
            />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
