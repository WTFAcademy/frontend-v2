import Link from "next/link";
import { TQuizResponse } from "../api/use-quiz-api";

const QuizHeader = ({quiz}: {quiz: TQuizResponse}) => {
  return (
    <div className="flex items-center gap-[6px] mb-6">
      <Link href="/quiz/1" className="text-base">
        {quiz.course.title}
      </Link>
      <span>/</span>
      <Link href="/quiz/1/2" className="text-base">
        {quiz.chapter.title}
      </Link>
    </div>
  );
};

export default QuizHeader;
