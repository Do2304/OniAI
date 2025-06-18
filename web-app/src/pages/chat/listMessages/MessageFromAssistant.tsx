import MessageContent from '@/pages/llm/MessageContent';

export default function MessageFromAssistant({
  content,
  model,
}: {
  content: string;
  model?: string;
}) {
  return (
    <div className="text-base ml-3 whitespace-normal border border-none">
      <div className="block text-black break-words whitespace-pre-wrap">
        <MessageContent content={content} />
        {model && <div className="text-xs text-gray-500">{model}</div>}
      </div>
    </div>
  );
}
