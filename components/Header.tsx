'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return (
    <button
      data-testid="login-btn"
      onClick={() => signIn(undefined, { callbackUrl: fullPath })}
      className="h-12 px-8 w-full md:w-auto flex items-center justify-center bg-gray-100 text-black text-xl font-medium hover:bg-white border-2 border-black transition-colors"
    >
      Log in
    </button>
  );
}

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 right-0 z-50 md:p-6">
      <div className="flex flex-col items-end">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            md:hidden h-12 w-16 px-2 bg-gray-100 border-2 border-black text-black font-bold text-2xl hover:bg-white 
            ${isOpen ? 'mt-4 mr-4' : '-translate-y-1/2 mt-0 mr-4'}
          `}
        >
          {isOpen ? '✕' : '...'}
        </button>

        <div className={`
          flex-col items-end gap-3 mt-3 px-4 md:px-0
          ${isOpen ? 'flex' : 'hidden'} 
          md:flex md:flex-col-reverse md:mt-0
        `}>
          {pathname !== '/' && (
            <Link
              href="/"
              className="h-12 px-8 w-full md:w-auto flex items-center justify-center bg-gray-100 text-black text-xl font-medium hover:bg-white border-2 border-black transition-colors"
            >
              Home
            </Link>
          )}

          {session ? (
            <>
              {isAdmin && pathname !== '/admin' && (
                <Link
                  href="/admin"
                  className="h-12 px-8 w-full md:w-auto bg-gray-100 flex items-center justify-center text-black text-xl font-medium hover:bg-white border-2 border-black transition-colors"
                >
                  Admin
                </Link>
              )}

              {pathname !== '/user' && (
                <Link
                  href="/user"
                  className="h-12 px-8 w-full md:w-auto flex items-center justify-center bg-gray-100 text-black text-xl font-medium hover:bg-white border-2 border-black transition-colors"
                >
                  My Bookmarks
                </Link>
              )}

              <button
                data-testid="logout-btn"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="h-12 px-8 w-full md:w-auto flex items-center justify-center bg-gray-100 text-black text-xl font-medium hover:bg-white border-2 border-black transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            pathname !== '/login' && (
              <Suspense fallback={<div className="h-12 px-8" />}>
                <LoginButton />
              </Suspense>
            )
          )}
        </div>
      </div>
    </header>
  );
}