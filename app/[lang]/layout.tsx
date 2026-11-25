import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import Providers from "../providers";
import { Toaster } from "@/components/ui/sonner";
import { getDictionary } from "./dictionaries";
import DictionaryProvider from "@/features/lang";
import { SITE_URL, localeAlternates } from "@/lib/site";

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

const SITE_DESCRIPTIONS: Record<string, string> = {
  en: "WTF Academy is an open-source Web3 developer education platform: learn Solidity, Ethers.js, zero-knowledge proofs and more, then earn on-chain certificates.",
  zh: "WTF Academy 是开源的 Web3 开发者教育平台：学习 Solidity、Ethers.js、零知识证明等课程，并获得链上证书。",
};

export async function generateMetadata({
  params: routeParams,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await routeParams;
  const description = SITE_DESCRIPTIONS[lang] ?? SITE_DESCRIPTIONS.en;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "WTF Academy",
      template: "%s | WTF Academy",
    },
    description,
    alternates: {
      canonical: `/${lang}`,
      ...localeAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: "WTF Academy",
      locale: lang === "zh" ? "zh_CN" : "en_US",
      url: `/${lang}`,
      title: "WTF Academy",
      description,
      images: ["/images/banner.jpeg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "WTF Academy",
      description,
      images: ["/images/banner.jpeg"],
    },
  };
}

export default async function RootLayout({
  children,
  params: routeParams,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await routeParams;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`${inter.variable} ${roboto.variable} ${roboto_mono.variable} antialiased min-h-screen w-full`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <Providers>
            {children}
            <Toaster richColors />
          </Providers>
        </DictionaryProvider>
      </body>
    </html>
  );
}
