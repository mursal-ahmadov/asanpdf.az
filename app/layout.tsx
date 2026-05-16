import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import MobileNav from "./components/MobileNav";
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
  title: "AsanPDF.az — PDF alətləri pulsuz və onlayn",
  description:
    "PDF birləşdir, ayır, səhifə sil, şəkildən PDF yarat. Hər şey brauzerdə işləyir — faylların heç yerə yüklənmir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="AsanPDF.az ana səhifə">
              <Image
                src="/logo.png"
                alt="AsanPDF.az"
                width={320}
                height={100}
                priority
                className="h-14 sm:h-16 w-auto"
              />
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <Link href="/birlesdir" className="nav-link">Birləşdir</Link>
              <Link href="/ayir" className="nav-link">Ayır</Link>
              <Link href="/sehife-sil" className="nav-link">Səhifə sil</Link>
              <Link href="/cixar" className="nav-link">Çıxar</Link>
              <Link href="/donder" className="nav-link">Döndər</Link>
              <Link href="/sekil-to-pdf" className="nav-link">Şəkil → PDF</Link>
              <Link href="/pdf-to-sekil" className="nav-link">PDF → Şəkil</Link>
              <Link href="/haqqimizda" className="nav-link nav-link-outline ml-2">Haqqımızda</Link>
            </nav>
            <MobileNav />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <span className="text-center sm:text-left">
              © {new Date().getFullYear()} AsanPDF.az — Pulsuz və sürətli PDF alətləri
            </span>
            <Link
              href="/haqqimizda"
              className="px-3 py-1.5 rounded-lg border border-border hover:border-accent hover:text-accent transition"
            >
              Haqqımızda
            </Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
