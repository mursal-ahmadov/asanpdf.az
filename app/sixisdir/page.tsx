import type { Metadata } from "next";
import CompressClient from "./CompressClient";
import HowToJsonLd from "../components/HowToJsonLd";

export const metadata: Metadata = {
  title: "PDF Sıxışdır — Fayl ölçüsünü azalt onlayn | AsanPDF.com",
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
    title: "PDF Sıxışdır — AsanPDF.com",
    description: "PDF fayl ölçüsünü 50-90% azalt. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="PDF-i necə sıxışdırmaq olar?"
        description="PDF faylının ölçüsünü 50-90% azaltmaq üçün addım-addım təlimat."
        url="/sixisdir"
        totalTime="PT2M"
        steps={[
          { name: "PDF faylı seç", text: "Sıxışdırmaq istədiyin PDF faylı sürüşdür və ya seç." },
          { name: "Keyfiyyət səviyyəsi seç", text: "Yüksək, Tövsiyə olunan və ya Maksimum sıxma rejimini seç." },
          { name: "Sıxışdır və yüklə", text: "\"Sıxışdır və yüklə\" düyməsinə bas — ölçü qənaəti faiz ilə göstəriləcək." },
        ]}
      />
      <CompressClient />
    </>
  );
}
