import { useSuspenseQuery } from "@tanstack/react-query";
import { getCourseWithType } from "../api/use-courses-api";
import { CascaderPanel } from "@/components/cascader-panel";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "./course-keyword-tag";

const CourseCascaderPanel = () => {
  const router = useRouter();
  const { data } = useSuspenseQuery({
    queryKey: ["coursesWithType"],
    queryFn: () => getCourseWithType(),
  });

  const courseOptions = data?.map(({name, list}) => {
    return {
      label: capitalizeFirstLetter(name),
      value: name,
      children: list.map(c => ({
        label: c.title,
        value: c.path,
      })),
      };
    }) || [];

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
