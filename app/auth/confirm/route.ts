import { getServerAuth } from "@/lib/server/supabase/auth";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  // Check for both token_hash and type
  if (token_hash && type) {
    const supabase = await getServerAuth();

    // Use verifyOtp instead of exchangeCodeForSession
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // Redirect the user to an error page if verification fails
  redirect("/auth/auth-code-error");
}