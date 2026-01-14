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
    <header className="w-full flex items-center px-6 py-4 border-b">
      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <>
            <Link
              href="/user"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              My Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: fullPath })}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn(undefined, { callbackUrl: fullPath })}
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}