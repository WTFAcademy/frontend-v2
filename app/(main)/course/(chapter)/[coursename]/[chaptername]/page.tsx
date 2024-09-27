

const CourseChapterPage = ({params}: {params: {coursename: string, chaptername: string}}) => {
    return <div>CourseChapterPage: {params.coursename} - {params.chaptername}</div>
}

export default CourseChapterPage