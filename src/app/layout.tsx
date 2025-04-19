import "~/styles/globals.css";

import { Lexend } from "next/font/google";
import { Toaster } from "sonner";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import localFont from "next/font/local";

import MobileWarning from "./_components/MobileWarning";
import { FontProvider } from "~/lib/font-context";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "FocuSpace",
  description: "Your perfect learning environment",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const openDyslexic = localFont({
  src: "../fonts/OpenDyslexic-Regular.woff",
  variable: "--font-open-dyslexic",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lexend.variable} ${openDyslexic.variable}`}>
      <body className="Lexend">
        <FontProvider>
          <MobileWarning />
          <TRPCReactProvider>
            <SessionProvider> {children}</SessionProvider>
          </TRPCReactProvider>
          <Toaster />
        </FontProvider>
      </body>
    </html>
  );
}
