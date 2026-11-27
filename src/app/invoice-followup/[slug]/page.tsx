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

      <header className="sticky top-0 z-30 h-16 bg-[#090D16]/95 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
          <Link
            href="/invoice-followup"
            className="inline-flex items-center gap-2 min-h-[44px] text-xs sm:text-sm font-medium text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to InvoiceFollowUp</span>
          </Link>
          <Link
            href={`/invoice-followup?preset=${guide.slug}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>Customize Template</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <section className="relative bg-[#090D16] text-white border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
          <span className="inline-flex px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
            {guide.defaultTone} tone • {guide.defaultStage} stage • ~
            {guide.defaultDaysOverdue} days overdue
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white leading-[1.08]">
            {guide.h1}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl leading-relaxed">
            {guide.metaDescription}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold mb-2">
              When To Send
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {guide.whenToSend}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Mistake To Avoid
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {guide.keyMistake}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Example Draft (Customize Free)
              </span>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                Subject: {sampleEmail.subject}
              </div>
            </div>
            <Link
              href={`/invoice-followup?preset=${guide.slug}`}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
            >
              <span>Load In Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <pre className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
            {sampleEmail.body}
          </pre>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
            Recommended Next Step &amp; Checklist
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            {guide.recommendedNextStep}
          </p>
          <ul className="space-y-2.5">
            {guide.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 text-sm text-slate-700"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
