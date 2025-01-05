import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col max-w-[840px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
      {/* Quiz Header Skeleton */}
      <div className="flex items-center gap-[6px] mb-6">
        <Skeleton className="h-6 w-[120px]" />
        <span>/</span>
        <Skeleton className="h-6 w-[100px]" />
      </div>

      {/* Quiz Items Skeleton */}
      <div className="flex flex-col gap-6 mb-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border border-wtf-border-outline rounded p-6 md:p-8">
            <Skeleton className="h-6 w-[80%] mb-4" />
            <Skeleton className="h-4 w-[60%] mb-3" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((option) => (
                <Skeleton key={option} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
