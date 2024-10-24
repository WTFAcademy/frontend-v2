import Image from "next/image";
import CourseKeywordTag from "./CourseKeywordTag";

type TCourseDisplayCardProps = {
  image?: string;
  title: string;
  description: string;
  keywords: string;
};

const LinkSvg = function () {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

const CourseDisplayCard = ({
  image,
  title,
  description,
  keywords
}: TCourseDisplayCardProps) => {
  const keywordsArray = keywords.split(",");

  return (
    <div className="course-display-card w-full p-8 md:p-10 4xl:p-20 border-wtf-border-divider border-[0.5px] border-solid flex flex-col items-center gap-y-8 cursor-pointer transition-all hover:bg-wtf-background-hover">
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
        <div className="text-base font-normal leading-7">{description}</div>
      </div>
      <div className="w-full flex justify-between">
        <div className="w-full flex items-center gap-x-2">
          {keywordsArray.map((keyword, index) => (
            <CourseKeywordTag key={`${keyword}-${index}`} text={keyword} />
          ))}
        </div>
        <div className="w-6 h-6 flex-shrink-0">
          <LinkSvg />
        </div>
      </div>
    </div>
  );
};

export default CourseDisplayCard;
