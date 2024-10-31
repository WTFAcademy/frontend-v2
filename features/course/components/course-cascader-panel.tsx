import { useSuspenseQuery } from "@tanstack/react-query";
import { getCourseWithType, TCourse } from "../api/use-courses.api";
import { CascaderPanel } from "@/components/cascader-panel";
import { get } from "lodash-es";

const CourseCascaderPanel = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["courses"],
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
    console.log(keys);
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
