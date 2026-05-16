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
  { href: "/haqqimizda", label: "Haqqımızda" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
        aria-label="Menyu"
      >
        <div className="w-5 h-0.5 bg-foreground mb-1"></div>
        <div className="w-5 h-0.5 bg-foreground mb-1"></div>
        <div className="w-5 h-0.5 bg-foreground"></div>
      </button>

      {open && (
        <div
          className="sm:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-3 rounded-lg text-base font-medium transition
                  ${pathname === l.href ? "bg-blue-50 text-accent" : "hover:bg-gray-50"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
