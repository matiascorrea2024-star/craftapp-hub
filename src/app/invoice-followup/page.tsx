import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceFollowUpStudio } from "@/components/InvoiceFollowUpStudio";
import { HUB_SITE_URL } from "@/config/tools";

export const metadata: Metadata = {
  title: "InvoiceFollowUp — Free Overdue Invoice Reminder Email Generator",
  description:
    "Get paid without sounding desperate. Generate polite, professional, or firm overdue invoice reminder emails and a follow-up timeline in seconds.",
  alternates: {
    canonical: `${HUB_SITE_URL}/invoice-followup`,
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InvoiceFollowUp by CraftApp Studio",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${HUB_SITE_URL}/invoice-followup`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function InvoiceFollowUpPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Suspense
        fallback={
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-16 text-sm text-ink-secondary">
            Loading InvoiceFollowUp generator...
          </div>
        }
      >
        <InvoiceFollowUpStudio />
      </Suspense>
    </>
  );
}
