export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.wtf.academy"
).replace(/\/+$/, "");

export const LOCALES = ["en", "zh"] as const;

export type TLocale = (typeof LOCALES)[number];

/**
 * hreflang alternates for a locale-prefixed route.
 * `path` is the route WITHOUT the locale prefix (e.g. "/course/solidity101").
 * Relative URLs are resolved against `metadataBase` (set in the root layout).
 */
export const localeAlternates = (path: string = "") => ({
  languages: {
    en: `/en${path}`,
    zh: `/zh${path}`,
    "x-default": `/en${path}`,
  },
});
