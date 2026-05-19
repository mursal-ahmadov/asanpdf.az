import type { Metadata } from "next";
import ExtractClient from "./ExtractClient";
import HowToJsonLd from "../components/HowToJsonLd";

export const metadata: Metadata = {
  title: "PDF-dən Səhifə Çıxar — Seçilmiş səhifələri ayrı yüklə | AsanPDF.com",
  description:
    "PDF-dən seçdiyin səhifələri ayrı sənəd kimi yüklə. Bir PDF və ya hər səhifə ayrı fayl seçimi. Pulsuz və brauzerdə işləyir.",
  keywords: ["pdf səhifə çıxar", "pdf-dən səhifə götür", "pdf extract pages", "pdf səhifə ayır"],
  alternates: { canonical: "/cixar" },
  openGraph: {
    title: "PDF Səhifə Çıxar — AsanPDF.com",
    description: "PDF-dən istədiyin səhifələri ayrı yüklə. Pulsuz və sürətli.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="PDF-dən səhifə necə çıxarmaq olar?"
        description="PDF-dən istədiyin səhifələri seçib ayrı sənəd kimi yükləmək üçün təlimat."
        url="/cixar"
        steps={[
          { name: "PDF faylı seç", text: "Səhifələrini çıxarmaq istədiyin PDF faylı sürüşdür və ya seç." },
          { name: "Səhifələri seç", text: "Çıxarmaq istədiyin səhifələrin nömrələrinə bas." },
          { name: "Format seç", text: "\"Bir PDF kimi\" və ya \"Hər səhifə ayrı PDF\" rejimini seç." },
          { name: "Çıxar və yüklə", text: "\"Çıxar və yüklə\" düyməsinə bas." },
        ]}
      />
      <ExtractClient />
    </>
  );
}
