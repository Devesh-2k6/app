import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { HydrationZapper } from "@/components/HydrationZapper";
import { AuthenticationProvider } from "@/contexts/AuthenticationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpiryGo | Grab it before it's gone.",
  description: "Near-expiry products from local shops at up to 70% off. Save money, fight food waste, shop smarter.",
  keywords: ["deals", "local shops", "food waste", "discounts", "near-expiry"],
  openGraph: {
    title: "ExpiryGo | Grab it before it's gone.",
    description: "Near-expiry products from local shops at up to 70% off.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#F4FBF7] text-slate-900`} suppressHydrationWarning>
        <HydrationZapper />
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </body>
    </html>
  );
}
