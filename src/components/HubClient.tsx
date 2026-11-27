"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Layers,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { HUB_PLANS, PAYPAL_BASE_URL } from "@/config/billing";
import {
  STUDIO_TOOLS,
  buildTrackedUrl,
  resolveHighlightedTool,
  resolveSourceLabel,
  type StudioTool,
} from "@/config/tools";

type HeroPreviewTab = "rate" | "scope" | "invoice";

function ToolIcon({
  toolKey,
  className = "w-4 h-4",
}: {
  toolKey: StudioTool["key"];
  className?: string;
}) {
  if (toolKey === "rate") return <TrendingUp className={className} />;
  if (toolKey === "audit") return <ShieldCheck className={className} />;
  if (toolKey === "invoice") return <Mail className={className} />;
  return <FileText className={className} />;
}

export function HubClient() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool");
  const fromParam = searchParams.get("from");

  const highlightedTool = resolveHighlightedTool(toolParam);
  const sourceLabel = resolveSourceLabel(fromParam);
  const sourceSlug = (fromParam || "craftapp_hub").trim().toLowerCase();

  const [previewTab, setPreviewTab] = useState<HeroPreviewTab>(
    highlightedTool?.key === "invoice"
      ? "invoice"
      : highlightedTool?.key === "audit" || highlightedTool?.key === "scope"
      ? "scope"
      : "rate"
  );

  const rateTool = STUDIO_TOOLS.find((t) => t.key === "rate")!;
  const auditTool = STUDIO_TOOLS.find((t) => t.key === "audit")!;
  const scopeTool = STUDIO_TOOLS.find((t) => t.key === "scope")!;
  const invoiceTool = STUDIO_TOOLS.find((t) => t.key === "invoice")!;

  const bundlePlan = HUB_PLANS.find((p) => p.id === "bundle-365")!;
  const singlePlans = HUB_PLANS.filter((p) => p.id !== "bundle-365");

  const handleToolClick = (toolName: string, targetUrl: string) => {
    track("hub_tool_launch", {
      tool: toolName,
      source: sourceSlug,
      target: targetUrl,
    });
  };

  const handleCheckoutClick = (planId: string, priceUsd: number) => {
    track("hub_paypal_click", {
      plan: planId,
      price_usd: priceUsd,
      source: sourceSlug,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Dark Glassmorphic Header */}
      <header className="sticky top-0 z-40 h-16 bg-[#090D16]/90 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-[1200px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 flex items-center justify-center font-display font-extrabold text-lg shrink-0">
              C
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm sm:text-[15px] font-bold tracking-tight text-white truncate">
                CraftApp Studio
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Freelance Suite
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a
              href={buildTrackedUrl(rateTool.baseUrl, sourceSlug, "top_nav")}
              className="hover:text-white transition-colors"
            >
              RateCraft
            </a>
            <a
              href={buildTrackedUrl(scopeTool.baseUrl, sourceSlug, "top_nav")}
              className="hover:text-white transition-colors"
            >
              ScopeCraft
            </a>
            <Link
              href="/invoice-followup"
              className="hover:text-white transition-colors"
            >
              InvoiceFollowUp
            </Link>
            <a
              href="#compare-pro"
              className="hover:text-white transition-colors"
            >
              Free vs. Pro
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/invoice-followup"
              className="md:hidden inline-flex items-center justify-center min-h-[44px] px-2.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              Invoice
            </Link>
            <a
              href="#pro-passes"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Pro Bundle · $99
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Executive Obsidian Hero Stage */}
        <section className="relative bg-[#090D16] text-white border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
          <div className="absolute inset-0 hero-glow-emerald pointer-events-none" />

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-14 lg:pt-14 lg:pb-16">
            {highlightedTool ? (
              <div className="rounded-2xl border border-emerald-400/35 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-9 shadow-[0_24px_80px_-24px_rgba(16,185,129,0.28)]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono uppercase tracking-wider font-semibold">
                    <ToolIcon toolKey={highlightedTool.key} className="w-3.5 h-3.5" />
                    Matched From {sourceLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Free Browser Tool • No Signup Required
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white leading-[1.06] max-w-3xl">
                  {highlightedTool.name}: {highlightedTool.shortTitle}
                </h1>
                <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed">
                  {highlightedTool.tagline} {highlightedTool.description}
                </p>

                <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={buildTrackedUrl(highlightedTool.baseUrl, sourceSlug)}
                    onClick={() =>
                      handleToolClick(highlightedTool.name, highlightedTool.baseUrl)
                    }
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-sm sm:text-base font-semibold transition-colors"
                  >
                    <span>{highlightedTool.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={buildTrackedUrl(highlightedTool.secondaryUrl, sourceSlug)}
                    onClick={() =>
                      handleToolClick(
                        `${highlightedTool.name}_secondary`,
                        highlightedTool.secondaryUrl
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium transition-colors"
                  >
                    <span>{highlightedTool.secondaryLabel}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Hero Left Copy */}
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono uppercase tracking-wider text-emerald-300 mb-5">
                    <span>US Freelancers &amp; Agencies</span>
                    {fromParam ? (
                      <>
                        <span className="text-slate-500">•</span>
                        <span>{sourceLabel}</span>
                      </>
                    ) : null}
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-[-0.035em] leading-[1.04]">
                    Price cleanly. Lock the scope. Get paid on time.
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 mt-5 leading-relaxed max-w-xl">
                    Three instant, browser-based tools that replace guesswork pricing, messy Word SOWs, and awkward overdue-invoice emails. Export client-ready US Letter PDFs in under 60 seconds—no account required.
                  </p>

                  {/* 3-Step Visual Clarity Pills */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10">
                      <strong className="text-emerald-300">01</strong> Quote 3 Tiers
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10">
                      <strong className="text-emerald-300">02</strong> Score &amp; Lock SOW
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10">
                      <strong className="text-emerald-300">03</strong> Follow Up &amp; Collect
                    </span>
                  </div>

                  {/* Primary & Secondary CTAs */}
                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <a
                      href={buildTrackedUrl(
                        rateTool.baseUrl,
                        sourceSlug,
                        "hero_primary"
                      )}
                      onClick={() =>
                        handleToolClick("ratecraft_hero", rateTool.baseUrl)
                      }
                      className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-sm sm:text-base font-semibold transition-colors"
                    >
                      <span>Start Free 3-Tier Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href={buildTrackedUrl(
                        auditTool.baseUrl,
                        sourceSlug,
                        "hero_secondary"
                      )}
                      onClick={() =>
                        handleToolClick("audit_hero", auditTool.baseUrl)
                      }
                      className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium transition-colors"
                    >
                      <span>Run 60s Scope Check</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-300" />
                    </a>
                  </div>
                </div>

                {/* Hero Right Interactive 3-Tab Live App Window */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-white/15 bg-[#0F1624]/95 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.75)] overflow-hidden">
                    {/* Browser Chrome Bar */}
                    <div className="px-4 py-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 truncate">
                        craftapp-studio / interactive-suite
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] uppercase">
                        Live
                      </span>
                    </div>

                    {/* Interactive Switcher */}
                    <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.02]">
                      {(
                        [
                          { id: "rate", label: "01 RateCraft" },
                          { id: "scope", label: "02 ScopeCraft" },
                          { id: "invoice", label: "03 FollowUp" },
                        ] as { id: HeroPreviewTab; label: string }[]
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPreviewTab(tab.id)}
                          className={`min-h-[44px] px-2 text-xs font-mono font-medium border-b-2 transition-colors ${
                            previewTab === tab.id
                              ? "border-emerald-400 text-white bg-white/[0.05]"
                              : "border-transparent text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Preview Content */}
                    <div className="p-5 sm:p-6">
                      {previewTab === "rate" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                              Recommended Quote vs. Naive Hourly
                            </span>
                            <span className="font-mono text-emerald-300 font-semibold tabular-nums">
                              +$2,890 recovered
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                              <div className="font-mono text-[10px] text-slate-400">
                                CORE
                              </div>
                              <div className="font-mono text-lg sm:text-xl font-semibold text-white tabular-nums mt-1">
                                $4,000
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Launch essentials
                              </div>
                            </div>
                            <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 p-3">
                              <div className="font-mono text-[10px] text-emerald-300 font-semibold">
                                RECOMMENDED
                              </div>
                              <div className="font-mono text-lg sm:text-xl font-semibold text-white tabular-nums mt-1">
                                $5,550
                              </div>
                              <div className="text-[11px] text-emerald-100/80 mt-1">
                                Full QA + SEO
                              </div>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                              <div className="font-mono text-[10px] text-slate-400">
                                PRIORITY
                              </div>
                              <div className="font-mono text-lg sm:text-xl font-semibold text-white tabular-nums mt-1">
                                $8,600
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Priority sprint
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                            <span className="text-xs text-slate-400">
                              Instant US Letter 3-tier PDF
                            </span>
                            <a
                              href={buildTrackedUrl(rateTool.baseUrl, sourceSlug)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                            >
                              <span>Open RateCraft</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {previewTab === "scope" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              Scope-Protection Score
                            </span>
                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold tabular-nums">
                              100 / 100 Protected
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-full bg-emerald-400 rounded-full" />
                          </div>
                          <div className="space-y-2 text-xs text-slate-200">
                            {[
                              "Explicit Not-Included exclusions locked",
                              "Revision rounds capped (2 rounds max)",
                              "50% deposit + Change Order pricing active",
                            ].map((rule) => (
                              <div
                                key={rule}
                                className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                            <span className="text-xs text-slate-400">
                              Includes SOW + Change Order PDF
                            </span>
                            <a
                              href={buildTrackedUrl(auditTool.baseUrl, sourceSlug)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                            >
                              <span>Run Scope Check</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {previewTab === "invoice" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                              Stage: 2nd Follow-Up (14d Overdue)
                            </span>
                            <span className="font-mono text-emerald-300">
                              Tone: Professional
                            </span>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-200 space-y-2">
                            <div className="font-semibold text-white">
                              Subject: Second Follow-Up: Invoice INV-2026-08 ($1,850)
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              &ldquo;This is a second reminder that $1,850 under Invoice INV-2026-08 is now 14 days overdue. Please schedule settlement via the link below and confirm your target payment date by Friday.&rdquo;
                            </p>
                          </div>
                          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                            <span className="text-xs text-slate-400">
                              100% free · 1-click copy + cadence
                            </span>
                            <Link
                              href="/invoice-followup"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                            >
                              <span>Open InvoiceFollowUp</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Action Strip */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href={buildTrackedUrl(rateTool.baseUrl, sourceSlug, "quick_bar")}
                onClick={() => handleToolClick("rate_quick", rateTool.baseUrl)}
                className="flex items-center justify-between min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    I need to quote a project
                  </div>
                  <div className="text-xs text-slate-500">
                    Open RateCraft 3-Tier Studio
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </a>
              <a
                href={buildTrackedUrl(auditTool.baseUrl, sourceSlug, "quick_bar")}
                onClick={() => handleToolClick("audit_quick", auditTool.baseUrl)}
                className="flex items-center justify-between min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Check scope before kickoff
                  </div>
                  <div className="text-xs text-slate-500">
                    Run 60s ScopeCraft Audit
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </a>
              <Link
                href="/invoice-followup"
                onClick={() =>
                  handleToolClick("invoice_quick", invoiceTool.baseUrl)
                }
                className="flex items-center justify-between min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Client is late paying
                  </div>
                  <div className="text-xs text-slate-500">
                    Open InvoiceFollowUp Generator
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </Link>
            </div>
          </div>
        </section>

        {/* Elevated Bento Workflow Grid */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-semibold">
                The Complete Freelance System
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.03em] mt-1.5">
                Four focused workbenches. Zero account bloat.
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Client-side privacy • Instant export
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STUDIO_TOOLS.map((tool) => {
              const trackedPrimary = buildTrackedUrl(tool.baseUrl, sourceSlug);
              const trackedSecondary = buildTrackedUrl(
                tool.secondaryUrl,
                sourceSlug,
                "directory_link"
              );
              const isHighlighted = highlightedTool?.key === tool.key;

              return (
                <article
                  key={tool.key}
                  className={`flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border transition-all shadow-[0_12px_36px_-18px_rgba(15,23,42,0.12)] hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.18)] ${
                    isHighlighted
                      ? "border-emerald-500 ring-1 ring-emerald-500/20"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 font-mono text-[11px] uppercase tracking-wider text-emerald-700 font-semibold">
                        {tool.stepLabel}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <ToolIcon toolKey={tool.key} className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-slate-900 tracking-[-0.02em]">
                      {tool.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {tool.shortTitle}
                    </p>

                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                      {tool.description}
                    </p>

                    <ul className="mt-5 space-y-2">
                      {tool.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={trackedPrimary}
                      onClick={() => handleToolClick(tool.name, tool.baseUrl)}
                      className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
                    >
                      <span>{tool.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                    <a
                      href={trackedSecondary}
                      onClick={() =>
                        handleToolClick(`${tool.name}_guide`, tool.secondaryUrl)
                      }
                      className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <span>{tool.secondaryLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Visual Free vs Pro Client Document Comparison */}
        <section id="compare-pro" className="bg-white border-y border-slate-200 py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-semibold">
                Why Agencies Upgrade
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.03em] mt-1.5">
                Start free. Upgrade when presenting to high-ticket clients.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Both generators export real US Letter PDFs at $0. Upgrading removes our footer badge, adds your studio header and brand color, and unlocks your full template library.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Card Preview */}
              <div className="rounded-2xl border border-slate-200 bg-dots-light p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-600">
                    Free PDF ($0 Forever)
                  </span>
                  <span className="text-xs text-slate-500">No account needed</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="h-1.5 w-16 rounded bg-slate-300" />
                  <div className="text-sm font-semibold text-slate-900">
                    Project Proposal &amp; Statement of Work
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-4/5 rounded bg-slate-100" />
                  </div>
                  <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>US Letter PDF</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      Created with CraftApp Studio
                    </span>
                  </div>
                </div>
              </div>

              {/* Pro Branded Card Preview */}
              <div className="rounded-2xl border border-emerald-500/35 bg-[#090D16] text-white p-5 sm:p-6 shadow-[0_20px_60px_-24px_rgba(16,185,129,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Pro White-Label Client PDF
                  </span>
                  <span className="text-xs text-slate-400">From $12 one-time</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 text-slate-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        Y
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Your Studio Name &amp; Logo
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold">
                      CUSTOM ACCENT
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    Executive 3-Tier Proposal + Structured SOW
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-3/4 rounded bg-slate-100" />
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-emerald-700 font-semibold">
                    <span>Zero CraftApp watermark</span>
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      30 Templates + Change Orders
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 65 Free SEO Benchmark Libraries Strip */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  65 Free US Industry Benchmarks &amp; Templates
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Pre-loaded numbers, scope exclusions, and follow-up scripts.
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <a
                  href={buildTrackedUrl(
                    "https://ratecraft-app.vercel.app/rates",
                    sourceSlug,
                    "library_strip"
                  )}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs sm:text-sm font-medium text-slate-800 transition-colors"
                >
                  <span>30 Pricing Guides</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </a>
                <a
                  href={buildTrackedUrl(
                    "https://scopecraft-sow.vercel.app/templates",
                    sourceSlug,
                    "library_strip"
                  )}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs sm:text-sm font-medium text-slate-800 transition-colors"
                >
                  <span>30 SOW Templates</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </a>
                <Link
                  href="/invoice-followup"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs sm:text-sm font-medium text-slate-800 transition-colors"
                >
                  <span>5 Invoice Guides</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Pricing & Obsidian Bundle Spotlight */}
        <section
          id="pro-passes"
          className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16"
        >
          <div className="max-w-2xl mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-semibold">
              Transparent One-Time Passes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.03em] mt-1.5">
              Everything you need from quote to scope protection.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Pay once via PayPal and keep working without automatic renewals. One clean client deal pays for an entire year. InvoiceFollowUp stays 100% free.
            </p>
          </div>

          {/* Spotlight All-Access Obsidian Card + 3 Single Passes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Dark Obsidian Bundle Spotlight */}
            <div className="lg:col-span-5 relative flex flex-col justify-between rounded-2xl bg-[#0B111E] text-white p-6 sm:p-8 border border-emerald-500/45 shadow-[0_24px_70px_-24px_rgba(16,185,129,0.35)] overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500" />
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                    Most Popular Studio Bundle
                  </span>
                  {bundlePlan.badge ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono font-semibold">
                      {bundlePlan.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {bundlePlan.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {bundlePlan.subtitle}
                </p>

                <div className="mt-5 flex items-baseline gap-2.5">
                  <span className="font-mono text-4xl sm:text-5xl font-bold text-white tabular-nums">
                    ${bundlePlan.priceUsd}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    USD • {bundlePlan.billingCycle}
                  </span>
                </div>

                <ul className="mt-6 space-y-2.5">
                  {bundlePlan.includes.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 pt-5 border-t border-white/10">
                <a
                  href={bundlePlan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    handleCheckoutClick(bundlePlan.id, bundlePlan.priceUsd)
                  }
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#031F16] text-sm font-semibold transition-colors"
                >
                  <span>Pay ${bundlePlan.priceUsd} USD via PayPal</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
                <p className="mt-3 text-[11px] text-slate-300 leading-relaxed">
                  {bundlePlan.paypalNoteHint}
                </p>
              </div>
            </div>

            {/* Individual Tool Passes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {singlePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {plan.name}
                      </h3>
                      <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                        ${plan.priceUsd}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        USD · {plan.billingCycle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{plan.subtitle}</p>
                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {plan.includes.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-2 text-xs text-slate-600"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2.5 text-[11px] text-slate-500 leading-relaxed">
                      {plan.paypalNoteHint}
                    </p>
                  </div>

                  <div className="sm:w-52 shrink-0">
                    <a
                      href={plan.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleCheckoutClick(plan.id, plan.priceUsd)}
                      className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
                    >
                      <span>Pay ${plan.priceUsd} USD via PayPal</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-semibold">Direct PayPal Checkout:</strong>{" "}
            Every pass routes straight to{" "}
            <a
              href={PAYPAL_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-slate-900 font-medium"
            >
              paypal.me/craftappstudio
            </a>
            . Keys are manually verified and emailed within 24 hours with zero recurring subscription traps.
          </div>
        </section>
      </main>

      {/* Dark Executive Footer */}
      <footer className="bg-[#090D16] text-slate-300 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-sm font-bold text-white">
              CraftApp Studio{" "}
              <span className="text-slate-400 font-normal font-mono text-xs">
                • Practical US Freelance Tools
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1.5 max-w-lg leading-relaxed">
              Pricing estimators, SOW templates, and email follow-up drafts are commercial workflow aids and do not constitute formal legal, tax, or debt-collection advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300">
            <a
              href="https://ratecraft-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white py-1"
            >
              RateCraft
            </a>
            <a
              href="https://scopecraft-sow.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white py-1"
            >
              ScopeCraft
            </a>
            <Link href="/invoice-followup" className="hover:text-white py-1">
              InvoiceFollowUp
            </Link>
            <a
              href="https://github.com/matiascorrea2024-star"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white py-1"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
