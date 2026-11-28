"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import AuthProvider from "@/features/auth/contexts/auth-context";
import WagmiProvider from "@/features/auth/contexts/wagmi-context";
import { Provider as JotaiProvider } from "jotai";

const Providers = ({
  children,
  walletStore,
}: {
  children: React.ReactNode;
  walletStore: string | null;
}) => {
  return (
    <JotaiProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WagmiProvider walletStore={walletStore}>
          <AuthProvider>{children}</AuthProvider>
        </WagmiProvider>
      </ThemeProvider>
    </JotaiProvider>
  );
};

export default Providers;
