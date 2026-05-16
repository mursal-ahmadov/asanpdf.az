import type { Metadata } from "next";
import CompressClient from "./CompressClient";

export const metadata: Metadata = {
  title: "PDF Sıxışdır — Fayl ölçüsünü azalt onlayn | AsanPDF.az",
  description:
    "PDF faylının ölçüsünü 50-90% azalt. Email-lə göndərmək üçün rahat. Pulsuz, brauzerdə işləyir, fayl heç yerə yüklənmir.",
  keywords: [
    "pdf sıxışdır",
    "pdf sıx",
    "pdf kiçilt",
    "pdf compress",
    "pdf ölçü azalt",
    "pdf reduce size",
  ],
  alternates: { canonical: "/sixisdir" },
  openGraph: {
    title: "PDF Sıxışdır — AsanPDF.az",
    description: "PDF fayl ölçüsünü 50-90% azalt. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return <CompressClient />;
}
