import { describe, expect, it } from "vitest";
import { HUB_PLANS, PAYPAL_BASE_URL, buildPayPalCheckoutUrl } from "@/config/billing";
import {
  STUDIO_TOOLS,
  buildTrackedUrl,
  resolveHighlightedTool,
  resolveSourceLabel,
} from "@/config/tools";
import {
  DEFAULT_INVOICE_INPUT,
  INVOICE_GUIDE_PAGES,
  generateInvoiceReminder,
} from "@/data/invoiceFollowUp";

describe("CraftApp Hub billing & PayPal routing", () => {
  it("routes all paid passes strictly to paypal.me/craftappstudio and never Mercado Pago", () => {
    expect(PAYPAL_BASE_URL).toBe("https://paypal.me/craftappstudio");
    expect(buildPayPalCheckoutUrl(99)).toBe("https://paypal.me/craftappstudio/99USD");

    for (const plan of HUB_PLANS) {
      expect(plan.checkoutUrl.startsWith("https://paypal.me/craftappstudio/")).toBe(true);
      expect(plan.checkoutUrl.endsWith("USD")).toBe(true);
      expect(plan.checkoutUrl.toLowerCase()).not.toContain("mercado");
      expect(plan.paypalNoteHint.length).toBeGreaterThan(20);
    }
  });
});

describe("CraftApp Hub query-param routing & UTM tracking", () => {
  it("resolves ?tool= aliases cleanly including invoice", () => {
    expect(resolveHighlightedTool("rate")?.key).toBe("rate");
    expect(resolveHighlightedTool("audit")?.key).toBe("audit");
    expect(resolveHighlightedTool("scope")?.key).toBe("scope");
    expect(resolveHighlightedTool("invoice")?.key).toBe("invoice");
    expect(resolveHighlightedTool("overdue")?.key).toBe("invoice");
    expect(resolveHighlightedTool("unknown")).toBeNull();
    expect(resolveHighlightedTool(null)).toBeNull();
  });

  it("maps traffic source labels and builds UTM links safely", () => {
    expect(resolveSourceLabel("tiktok")).toBe("TikTok Bio");
    expect(resolveSourceLabel("reels")).toBe("Instagram Reels");
    expect(resolveSourceLabel(null)).toBe("Direct Launch");

    const tracked = buildTrackedUrl(STUDIO_TOOLS[0].baseUrl, "TikTok");
    const parsed = new URL(tracked);
    expect(parsed.origin).toBe("https://ratecraft-app.vercel.app");
    expect(parsed.searchParams.get("utm_source")).toBe("tiktok");
    expect(parsed.searchParams.get("utm_medium")).toBe("bio_hub");
    expect(parsed.searchParams.get("utm_campaign")).toBe("craftapp_studio");
  });
});

describe("InvoiceFollowUp generator & SEO guides", () => {
  it("generates stage/tone-specific email subjects, timeline, and covers 5 SEO guides", () => {
    expect(INVOICE_GUIDE_PAGES.length).toBe(5);

    const friendlyFirst = generateInvoiceReminder({
      ...DEFAULT_INVOICE_INPUT,
      tone: "friendly",
      stage: "first",
      daysOverdue: 4,
      amountUsd: 2400,
    });
    expect(friendlyFirst.subject).toContain("$2,400");
    expect(friendlyFirst.body).toContain("INV-2026-08");
    expect(friendlyFirst.timeline.length).toBe(3);
    expect(friendlyFirst.timeline[0].active).toBe(true);

    const firmFinal = generateInvoiceReminder({
      ...DEFAULT_INVOICE_INPUT,
      tone: "firm",
      stage: "final",
      daysOverdue: 28,
    });
    expect(firmFinal.subject).toContain("Work Pause Notice");
    expect(firmFinal.body.toLowerCase()).not.toContain("lawsuit");
    expect(firmFinal.body.toLowerCase()).not.toContain("collections");
    expect(firmFinal.timeline[2].active).toBe(true);
  });
});
