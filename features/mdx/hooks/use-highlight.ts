import { getSingletonHighlighter, type BundledLanguage } from 'shiki';
import languageMap from '../constants/language-map';
import { FALLBACK_LANG, SHIKI_THEMES, getShikiTransformers } from '../constants/shiki';
import { useQuery } from '@tanstack/react-query';

export { FALLBACK_LANG };

// NOTE: deliberately NOT `shiki/bundle/web` — the web bundle has no Solidity
// grammar, which is this site's primary language. The full bundle lazy-loads
// each grammar as its own chunk, so the client only downloads what it uses.

/**
 * Cheap stable digest so the react-query cache key doesn't contain the whole
 * code block text (djb2 + length).
 */
const hashText = (text: string): string => {
    let hash = 5381;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
    }
    return `${text.length.toString(36)}:${(hash >>> 0).toString(36)}`;
};

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) => {
    const language = lang.toLowerCase();

    return useQuery({
        queryKey: ['highlight', language, isDarkMode ? 'dark' : 'light', hashText(text)],
        queryFn: async () => {
            try {
                const resolvedLang = languageMap.includes(language as any) ? language : FALLBACK_LANG;

                // getSingletonHighlighter caches the instance (and its init
                // promise), so concurrent mounts share a single highlighter and
                // extra languages are merged in on demand — no more re-creating
                // the highlighter with every language ever requested.
                const highlighter = await getSingletonHighlighter({
                    langs: [resolvedLang as BundledLanguage],
                    themes: [SHIKI_THEMES.dark, SHIKI_THEMES.light],
                });

                return highlighter.codeToHtml(text, {
                    lang: resolvedLang,
                    theme: isDarkMode ? SHIKI_THEMES.dark : SHIKI_THEMES.light,
                    transformers: getShikiTransformers(),
                });
            } catch (error) {
                console.warn("useHighlight error", error);
                return '';
            }
        },
        staleTime: Infinity,
        gcTime: 24 * 60 * 60 * 1000,
    });
};
