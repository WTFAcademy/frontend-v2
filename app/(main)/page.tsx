import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/docs/1/1">文档1-1</Link>
      <Link href="/docs/2/2">文档2-2</Link>

      <Link href="/login">登录</Link>

      <Link href="/courses">课程列表</Link>
      <Link href="/courses/1">课程1</Link>
      <Link href="/courses/2">课程2</Link>
    </div>
  );
}
