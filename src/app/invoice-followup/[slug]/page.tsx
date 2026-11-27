import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { HUB_SITE_URL } from "@/config/tools";
import {
  DEFAULT_INVOICE_INPUT,
  INVOICE_GUIDE_PAGES,
  generateInvoiceReminder,
} from "@/data/invoiceFollowUp";

export function generateStaticParams() {
  return INVOICE_GUIDE_PAGES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = INVOICE_GUIDE_PAGES.find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | CraftApp Studio`,
    description: guide.metaDescription,
    alternates: {
      canonical: `${HUB_SITE_URL}/invoice-followup/${guide.slug}`,
    },
  };
}

export default async function InvoiceGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = INVOICE_GUIDE_PAGES.find((g) => g.slug === slug);
  if (!guide) notFound();

  const sampleEmail = generateInvoiceReminder({
    ...DEFAULT_INVOICE_INPUT,
    daysOverdue: guide.defaultDaysOverdue,
    tone: guide.defaultTone,
    stage: guide.defaultStage,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.metaDescription,
    url: `${HUB_SITE_URL}/invoice-followup/${guide.slug}`,
    author: {
      "@type": "Organization",
      name: "CraftApp Studio",
    },
  };

  return (
    <div className="flex-1 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="bg-canvas border-b border-hairline">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/invoice-followup"
            className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-ink-secondary hover:text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to InvoiceFollowUp Generator</span>
          </Link>
          <Link
            href={`/invoice-followup?preset=${guide.slug}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-medium transition-colors"
          >
            <span>Customize This Template</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-forest-tint text-forest text-xs font-mono uppercase tracking-wider font-medium mb-3">
            {guide.defaultTone} tone • {guide.defaultStage} stage • ~
            {guide.defaultDaysOverdue} days overdue
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-[1.08]">
            {guide.h1}
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary mt-3 leading-relaxed">
            {guide.metaDescription}
          </p>
        </div>

        {/* Situation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-paper border border-hairline rounded-2xl p-5">
            <h2 className="text-xs font-mono uppercase tracking-wider text-forest font-medium mb-2">
              When To Send
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {guide.whenToSend}
            </p>
          </div>
          <div className="bg-paper border border-hairline rounded-2xl p-5">
            <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted font-medium mb-2">
              Mistake To Avoid
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {guide.keyMistake}
            </p>
          </div>
        </div>

        {/* Ready-to-Review Sample */}
        <div className="bg-paper border border-hairline rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-hairline">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Example Draft (Customize Free)
              </span>
              <div className="text-sm font-semibold text-ink mt-1">
                Subject: {sampleEmail.subject}
              </div>
            </div>
            <Link
              href={`/invoice-followup?preset=${guide.slug}`}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-forest hover:bg-forest-hover text-white text-sm font-medium transition-colors"
            >
              <span>Load In Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <pre className="p-4 sm:p-5 rounded-xl border border-hairline bg-canvas text-sm text-ink whitespace-pre-wrap font-sans leading-relaxed">
            {sampleEmail.body}
          </pre>
        </div>

        {/* Practical Checklist */}
        <div className="bg-subtle border border-hairline rounded-2xl p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-ink mb-3">
            Recommended Next Step &amp; Checklist
          </h2>
          <p className="text-sm text-ink-secondary mb-4">
            {guide.recommendedNextStep}
          </p>
          <ul className="space-y-2.5">
            {guide.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 text-sm text-ink-secondary"
              >
                <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
