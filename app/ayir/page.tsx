import type { Metadata } from "next";
import SplitClient from "./SplitClient";
import HowToJsonLd from "../components/HowToJsonLd";

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
  return (
    <>
      <HowToJsonLd
        name="PDF-i necə ayırmaq olar?"
        description="PDF sənədini səhifələrə bölmək və ya konkret aralıqları çıxarmaq üçün təlimat."
        url="/ayir"
        steps={[
          { name: "PDF faylı seç", text: "Bölmək istədiyin PDF faylı sürüşdür və ya seç." },
          { name: "Rejimi seç", text: "\"Hər səhifəni ayrı PDF kimi\" və ya \"Aralıqlar seç\" rejimini seç." },
          { name: "Aralıq yaz (lazım gəlsə)", text: "Aralıq nümunəsi: 1-3, 5, 7-9 — vergüllə ayır." },
          { name: "Ayır və yüklə", text: "\"Ayır və yüklə\" düyməsinə bas." },
        ]}
      />
      <SplitClient />
    </>
  );
}
