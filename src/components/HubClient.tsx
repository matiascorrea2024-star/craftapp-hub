"use client";

import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Layers,
  ShieldCheck,
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

function ToolIcon({ toolKey }: { toolKey: StudioTool["key"] }) {
  if (toolKey === "rate") return <TrendingUp className="w-4 h-4 text-forest" />;
  if (toolKey === "audit") return <ShieldCheck className="w-4 h-4 text-forest" />;
  return <FileText className="w-4 h-4 text-forest" />;
}

export function HubClient() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool");
  const fromParam = searchParams.get("from");

  const highlightedTool = resolveHighlightedTool(toolParam);
  const sourceLabel = resolveSourceLabel(fromParam);
  const sourceSlug = (fromParam || "craftapp_hub").trim().toLowerCase();

  const rateTool = STUDIO_TOOLS.find((t) => t.key === "rate")!;
  const auditTool = STUDIO_TOOLS.find((t) => t.key === "audit")!;

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
      {/* Compact Sticky Header */}
      <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur border-b border-hairline">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-forest text-white flex items-center justify-center font-serif text-xl shrink-0">
              C
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink tracking-tight truncate">
                CraftApp Studio
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                Freelance Suite
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#pro-passes"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg border border-hairline bg-paper text-xs sm:text-sm font-medium text-ink hover:border-ink/30 transition-colors"
            >
              Pro Passes
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero / Direct Bio Launcher */}
        <section className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">
          {highlightedTool ? (
            <div className="bg-paper border border-forest/40 rounded-2xl p-5 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-tint text-forest text-xs font-mono uppercase tracking-wider font-medium">
                  <ToolIcon toolKey={highlightedTool.key} />
                  Matched From {sourceLabel}
                </span>
                <span className="text-xs text-ink-muted font-mono">
                  Free US Letter PDF • No Signup
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-ink leading-[1.08] tracking-tight">
                {highlightedTool.name}: {highlightedTool.shortTitle}
              </h1>
              <p className="text-base sm:text-lg text-ink-secondary mt-3 max-w-2xl leading-relaxed">
                {highlightedTool.tagline} {highlightedTool.description}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={buildTrackedUrl(highlightedTool.baseUrl, sourceSlug)}
                  onClick={() =>
                    handleToolClick(highlightedTool.name, highlightedTool.baseUrl)
                  }
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-forest hover:bg-forest-hover text-white text-sm sm:text-base font-medium transition-colors"
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
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl border border-hairline bg-canvas hover:bg-subtle text-ink text-sm font-medium transition-colors"
                >
                  <span>{highlightedTool.secondaryLabel}</span>
                  <ArrowUpRight className="w-4 h-4 text-ink-secondary" />
                </a>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-subtle border border-hairline text-xs font-mono uppercase tracking-wider text-ink-secondary mb-4">
                <span>US Freelancers &amp; Boutique Agencies</span>
                {fromParam ? (
                  <>
                    <span className="text-ink-muted">•</span>
                    <span className="text-forest font-medium">{sourceLabel}</span>
                  </>
                ) : null}
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight">
                Price the work cleanly. Lock the scope before kickoff.
              </h1>
              <p className="text-base sm:text-lg text-ink-secondary mt-4 leading-relaxed">
                Two focused, zero-signup client document tools built for real US freelance workflows. Generate an instant quote or SOW in under 60 seconds, then export a clean US Letter PDF.
              </p>

              {/* 1-Tap Problem Selector */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={buildTrackedUrl(rateTool.baseUrl, sourceSlug, "hero_selector")}
                  onClick={() => handleToolClick("ratecraft_hero", rateTool.baseUrl)}
                  className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-xl bg-forest hover:bg-forest-hover text-white transition-colors"
                >
                  <div className="text-left">
                    <div className="text-sm font-medium">I need to price a project</div>
                    <div className="text-xs text-white/80">
                      Open RateCraft 3-Tier Quote Studio
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>

                <a
                  href={buildTrackedUrl(auditTool.baseUrl, sourceSlug, "hero_selector")}
                  onClick={() => handleToolClick("audit_hero", auditTool.baseUrl)}
                  className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-xl border border-hairline bg-paper hover:border-ink/30 text-ink transition-colors"
                >
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      Check my scope before sending
                    </div>
                    <div className="text-xs text-ink-secondary">
                      Run 60s ScopeCraft Risk Audit
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-ink-secondary" />
                </a>
              </div>
            </div>
          )}
        </section>

        {/* 2-Step Complete Workflow Tools */}
        <section className="max-w-[1040px] mx-auto px-4 sm:px-6 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                The Complete Client Workflow
              </h2>
              <p className="font-serif text-2xl sm:text-3xl text-ink mt-1">
                From ballpark price to signed boundary.
              </p>
            </div>
            <p className="text-xs text-ink-secondary font-mono">
              100% browser-based • Free PDF export
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className={`flex flex-col justify-between bg-paper rounded-2xl p-5 sm:p-6 border ${
                    isHighlighted ? "border-forest" : "border-hairline"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-medium">
                        {tool.stepLabel}
                      </span>
                      <ToolIcon toolKey={tool.key} />
                    </div>

                    <h3 className="font-serif text-2xl text-ink leading-tight">
                      {tool.name}
                    </h3>
                    <p className="text-xs font-medium text-ink-secondary mt-1">
                      {tool.shortTitle}
                    </p>

                    <p className="text-sm text-ink-secondary mt-3 leading-relaxed">
                      {tool.description}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {tool.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-ink-secondary"
                        >
                          <Check className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-2">
                    <a
                      href={trackedPrimary}
                      onClick={() => handleToolClick(tool.name, tool.baseUrl)}
                      className="inline-flex items-center justify-between min-h-[44px] px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-sm font-medium transition-colors"
                    >
                      <span>{tool.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                    <a
                      href={trackedSecondary}
                      onClick={() =>
                        handleToolClick(`${tool.name}_guide`, tool.secondaryUrl)
                      }
                      className="inline-flex items-center justify-between min-h-[44px] px-4 rounded-xl border border-hairline bg-canvas hover:bg-subtle text-ink-secondary hover:text-ink text-xs font-medium transition-colors"
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

        {/* Free SEO Benchmark Libraries */}
        <section className="max-w-[1040px] mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-subtle border border-hairline rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-forest font-medium mb-1">
                <Layers className="w-3.5 h-3.5" />
                60 Free US Industry Guides
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                Need numbers or clauses for a specific service?
              </h2>
              <p className="text-sm text-ink-secondary mt-1.5">
                Open pre-filled pricing benchmarks and scope-protection templates across web design, Shopify, SEO, branding, consulting, and video production.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <a
                href={buildTrackedUrl(
                  "https://ratecraft-app.vercel.app/rates",
                  sourceSlug,
                  "library_strip"
                )}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-paper border border-hairline hover:border-ink/30 text-sm font-medium text-ink transition-colors"
              >
                <span>30 Pricing Guides</span>
                <ArrowUpRight className="w-4 h-4 text-ink-secondary" />
              </a>
              <a
                href={buildTrackedUrl(
                  "https://scopecraft-sow.vercel.app/templates",
                  sourceSlug,
                  "library_strip"
                )}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-paper border border-hairline hover:border-ink/30 text-sm font-medium text-ink transition-colors"
              >
                <span>30 SOW Templates</span>
                <ArrowUpRight className="w-4 h-4 text-ink-secondary" />
              </a>
            </div>
          </div>
        </section>

        {/* Transparent Pro Passes & All-Access Bundle */}
        <section
          id="pro-passes"
          className="max-w-[1040px] mx-auto px-4 sm:px-6 pb-16"
        >
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-forest font-medium">
              Optional Pro Upgrades
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-1">
              Start free. Upgrade only when sending client-branded PDFs.
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary mt-2 max-w-2xl">
              Both apps remain free to use without creating an account. Pro passes remove the footer badge, unlock custom studio branding, and work via one-time PayPal checkout with zero surprise renewals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HUB_PLANS.map((plan) => {
              const isBundle = plan.id === "bundle-365";
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-2xl p-5 sm:p-6 border ${
                    isBundle
                      ? "bg-paper border-forest shadow-sm"
                      : "bg-paper border-hairline"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="font-serif text-2xl text-ink">{plan.name}</h3>
                      {plan.badge ? (
                        <span className="px-2.5 py-1 rounded-full bg-forest-tint text-forest text-[11px] font-mono uppercase tracking-wider font-medium">
                          {plan.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-ink-secondary">{plan.subtitle}</p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-3xl font-semibold text-ink tabular-nums">
                        ${plan.priceUsd}
                      </span>
                      <span className="text-xs text-ink-muted font-mono">
                        USD • {plan.billingCycle}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {plan.includes.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-2 text-xs sm:text-sm text-ink-secondary"
                        >
                          <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hairline">
                    <a
                      href={plan.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleCheckoutClick(plan.id, plan.priceUsd)}
                      className={`w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl text-sm font-medium transition-colors ${
                        isBundle
                          ? "bg-forest hover:bg-forest-hover text-white"
                          : "bg-subtle hover:bg-hairline/70 text-ink border border-hairline"
                      }`}
                    >
                      <span>Pay ${plan.priceUsd} USD via PayPal</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-hairline bg-subtle px-4 py-3 text-xs text-ink-secondary leading-relaxed">
            <strong className="text-ink font-medium">How Pro delivery works:</strong>{" "}
            All checkout links open{" "}
            <a
              href={PAYPAL_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-ink"
            >
              paypal.me/craftappstudio
            </a>
            . Include your email address and chosen tool in the PayPal note to receive your license key directly—no subscription trap.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-hairline">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              CraftApp Studio{" "}
              <span className="text-ink-muted font-normal font-mono text-xs">
                • Practical US Freelance Tools
              </span>
            </p>
            <p className="text-xs text-ink-muted mt-1 max-w-lg">
              Pricing estimators and Statement of Work templates are commercial planning tools and do not constitute formal legal or tax advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
            <a
              href="https://ratecraft-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink py-1"
            >
              RateCraft
            </a>
            <a
              href="https://scopecraft-sow.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink py-1"
            >
              ScopeCraft
            </a>
            <a
              href="https://github.com/matiascorrea2024-star"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink py-1"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
