import { useLLMOutput } from '@llm-ui/react';
import MarkdownComponent from '../llm/Markdown';
import CodeBlock from '../llm/CodeBlock';
import {
  codeBlockLookBack,
  findCompleteCodeBlock,
  findPartialCodeBlock,
} from '@llm-ui/code';
import { markdownLookBack } from '@llm-ui/markdown';
// import { useEffect } from 'react';

const MessageContent = ({ content }: { content: string }) => {
  // console.log('content', content);
  // useEffect(() => {
  //   console.log('content:-------', content);
  // }, [content]);

  const { blockMatches } = useLLMOutput({
    llmOutput: content,
    fallbackBlock: {
      component: MarkdownComponent,
      lookBack: markdownLookBack(),
    },
    blocks: [
      {
        component: CodeBlock,
        findCompleteMatch: findCompleteCodeBlock(),
        findPartialMatch: findPartialCodeBlock(),
        lookBack: codeBlockLookBack(),
      },
    ],
    isStreamFinished: false,
  });

  return (
    <>
      {blockMatches.map((blockMatch, index) => {
        const Component = blockMatch.block.component;
        return <Component key={index} blockMatch={blockMatch} />;
      })}
      {/* {content} */}
    </>
  );
};

export default MessageContent;
