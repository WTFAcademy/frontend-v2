import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CopyButton } from "./copy-button";
import { highlightCodeServer } from "../../lib/highlight-server";

/**
 * Server-rendered code block: same wrapper markup/classes as the client
 * <Pre />, but the shiki HTML is produced during SSR (dual light/dark theme —
 * see highlight-server.ts). Copy button stays a client island.
 */
const PreServer = async ({
  language,
  children,
}: {
  language: string;
  children: string;
}) => {
  const html = await highlightCodeServer(children.trim(), language);

  return (
    <div className="relative group overflow-hidden rounded-sm bg-wtf-background-code border-[1px] border-wtf-border-outline px-4 py-3 text-sm my-4 font-mono">
      <ScrollArea className="w-full">
        {html ? (
          <div
            className="shiki shiki-wrapper"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          // Same plain fallback the client shows when highlighting fails.
          <div className="text-wtf-content-3">
            <pre>
              <code>{children.trim()}</code>
            </pre>
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="absolute top-2 right-2">
        <CopyButton value={children} />
      </div>
    </div>
  );
};

export default PreServer;
