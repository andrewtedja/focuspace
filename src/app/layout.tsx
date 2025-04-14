import "~/styles/globals.css";

import { Lexend } from "next/font/google";
import { Toaster } from "sonner";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
// import localFont from "next/font/local";

import MobileWarning from "./_components/MobileWarning";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "focuspace",
  description: "an amazing app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// const openDyslexic = localFont({
//   src: "../fonts/OpenDyslexic-Regular.woff",
// });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lexend.className}`}>
      <body className="Lexend">
        <MobileWarning />
        <TRPCReactProvider>
          <SessionProvider> {children}</SessionProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
