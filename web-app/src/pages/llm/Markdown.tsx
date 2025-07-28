import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type LLMOutputComponent } from '@llm-ui/react';

const MarkdownComponent: LLMOutputComponent = ({ blockMatch }) => {
  // console.log('blockMatch', blockMatch);

  const markdown = blockMatch.llmOutput;
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;
};

export default MarkdownComponent;
