import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { HydrationZapper } from "@/components/HydrationZapper";
import { AuthenticationProvider } from "@/contexts/AuthenticationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshSave - Near-Expiry Local Grocery Deals",
  description: "Find discounted near-expiry groceries in your local neighborhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`} suppressHydrationWarning>
        <HydrationZapper />
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </body>
    </html>
  );
}
