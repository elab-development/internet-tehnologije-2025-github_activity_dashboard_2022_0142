'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function login(formData: FormData) {
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 border-2">
      <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

      <form action={login} className="flex flex-col gap-4">
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <input
          data-testid="login-email"
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full px-3 py-2 border-2 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
        />

        <input
          data-testid="login-password"
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full px-3 py-2 border-2 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
        />

        <button
          data-testid="login-submit"
          type="submit"
          className="w-full py-2 mt-2 bg-gray-800 text-white border-2 border-transparent hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link
          href="/register"
          className="text-lg font-semibold text-gray-900 hover:underline transition-all"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <LoginForm />
    </Suspense>
  );
}