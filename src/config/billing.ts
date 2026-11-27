export interface BillingPlan {
  id: string;
  name: string;
  subtitle: string;
  priceUsd: number;
  billingCycle: string;
  badge?: string;
  checkoutUrl: string;
  paypalNoteHint: string;
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
    subtitle:
      "Everything you need from quote to scope protection. Get both Pro studios for one year—pay once, keep working without automatic renewals.",
    priceUsd: 99,
    billingCycle: "one-time / 365 days",
    badge: "Save $39 vs buying separately",
    checkoutUrl:
      AUTOMATED_UPGRADE_CONFIG.payhipBundleUrl || buildPayPalCheckoutUrl(99),
    paypalNoteHint:
      "After payment, include your email in the PayPal note. You'll receive two separate 365-day license keys—one for ScopeCraft and one for RateCraft—by email within 24 hours. No recurring payments.",
    includes: [
      "Two 365-day Pro license keys: ScopeCraft Pro + RateCraft Pro ($138 combined value)",
      "Clean unbranded US Letter PDFs across 3-tier quotes, SOWs, and Change Orders",
      "Your studio branding, saved local library, and share links",
      "One-time payment via PayPal — zero surprise auto-renewals",
    ],
  },
  {
    id: "scopecraft-365",
    name: "ScopeCraft Pro (365-Day)",
    subtitle: "Structured SOWs + Paid Change Orders",
    priceUsd: 79,
    billingCycle: "one-time / 365 days",
    checkoutUrl: buildPayPalCheckoutUrl(79),
    paypalNoteHint:
      "Include your email in the PayPal note. Your 365-day SC-PRO license key is emailed within 24 hours.",
    includes: [
      "Clean SOW & Change Order PDFs with custom studio header",
      "Unlimited Change Order exports & saved local templates",
      "365-day SC-PRO license key emailed within 24 hours",
    ],
  },
  {
    id: "ratecraft-365",
    name: "RateCraft Pro (365-Day)",
    subtitle: "3-Tier Pricing & Quote PDF Studio",
    priceUsd: 59,
    billingCycle: "one-time / 365 days",
    checkoutUrl: buildPayPalCheckoutUrl(59),
    paypalNoteHint:
      "Include your email in the PayPal note. Your 365-day RC-PRO license key is emailed within 24 hours.",
    includes: [
      "Clean 3-tier US Letter proposal PDFs with studio header",
      "Unlimited saved pricing presets & tier customization",
      "365-day RC-PRO license key emailed within 24 hours",
    ],
  },
  {
    id: "single-30",
    name: "Single-Tool 30-Day Pass",
    subtitle: "Try Pro on ScopeCraft or RateCraft",
    priceUsd: 12,
    billingCycle: "one-time / 30 days",
    checkoutUrl: buildPayPalCheckoutUrl(12),
    paypalNoteHint:
      "PayPal note: EMAIL + SCOPECRAFT or EMAIL + RATECRAFT. Your 30-day license key is emailed within 24 hours.",
    includes: [
      "Choose ScopeCraft Pro OR RateCraft Pro in your PayPal note",
      "Clean PDF exports + custom branding for 30 days",
      "Zero recurring commitment",
    ],
  },
];
