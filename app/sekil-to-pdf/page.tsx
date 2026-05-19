import type { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";
import HowToJsonLd from "../components/HowToJsonLd";

export const metadata: Metadata = {
  title: "Şəkildən PDF Yarat — JPG və PNG-dən PDF | AsanPDF.com",
  description:
    "JPG və PNG şəkillərdən bir PDF sənədi yarat. Bir neçə şəkil sıra ilə A4 səhifələrinə düzülür. Pulsuz, brauzerdə işləyir.",
  keywords: ["şəkildən pdf", "jpg to pdf", "png to pdf", "şəkil pdf çevir", "jpeg pdf"],
  alternates: { canonical: "/sekil-to-pdf" },
  openGraph: {
    title: "Şəkildən PDF Yarat — AsanPDF.com",
    description: "JPG/PNG şəkillərdən pulsuz PDF sənəd hazırla.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="Şəkillərdən necə PDF yaratmaq olar?"
        description="JPG və PNG şəkillərdən bir PDF sənədi yaratmaq üçün təlimat."
        url="/sekil-to-pdf"
        steps={[
          { name: "Şəkilləri seç", text: "JPG və ya PNG şəkilləri sürüşdür və ya seç (çoxlu fayl olar)." },
          { name: "Sıranı dəyiş", text: "Yuxarı/aşağı düymələri ilə şəkillərin sırasını tənzimlə." },
          { name: "PDF yarat və yüklə", text: "\"PDF yarat və yüklə\" düyməsinə bas — hər şəkil A4 səhifəsi kimi PDF-ə düzüləcək." },
        ]}
      />
      <ImageToPdfClient />
    </>
  );
}
