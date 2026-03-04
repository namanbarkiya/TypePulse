import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://typepulse.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/play/ai-news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/play/current-affairs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];
}
