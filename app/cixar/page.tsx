import type { Metadata } from "next";
import ExtractClient from "./ExtractClient";

export const metadata: Metadata = {
  title: "PDF-dən Səhifə Çıxar — Seçilmiş səhifələri ayrı yüklə | AsanPDF.com",
  description:
    "PDF-dən seçdiyin səhifələri ayrı sənəd kimi yüklə. Bir PDF və ya hər səhifə ayrı fayl seçimi. Pulsuz və brauzerdə işləyir.",
  keywords: ["pdf səhifə çıxar", "pdf-dən səhifə götür", "pdf extract pages", "pdf səhifə ayır"],
  alternates: { canonical: "/cixar" },
  openGraph: {
    title: "PDF Səhifə Çıxar — AsanPDF.com",
    description: "PDF-dən istədiyin səhifələri ayrı yüklə. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return <ExtractClient />;
}
