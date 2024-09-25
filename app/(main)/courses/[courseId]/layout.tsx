

const CourseLayout = ({ children, params }: { children: React.ReactNode, params: { courseId: string } }) => {
  console.log(params.courseId);

  return (
    <div>
      {/* <Slider /> */}
      <div>当前课程 ID：{params.courseId}</div>
      {children}
    </div>
  );
};

export default CourseLayout;
