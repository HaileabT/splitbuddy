import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/server/supabase/proxy";

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);

  headers.set('x-pathname', request.nextUrl.pathname);


  const res = await updateSession(request);

  res.headers.set('x-pathname', request.nextUrl.pathname);

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
