import { Skeleton } from "@/components/ui/skeleton";

const CourseChapterPageLoading = () => {
  return (
    <div className="relative flex-auto overflow-y-auto">
      <div className="p-10">
        <Skeleton className="h-12 w-2/3" />
        
        <div className="my-4 flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-wtf-background-block border-t border-wtf-border-divider px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
};

export default CourseChapterPageLoading;
