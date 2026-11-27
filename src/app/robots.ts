import type { MetadataRoute } from "next";
import { HUB_SITE_URL } from "@/config/tools";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${HUB_SITE_URL}/sitemap.xml`,
  };
}
