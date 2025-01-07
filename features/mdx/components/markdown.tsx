"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from "../utils";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "../../../components/image";
import "react-photo-view/dist/react-photo-view.css";
import CodeBlock from "./code/code-block";
import PreSingleLine from "./code/pre-single-line";
import { cn } from "@/lib/utils";

export default function Markdown({
  children,
  mode = "normal",
}: {
  children: string;
  mode?: "normal" | "quiz";
}) {
  const escapedContent = useMemo(() => {
    return fixMarkdownBold(escapeMhchem(escapeBrackets(children || "")));
  }, [children]);

  const components = useMemo(() => {
    return {
      a: (props: any) => (
        <a
          {...props}
          className="text-wtf-function-link relative inline-block break-all hover:after:w-full after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-200"
        >
          {props.children}
        </a>
      ),
      img: (props: any) => (
        <PhotoProvider>
          <PhotoView key={props.src} src={props.src}>
            <div className="flex justify-center items-center cursor-zoom-in my-4">
              <Image
                src={props.src}
                alt={props.alt || ""}
                width={1200}
                height={800}
                className="object-contain w-full h-auto max-h-[500px] rounded overflow-hidden"
                priority={false}
                quality={75}
                sizes="100vw"
              />
            </div>
          </PhotoView>
        </PhotoProvider>
      ),
      pre: (props: any) => <CodeBlock highlight={true} {...props} />,
      code: (props: any) => <PreSingleLine {...props} />,
    };
  }, []);

  return (
    <article className={cn(mode === "normal" ? "wtf-mdx" : "wtf-quiz-mdx")}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkMath, remarkGfm]}
        components={components}
      >
        {escapedContent}
      </ReactMarkdown>
    </article>
  );
}
