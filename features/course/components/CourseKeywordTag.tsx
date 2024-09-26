type TCourseKeywordTagProps = {
  text: string;
};

const CourseKeywordTag = ({ text }: TCourseKeywordTagProps) => {
  return (
    <span className="inline-flex font-roboto-mono h-7 justify-center items-center rounded bg-wtf-black/[0.08] px-2 py-0 text-wtf-text-3 text-sm font-medium leading-[150%]">
      {text}
    </span>
  );
};

export default CourseKeywordTag;
