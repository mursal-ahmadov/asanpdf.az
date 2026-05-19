import type { Metadata } from "next";
import RotateClient from "./RotateClient";
import HowToJsonLd from "../components/HowToJsonLd";

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
  return (
    <>
      <HowToJsonLd
        name="PDF səhifəsini necə döndərmək olar?"
        description="PDF səhifələrini 90°, 180° və ya 270° döndərmək üçün təlimat."
        url="/donder"
        steps={[
          { name: "PDF faylı seç", text: "Səhifələrini döndərmək istədiyin PDF faylı sürüşdür və ya seç." },
          { name: "Səhifəni döndər", text: "Hər səhifəyə bas — hər kliklə 90° döndərir. Və ya \"Hamısını döndər\" düyməsindən istifadə et." },
          { name: "Tətbiq et və yüklə", text: "\"Tətbiq et və yüklə\" düyməsinə bas — döndərilmiş PDF avtomatik enəcək." },
        ]}
      />
      <RotateClient />
    </>
  );
}
