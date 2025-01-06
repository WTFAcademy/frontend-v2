import Image from "@/components/image";
import { Skeleton as SkeletonUI } from "@/components/ui/skeleton";
import Link from "next/link";
import { Icons } from "@/components/icons";

type TCourseDisplayCardProps = {
  image?: string;
  title: string;
  description: string;
  path: string;
  time: string;
  isCompleted: boolean;
};

const LinkSvg = function () {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const UserCourseDisplayCard = ({
  image,
  title,
  description,
  path,
  time,
  isCompleted,
}: TCourseDisplayCardProps) => {
  return (
    <div className="course-display-card w-full p-8 md:p-10 border-wtf-border-divider border-[0.5px] border-solid flex flex-col items-center gap-y-8 cursor-pointer transition-all hover:bg-wtf-background-hover">
      <div className="relative w-full h-[186px] md:h-[240px]">
        <Image
          src={image || "/images/course-placeholder.png"}
          alt={title}
          fill
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-full flex flex-col gap-y-3">
        <div className="text-[22px] font-bold leading-none">{title}</div>
        <div className="text-base font-normal leading-7 overflow-hidden line-clamp-2">
          {description}
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center gap-x-2">
          {isCompleted && (
            <div className="px-2 py-[9px] rounded bg-wtf-function-successBg flex items-center gap-x-2">
              <Icons.completed className="w-5 h-5 text-wtf-function-success" />
              <span className="text-wtf-function-success font-semibold">
                {time}
              </span>
            </div>
          )}
          {!isCompleted && (
            <div className="px-2 py-[9px] rounded bg-wtf-background-tag flex items-center gap-x-2 text-wtf-content-3">
              <Icons.fillDate className="w-5 h-5" />
              <span className="font-semibold">{time}</span>
            </div>
          )}
        </div>
        <Link href={`/course/${path}`} className="w-6 h-6 flex-shrink-0">
          <LinkSvg />
        </Link>
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="course-display-card w-full p-8 md:p-10 border-wtf-border-divider border-[0.5px] border-solid flex flex-col items-center gap-y-8 cursor-pointer transition-all hover:bg-wtf-background-hover">
      <SkeletonUI className="relative w-full h-[186px] md:h-[240px]" />
      <div className="w-full flex flex-col gap-y-3">
        <SkeletonUI className="w-full h-[22px] mb-3" />
        <SkeletonUI className="w-full h-[14px]" />
      </div>
      <div className="w-full flex justify-between">
        <div className="w-full flex items-center gap-x-2">
          <SkeletonUI className="w-full h-[14px]" />
          <SkeletonUI className="w-full h-[14px]" />
        </div>
      </div>
    </div>
  );
};

UserCourseDisplayCard.Skeleton = Skeleton;

export default UserCourseDisplayCard;
