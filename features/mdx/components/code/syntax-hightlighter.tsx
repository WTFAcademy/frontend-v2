import { memo } from 'react';
import { useTheme } from 'next-themes';
import { Icons } from '@/components/icons';
import { useHighlight } from '../../hooks/use-highlight';

export interface SyntaxHighlighterProps {
  children: string;
  language: string;
}

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language }) => {
    const { theme } = useTheme();
    const { data, isLoading } = useHighlight(children.trim(), language, theme === 'dark');

    return (
      <>
        {isLoading || !data ? (
          <div className="text-wtf-content-3">
            <pre>
              <code>{children.trim()}</code>
            </pre>
          </div>
        ) : (
          <div
            className="shiki shiki-wrapper"
            dangerouslySetInnerHTML={{
              __html: data as string,
            }}
          />
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Icons.loading className='animate-spin' />
          </div>
        )}
      </>
    );
  },
);

SyntaxHighlighter.displayName = 'SyntaxHighlighter';

export default SyntaxHighlighter;
