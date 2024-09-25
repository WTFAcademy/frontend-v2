"use client";

import AppKitProvider from "@/features/wallet/components/appkit-provider";

const Providers = ({children}: {children: React.ReactNode}) => {
  return <AppKitProvider>{children}</AppKitProvider>;
};

export default Providers;