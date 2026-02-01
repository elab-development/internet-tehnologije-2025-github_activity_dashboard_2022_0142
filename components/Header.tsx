"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="w-full h-10 flex items-center pl-6 pr-0 border-b border-black">
      
      <div className="ml-auto flex items-center gap-0 h-full">
        {pathname !== "/" && (
          <Link
            href="/"
            className="h-full px-6 flex items-center bg-transparent text-black text-sm hover:bg-gray-100 border-l border-black transition-colors"
          >
            Home
          </Link>
        )}

        {session ? (
          <>
            {isAdmin && pathname !== "/admin" && (
              <Link
                href="/admin"
                className="h-full px-6 flex items-center bg-red-50 text-black text-sm hover:bg-red-100 border-l border-black transition-colors font-medium"
              >
                Admin Dashboard
              </Link>
            )}

            {pathname !== "/user" && (
              <Link
                href="/user"
                className="h-full px-6 flex items-center bg-transparent text-black text-sm hover:bg-gray-100 border-l border-black transition-colors"
              >
                My Bookmarks
              </Link>
            )}
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="h-full px-6 bg-transparent text-black text-sm hover:bg-gray-100 border-l border-black transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          pathname !== "/login" && (
            <button
              onClick={() => signIn(undefined, { callbackUrl: fullPath })}
              className="h-full px-6 bg-transparent text-black text-sm hover:bg-gray-100 border-l border-black transition-colors"
            >
              Log in
            </button>
          )
        )}
      </div>
    </header>
  );
}