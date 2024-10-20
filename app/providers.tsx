"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import AntProvider from '@/features/wallet/components/ant-provider'
import AuthProvider from '@/features/auth/contexts/auth-context'
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AntProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </AntProvider>
  );
};

export default Providers;
