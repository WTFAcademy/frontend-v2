import Image from "next/image";
import CourseKeywordTag from "./CourseKeywordTag";

type TCourseDisplayCardProps = {
  image?: string;
  title: string;
  description: string;
  keywords: string;
};

const CourseDisplayCard = ({
  image,
  title,
  description,
  keywords,
}: TCourseDisplayCardProps) => {
  const keywordsArray = keywords.split(",");

  return (
    <div className="course-display-card w-full p-8 md:p-10 4xl:p-20 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] border-solid flex flex-col items-center gap-y-8">
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
      <div className="w-full flex items-center gap-x-2">
        {keywordsArray.map((keyword, index) => (
          <CourseKeywordTag key={`${keyword}-${index}`} text={keyword} />
        ))}
      </div>
    </div>
  );
};

export default CourseDisplayCard;
