import { codeToHtml, type BundledLanguage } from "shiki/bundle/full";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
} from "@shikijs/transformers";
import languageMap from "./constants/language-map";

const supported = new Set<string>(languageMap);

export function highlight(text: string, language: string, dark: boolean) {
  return codeToHtml(text, {
    lang: supported.has(language) ? (language as BundledLanguage) : "txt",
    theme: dark ? "github-dark" : "github-light",
    transformers: [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
    ],
  });
}
