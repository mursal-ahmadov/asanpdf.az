import type { Metadata } from "next";
import DeleteClient from "./DeleteClient";

export const metadata: Metadata = {
  title: "PDF-dən Səhifə Sil — Lazımsız səhifələri çıxar | AsanPDF.com",
  description:
    "PDF-dən istəmədiyin səhifələri sil və təmiz yeni sənəd yarat. Vizual səhifə seçimi, brauzerdə işləyir, pulsuz.",
  keywords: ["pdf səhifə sil", "pdf-dən səhifə çıxar", "pdf delete pages", "pdf təmizlə"],
  alternates: { canonical: "/sehife-sil" },
  openGraph: {
    title: "PDF Səhifə Sil — AsanPDF.com",
    description: "PDF-dən istəmədiyin səhifələri sil. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return <DeleteClient />;
}
