import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import Providers from "../providers";
import { headers } from "next/headers";
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
  const cookies = headers().get("cookie");
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`${inter.variable} ${roboto.variable} ${roboto_mono.variable} antialiased min-h-screen w-full`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <Providers cookies={cookies}>
            {children}
            <Toaster richColors />
          </Providers>
        </DictionaryProvider>
      </body>
    </html>
  );
}
