import type { Metadata } from "next";
import { Roboto_Mono, Google_Sans, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/context/auth/auth-provider";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  fallback: ["sans-serif"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://splitbuddy.haileabtesfaye.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  title: {
    default: "SplitBuddy - Track Shared Expenses & Loan Books",
    template: "%s | SplitBuddy",
  },
  description: "Track shared expenses, manage loan books, and keep financial balances crystal clear between friends effortlessly.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/favicon_io/site.webmanifest",
      },
    ],
  },
  openGraph: {
    title: "SplitBuddy - Track Shared Expenses & Loan Books",
    description: "Track shared expenses, manage loan books, and keep financial balances crystal clear between friends effortlessly.",
    url: siteUrl,
    siteName: "SplitBuddy",
    images: [
      {
        url: "/link-preview.png",
        width: 1200,
        height: 630,
        alt: "SplitBuddy Link Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SplitBuddy - Track Shared Expenses & Loan Books",
    description: "Track shared expenses, manage loan books, and keep financial balances crystal clear between friends effortlessly.",
    images: ["/link-preview.png"],
  },
};

import { PwaInstaller } from "@/components/pwa-installer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        " h-full",
        "antialiased",
        googleSans.variable,
        robotoMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <head></head>
      <body
        className={
          "h-svh relative flex flex-col overflow-hidden " + googleSans.className
        }
      >
        <ThemeProvider>
          <QueryProvider>
            <Suspense fallback={<div className="w-full h-full grid place-items-center bg-background!"><Loader2 className="animate-spin" /></div>}>
              <AuthProvider>
                <div className="h-full max-w-2xl w-[calc(100%-1rem)] mx-auto flex flex-col">
                  <div className="h-full w-full">{children}</div>
                </div>
              </AuthProvider>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
        <PwaInstaller />
      </body>
    </html>
  );
}
