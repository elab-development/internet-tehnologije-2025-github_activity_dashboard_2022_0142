import Header from "@/components/Header";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { VT323 } from "next/font/google";
import RetroScrollProvider from "@/components/ScrollbarProvider"; // Import your wrapper

const tiny5 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${tiny5.className} text-[1.3rem] h-screen text-gray-100 bg-blueprint overflow-hidden`}>
        <SessionProvider>
          {/* Use the wrapper here instead of SimpleBar directly */}
          <RetroScrollProvider>
            <Header />
            <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
              {children}
            </main>
          </RetroScrollProvider>
        </SessionProvider>
      </body>
    </html>
  );
}