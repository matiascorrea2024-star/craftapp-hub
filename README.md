# CraftApp Studio Hub

**Live Hub:** [https://craftapp-hub.vercel.app](https://craftapp-hub.vercel.app)  
**Overdue Invoice Tool:** [https://craftapp-hub.vercel.app/invoice-followup](https://craftapp-hub.vercel.app/invoice-followup)

A fast, zero-signup freelance workflow suite built for US independent consultants, web designers, developers, and boutique agencies—with `$0` recurring server infrastructure and client-side privacy.

---

## The 3-Step Workflow

1. **Step 01 — Price The Work ([RateCraft](https://ratecraft-app.vercel.app)):** Factor hidden admin buffer, project complexity, and margin automatically, then export a 3-tier US Letter proposal PDF (`Core`, `Recommended`, `Priority`) plus 30 industry pricing guides (`/rates/[slug]`).
2. **Step 02 — Protect The Scope ([ScopeCraft](https://scopecraft-sow.vercel.app)):** Run a 60-second Scope-Creep Risk Audit (`/audit`), auto-add explicit exclusions and revision limits, export clean SOW & Change Order PDFs, or share read-only client links (`/view`) plus 30 SOW templates (`/templates/[slug]`).
3. **Step 03 — Get Paid Cleanly ([InvoiceFollowUp](https://craftapp-hub.vercel.app/invoice-followup)):** 100% free overdue-invoice email generator supporting `Friendly`, `Professional`, and `Firm` tones across 1st, 2nd, and Final follow-up stages, with a milestone cadence timeline and 5 situational guides (`/invoice-followup/[slug]`).

## Hub Features
- **Campaign Bio Router (`/?tool=audit|rate|scope|invoice&from=tiktok|reels|shorts`):** Automatically highlights the exact tool featured in short-form social videos right above the fold with mobile-ready `>= 44px` tap targets (`0px` horizontal overflow down to `360px`).
- **Transparent Optional Pro Passes:** One-time PayPal Pro licenses (`$12` 30-day, `$59` RateCraft 365d, `$79` ScopeCraft 365d, or `$99` All-Access Bundle covering both Pro studios for 365 days) with clear delivery notes and zero auto-renewals.

## Stack & Verification
- Next.js 15 App Router, TypeScript, Tailwind CSS, Lucide Icons, `@vercel/analytics`
- Vitest unit tests (`tests/hub.test.ts`) + Playwright headless desktop/mobile E2E checks (`scripts/audit_live.py`)
