"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/birlesdir", label: "Birləşdir" },
  { href: "/ayir", label: "Ayır" },
  { href: "/sehife-sil", label: "Səhifə sil" },
  { href: "/cixar", label: "Çıxar" },
  { href: "/donder", label: "Döndər" },
  { href: "/sekil-to-pdf", label: "Şəkil → PDF" },
  { href: "/pdf-to-sekil", label: "PDF → Şəkil" },
  { href: "/sixisdir", label: "PDF Sıxışdır" },
  { href: "/haqqimizda", label: "Haqqımızda" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-gray-100 active:bg-gray-200 cursor-pointer touch-manipulation"
        aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: "none" }}
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed left-0 right-0 bottom-0 bg-black/40 z-40"
            style={{ top: "80px" }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Menu panel — drops down from header */}
          <nav
            className="lg:hidden fixed left-0 right-0 bg-white border-b border-border shadow-lg z-50"
            style={{ top: "80px" }}
          >
            <div className="flex flex-col p-3 gap-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition active:bg-gray-100
                    ${pathname === l.href ? "bg-blue-50 text-accent" : "hover:bg-gray-50 text-foreground"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
