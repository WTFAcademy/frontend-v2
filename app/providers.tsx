"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import AppKitProvider from "@/features/wallet/components/appkit-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppKitProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AppKitProvider>
  );
};

export default Providers;
