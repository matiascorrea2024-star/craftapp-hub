export const HUB_SITE_URL = "https://craftapp-hub.vercel.app";
export const HUB_SITE_NAME = "CraftApp Studio";

export type ToolKey = "rate" | "audit" | "scope" | "invoice";

export interface StudioTool {
  key: ToolKey;
  stepLabel: string;
  name: string;
  shortTitle: string;
  tagline: string;
  description: string;
  baseUrl: string;
  ctaLabel: string;
  secondaryLabel: string;
  secondaryUrl: string;
  highlights: string[];
  badgeText: string;
  isInternal?: boolean;
}

export const STUDIO_TOOLS: StudioTool[] = [
  {
    key: "rate",
    stepLabel: "Step 01 — Price The Work",
    name: "RateCraft",
    shortTitle: "3-Tier Quote & Pricing Studio",
    tagline: "Stop quoting naive hourly rates. Send 3-tier proposal PDFs in 30s.",
    description:
      "Accounts for admin buffer, project complexity, and margin automatically, then formats Core, Recommended, and Priority packages on US Letter.",
    baseUrl: "https://ratecraft-app.vercel.app",
    ctaLabel: "Open RateCraft Quote Studio",
    secondaryLabel: "Browse 30 Rate Guides",
    secondaryUrl: "https://ratecraft-app.vercel.app/rates",
    highlights: [
      "Free instant quote PDF with no signup",
      "Transparent step-by-step price formula",
      "30 US freelance pricing benchmarks",
    ],
    badgeText: "Best if a client asked for a ballpark price",
  },
  {
    key: "audit",
    stepLabel: "Step 02A — Audit Before Sending",
    name: "Scope-Creep Risk Check",
    shortTitle: "60-Second Scope Protection Audit",
    tagline: "Find missing exclusions and revision caps before kickoff.",
    description:
      "Score any proposal on a transparent 100-point rubric and auto-insert missing protection clauses like revision limits, out-of-scope rules, and cancellation notice terms.",
    baseUrl: "https://scopecraft-sow.vercel.app/audit",
    ctaLabel: "Run Free 60s Scope Check",
    secondaryLabel: "View Live Client SOW Preview",
    secondaryUrl: "https://scopecraft-sow.vercel.app/view",
    highlights: [
      "Flags vague deliverables immediately",
      "1-click fixes raise score toward 100/100",
      "Exports straight into a full SOW PDF",
    ],
    badgeText: "Featured in short videos",
  },
  {
    key: "scope",
    stepLabel: "Step 02B — Protect The Work",
    name: "ScopeCraft",
    shortTitle: "Structured SOW & Change Order Builder",
    tagline: "Turn approved quotes into clear deliverables, exclusions, and paid add-ons.",
    description:
      "Clear, professionally structured SOWs with explicit deliverables, exclusions, and Change Order PDFs when clients ask for extras—plus read-only share links.",
    baseUrl: "https://scopecraft-sow.vercel.app",
    ctaLabel: "Open ScopeCraft SOW Builder",
    secondaryLabel: "Browse 30 Industry Templates",
    secondaryUrl: "https://scopecraft-sow.vercel.app/templates",
    highlights: [
      "SOW + Change Order mode in one workbench",
      "No account or credit card required to export",
      "30 industry templates for designers, devs, agencies",
    ],
    badgeText: "Best when a client asks for one more thing",
  },
  {
    key: "invoice",
    stepLabel: "Step 03 — Get Paid Cleanly",
    name: "InvoiceFollowUp",
    shortTitle: "Overdue Invoice Reminder Generator",
    tagline: "Get paid without sounding desperate.",
    description:
      "Generate calm, copy-ready payment follow-up emails by tone (Friendly, Professional, Firm) and reminder stage—plus a clear client communication timeline.",
    baseUrl: `${HUB_SITE_URL}/invoice-followup`,
    ctaLabel: "Open Free Email Generator",
    secondaryLabel: "5 Overdue Email Templates",
    secondaryUrl: `${HUB_SITE_URL}/invoice-followup/overdue-invoice-reminder-email-template`,
    highlights: [
      "100% free & client-side — zero signup",
      "First, Second, and Final polite follow-ups",
      "Pure communication aid (no legal threats)",
    ],
    badgeText: "Stop staring at overdue invoices",
    isInternal: true,
  },
];

const SOURCE_LABELS: Record<string, string> = {
  tiktok: "TikTok Bio",
  reels: "Instagram Reels",
  shorts: "YouTube Shorts",
  ph: "Product Hunt",
  x: "X / Twitter",
  reddit: "Community",
};

export function resolveSourceLabel(fromParam?: string | null): string {
  if (!fromParam) return "Direct Launch";
  const normalized = fromParam.trim().toLowerCase();
  return SOURCE_LABELS[normalized] || "Creator Link";
}

export function resolveHighlightedTool(
  toolParam?: string | null
): StudioTool | null {
  if (!toolParam) return null;
  const normalized = toolParam.trim().toLowerCase();
  if (normalized === "rate" || normalized === "rates" || normalized === "quote") {
    return STUDIO_TOOLS.find((t) => t.key === "rate") || null;
  }
  if (normalized === "audit" || normalized === "check" || normalized === "risk") {
    return STUDIO_TOOLS.find((t) => t.key === "audit") || null;
  }
  if (normalized === "scope" || normalized === "sow" || normalized === "change") {
    return STUDIO_TOOLS.find((t) => t.key === "scope") || null;
  }
  if (
    normalized === "invoice" ||
    normalized === "followup" ||
    normalized === "reminder" ||
    normalized === "overdue"
  ) {
    return STUDIO_TOOLS.find((t) => t.key === "invoice") || null;
  }
  return null;
}

export function buildTrackedUrl(
  baseUrl: string,
  source?: string | null,
  medium = "bio_hub",
  campaign = "craftapp_studio"
): string {
  const url = new URL(baseUrl);
  const cleanSource = (source || "craftapp_hub").trim().toLowerCase() || "craftapp_hub";
  url.searchParams.set("utm_source", cleanSource);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}
