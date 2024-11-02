import { Icons } from "@/components/icons";
import { Skeleton as SkeletonUI } from "@/components/ui/skeleton";

const CourseDetailCardSkeleton = () => {
  return (
    <div className="w-full">
      <SkeletonUI className="w-full h-10" />
      <SkeletonUI className="w-full h-10 mt-3" />
      <SkeletonUI className="w-full h-4 mt-3" />
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="flex flex-col">
          <Icons.code className="w-6 h-6 text-wtf-brand-1" />
          <SkeletonUI className="w-full h-4 mt-2" />
          <SkeletonUI className="w-full h-4 mt-1" />
        </div>
        <div className="flex flex-col">
          <Icons.level className="w-6 h-6 text-wtf-brand-1" />
          <SkeletonUI className="w-full h-4 mt-2" />
          <SkeletonUI className="w-full h-4 mt-1" />
        </div>
        <div className="flex flex-col">
          <Icons.date className="w-6 h-6 text-wtf-brand-1" />
          <SkeletonUI className="w-full h-4 mt-2" />
          <SkeletonUI className="w-full h-4 mt-1" />
        </div>
      </div>
      <div className="mt-10">
        <SkeletonUI className="w-full h-10" />
      </div>
      <div className="mt-10 p-8 border border-wtf-border-line rounded-lg flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-wtf-content-1 text-base font-semibold">
            Course Certificate
          </h3>
          <SkeletonUI className="w-full h-4 mt-1" />
        </div>
        <div className="w-[336px] h-[170px] p-2 bg-white dark:bg-wtf-black rounded-lg relative">
          <SkeletonUI className="w-full h-full" />
        </div>
        <SkeletonUI className="w-[100px] h-10" />
      </div>
      <div className="flex flex-col gap-4 mt-10">
        <div className="flex items-center gap-2">
          <Icons.cooperation className="w-4 h-4 text-wtf-content-3" />
          <SkeletonUI className="w-full h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Icons.fillDate className="w-4 h-4 text-wtf-content-3" />
          <SkeletonUI className="w-full h-4" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailCardSkeleton;
