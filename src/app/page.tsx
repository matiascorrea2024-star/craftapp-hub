import { Suspense } from "react";
import { HubClient } from "@/components/HubClient";
import { HUB_SITE_NAME, HUB_SITE_URL } from "@/config/tools";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: HUB_SITE_NAME,
  url: HUB_SITE_URL,
  description:
    "Free no-signup freelance pricing and scope protection tools by CraftApp Studio.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Suspense
        fallback={
          <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-16 text-sm text-ink-secondary">
            Loading CraftApp Studio...
          </div>
        }
      >
        <HubClient />
      </Suspense>
    </>
  );
}
