import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  await supabase.auth.getClaims();
  const supabaseUser = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const exactProtectedRoutes = ["/profile", "/update-password"];

  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    exactProtectedRoutes.includes(pathname);

  // if user is not authenticated and tries to access a protected route, redirect to login page
  if (!supabaseUser.data?.user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // if user is authenticated and tries to access the login page, redirect to admin page
  if (supabaseUser.data?.user && request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return supabaseResponse;
}
