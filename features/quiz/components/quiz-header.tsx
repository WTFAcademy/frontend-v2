import Link from "next/link";
import { TQuizResponse } from "../api/use-quiz-api";

const QuizHeader = ({quiz}: {quiz: TQuizResponse}) => {
  return (
    <div className="flex items-center gap-[6px] mb-6">
      <Link href="/quiz/1" className="text-base">
        {quiz.simple_course.title}
      </Link>
      <span>/</span>
      <Link href="/quiz/1/2" className="text-base">
        {quiz.simple_chapter.title}
      </Link>
      <span>/</span>
      <span className="text-base text-wtf-content-4 pointer-events-none">
        Quiz
      </span>
    </div>
  );
};

export default QuizHeader;
