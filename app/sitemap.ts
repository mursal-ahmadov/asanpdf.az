import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  // Manual override (set NEXT_PUBLIC_SITE_URL in Vercel for the production domain)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  // Vercel auto-provides the deployment URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

const paths = ["", "/birlesdir", "/ayir", "/sehife-sil", "/cixar", "/donder", "/sekil-to-pdf", "/pdf-to-sekil", "/sixisdir", "/haqqimizda"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const now = new Date();
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
