export interface BillingPlan {
  id: string;
  name: string;
  subtitle: string;
  priceUsd: number;
  billingCycle: string;
  badge?: string;
  checkoutUrl: string;
  includes: string[];
}

export const PAYPAL_BASE_URL = "https://paypal.me/craftappstudio";

/**
 * Upgrade path for automated 24/7 license delivery:
 * Set NEXT_PUBLIC_PAYHIP_BUNDLE_URL or NEXT_PUBLIC_PAYPAL_SUBSCRIPTIONS_URL
 * in Vercel Environment Variables (never commit secrets in client code).
 */
export const AUTOMATED_UPGRADE_CONFIG = {
  payhipBundleUrl: process.env.NEXT_PUBLIC_PAYHIP_BUNDLE_URL || "",
  paypalSubscriptionsEnabled:
    process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIPTIONS_ENABLED === "true",
};

export function buildPayPalCheckoutUrl(priceUsd: number): string {
  return `${PAYPAL_BASE_URL}/${priceUsd}USD`;
}

export const HUB_PLANS: BillingPlan[] = [
  {
    id: "bundle-365",
    name: "All-Access Studio Bundle",
    subtitle: "ScopeCraft Pro + RateCraft Pro (365-day pass)",
    priceUsd: 99,
    billingCycle: "one-time / 365 days",
    badge: "Best Studio Value — Save $39",
    checkoutUrl:
      AUTOMATED_UPGRADE_CONFIG.payhipBundleUrl || buildPayPalCheckoutUrl(99),
    includes: [
      "365-day Pro license key for ScopeCraft + 365-day Pro key for RateCraft",
      "Clean unbranded US Letter PDFs across quotes, SOWs, and Change Orders",
      "Your studio branding, saved local library, and share links",
      "One-time payment via PayPal — no surprise auto-renewal",
    ],
  },
  {
    id: "scopecraft-365",
    name: "ScopeCraft Pro (365-Day)",
    subtitle: "Statements of Work + Change Orders",
    priceUsd: 79,
    billingCycle: "one-time / 365 days",
    checkoutUrl: buildPayPalCheckoutUrl(79),
    includes: [
      "Clean SOW & Change Order PDFs with custom studio header",
      "Unlimited Change Order exports & saved local templates",
      "Instant Pro activation via SC-PRO license key",
    ],
  },
  {
    id: "ratecraft-365",
    name: "RateCraft Pro (365-Day)",
    subtitle: "3-Tier Pricing & Quote PDF Studio",
    priceUsd: 59,
    billingCycle: "one-time / 365 days",
    checkoutUrl: buildPayPalCheckoutUrl(59),
    includes: [
      "Clean 3-tier US Letter proposal PDFs with studio header",
      "Unlimited saved pricing presets & tier customization",
      "Instant Pro activation via RC-PRO license key",
    ],
  },
  {
    id: "single-30",
    name: "Single-Tool 30-Day Pass",
    subtitle: "Try Pro on ScopeCraft or RateCraft",
    priceUsd: 12,
    billingCycle: "one-time / 30 days",
    checkoutUrl: buildPayPalCheckoutUrl(12),
    includes: [
      "Choose ScopeCraft Pro OR RateCraft Pro in your PayPal note",
      "Clean PDF exports + custom branding for 30 days",
      "Zero recurring commitment",
    ],
  },
];
