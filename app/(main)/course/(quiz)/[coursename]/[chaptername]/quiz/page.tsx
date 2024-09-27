

const QuizPage = ({params}: {params: {coursename: string, chaptername: string}}) => {
    return <div>QuizPage: {params.coursename} - {params.chaptername}</div>
}

export default QuizPage