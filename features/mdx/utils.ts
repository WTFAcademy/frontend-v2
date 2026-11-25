/**
 * Plain-text excerpt of a markdown document (for meta descriptions):
 * strips frontmatter, code fences, HTML, images, math and markdown syntax.
 */
export function markdownExcerpt(markdown: string, maxLength = 160): string {
    if (!markdown) return '';

    const text = markdown
        .replace(/^\s*---[\S\s]*?---/, ' ') // frontmatter
        .replace(/```[\S\s]*?```/g, ' ') // code fences
        .replace(/<(script|style)[\S\s]*?<\/\1>/gi, ' ') // script/style incl. content
        .replace(/<[^>]+>/g, ' ') // raw html tags
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> label
        .replace(/\$\$[\S\s]*?\$\$|\$[^$\n]*\$/g, ' ') // math
        .replace(/^[#>\-*+\s]+/gm, '') // heading/quote/list markers
        .replace(/[`*_~]/g, '') // emphasis/inline-code markers
        .replace(/\s+/g, ' ')
        .trim();

    return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

export function escapeBrackets(text: string) {
    const pattern = /(```[\S\s]*?```|`.*?`)|\\\[([\S\s]*?[^\\])\\]|\\\((.*?)\\\)/g;
    return text.replaceAll(pattern, (match, codeBlock, squareBracket, roundBracket) => {
        if (codeBlock) {
            return codeBlock;
        } else if (squareBracket) {
            return `$$${squareBracket}$$`;
        } else if (roundBracket) {
            return `$${roundBracket}$`;
        }
        return match;
    });
}

export function escapeMhchem(text: string) {
    return text.replaceAll('$\\ce{', '$\\\\ce{').replaceAll('$\\pu{', '$\\\\pu{');
}

export function fixMarkdownBold(text: string): string {
    let count = 0;
    let count2 = 0;
    let result = '';
    let inCodeBlock = false;
    let inInlineCode = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (text.slice(i, i + 3) === '```') {
            inCodeBlock = !inCodeBlock;
            result += '```';
            i += 2;
            continue;
        }
        if (char === '`') {
            inInlineCode = !inInlineCode;
            result += '`';
            continue;
        }

        if (char === '*' && !inInlineCode && !inCodeBlock) {
            count++;
            if (count === 2) {
                count2++;
            }
            if (count > 2) {
                result += char;
                continue;
            }
            if (count === 2 && count2 % 2 === 0) {
                const prevChar = i > 0 ? text[i - 2] : '';
                const isPrevCharSymbol = /[\p{P}\p{S}]/u.test(prevChar);

                if (i + 1 < text.length && text[i + 1] !== ' ' && isPrevCharSymbol) {
                    result += '* ';
                } else {
                    result += '*';
                }
            } else {
                result += '*';
            }
        } else {
            result += char;
            count = 0;
        }
    }
    return result;
}
