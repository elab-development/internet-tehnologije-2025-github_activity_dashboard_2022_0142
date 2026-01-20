"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return (
    // pr-0 uklanja desni padding tako da sadržaj ide do ivice
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
              // border-l i border-r (ili border-x) čine da dugme ima linije sa obe strane
              className="h-full px-6 bg-transparent text-black text-sm hover:bg-gray-100 border-l border-black transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          pathname !== "/login" && (
            <button
              onClick={() => signIn(undefined, { callbackUrl: fullPath })}
              // border-l osigurava separaciju od prethodnog elementa, a ivica ekrana je desno
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