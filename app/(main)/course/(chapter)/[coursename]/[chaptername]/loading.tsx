import { Skeleton } from "@/components/ui/skeleton";

const CourseChapterPageLoading = () => {
  return (
    <div className="relative flex-auto overflow-y-auto pt-20">
      <div className="px-4 md:px-10 py-10">
        <Skeleton className="h-10 w-2/3" />
        
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
    </div>
  );
};

export default CourseChapterPageLoading;
