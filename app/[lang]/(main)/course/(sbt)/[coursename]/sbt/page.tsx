import Image from "@/components/image";
import { getCourseDetailByPath } from "@/features/course/api/use-courses-api";
import ClaimStepper from "@/features/sbt/components/claim-steppter";
import Title from "@/features/sbt/components/title";

const CourseSbtPage = async ({
  params,
}: {
  params: { coursename: string };
}) => {
  const course = await getCourseDetailByPath(params.coursename).catch();

  console.log(course);
  if (course.code !== 0)
    return (
      <div className="flex flex-col text-center max-w-[1024px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
        Course not found
      </div>
    );

  return (
    <div className="flex flex-col max-w-[1024px] min-h-screen mx-auto pt-[56px] md:pt-[76px] px-4 md:px-10">
      <div className="mt-[58px] mb-[40px] md:mb-[60px]">
        <Title course={course.data} />
      </div>
      <div className="flex flex-col md:flex-row gap-10 md:h-[376px]">
        <div className="flex-1 bg-wtf-background-block rounded-2xl overflow-hidden flex flex-col justify-center items-center">
          <div className="relative h-[180px] w-[calc(100%-80px)]">
            <Image
              src={course.data.sbt_preview_url}
              alt={course.data.title}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-base text-center mt-6">NFT Certificate</span>
        </div>
        <div className="flex-1">
          <ClaimStepper />
        </div>
      </div>
    </div>
  );
};

export default CourseSbtPage;
