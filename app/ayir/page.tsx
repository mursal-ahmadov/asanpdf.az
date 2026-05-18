import type { Metadata } from "next";
import SplitClient from "./SplitClient";

export const metadata: Metadata = {
  title: "PDF Ayır — PDF-i səhifələrə böl onlayn | AsanPDF.com",
  description:
    "PDF sənədini səhifələrə böl və ya istədiyin aralıqları çıxar. Pulsuz, brauzerdə işləyir, fayl heç yerə yüklənmir.",
  keywords: ["pdf ayır", "pdf böl", "pdf split", "pdf səhifə ayır", "pdf parçalamaq"],
  alternates: { canonical: "/ayir" },
  openGraph: {
    title: "PDF Ayır — AsanPDF.com",
    description: "PDF-i ayrı-ayrı səhifələrə böl. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return <SplitClient />;
}
