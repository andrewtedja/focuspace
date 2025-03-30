import "~/styles/globals.css";

import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";

import MobileWarning from "./_components/MobileWarning";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "focuspace",
  description: "an amazing app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <MobileWarning />
        <TRPCReactProvider>
          <SessionProvider> {children}</SessionProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
