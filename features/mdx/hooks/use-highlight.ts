import {
    transformerNotationDiff,
    transformerNotationErrorLevel,
    transformerNotationFocus,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { type Highlighter, createHighlighter } from 'shiki';
import languageMap from '../constants/language-map';
import { useQuery } from '@tanstack/react-query';

export const FALLBACK_LANG = 'txt';

const FALLBACK_LANGS = [FALLBACK_LANG];

let cacheHighlighter: Highlighter;

const initHighlighter = async (lang: string): Promise<Highlighter> => {
    let highlighter = cacheHighlighter;
    const language = lang.toLowerCase();

    if (highlighter && FALLBACK_LANGS.includes(language)) return highlighter;

    if (languageMap.includes(language as any) && !FALLBACK_LANGS.includes(language)) {
        FALLBACK_LANGS.push(language);
    }

    highlighter = await createHighlighter({
        langs: FALLBACK_LANGS,
        themes: ['github-dark', 'github-light']
    });

    cacheHighlighter = highlighter;

    return highlighter;
};

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) =>
    useQuery({
        queryKey: ['highlight', lang.toLowerCase(), isDarkMode ? 'dark' : 'light', text],
        queryFn: async () => {
            try {
                const language = lang.toLowerCase();
                const highlighter = await initHighlighter(language);
                const html = highlighter?.codeToHtml(text, {
                    lang: languageMap.includes(language as any) ? language : FALLBACK_LANG,
                    theme: isDarkMode ? 'github-dark' : 'github-light',
                    transformers: [
                        transformerNotationDiff(),
                        transformerNotationHighlight(),
                        transformerNotationWordHighlight(),
                        transformerNotationFocus(),
                        transformerNotationErrorLevel(),
                    ],
                });

                return html;
            } catch (error) {
                console.warn("useHighlight error", error);
                return '';
            }
        },
        staleTime: Infinity,
        gcTime: 24 * 60 * 60 * 1000,
    });
