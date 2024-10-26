import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import Providers from "./providers";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${roboto_mono.variable} antialiased min-h-screen w-full`}
      >
        <Providers cookies={cookies}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
