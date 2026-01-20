import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  const isPublicPage = pathname === "/login" || pathname === "/register";
  const isApiRoute = pathname.startsWith("/api");

  const isActivityPage = pathname.split("/").length > 1 && pathname !== "/";

/*
  if (!isApiRoute && isActivityPage && !isPublicPage) {
    if (!isLoggedIn || role === "guest") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
*/
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};