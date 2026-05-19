import type { Metadata } from "next";
import PdfToImageClient from "./PdfToImageClient";
import HowToJsonLd from "../components/HowToJsonLd";

export const metadata: Metadata = {
  title: "PDF-dən Şəkil — PDF səhifələrini JPG-yə çevir | AsanPDF.com",
  description:
    "PDF-in hər səhifəsini yüksək keyfiyyətli JPG şəklə çevir. Hər səhifə üçün ayrı fayl. Pulsuz, brauzerdə işləyir.",
  keywords: ["pdf to jpg", "pdf to image", "pdf şəkil çevir", "pdf-dən şəkil", "pdf to png"],
  alternates: { canonical: "/pdf-to-sekil" },
  openGraph: {
    title: "PDF-dən Şəkil — AsanPDF.com",
    description: "PDF səhifələrini JPG şəkillərə çevir. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="PDF-i necə şəkillərə çevirmək olar?"
        description="PDF-in hər səhifəsini ayrı JPG şəklə çevirmək üçün təlimat."
        url="/pdf-to-sekil"
        steps={[
          { name: "PDF faylı seç", text: "Şəkillərə çevirmək istədiyin PDF faylı sürüşdür və ya seç." },
          { name: "Şəkillərə çevir və yüklə", text: "\"Şəkillərə çevir və yüklə\" düyməsinə bas — hər səhifə ayrı JPG kimi avtomatik enəcək." },
        ]}
      />
      <PdfToImageClient />
    </>
  );
}
