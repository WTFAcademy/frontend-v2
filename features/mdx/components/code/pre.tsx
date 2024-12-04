import SyntaxHighlighter from "./syntax-hightlighter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Pre = ({
  language,
  children,
}: {
  language: string;
  children: string;
}) => {
  return (
    <div className="overflow-hidden rounded-sm bg-wtf-background-block border-[1px] border-wtf-border-line px-4 py-3 text-sm my-4">
      <ScrollArea className="w-full">
        <SyntaxHighlighter language={language}>{children}</SyntaxHighlighter>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Pre;
