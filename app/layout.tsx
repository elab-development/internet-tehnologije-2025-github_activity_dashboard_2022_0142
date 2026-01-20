import Header from "@/components/Header";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-200 text-gray-100">
        <SessionProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 py-10">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
