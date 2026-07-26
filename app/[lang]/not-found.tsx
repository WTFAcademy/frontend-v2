import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg bg-wtf-background-block p-8 text-center">
        <span className="text-4xl font-semibold">404</span>
        <span className="text-sm text-wtf-content-3">
          Page not found. 页面不存在。
        </span>
        <Button asChild className="rounded-full">
          <Link href="/">Back to home 返回首页</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
