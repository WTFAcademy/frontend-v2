import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import useCopy from "@/hooks/use-copy";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const { copied, copy } = useCopy();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => copy(value)}
      className="hidden group-hover:flex transition-all w-6 h-6 border-[1px] border-wtf-border-outline rounded bg-wtf-background-primary hover:bg-wtf-background-primary"
    >
      {copied ? (
        <Icons.check className="h-4 w-4 text-wtf-content-3" />
      ) : (
        <Icons.copy className="h-4 w-4 text-wtf-content-3" />
      )}
      <span className="sr-only">{copied ? "已复制" : "复制代码"}</span>
    </Button>
  );
}
