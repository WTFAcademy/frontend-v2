import { useSuspenseQuery } from "@tanstack/react-query";
import { getCourseWithType, TCourse } from "../api/use-courses-api";
import { CascaderPanel } from "@/components/cascader-panel";
import { get } from "lodash-es";
import { useRouter } from "next/navigation";

const CourseCascaderPanel = () => {
  const router = useRouter();
  const { data } = useSuspenseQuery({
    queryKey: ["coursesWithType"],
    queryFn: () => getCourseWithType(),
  });

  const courseData = get(data, "data", {});
  const courseOptions = Object.keys(courseData).map(type => {
    const course: TCourse[] = get(courseData, type, []);
    return {
      label: type,
      value: type,
      children: course.map(c => ({
        label: c.title,
        value: c.path,
      })),
    };
  });

  const handleSelect = (keys: string[]) => {
    router.push(`/course/${keys[keys.length - 1]}`);
  };

  return (
    <CascaderPanel
      options={courseOptions}
      onSelect={handleSelect}
      className="w-fit"
    />
  );
};

export default CourseCascaderPanel;
