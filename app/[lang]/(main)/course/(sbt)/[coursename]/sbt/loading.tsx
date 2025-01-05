import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col max-w-[1024px] min-h-screen mx-auto pt-[56px] md:pt-[76px] px-4 md:px-10">
      {/* Title skeleton */}
      <div className="mt-[58px] mb-[40px] md:mb-[60px] flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Skeleton className="h-6 w-[300px]" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col md:flex-row gap-10 md:min-h-[376px]">
        {/* Left NFT preview skeleton */}
        <div className="flex-1 bg-wtf-background-block rounded-2xl overflow-hidden flex flex-col justify-center items-center p-10">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-6 w-32 mt-6" />
        </div>

        {/* Right claim section skeleton */}
        <div className="flex-1">
          <div className="w-full h-full bg-wtf-background-primary rounded-2xl shadow-modal py-8 border border-wtf-border-outline">
            <Skeleton className="h-8 w-48 mx-auto mb-6" />
            
            {/* Step skeletons */}
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className="h-20 w-full px-8 flex items-center justify-between border-y-[0.5px] border-wtf-border-divider"
              >
                <div className="flex items-center gap-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
