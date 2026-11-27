import type { MetadataRoute } from "next";
import { HUB_SITE_URL } from "@/config/tools";
import { INVOICE_GUIDE_PAGES } from "@/data/invoiceFollowUp";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: HUB_SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${HUB_SITE_URL}/invoice-followup`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = INVOICE_GUIDE_PAGES.map((guide) => ({
    url: `${HUB_SITE_URL}/invoice-followup/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...baseRoutes, ...guideRoutes];
}
