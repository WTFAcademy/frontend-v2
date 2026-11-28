import { quizGuide } from "@/features/quiz/authoring";
export function GET(_: Request, { params }: { params: { lang: string } }) {
  return new Response(quizGuide(params.lang === "en" ? "en" : "zh"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
