import { FALLBACK_LANG } from "./use-highlight";

const countLines = (str: string): number => {
    const regex = /\n/g;
    const matches = str.match(regex);
    return matches ? matches.length : 1;
};

const useCode = (raw: any) => {
    console.log("raw", raw);
    
    if (!raw) return;

    const { children, className } = raw.props;

    if (!children) return;

    const content = Array.isArray(children) ? (children[0] as string) : children;

    const lang = className?.replace("language-", "") || FALLBACK_LANG;

    const isSingleLine = countLines(content) <= 1 && content.length <= 32;

    return {
        content,
        isSingleLine,
        lang,
    };
};

export default useCode;
