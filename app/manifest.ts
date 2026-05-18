import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AsanPDF.com — PDF alətləri",
    short_name: "AsanPDF",
    description:
      "PDF birləşdir, ayır, səhifə sil, sıxışdır, şəkilə çevir. Pulsuz, brauzerdə işləyir, fayl heç yerə yüklənmir.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "az",
    categories: ["productivity", "utilities", "business"],
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "any", type: "image/png", purpose: "maskable" },
    ],
  };
}
