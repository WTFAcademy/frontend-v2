"use client";

import { Button } from "@/components/ui/button";

const Error = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg bg-wtf-background-block p-8 text-center">
        <span className="text-lg font-medium">Something went wrong 出错了</span>
        <span className="text-sm text-wtf-content-3">
          Failed to load the course. Please try again. 课程加载失败，请重试。
        </span>
        <Button className="rounded-full" onClick={() => reset()}>
          Retry 重试
        </Button>
      </div>
    </div>
  );
};

export default Error;
