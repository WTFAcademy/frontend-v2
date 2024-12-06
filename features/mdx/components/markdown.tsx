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
import { motion } from "framer-motion";
import CodeBlock from "./code/code-block";
import PreSingleLine from "./code/pre-single-line";
import { cn } from "@/lib/utils";

export default function Markdown({ children, mode = 'normal' }: { children: string, mode?: 'normal' | 'quiz' }) {
  const escapedContent = useMemo(() => {
    return fixMarkdownBold(escapeMhchem(escapeBrackets(children)));
  }, [children]);

  const components = useMemo(() => {
    return {
      a: (props: any) => (
        <motion.a
          {...props}
          className="text-wtf-function-link relative inline-block break-all"
          initial="initial"
          whileHover="hover"
          variants={{
            initial: {
              backgroundImage: "linear-gradient(currentColor, currentColor)",
              backgroundPosition: "50% 100%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "0% 1px",
            },
            hover: {
              backgroundSize: "100% 1px",
            },
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          {props.children}
        </motion.a>
      ),
      img: (props: any) => (
        <PhotoProvider>
          <PhotoView key={props.src} src={props.src}>
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={{
                initial: {
                  scale: 1,
                },
                hover: {
                  scale: 1.02,
                },
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="flex justify-center items-center cursor-zoom-in my-4"
            >
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
            </motion.div>
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
