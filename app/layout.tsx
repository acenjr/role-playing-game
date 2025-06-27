import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eldoria: Shadow of the Dragonfall",
  description:
    "A story-driven RPG adventure in the world of Eldoria. Restore the dragons, gather companions, and shape the fate of the realm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] min-h-screen`}
      >
        <div className="w-full min-h-screen flex flex-col items-center justify-start">
          <header className="w-full py-6 bg-black/60 text-center text-3xl font-bold tracking-wide text-yellow-200 shadow-lg">
            Eldoria: Shadow of the Dragonfall
          </header>
          <main className="flex-1 w-full max-w-2xl px-2 md:px-0">
            {children}
          </main>
          <footer className="w-full py-4 text-center text-xs text-gray-400 bg-black/40 mt-8">
            &copy; {new Date().getFullYear()} Eldoria RPG. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
