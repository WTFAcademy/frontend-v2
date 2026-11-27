"use client";
import { useEffect, useState, type ReactNode } from "react";

// The Academy session lives in the browser. Render the same shell during SSR
// and hydration before resolving account-specific navigation or queries.
export default function SessionReady({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? (
    <>{children}</>
  ) : (
    <div className="ws" aria-busy="true">
      <div className="ws-title">
        <h1>{lang === "en" ? "Personal workspace" : "个人中心"}</h1>
      </div>
    </div>
  );
}
