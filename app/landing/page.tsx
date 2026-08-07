import Link from "next/link";
import { LogIn, UserPlus, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="h-svh w-full flex items-center justify-center p-4 bg-background select-none">
      <div className="w-full max-w-lg rounded-4xl border border-border/20 bg-card p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center gap-6">

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-primary tracking-tight font-mono">
            splitbuddy
          </h1>
        </div>

        <p className="text-foreground/75 text-sm sm:text-base leading-relaxed font-sans max-w-md">
          Track shared expenses, manage loan books, and keep financial balances crystal clear between friends effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
          <Link
            href="/sign-in"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-background font-mono font-bold px-5 py-3 text-sm hover:opacity-90 transition-opacity"
          >
            <LogIn className="size-4" />
            <span>Login</span>
          </Link>

          <Link
            href="/sign-up"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border/30 font-mono font-semibold px-5 py-3 text-sm transition-colors"
          >
            <UserPlus className="size-4 text-primary" />
            <span>Sign Up</span>
          </Link>

          <a
            href="https://github.com/HaileabT/splitbuddy"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-card border border-border/40 hover:bg-muted text-foreground/80 hover:text-foreground font-mono font-medium px-4 py-3 text-sm transition-colors"
            title="GitHub Repository"
          >
            <svg
              className="size-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="sm:hidden font-sans">GitHub</span>
          </a>
        </div>

      </div>
    </main>
  );
}
