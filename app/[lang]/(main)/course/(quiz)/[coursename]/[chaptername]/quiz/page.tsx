import { Button } from "@/components/ui/button";
import { getQuizzes } from "@/features/quiz/api/use-quiz-api";
import QuizHeader from "@/features/quiz/components/quiz-header";
import QuizListForm from "@/features/quiz/components/quiz-list-form";
import Link from "next/link";

const QuizPage = async ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  const data = await getQuizzes(params.coursename, params.chaptername).catch(
    (err) => {
      console.log(err);
      return null;
    }
  );

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
        <p className="text-gray-600 mb-6">
          This chapter may not exist or has no quiz content yet
        </p>
        <Button variant="destructive" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-[840px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
      <QuizHeader quiz={data.data} />
      <QuizListForm quiz={data.data} />
    </div>
  );
};

export default QuizPage;
