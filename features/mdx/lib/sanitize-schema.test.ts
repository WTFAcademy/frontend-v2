import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  markdownSanitizeSchema,
  rehypeFilterIframes,
} from "@/features/mdx/lib/sanitize-schema";

/**
 * These cover code that already ships (the XSS boundary for contributor
 * markdown). They exist as regression armor and as proof that the new harness
 * runs real project code — not a toy. Their ability to fail is demonstrated by
 * the sanitize mutants in tools/mutants.sh.
 */

type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const iframe = (src: unknown): Node => ({
  type: "element",
  tagName: "iframe",
  properties: { src },
});

const tree = (...children: Node[]): Node => ({ type: "root", children });

const srcs = (node: Node) =>
  (node.children ?? []).map((c) => c.properties?.src);

describe("rehypeFilterIframes", () => {
  it("keeps a YouTube embed iframe", () => {
    const t = tree(iframe("https://www.youtube.com/embed/abc123"));
    rehypeFilterIframes()(t);
    expect(srcs(t)).toEqual(["https://www.youtube.com/embed/abc123"]);
  });

  it("keeps a protocol-relative Bilibili player iframe", () => {
    const t = tree(iframe("//player.bilibili.com/player.html?aid=1"));
    rehypeFilterIframes()(t);
    expect(srcs(t)).toEqual(["//player.bilibili.com/player.html?aid=1"]);
  });

  it("drops an iframe pointing at an arbitrary host", () => {
    const t = tree(iframe("https://evil.example.com/embed/x"));
    rehypeFilterIframes()(t);
    expect(t.children).toEqual([]);
  });

  it("drops a javascript: iframe", () => {
    const t = tree(iframe("javascript:alert(1)"));
    rehypeFilterIframes()(t);
    expect(t.children).toEqual([]);
  });

  it("drops an iframe with no src at all", () => {
    const t = tree({ type: "element", tagName: "iframe" });
    rehypeFilterIframes()(t);
    expect(t.children).toEqual([]);
  });

  it("requires the allowlisted origin at the START of the src, not anywhere in it", () => {
    const t = tree(iframe("https://evil.example.com/?u=https://www.youtube.com/embed/x"));
    rehypeFilterIframes()(t);
    expect(t.children).toEqual([]);
  });

  it("matches the prefix case-insensitively", () => {
    const t = tree(iframe("HTTPS://WWW.YOUTUBE.COM/EMBED/abc"));
    rehypeFilterIframes()(t);
    expect(srcs(t)).toEqual(["HTTPS://WWW.YOUTUBE.COM/EMBED/abc"]);
  });

  it("filters iframes nested deep in the tree, not only at the root", () => {
    const t = tree({
      type: "element",
      tagName: "div",
      children: [
        { type: "element", tagName: "p", children: [iframe("https://evil.example.com/")] },
      ],
    });
    rehypeFilterIframes()(t);
    const p = t.children![0].children![0];
    expect(p.children).toEqual([]);
  });

  it("leaves non-iframe elements untouched", () => {
    const t = tree(
      { type: "element", tagName: "img", properties: { src: "https://evil.example.com/x.png" } },
      { type: "text" }
    );
    rehypeFilterIframes()(t);
    expect(t.children).toHaveLength(2);
  });

  it("tolerates a leaf node with no children array", () => {
    const t: Node = { type: "root" };
    expect(() => rehypeFilterIframes()(t)).not.toThrow();
  });

  it("property: no surviving iframe src starts with anything but an allowlisted prefix", () => {
    const prefixes = [
      "https://www.youtube.com/embed/",
      "https://youtube.com/embed/",
      "https://www.youtube-nocookie.com/embed/",
      "https://player.bilibili.com/",
      "//www.youtube.com/embed/",
      "//player.bilibili.com/",
    ];
    fc.assert(
      fc.property(fc.array(fc.string(), { maxLength: 12 }), (rawSrcs) => {
        const t = tree(...rawSrcs.map(iframe));
        rehypeFilterIframes()(t);
        for (const s of srcs(t)) {
          const lower = String(s).toLowerCase();
          expect(prefixes.some((p) => lower.startsWith(p))).toBe(true);
        }
      }),
      { numRuns: 1000 }
    );
  });

  it("property: an allowlisted prefix plus any suffix always survives", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          "https://www.youtube.com/embed/",
          "https://youtube.com/embed/",
          "https://www.youtube-nocookie.com/embed/",
          "https://player.bilibili.com/",
          "//www.youtube.com/embed/",
          "//player.bilibili.com/"
        ),
        fc.string(),
        (prefix, suffix) => {
          const t = tree(iframe(prefix + suffix));
          rehypeFilterIframes()(t);
          expect(t.children).toHaveLength(1);
        }
      ),
      { numRuns: 1000 }
    );
  });
});

describe("markdownSanitizeSchema", () => {
  it("does not allow <script>", () => {
    expect(markdownSanitizeSchema.tagNames).not.toContain("script");
  });

  it("allows the media and disclosure tags course content uses", () => {
    for (const tag of ["video", "source", "iframe", "details", "summary", "u"]) {
      expect(markdownSanitizeSchema.tagNames).toContain(tag);
    }
  });

  it("allows KaTeX MathML output tags", () => {
    for (const tag of ["math", "semantics", "annotation", "mrow", "mfrac"]) {
      expect(markdownSanitizeSchema.tagNames).toContain(tag);
    }
  });

  it("allows className and style on every element and nothing executable", () => {
    const globals = markdownSanitizeSchema.attributes?.["*"] ?? [];
    expect(globals).toContain("className");
    expect(globals).toContain("style");
    const names = globals.map((a) => (Array.isArray(a) ? String(a[0]) : String(a)));
    expect(names.filter((n) => n.toLowerCase().startsWith("on"))).toEqual([]);
  });

  it("does not allow event-handler attributes on any tag", () => {
    for (const attrs of Object.values(markdownSanitizeSchema.attributes ?? {})) {
      const names = attrs.map((a) => (Array.isArray(a) ? String(a[0]) : String(a)));
      expect(names.filter((n) => /^on[a-z]/i.test(n))).toEqual([]);
    }
  });

  it("keeps the default protocol allowlist (no javascript: URLs)", () => {
    const protocols = Object.values(markdownSanitizeSchema.protocols ?? {}).flat();
    expect(protocols).not.toContain("javascript");
  });
});
