import type { Metadata } from "next";
import MergeClient from "./MergeClient";
import HowToJsonLd from "../components/HowToJsonLd";

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
  return (
    <>
      <HowToJsonLd
        name="PDF-ləri necə birləşdirmək olar?"
        description="Bir neçə PDF faylını sıra ilə bir sənədə birləşdirmək üçün addım-addım təlimat."
        url="/birlesdir"
        steps={[
          { name: "PDF faylları seç", text: "Birləşdirmək istədiyin PDF faylları sürüşdür və ya kompüterdən seç." },
          { name: "Sıranı tənzimlə", text: "Yuxarı/aşağı düymələri ilə faylların ardıcıllığını dəyiş." },
          { name: "Birləşdir və yüklə", text: "\"Birləşdir və yüklə\" düyməsinə bas — yeni PDF avtomatik enəcək." },
        ]}
      />
      <MergeClient />
    </>
  );
}
