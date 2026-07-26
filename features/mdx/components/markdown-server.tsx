import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from "../utils";
import { cn } from "@/lib/utils";
import MarkdownImage from "./markdown-image";
import CodeBlockServer from "./code/code-block-server";
import PreSingleLine from "./code/pre-single-line";
import {
  markdownSanitizeSchema,
  rehypeFilterIframes,
} from "../lib/sanitize-schema";

/**
 * Server (RSC) markdown renderer — same remark/rehype pipeline and component
 * mappings/classes as the client <Markdown />, so the output is identical,
 * with two differences:
 *
 * 1. shiki runs on the server (dual-theme output, see PreServer), and
 * 2. rehype-sanitize runs after rehype-raw/rehype-katex to strip dangerous
 *    contributor HTML (see sanitize-schema.ts).
 *
 * Interactive bits (image zoom, copy button) remain client islands.
 * The client <Markdown /> stays for quiz pages and other client-only spots.
 */

const components = {
  a: (props: any) => (
    <a
      {...props}
      className="text-wtf-function-link relative inline-block break-all hover:after:w-full after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-200"
    >
      {props.children}
    </a>
  ),
  img: (props: any) => <MarkdownImage src={props.src} alt={props.alt} />,
  pre: (props: any) => <CodeBlockServer {...props} />,
  code: (props: any) => <PreSingleLine {...props} />,
};

export default function MarkdownServer({
  children,
  mode = "normal",
}: {
  children: string;
  mode?: "normal" | "quiz";
}) {
  const escapedContent = fixMarkdownBold(
    escapeMhchem(escapeBrackets(children || ""))
  );

  return (
    <article className={cn(mode === "normal" ? "wtf-mdx" : "wtf-quiz-mdx")}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          [rehypeKatex, { output: "mathml" }],
          // Sanitize AFTER raw + katex: strips scripts/handlers from
          // contributor HTML while keeping KaTeX's MathML output.
          [rehypeSanitize, markdownSanitizeSchema],
          rehypeFilterIframes,
        ]}
        remarkPlugins={[remarkMath, remarkGfm]}
        components={components}
      >
        {escapedContent}
      </ReactMarkdown>
    </article>
  );
}
