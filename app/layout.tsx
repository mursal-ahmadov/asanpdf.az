import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import MobileNav from "./components/MobileNav";
import InstallPrompt from "./components/InstallPrompt";
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
  title: "AsanPDF.com — PDF alətləri pulsuz və onlayn",
  description:
    "PDF birləşdir, ayır, səhifə sil, şəkildən PDF yarat. Hər şey brauzerdə işləyir — faylların heç yerə yüklənmir.",
  applicationName: "AsanPDF",
  appleWebApp: {
    capable: true,
    title: "AsanPDF",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
            <Link href="/" className="flex items-center" aria-label="AsanPDF.com ana səhifə">
              <Image
                src="/logo.png"
                alt="AsanPDF.com"
                width={637}
                height={577}
                priority
                className="h-14 sm:h-16 w-auto"
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
              <Link href="/birlesdir"   className="px-3 py-1.5 rounded-lg border border-blue-200    text-blue-700    hover:bg-blue-50    hover:border-blue-400    transition">Birləşdir</Link>
              <Link href="/ayir"        className="px-3 py-1.5 rounded-lg border border-violet-200  text-violet-700  hover:bg-violet-50  hover:border-violet-400  transition">Ayır</Link>
              <Link href="/sehife-sil"  className="px-3 py-1.5 rounded-lg border border-rose-200    text-rose-700    hover:bg-rose-50    hover:border-rose-400    transition">Səhifə sil</Link>
              <Link href="/cixar"       className="px-3 py-1.5 rounded-lg border border-amber-200   text-amber-700   hover:bg-amber-50   hover:border-amber-400   transition">Çıxar</Link>
              <Link href="/donder"      className="px-3 py-1.5 rounded-lg border border-cyan-200    text-cyan-700    hover:bg-cyan-50    hover:border-cyan-400    transition">Döndər</Link>
              <Link href="/sekil-to-pdf" className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition">Şəkil → PDF</Link>
              <Link href="/pdf-to-sekil" className="px-3 py-1.5 rounded-lg border border-pink-200   text-pink-700    hover:bg-pink-50    hover:border-pink-400    transition">PDF → Şəkil</Link>
              <Link href="/sixisdir"    className="px-3 py-1.5 rounded-lg border border-indigo-200  text-indigo-700  hover:bg-indigo-50  hover:border-indigo-400  transition">Sıxışdır</Link>
              <Link href="/qeyd-et"     className="px-3 py-1.5 rounded-lg border border-yellow-300  text-yellow-700  hover:bg-yellow-50  hover:border-yellow-500  transition">Qeyd et</Link>
              <Link href="/haqqimizda"  className="px-3 py-1.5 rounded-lg border border-gray-300    text-gray-700    hover:bg-gray-50    hover:border-gray-500    transition ml-1">Haqqımızda</Link>
            </nav>
            <MobileNav />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <span className="text-center sm:text-left">
              © {new Date().getFullYear()} AsanPDF.com — Pulsuz və sürətli PDF alətləri
            </span>
            <Link
              href="/haqqimizda"
              className="px-3 py-1.5 rounded-lg border border-border hover:border-accent hover:text-accent transition"
            >
              Haqqımızda
            </Link>
          </div>
        </footer>
        <InstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
