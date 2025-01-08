type TCourseKeywordTagProps = {
  text: string;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const CourseKeywordTag = ({ text }: TCourseKeywordTagProps) => {
  return (
    <span className="inline-flex font-roboto-mono h-7 justify-center items-center rounded bg-wtf-background-tag px-2 py-0 text-wtf-content-3 text-sm font-medium leading-[150%]">
      {capitalizeFirstLetter(text)}
    </span>
  );
};

export default CourseKeywordTag;
