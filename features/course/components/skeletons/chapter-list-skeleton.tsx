import { Skeleton } from "@/components/ui/skeleton";

const ChapterListSkeleton = () => {
  return (
    <div className="w-full">
      <h1 className="text-wtf-content-1 text-xl font-bold mb-4">
        <Skeleton className="h-8 w-32" />
      </h1>
      <div className="flex flex-col gap-1">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="border-b-[0.5px] border-wtf-border-divider py-1"
          >
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Skeleton className="rounded-full w-[30px] h-[30px]" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterListSkeleton;
