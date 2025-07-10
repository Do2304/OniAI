import MessageContent from '@/pages/llm/MessageContent';

export default function MessageFromAssistant({
  content,
  model,
  citations,
}: {
  content: string;
  model?: string;
  citations?: {
    title: string;
    link: string;
    context: string;
  }[];
}) {
  return (
    <div className="text-base ml-3 whitespace-normal border border-none">
      <div className="block text-black break-words whitespace-pre-wrap">
        <MessageContent content={content} />
        {citations && citations.length > 0 && (
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="font-medium text-lg text-gray-800">Web search:</div>
            {citations.map((citation, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-400 pl-3 py-1 bg-blue-50 rounded"
              >
                <a
                  href={citation.link}
                  target="_blank"
                  className="text-blue-700 underline"
                >
                  {citation.title}
                </a>
                <div className="text-xs mt-1 text-gray-600">
                  {citation.context.slice(0, 200)}...
                </div>
              </div>
            ))}
          </div>
        )}
        {model && <div className="text-xs text-gray-500">{model}</div>}
      </div>
    </div>
  );
}
