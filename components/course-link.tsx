"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

export default function CourseLink({
  href, ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { lang } = useParams<{ lang: string }>();
  return <Link href={`/${lang}${href}`} {...props} />;
}
