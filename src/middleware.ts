import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AGE_GATE_COOKIE = "tv-age-gate";
const AGE_RESTRICTED_PATH = "/age-restricted";

const isAllowedWhenRejected = (pathname: string) => {
  return (
    pathname === AGE_RESTRICTED_PATH ||
    pathname.startsWith("/api/age-gate") ||
    pathname.startsWith("/api/auth")
  );
};

export async function middleware(request: NextRequest) {
  const ageGateStatus = request.cookies.get(AGE_GATE_COOKIE)?.value;

  if (
    ageGateStatus === "rejected" &&
    !isAllowedWhenRejected(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL(AGE_RESTRICTED_PATH, request.url));
  }

  // update user's auth session
  return await updateSession(request);
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
