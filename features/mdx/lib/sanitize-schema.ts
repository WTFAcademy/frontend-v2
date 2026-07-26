import { defaultSchema } from "rehype-sanitize";

/**
 * Sanitization for contributor-authored markdown (which may embed raw HTML).
 *
 * Course content is written by third-party contributors, and the site keeps a
 * JWT in a cookie — so raw HTML flowing through rehype-raw is a stored-XSS
 * vector. This schema is the rehype-sanitize default schema (script tags,
 * event handlers, javascript: URLs etc. are stripped) EXTENDED with only what
 * WTF course content legitimately uses:
 *
 * - `className` + `style` on every element (Tailwind classes / inline layout
 *   used by existing course HTML; neither can execute script).
 * - `img` with src/alt/width/height (http/https/relative src only — default
 *   protocol rules apply).
 * - `video`/`source` for self-hosted clips.
 * - `iframe` — allowed here attribute-wise, but the src is further restricted
 *   to YouTube/Bilibili embed players by `rehypeFilterIframes` below (schema
 *   attribute rules can't express "URL prefix" constraints).
 * - `details`/`summary` disclosure widgets and `u` (styled by mdx.css).
 * - KaTeX MathML output tags/attributes (rehype-katex runs with
 *   `output: "mathml"` BEFORE sanitize, so its output must be allowed).
 *
 * Everything else (on* handlers, javascript:/data: URLs, <script>, <object>,
 * <embed>, form elements, …) is dropped by the default schema.
 */

const MATHML_TAGS = [
  "math",
  "semantics",
  "annotation",
  "mrow",
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "mspace",
  "msup",
  "msub",
  "msubsup",
  "mfrac",
  "msqrt",
  "mroot",
  "mstyle",
  "merror",
  "mpadded",
  "mphantom",
  "mtable",
  "mtr",
  "mtd",
  "mover",
  "munder",
  "munderover",
  "mmultiscripts",
  "mprescripts",
  "none",
];

// Presentation attributes KaTeX emits on its MathML output (all inert).
const MATHML_ATTRS = [
  "accent",
  "accentunder",
  "columnalign",
  "columnlines",
  "columnspacing",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "height",
  "linethickness",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rspace",
  "scriptlevel",
  "separator",
  "stretchy",
  "voffset",
  "width",
  "xmlns",
];

export const markdownSanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    // media
    "video",
    "source",
    "iframe",
    // disclosure widgets
    "details",
    "summary",
    // underline (styled by mdx.css)
    "u",
    // KaTeX MathML output
    ...MATHML_TAGS,
  ],
  attributes: {
    ...defaultSchema.attributes,
    // className/style everywhere — presentational only, cannot run script.
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style"],
    img: ["src", "alt", "width", "height"],
    video: [
      "src",
      "controls",
      "autoPlay",
      "loop",
      "muted",
      "playsInline",
      "poster",
      "preload",
      "width",
      "height",
    ],
    source: ["src", "type"],
    // src additionally restricted by rehypeFilterIframes (prefix allowlist).
    iframe: [
      "src",
      "width",
      "height",
      "title",
      "allow",
      "allowFullScreen",
      "frameBorder",
      "scrolling",
      "referrerPolicy",
      "sandbox",
      "loading",
    ],
    ...Object.fromEntries(MATHML_TAGS.map((tag) => [tag, MATHML_ATTRS])),
  },
};

/**
 * Only these embed players may be iframed. Bilibili's official share snippet
 * is protocol-relative ("//player.bilibili.com/…"), hence the bare prefixes.
 */
const ALLOWED_IFRAME_SRC_PREFIXES = [
  "https://www.youtube.com/embed/",
  "https://youtube.com/embed/",
  "https://www.youtube-nocookie.com/embed/",
  "https://player.bilibili.com/",
  "//www.youtube.com/embed/",
  "//player.bilibili.com/",
];

type THastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: THastNode[];
};

/**
 * Rehype plugin (runs AFTER rehype-sanitize): drops any <iframe> whose src is
 * not a YouTube/Bilibili embed URL. Dependency-free tree walk on purpose.
 */
export const rehypeFilterIframes = () => (tree: THastNode) => {
  const walk = (node: THastNode) => {
    if (!node.children) return;

    node.children = node.children.filter((child) => {
      if (child.type === "element" && child.tagName === "iframe") {
        const src = String(child.properties?.src ?? "").toLowerCase();
        return ALLOWED_IFRAME_SRC_PREFIXES.some((prefix) =>
          src.startsWith(prefix)
        );
      }
      return true;
    });

    node.children.forEach(walk);
  };

  walk(tree);
};
