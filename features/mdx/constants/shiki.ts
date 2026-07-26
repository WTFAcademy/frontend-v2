import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";

export const FALLBACK_LANG = "txt";

/** Same theme pair on the client hook and the server renderer. */
export const SHIKI_THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

/** Shared notation transformers ([!code highlight], diffs, etc.). */
export const getShikiTransformers = () => [
  transformerNotationDiff(),
  transformerNotationHighlight(),
  transformerNotationWordHighlight(),
  transformerNotationFocus(),
  transformerNotationErrorLevel(),
];
