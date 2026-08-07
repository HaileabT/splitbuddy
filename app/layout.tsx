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

export const metadata: Metadata = {
  title: "SplitBuddy",
  description: "Track and split transactions effortlessly",
};

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
      </body>
    </html>
  );
}
