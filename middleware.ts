import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow access to auth routes and public pages
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/tracker")
  ) {
    return NextResponse.next();
  }

  // Get token for protected routes
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/session",
    "/sessions",
    "/settings",
    "/setup",
    "/projects",
  ];

  const protectedApiRoutes = [
    "/api/sessions",
    "/api/tags",
    "/api/stats",
    "/api/projects",
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Protect API routes
  if (isProtectedApiRoute) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect page routes
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/session/:path*",
    "/sessions/:path*",
    "/settings/:path*",
    "/setup/:path*",
    "/projects/:path*",
    "/api/sessions/:path*",
    "/api/tags/:path*",
    "/api/stats/:path*",
    "/api/projects/:path*",
    "/api/auth/:path*",
    "/login",
    "/signup",
  ],
};

