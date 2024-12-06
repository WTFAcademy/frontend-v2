import Link from "next/link";

const QuizHeader = () => {
  return (
    <div className="flex items-center gap-[6px] mb-6">
      <Link href="/quiz/1" className="text-base">
        Solidity 101
      </Link>
      <span>/</span>
      <Link href="/quiz/1/2" className="text-base">
        2. Value Type
      </Link>
      <span>/</span>
      <span className="text-base text-wtf-content-4 pointer-events-none">
        Quiz
      </span>
    </div>
  );
};

export default QuizHeader;
