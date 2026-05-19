const SITE_URL = "https://asanpdf.com";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "AsanPDF.com",
  alternateName: "AsanPDF",
  url: SITE_URL,
  inLanguage: "az",
  description:
    "Azərbaycan dilində pulsuz onlayn PDF alətləri: birləşdir, ayır, səhifə sil, sıxışdır, şəkilə çevir, qeydlər və daha çox.",
  publisher: { "@id": `${SITE_URL}/#org` },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: "AsanPDF.com",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "AsanPDF.com",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "PDF Tools",
  operatingSystem: "Web (any browser, iOS, Android, Windows, macOS, Linux)",
  inLanguage: "az",
  url: SITE_URL,
  description:
    "Pulsuz onlayn PDF alətləri: birləşdir, ayır, səhifə sil, çıxar, döndər, şəkilə çevir, sıxışdır, üzərində qeyd et. Hər şey brauzerdə işləyir.",
  featureList: [
    "PDF birləşdir",
    "PDF ayır",
    "PDF səhifə sil",
    "PDF səhifə çıxar",
    "PDF səhifə döndər",
    "Şəkildən PDF yarat",
    "PDF-dən şəkil çıxar",
    "PDF sıxışdır",
    "PDF üzərində qeyd et (marker, dairə, qələm)",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AZN",
  },
  isAccessibleForFree: true,
  browserRequirements: "Requires JavaScript. Modern browser.",
};

export default function SiteJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}
