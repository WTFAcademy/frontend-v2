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

it("resolves published images on the configured Academy API origin", () => {
  const previous = process.env.NEXT_PUBLIC_API_URL;
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:48102/v1";
  try {
    const root = "http://localhost:48102/v1/material/2/" + "b".repeat(64);
    const source = root + "/chapters/01-first/zh.md";
    expect(portableMarkdown("![图](img/example.png)", source)).toContain(root + "/chapters/01-first/img/example.png");
    expect(sourceLink("/assets/shared.png", source)).toBe(root + "/assets/shared.png");
    expect(sourceLink("img/example.png", source.replace("localhost", "other.example"))).toBe("img/example.png");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = previous;
  }
});
