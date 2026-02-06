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
    <header className="fixed top-0 right-0 z-50 p-6 bg-transparent">
      {/* Changed flex-row (implicit) to flex-col and added items-end */}
      <div className="flex flex-col-reverse items-end gap-3">
        {pathname !== "/" && (
          <Link
            href="/"
            className="h-10 px-6 flex items-center bg-transparent text-black text-sm hover:bg-gray-100 border border-black transition-colors"
          >
            Home
          </Link>
        )}

        {session ? (
          <>
            {isAdmin && pathname !== "/admin" && (
              <Link
                href="/admin"
                className="h-10 px-6 bg-transparent flex items-center text-black text-sm hover:bg-gray-100 border border-black transition-colors"
              >
                Admin
              </Link>
            )}

            {pathname !== "/user" && (
              <Link
                href="/user"
                className="h-10 px-6 flex items-center bg-transparent text-black text-sm hover:bg-gray-100 border border-black transition-colors"
              >
                My Bookmarks
              </Link>
            )}
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="h-10 px-6 bg-transparent text-black text-sm hover:bg-gray-100 border border-black transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          pathname !== "/login" && (
            <button
              onClick={() => signIn(undefined, { callbackUrl: fullPath })}
              className="h-10 px-6 bg-transparent text-black text-sm hover:bg-gray-100 border border-black transition-colors"
            >
              Log in
            </button>
          )
        )}
      </div>
    </header>
  );
}