import type { Metadata } from "next";
import AnnotateClient from "./AnnotateClient";
import HowToJsonLd from "../components/HowToJsonLd";

export const metadata: Metadata = {
  title: "PDF üzərində qeyd et — Marker, dairə, qələm | AsanPDF.com",
  description:
    "PDF üzərində markerlə vurğula, dairə içinə al, sərbəst xətt çək. 8 rəng seçimi, çoxsəhifəli dəstək, mobil və desktop üçün uyğun. Pulsuz, brauzerdə işləyir.",
  keywords: [
    "pdf marker",
    "pdf üzərində yaz",
    "pdf annotate",
    "pdf vurğula",
    "pdf qeyd",
    "pdf highlight",
    "pdf dairə",
    "pdf qələm",
  ],
  alternates: { canonical: "/qeyd-et" },
  openGraph: {
    title: "PDF üzərində qeyd et — AsanPDF.com",
    description: "Marker, dairə, qələm — PDF-də istədiyin yeri qeyd et. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="PDF üzərində necə qeyd etmək olar?"
        description="PDF-də marker ilə vurğulamaq, dairə içinə almaq və xətt çəkmək üçün təlimat."
        url="/qeyd-et"
        steps={[
          { name: "PDF faylı seç", text: "Üzərində qeyd etmək istədiyin PDF faylı sürüşdür və ya seç." },
          { name: "Alət seç", text: "Marker, Dairə və ya Qələm alətini seç." },
          { name: "Rəng və qalınlıq seç", text: "Sağdakı düymələrdən rəng və qalınlıq seçimini et." },
          { name: "PDF üstündə çək", text: "Mouse və ya barmaqla PDF üstündə istədiyin yeri qeyd et." },
          { name: "Tətbiq et və yüklə", text: "\"Tətbiq et və yüklə\" düyməsinə bas — qeydlərlə birlikdə PDF avtomatik enəcək." },
        ]}
      />
      <AnnotateClient />
    </>
  );
}
