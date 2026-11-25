"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import AuthProvider from "@/features/auth/contexts/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider as JotaiProvider } from "jotai";

const Providers = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
  return (
    <JotaiProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={client}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </JotaiProvider>
  );
};

export default Providers;
