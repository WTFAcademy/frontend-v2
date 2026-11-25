import WalletProvider from "@/features/auth/contexts/wagmi-context";
import { ReactNode } from "react";

const CourseSbtLayout = ({ children }: { children: ReactNode }) => {
  return <WalletProvider>{children}</WalletProvider>;
};

export default CourseSbtLayout;
