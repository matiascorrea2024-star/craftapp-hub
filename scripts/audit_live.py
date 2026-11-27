import json
import os
import sys
from playwright.sync_api import sync_playwright

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "https://craftapp-hub.vercel.app"
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audit_screenshots")
os.makedirs(OUT_DIR, exist_ok=True)


def check_overflow(page):
    return page.evaluate(
        "() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth)"
    )


def main():
    report = {
        "base_url": BASE_URL,
        "console_errors": [],
        "page_errors": [],
        "overflow_checks": [],
        "paypal_hrefs": [],
        "query_spotlight_checks": {},
        "invoice_flow": {},
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop 1440x900
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.on(
            "console",
            lambda msg: report["console_errors"].append(msg.text)
            if msg.type == "error"
            else None,
        )
        page.on("pageerror", lambda err: report["page_errors"].append(str(err)))

        for route in [
            "/",
            "/invoice-followup",
            "/invoice-followup/overdue-invoice-reminder-email-template",
        ]:
            page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            report["overflow_checks"].append(
                {
                    "viewport": "1440x900",
                    "route": route,
                    "overflow_px": check_overflow(page),
                }
            )

        # Capture updated home & invoice studio
        page.goto(BASE_URL, wait_until="networkidle")
        page.screenshot(path=os.path.join(OUT_DIR, "desktop_home.png"), full_page=False)
        paypal_links = page.locator("a[href^='https://paypal.me/craftappstudio/']")
        report["paypal_hrefs"] = [
            paypal_links.nth(i).get_attribute("href")
            for i in range(paypal_links.count())
        ]

        # Test query param routing spotlight
        page.goto(f"{BASE_URL}/?tool=audit&from=tiktok", wait_until="networkidle")
        report["query_spotlight_checks"]["audit_tiktok"] = page.locator(
            "text=Matched From TikTok Bio"
        ).is_visible()

        page.goto(f"{BASE_URL}/?tool=invoice&from=reels", wait_until="networkidle")
        report["query_spotlight_checks"]["invoice_reels"] = page.locator(
            "text=Matched From Instagram Reels"
        ).is_visible()

        # Test interactive InvoiceFollowUp state changes
        page.goto(f"{BASE_URL}/invoice-followup", wait_until="networkidle")
        page.get_by_role("button", name="Firm").click()
        page.get_by_role("button", name="Final Notice").click()
        report["invoice_flow"]["firm_final_subject"] = page.locator(
            "text=Work Pause Notice"
        ).is_visible()
        page.screenshot(
            path=os.path.join(OUT_DIR, "desktop_invoice_followup.png"), full_page=False
        )
        context.close()

        # Mobile 390x844
        m390 = browser.new_context(viewport={"width": 390, "height": 844})
        mpage = m390.new_page()
        for route in [
            "/",
            "/?tool=invoice&from=tiktok",
            "/invoice-followup",
            "/invoice-followup/overdue-invoice-reminder-email-template",
        ]:
            mpage.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            report["overflow_checks"].append(
                {
                    "viewport": "390x844",
                    "route": route,
                    "overflow_px": check_overflow(mpage),
                }
            )
        mpage.goto(f"{BASE_URL}/invoice-followup", wait_until="networkidle")
        mpage.screenshot(
            path=os.path.join(OUT_DIR, "mobile_390_invoice.png"), full_page=False
        )
        m390.close()

        # Mobile 360x800
        m360 = browser.new_context(viewport={"width": 360, "height": 800})
        m360_page = m360.new_page()
        for route in ["/", "/invoice-followup"]:
            m360_page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            report["overflow_checks"].append(
                {
                    "viewport": "360x800",
                    "route": route,
                    "overflow_px": check_overflow(m360_page),
                }
            )
        m360.close()

        browser.close()

    print(json.dumps(report, indent=2))
    assert not report["console_errors"], f"Console errors: {report['console_errors']}"
    assert not report["page_errors"], f"Page errors: {report['page_errors']}"
    assert all(
        c["overflow_px"] == 0 for c in report["overflow_checks"]
    ), f"Overflow found: {report['overflow_checks']}"
    assert len(report["paypal_hrefs"]) >= 4, f"Missing PayPal hrefs: {report['paypal_hrefs']}"
    assert all(report["query_spotlight_checks"].values()), report["query_spotlight_checks"]
    assert report["invoice_flow"]["firm_final_subject"], report["invoice_flow"]


if __name__ == "__main__":
    main()
