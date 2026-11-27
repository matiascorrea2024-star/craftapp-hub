import type { MetadataRoute } from "next";
import { HUB_SITE_URL } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: HUB_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
