import type { Metadata } from "next";
import RotateClient from "./RotateClient";

export const metadata: Metadata = {
  title: "PDF Səhifə Döndər — 90°, 180° fırlat | AsanPDF.com",
  description:
    "PDF səhifələrini 90°, 180° və ya 270° döndər. Hər səhifəni ayrı və ya hamısını birdən. Pulsuz, brauzerdə işləyir.",
  keywords: ["pdf döndər", "pdf rotate", "pdf səhifə fırlat", "pdf düzəlt"],
  alternates: { canonical: "/donder" },
  openGraph: {
    title: "PDF Səhifə Döndər — AsanPDF.com",
    description: "PDF səhifələrini istədiyin istiqamətə döndər. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return <RotateClient />;
}
