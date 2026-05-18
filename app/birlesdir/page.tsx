import type { Metadata } from "next";
import MergeClient from "./MergeClient";

export const metadata: Metadata = {
  title: "PDF Birləşdir — Bir neçə PDF-i birinə birləşdir | AsanPDF.com",
  description:
    "PDF faylları onlayn pulsuz birləşdir. Sıralanı tut, brauzerdə işləyir, fayllar serverə yüklənmir. Qeydiyyat yoxdur, limit yoxdur.",
  keywords: ["pdf birləşdir", "pdf birleşdir", "pdf merge", "pdf birləşdirmə", "pulsuz pdf birləşdir"],
  alternates: { canonical: "/birlesdir" },
  openGraph: {
    title: "PDF Birləşdir — AsanPDF.com",
    description: "Bir neçə PDF faylını bir sənədə birləşdir. Pulsuz, sürətli, brauzerdə işləyir.",
    type: "website",
  },
};

export default function Page() {
  return <MergeClient />;
}
