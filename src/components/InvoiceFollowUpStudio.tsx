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
      {/* Dark Sticky Header */}
      <header className="sticky top-0 z-40 h-16 bg-[#090D16]/95 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[44px] pr-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>CraftApp Hub</span>
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="hidden sm:inline font-display font-bold text-base text-white">
              InvoiceFollowUp
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#pro-passes"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-xs sm:text-sm font-semibold transition-colors"
            >
              All-Access Bundle ($99)
            </Link>
          </div>
        </div>
      </header>

      {/* Compact Dark Obsidian Hero */}
      <section className="relative bg-[#090D16] text-white border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
        <div className="absolute inset-0 hero-glow-emerald pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
            Free Client Communication Tool • Zero Signup
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white leading-[1.06] max-w-3xl">
            Get paid without sounding desperate.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl leading-relaxed">
            Pick your reminder stage and tone to generate a calm, copy-ready follow-up email and milestone timeline in seconds. Pure commercial communication—zero empty legal threats.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Elevated Studio Application Shell */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.14)] overflow-hidden">
          {/* App Window Chrome */}
          <div className="px-5 py-3.5 bg-[#0F172A] text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              </div>
              <span className="font-mono text-xs text-slate-300 ml-1">
                InvoiceFollowUp Studio · {input.invoiceNumber || "INV-2026-08"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyText("full")}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-xs font-semibold transition-colors"
              >
                {copiedMode === "full" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Subject + Email</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Subject &amp; Email</span>
                  </>
                )}
              </button>
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1 min-h-[38px] px-3 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
              >
                <span>Open Mail App</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Controls */}
            <section className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-5 bg-white">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  1. Invoice &amp; Tone Setup
                </span>
                <button
                  type="button"
                  onClick={() => setInput(DEFAULT_INVOICE_INPUT)}
                  className="text-xs font-semibold text-emerald-700 hover:underline min-h-[36px] px-2"
                >
                  Reset sample
                </button>
              </div>

              {/* Stage Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                            ? "border-emerald-600 bg-emerald-50 text-slate-900"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {opt.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div
                          className={`text-[11px] ${
                            active ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {opt.hint}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="invoice-amount"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="due-date"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="days-overdue"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Days Overdue
                  </label>
                  <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
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
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="invoice-ref"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="client-name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Client First Name
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={input.clientName}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="project-name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Project Name
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    value={input.projectName}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        projectName: e.target.value,
                      }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sender-name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Your Name / Studio
                  </label>
                  <input
                    id="sender-name"
                    type="text"
                    value={input.senderName}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        senderName: e.target.value,
                      }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="payment-note"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </section>

            {/* Right Preview Canvas */}
            <section className="lg:col-span-7 bg-dots-light p-5 sm:p-7 space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                      2. Ready-to-Send Email
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText("body")}
                    className="text-xs font-semibold text-emerald-700 hover:underline py-1"
                  >
                    {copiedMode === "body" ? "Copied body" : "Copy body only"}
                  </button>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-600">
                  <strong className="text-slate-900 font-semibold">
                    Sample fields pre-filled:
                  </strong>{" "}
                  Replace client name, invoice number, and payment link before sending.
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Subject Line
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900">
                    {generated.subject}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Email Body
                  </div>
                  <pre className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {generated.body}
                  </pre>
                </div>
              </div>

              {/* Follow-Up Cadence Timeline */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Recommended Follow-Up Cadence
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {generated.timeline.map((step) => (
                    <div
                      key={step.stepLabel}
                      className={`rounded-xl p-3.5 border ${
                        step.active
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                        {step.stepLabel}
                      </div>
                      <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums mt-1">
                        {step.dateIso}
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Prevention Cross-Sell Bridge */}
        <section className="mt-10 rounded-2xl bg-[#0B111E] text-white p-6 sm:p-8 border border-white/10">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold mb-1">
            Prevent Late Invoices On Your Next Project
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Lock deposits &amp; milestones before work begins.
          </h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://scopecraft-sow.vercel.app/?utm_source=invoice_followup&utm_medium=bridge"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 rounded-xl p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-white">ScopeCraft</div>
                <p className="text-xs text-slate-300 mt-1">
                  Define deposits, milestones &amp; Change Orders in your SOW.
                </p>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                <span>Open SOW Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="https://ratecraft-app.vercel.app/?utm_source=invoice_followup&utm_medium=bridge"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 rounded-xl p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-white">RateCraft</div>
                <p className="text-xs text-slate-300 mt-1">
                  Anchor 3-tier proposals so clients respect project value.
                </p>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                <span>Price Next Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <Link
              href="/#pro-passes"
              className="bg-emerald-500 hover:bg-emerald-400 text-[#031F16] rounded-xl p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="text-sm font-bold">
                  All-Access Bundle ($99)
                </div>
                <p className="text-xs text-[#031F16]/80 mt-1 font-medium">
                  Both Pro studios for 365 days—save $39 via PayPal.
                </p>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold">
                <span>View Studio Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </section>

        {/* 5 SEO Guides Index */}
        <section className="mt-10 pt-8 border-t border-slate-200">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Situational Overdue Invoice Email Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INVOICE_GUIDE_PAGES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/invoice-followup/${guide.slug}`}
                className="bg-white border border-slate-200 hover:border-emerald-500/50 rounded-xl p-4 transition-colors shadow-sm"
              >
                <div className="text-sm font-semibold text-slate-900">{guide.h1}</div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
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
