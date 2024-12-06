import QuizHeader from "@/features/quiz/components/quiz-header"
import QuizListForm from "@/features/quiz/components/quiz-list-form"


const QuizPage = ({params}: {params: {coursename: string, chaptername: string}}) => {
    console.log(params);
    
    return (
        <div className="flex flex-col max-w-[840px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
            <QuizHeader />
            <QuizListForm />
        </div>
    )
}

export default QuizPage