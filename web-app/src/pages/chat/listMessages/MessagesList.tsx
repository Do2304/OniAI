import MessageFromUser from './MessageFromUser';
import MessageFromAssistant from './MessageFromAssistant';

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
  return (
    <div className={`${messages && 'flex-1'}`}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 ${msg.role === 'User' ? 'text-right' : 'text-left'}`}
        >
          {msg.role === 'User' ? (
            <MessageFromUser content={msg.content} />
          ) : (
            <MessageFromAssistant content={msg.content} model={msg.model} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
