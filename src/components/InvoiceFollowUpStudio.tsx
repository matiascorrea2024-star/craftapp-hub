"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  Copy,
  Mail,
} from "lucide-react";
import {
  DEFAULT_INVOICE_INPUT,
  INVOICE_GUIDE_PAGES,
  generateInvoiceReminder,
  type InvoiceFollowUpInput,
  type ReminderStage,
  type ReminderTone,
} from "@/data/invoiceFollowUp";

const TONE_OPTIONS: { id: ReminderTone; label: string; hint: string }[] = [
  { id: "friendly", label: "Friendly", hint: "Warm check-in" },
  { id: "professional", label: "Professional", hint: "Clear & direct" },
  { id: "firm", label: "Firm", hint: "Commercial hold" },
];

const STAGE_OPTIONS: { id: ReminderStage; label: string; badge: string }[] = [
  { id: "first", label: "1st Reminder", badge: "Day +3" },
  { id: "second", label: "2nd Follow-Up", badge: "Day +14" },
  { id: "final", label: "Final Notice", badge: "Day +21" },
];

const OVERDUE_PRESETS = [3, 7, 14, 30, 45];

export function InvoiceFollowUpStudio() {
  const searchParams = useSearchParams();
  const presetSlug = searchParams.get("preset");

  const initialState = useMemo<InvoiceFollowUpInput>(() => {
    const matched = presetSlug
      ? INVOICE_GUIDE_PAGES.find((g) => g.slug === presetSlug)
      : undefined;
    if (!matched) return DEFAULT_INVOICE_INPUT;
    return {
      ...DEFAULT_INVOICE_INPUT,
      daysOverdue: matched.defaultDaysOverdue,
      tone: matched.defaultTone,
      stage: matched.defaultStage,
    };
  }, [presetSlug]);

  const [input, setInput] = useState<InvoiceFollowUpInput>(initialState);
  const [copiedMode, setCopiedMode] = useState<"full" | "body" | null>(null);

  const generated = useMemo(() => generateInvoiceReminder(input), [input]);

  const copyText = async (mode: "full" | "body") => {
    const payload =
      mode === "full"
        ? `Subject: ${generated.subject}\n\n${generated.body}`
        : generated.body;
    await navigator.clipboard.writeText(payload);
    setCopiedMode(mode);
    track("invoice_followup_copy", {
      mode,
      tone: input.tone,
      stage: input.stage,
      days_overdue: input.daysOverdue,
    });
    window.setTimeout(() => setCopiedMode(null), 2000);
  };

  const mailtoHref = `mailto:?subject=${encodeURIComponent(
    generated.subject
  )}&body=${encodeURIComponent(generated.body)}`;

  return (
    <div className="flex-1 flex flex-col">
      {/* Compact Sticky Header */}
      <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur border-b border-hairline">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[44px] pr-2 text-xs sm:text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>CraftApp Hub</span>
            </Link>
            <span className="text-hairline hidden sm:inline">|</span>
            <span className="hidden sm:inline font-serif text-lg text-ink">
              InvoiceFollowUp
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#pro-passes"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-medium transition-colors"
            >
              All-Access Bundle ($99)
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1180px] w-full mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Hero */}
        <div className="max-w-3xl mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-tint text-forest text-xs font-mono uppercase tracking-wider font-medium mb-3">
            Free Client Communication Tool • Zero Signup
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-[1.06] tracking-tight">
            Get paid without sounding desperate.
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary mt-3 leading-relaxed">
            Generate calm, professional overdue-invoice follow-up emails and a clear payment timeline in seconds. Pure commercial communication—no empty legal threats.
          </p>
        </div>

        {/* Interactive Split Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Controls */}
          <section className="lg:col-span-5 bg-paper border border-hairline rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-hairline">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-medium">
                1. Invoice &amp; Tone Setup
              </span>
              <button
                type="button"
                onClick={() => setInput(DEFAULT_INVOICE_INPUT)}
                className="text-xs font-medium text-forest hover:underline min-h-[36px] px-2"
              >
                Reset sample
              </button>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-2">
                Reminder Stage
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STAGE_OPTIONS.map((opt) => {
                  const active = input.stage === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setInput((prev) => ({ ...prev, stage: opt.id }))
                      }
                      className={`min-h-[48px] px-2.5 py-2 rounded-xl border text-left transition-colors ${
                        active
                          ? "border-forest bg-forest-tint text-ink"
                          : "border-hairline bg-canvas hover:bg-subtle text-ink-secondary"
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[11px] font-mono text-ink-muted">
                        {opt.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-2">
                Communication Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TONE_OPTIONS.map((opt) => {
                  const active = input.tone === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setInput((prev) => ({ ...prev, tone: opt.id }))
                      }
                      className={`min-h-[48px] px-2.5 py-2 rounded-xl border text-left transition-colors ${
                        active
                          ? "border-forest bg-forest text-white"
                          : "border-hairline bg-canvas hover:bg-subtle text-ink-secondary"
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div
                        className={`text-[11px] ${
                          active ? "text-white/80" : "text-ink-muted"
                        }`}
                      >
                        {opt.hint}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Days Overdue Quick Pills + Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="invoice-amount"
                  className="block text-xs font-medium text-ink-secondary mb-1.5"
                >
                  Invoice Amount (USD)
                </label>
                <input
                  id="invoice-amount"
                  type="number"
                  min={1}
                  value={input.amountUsd}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      amountUsd: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm font-mono tabular-nums text-ink focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label
                  htmlFor="due-date"
                  className="block text-xs font-medium text-ink-secondary mb-1.5"
                >
                  Original Due Date
                </label>
                <input
                  id="due-date"
                  type="date"
                  value={input.dueDateIso}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, dueDateIso: e.target.value }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm font-mono tabular-nums text-ink focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="days-overdue"
                  className="text-xs font-medium text-ink-secondary"
                >
                  Days Overdue
                </label>
                <span className="text-xs font-mono text-forest font-semibold tabular-nums">
                  {input.daysOverdue} days
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {OVERDUE_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setInput((prev) => ({ ...prev, daysOverdue: d }))
                    }
                    className={`min-h-[36px] px-3 rounded-lg border text-xs font-mono tabular-nums transition-colors ${
                      input.daysOverdue === d
                        ? "border-forest bg-forest-tint text-forest font-semibold"
                        : "border-hairline bg-canvas text-ink-secondary hover:bg-subtle"
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <input
                id="days-overdue"
                type="number"
                min={1}
                value={input.daysOverdue}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    daysOverdue: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
                className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm font-mono tabular-nums text-ink focus:outline-none focus:border-forest"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="invoice-ref"
                  className="block text-xs font-medium text-ink-secondary mb-1.5"
                >
                  Invoice #
                </label>
                <input
                  id="invoice-ref"
                  type="text"
                  value={input.invoiceNumber}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      invoiceNumber: e.target.value,
                    }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label
                  htmlFor="client-name"
                  className="block text-xs font-medium text-ink-secondary mb-1.5"
                >
                  Client First Name
                </label>
                <input
                  id="client-name"
                  type="text"
                  value={input.clientName}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-xs font-medium text-ink-secondary mb-1.5"
                >
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={input.projectName}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, projectName: e.target.value }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label
                  htmlFor="sender-name"
                  className="block text-xs font-medium text-ink-secondary mb-1.5"
                >
                  Your Name / Studio
                </label>
                <input
                  id="sender-name"
                  type="text"
                  value={input.senderName}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, senderName: e.target.value }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="payment-note"
                className="block text-xs font-medium text-ink-secondary mb-1.5"
              >
                Payment Link or Remittance Details
              </label>
              <input
                id="payment-note"
                type="text"
                value={input.paymentMethodNote}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    paymentMethodNote: e.target.value,
                  }))
                }
                className="w-full min-h-[44px] px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-forest"
              />
            </div>
          </section>

          {/* Right Live Email & Follow-Up Timeline */}
          <section className="lg:col-span-7 space-y-5">
            <div className="bg-paper border border-hairline rounded-2xl p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-forest" />
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-medium">
                    2. Ready-to-Send Follow-Up Email
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyText("full")}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-medium transition-colors"
                  >
                    {copiedMode === "full" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied Subject + Email</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Subject &amp; Email</span>
                      </>
                    )}
                  </button>
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-xl border border-hairline bg-canvas hover:bg-subtle text-xs sm:text-sm font-medium text-ink transition-colors"
                  >
                    <span>Open Mail App</span>
                    <ArrowUpRight className="w-4 h-4 text-ink-secondary" />
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-subtle border border-hairline px-3.5 py-2 text-xs text-ink-secondary">
                <strong className="text-ink font-medium">Sample fields pre-filled:</strong>{" "}
                Replace client name, invoice number, and payment link before sending.
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1">
                    Subject Line
                  </div>
                  <div className="p-3.5 rounded-xl border border-hairline bg-canvas text-sm font-semibold text-ink">
                    {generated.subject}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                      Email Body
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText("body")}
                      className="text-xs font-medium text-forest hover:underline py-1"
                    >
                      {copiedMode === "body" ? "Copied body" : "Copy body only"}
                    </button>
                  </div>
                  <pre className="p-4 sm:p-5 rounded-xl border border-hairline bg-canvas text-sm text-ink whitespace-pre-wrap font-sans leading-relaxed">
                    {generated.body}
                  </pre>
                </div>
              </div>
            </div>

            {/* Follow-Up Cadence Timeline */}
            <div className="bg-paper border border-hairline rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="w-4 h-4 text-forest" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted font-medium">
                  Recommended Follow-Up Cadence (Based on Due Date)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {generated.timeline.map((step) => (
                  <div
                    key={step.stepLabel}
                    className={`rounded-xl p-3.5 border ${
                      step.active
                        ? "border-forest bg-forest-tint"
                        : "border-hairline bg-canvas"
                    }`}
                  >
                    <div className="text-[11px] font-mono uppercase tracking-wider text-forest font-semibold">
                      {step.stepLabel}
                    </div>
                    <div className="font-mono text-sm font-semibold text-ink tabular-nums mt-1">
                      {step.dateIso}
                    </div>
                    <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                      {step.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention Cross-Sell Bridge */}
            <div className="bg-subtle border border-hairline rounded-2xl p-5 sm:p-6">
              <div className="text-xs font-mono uppercase tracking-wider text-forest font-medium mb-1">
                Prevent Late Invoices On Your Next Project
              </div>
              <h2 className="font-serif text-2xl text-ink">
                Lock deposits &amp; milestones before work begins.
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://scopecraft-sow.vercel.app/?utm_source=invoice_followup&utm_medium=bridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-paper border border-hairline hover:border-forest rounded-xl p-4 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-ink">ScopeCraft</div>
                    <p className="text-xs text-ink-secondary mt-1">
                      Define deposits, milestones &amp; Change Orders in your SOW.
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-forest">
                    <span>Open SOW Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>

                <a
                  href="https://ratecraft-app.vercel.app/?utm_source=invoice_followup&utm_medium=bridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-paper border border-hairline hover:border-forest rounded-xl p-4 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-ink">RateCraft</div>
                    <p className="text-xs text-ink-secondary mt-1">
                      Anchor 3-tier proposals so clients respect project value.
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-forest">
                    <span>Price Next Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>

                <Link
                  href="/#pro-passes"
                  className="bg-forest text-white hover:bg-forest-hover rounded-xl p-4 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold">
                      All-Access Bundle ($99)
                    </div>
                    <p className="text-xs text-white/85 mt-1">
                      Both Pro studios for 365 days—save $39 via PayPal.
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium">
                    <span>View Studio Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* 5 SEO Guides Index */}
        <section className="mt-12 pt-8 border-t border-hairline">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-3">
            Situational Overdue Invoice Email Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INVOICE_GUIDE_PAGES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/invoice-followup/${guide.slug}`}
                className="bg-paper border border-hairline hover:border-forest rounded-xl p-4 transition-colors"
              >
                <div className="text-sm font-semibold text-ink">{guide.h1}</div>
                <p className="text-xs text-ink-secondary mt-1 line-clamp-2">
                  {guide.searchIntent}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
