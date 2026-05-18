import type { Metadata } from "next";
import PdfToImageClient from "./PdfToImageClient";

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
  return <PdfToImageClient />;
}
