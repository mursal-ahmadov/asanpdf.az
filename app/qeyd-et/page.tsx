import type { Metadata } from "next";
import AnnotateClient from "./AnnotateClient";

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
  return <AnnotateClient />;
}
