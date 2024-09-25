

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  return <div>课程详情: {params.courseId}</div>;
};

export default CoursePage;
