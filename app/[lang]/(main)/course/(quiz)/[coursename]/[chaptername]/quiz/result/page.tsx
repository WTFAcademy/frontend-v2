import { redirect } from "next/navigation";

export default function PreviousResultLink({
  params,
}: {
  params: { lang: string; coursename: string; chaptername: string };
}) {
  redirect(
    `/${params.lang}/course/${params.coursename}/${params.chaptername}/quiz`
  );
}
