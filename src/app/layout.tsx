import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "focuspace",
  description: "an amazing app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
