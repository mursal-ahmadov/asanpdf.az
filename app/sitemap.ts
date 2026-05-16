import type { MetadataRoute } from "next";

const base = "https://asanpdf.az";
const paths = ["", "/birlesdir", "/ayir", "/sehife-sil", "/cixar", "/donder", "/sekil-to-pdf", "/pdf-to-sekil"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
