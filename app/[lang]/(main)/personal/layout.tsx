import type { ReactNode } from "react";
import SessionReady from "@/features/workspace/session-ready";
import "./workspace.css";

export const metadata = { robots: { index: false, follow: false } };

export default function PersonalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return <SessionReady lang={params.lang}>{children}</SessionReady>;
}
