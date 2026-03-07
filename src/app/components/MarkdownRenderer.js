"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer({ content }) {
  return (
    <article className="prose prose-invert dark:prose lg:prose-lg max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}