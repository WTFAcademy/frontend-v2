import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from 'next/font/google'
import "@/styles/globals.css";
import Providers from "./providers";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto'
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-roboto-mono'
})

export const metadata: Metadata = {
  title: "WTF Academy",
  description: "WTF Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${roboto_mono.variable} antialiased min-h-screen w-full`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
