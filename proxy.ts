import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const isLoggedIn = !!user;
  const role = user?.role;

  const isPublicPage = ["/", "/login", "/register"].includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage = pathname.startsWith("/user");

  if (isPublicPage) {
    return NextResponse.next();
  }

  if (isAdminPage) {
    if (isLoggedIn && role === "ADMIN") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isUserPage) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};