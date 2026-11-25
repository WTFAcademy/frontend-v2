import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";
import { sourceLink } from "./source-links";

const markdown = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkStringify);

export function portableMarkdown(body: string, source?: string): string {
  if (!source) return body;
  const tree = markdown.parse(body);
  let changed = false;
  visit(tree, (node) => {
    if (
      node.type === "image" ||
      node.type === "link" ||
      node.type === "definition"
    ) {
      const url = sourceLink(node.url, source);
      if (url !== node.url) {
        node.url = url;
        changed = true;
      }
    }
  });
  return changed ? markdown.stringify(tree) : body;
}
