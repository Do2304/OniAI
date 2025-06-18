import type { CodeToHtmlOptions } from '@llm-ui/code';
import {
  loadHighlighter,
  useCodeBlockToHtml,
  allLangs,
  allLangsAlias,
} from '@llm-ui/code';

import { bundledThemes } from 'shiki/themes';
import { type LLMOutputComponent } from '@llm-ui/react';
import parseHtml from 'html-react-parser';
import { createHighlighter } from 'shiki';

import { bundledLanguagesInfo } from 'shiki/langs';

const highlighter = loadHighlighter(
  createHighlighter({
    langs: allLangs(bundledLanguagesInfo),
    langAlias: allLangsAlias(bundledLanguagesInfo),
    themes: Object.values(bundledThemes),
  }),
);

const codeToHtmlOptions: CodeToHtmlOptions = {
  theme: 'github-dark',
};

const CodeBlock: LLMOutputComponent = ({ blockMatch }) => {
  const { html, code } = useCodeBlockToHtml({
    markdownCodeBlock: blockMatch.output,
    highlighter,
    codeToHtmlOptions,
  });
  if (!html) {
    return (
      <pre className="shiki">
        <code>{code}</code>
      </pre>
    );
  }
  return <>{parseHtml(html)}</>;
};

export default CodeBlock;
