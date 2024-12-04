import SyntaxHighlighter from "./syntax-hightlighter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CopyButton } from "./copy-button";

const Pre = ({
  language,
  children,
}: {
  language: string;
  children: string;
}) => {
  return (
    <div className="relative group overflow-hidden rounded-sm bg-wtf-background-block border-[1px] border-wtf-border-line px-4 py-3 text-sm my-4">
      <ScrollArea className="w-full">
        <SyntaxHighlighter language={language}>{children}</SyntaxHighlighter>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="absolute top-2 right-2">
        <CopyButton value={children} />
      </div>
    </div>
  );
};

export default Pre;
