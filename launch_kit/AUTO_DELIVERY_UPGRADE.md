# Auto-Delivery Upgrade Guide (Manual PayPal -> Automated 24/7 Keys)

Right now, all Pro checkout buttons in `src/config/billing.ts` route cleanly to `https://paypal.me/craftappstudio/<PRICE>USD` with zero recurring fees or external SaaS cost, and buyers receive their key(s) by email within 24 hours.

Once sales volume picks up, switch to **100% instant 24/7 automated license delivery** in 3 steps—with zero code rewrite:

## Option A — Payhip (Fastest, $0/month Base, Connected to Same PayPal)
1. Create a free Payhip account linked to Matías's PayPal (`craftappstudio`), create the `$99` All-Access Bundle product (plus `$12`, `$59`, `$79` passes if desired), and upload pre-generated license keys from `scopecraft/launch_kit/license_keys_500.txt` and `ratecraft/launch_kit/license_keys_500.txt` into Payhip's License Key dispenser.
2. In Vercel (`craftapp-hub` project -> Settings -> Environment Variables), add:
   - `NEXT_PUBLIC_PAYHIP_BUNDLE_URL = https://payhip.com/b/<YOUR_BUNDLE_ID>`
3. Trigger `vercel deploy --prod --yes` — `src/config/billing.ts` automatically routes the `$99` Bundle button to Payhip while keeping all secrets out of GitHub.

## Option B — PayPal Subscriptions / Orders Webhook + Resend
1. Create a `/api/paypal-webhook` route on Vercel that verifies `PAYPAL-TRANSMISSION-SIG` against `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` env vars (never hardcode secrets).
2. Pop the next unused key from an encrypted Vercel KV / Upstash free-tier list and email it via Resend (`RESEND_API_KEY`).
