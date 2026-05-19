type Props = {
  name: string;
  description: string;
  url: string;
  totalTime?: string; // ISO 8601 duration, e.g. "PT1M"
  steps: { name: string; text: string }[];
};

const SITE_URL = "https://asanpdf.com";

export default function HowToJsonLd({
  name,
  description,
  url,
  totalTime = "PT1M",
  steps,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    inLanguage: "az",
    supply: { "@type": "HowToSupply", name: "PDF və ya şəkil faylı" },
    tool: { "@type": "HowToTool", name: "İnternet brauzeri" },
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}${url}#step-${i + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
