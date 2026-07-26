import "server-only";

import { codeToHtml } from "shiki";
import languageMap from "../constants/language-map";
import { FALLBACK_LANG, SHIKI_THEMES, getShikiTransformers } from "./../constants/shiki";

/**
 * Server-side code highlighting (RSC only).
 *
 * Unlike the client hook (which highlights with a single theme and re-renders
 * on theme change), the server renders BOTH palettes at once via shiki's
 * dual-theme output: inline styles carry the github-light colors plus
 * `--shiki-dark*` CSS variables. `html.dark .shiki.shiki-themes` rules in
 * styles/mdx.css flip to the dark set, so the rendered colors per theme are
 * identical to what the client hook produces today.
 *
 * `codeToHtml` uses shiki's internal lazy singleton and loads languages on
 * demand — bundle size is irrelevant on the server.
 */
export const highlightCodeServer = async (
  code: string,
  lang: string
): Promise<string> => {
  const language = lang.toLowerCase();

  try {
    return await codeToHtml(code, {
      lang: languageMap.includes(language as (typeof languageMap)[number])
        ? language
        : FALLBACK_LANG,
      themes: SHIKI_THEMES,
      defaultColor: "light",
      transformers: getShikiTransformers(),
    });
  } catch (error) {
    console.warn("highlightCodeServer error", error);
    return "";
  }
};
