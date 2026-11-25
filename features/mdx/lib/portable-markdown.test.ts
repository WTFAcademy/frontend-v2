import { expect, it } from "vitest";
import { portableMarkdown } from "./portable-markdown";
import { sourceLink } from "./source-links";

const root =
  "https://raw.githubusercontent.com/academy/tutorial/" + "a".repeat(40);
const source = root + "/chapters/01-intro/zh.md";
it("keeps Markdown images and reference links tied to the reviewed commit", () => {
  const body =
    "![图](img/test.png)\n\n[代码][sample]\n\n[sample]: /examples/index.sol\n\n`![literal](local)`";
  const result = portableMarkdown(body, source);
  expect(result).toContain(root + "/chapters/01-intro/img/test.png");
  expect(result).toContain(root + "/examples/index.sol");
  expect(result).toContain("![literal](local)");
  expect(sourceLink("#目录", source)).toBe("#目录");
  expect(portableMarkdown(body)).toBe(body);
});
