import type { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";

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
  return <ImageToPdfClient />;
}
