import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import Providers from "../providers";
import { headers } from "next/headers";
import { walletStoreCookie, walletStoreJSON } from "@/features/auth/wallet-cookie";
import { Toaster } from "@/components/ui/sonner";
import { getDictionary } from "./dictionaries";
import DictionaryProvider from "@/features/lang";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "WTF Academy",
  description: "WTF Academy",
};

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const walletPair = headers().get("cookie")?.split(/;\s*/).find(pair=>pair.startsWith(walletStoreCookie+"="));
  const walletStore = walletStoreJSON(walletPair?.slice(walletStoreCookie.length+1));
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`${inter.variable} ${roboto.variable} ${roboto_mono.variable} antialiased min-h-screen w-full`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <Providers walletStore={walletStore}>
            {children}
            <Toaster richColors />
          </Providers>
        </DictionaryProvider>
      </body>
    </html>
  );
}
