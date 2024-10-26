"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import AuthProvider from "@/features/auth/contexts/auth-context";
import WagmiProvider from "@/features/wallet/contexts/wagmi-context";

const Providers = ({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider cookies={cookies}>
        <AuthProvider>{children}</AuthProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};

export default Providers;
