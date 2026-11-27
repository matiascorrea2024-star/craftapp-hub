import base64
import os
import subprocess
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(os.getcwd())
HUB_SHOTS = ROOT / "audit_screenshots"
RATE_SHOTS = ROOT.parent / "ratecraft" / "audit_screenshots"
SCOPE_SHOTS = ROOT.parent / "scopecraft" / "audit_screenshots"

OUT_COVER = ROOT / "launch_kit" / "editorial_cover_1280x720.png"
VID_DIR = ROOT / "launch_kit" / "viral_videos"
VID_DIR.mkdir(parents=True, exist_ok=True)


def b64(path: Path) -> str:
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode("ascii") if path.exists() else ""


COVER_HTML = """<!doctype html><html><head><meta charset="utf-8"/><style>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{width:1280px;height:720px;background:#FAFAF8;color:#111315;font-family:'Inter',sans-serif;border-top:8px solid #0F5C4A;padding:54px 64px;display:flex;gap:48px;align-items:stretch;overflow:hidden}
.left{flex:1;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px}
.mark{width:38px;height:38px;border-radius:7px;background:#0F5C4A;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-size:24px}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#0F5C4A;font-weight:600;margin-bottom:16px}
h1{font-family:'Instrument Serif',Georgia,serif;font-size:60px;line-height:1.05;font-weight:400;margin-bottom:18px}
.sub{font-size:18px;line-height:1.5;color:#5A606B;max-width:500px}
.pills{display:flex;gap:8px}
.pill{font-family:'JetBrains Mono',monospace;font-size:11px;padding:7px 11px;border:1px solid #E4E2DC;background:#fff;border-radius:6px}
.pill.acc{background:#ECF5F2;border-color:rgba(15,92,74,.3);color:#0F5C4A;font-weight:600}
.right{flex:1;background:#fff;border:1px solid #E4E2DC;border-radius:12px;padding:30px;display:flex;flex-direction:column;justify-content:space-between}
.step{border:1px solid #E4E2DC;border-radius:10px;padding:18px;background:#FAFAF8}
.step.acc{border-color:#0F5C4A;background:#ECF5F2}
.mono{font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums}
</style></head><body>
<div class="left">
  <div class="brand"><div class="mark">C</div><div><div style="font-size:19px;font-weight:700">CraftApp Studio</div><div class="mono" style="font-size:11px;color:#6E6C64">FREELANCE SUITE</div></div></div>
  <div>
    <div class="eyebrow">2-Step Freelance Workflow</div>
    <h1>Price the project cleanly. Lock the scope.</h1>
    <p class="sub">Zero-signup US Letter PDF tools for independent consultants and boutique agencies: RateCraft 3-tier quotes + ScopeCraft SOW &amp; Change Orders.</p>
  </div>
  <div class="pills"><span class="pill acc">craftapp-hub.vercel.app</span><span class="pill">60 SEO Guides</span><span class="pill">Free US Letter PDF</span></div>
</div>
<div class="right">
  <div class="step">
    <div class="mono" style="font-size:11px;color:#0F5C4A;font-weight:600">STEP 01 — RATECRAFT</div>
    <div style="font-family:'Instrument Serif',serif;font-size:28px;margin-top:4px">3-Tier Proposal PDF in 30 Seconds</div>
    <div style="font-size:14px;color:#5A606B;margin-top:6px">Calculate admin buffer + margin, anchor Core / Studio / Priority tiers.</div>
  </div>
  <div class="step acc">
    <div class="mono" style="font-size:11px;color:#0F5C4A;font-weight:600">STEP 02 — SCOPECRAFT</div>
    <div style="font-family:'Instrument Serif',serif;font-size:28px;margin-top:4px">Scope-Creep Check + SOW PDF</div>
    <div style="font-size:14px;color:#111315;margin-top:6px">Flag vague deliverables, lock explicit exclusions, and issue paid Change Orders.</div>
  </div>
  <div class="mono" style="font-size:12px;color:#5A606B;display:flex;justify-content:space-between;border-top:1px solid #E4E2DC;padding-top:14px"><span>Start Free — Zero Account</span><span style="color:#0F5C4A;font-weight:600">All-Access Pro Bundle $99/yr</span></div>
</div>
</body></html>"""


def vslide(eyebrow: str, headline: str, sub: str, pill: str, shot: str = "", warn: bool = False) -> str:
    col = "#B42318" if warn else "#0F5C4A"
    tint = "#FEF3F2" if warn else "#ECF5F2"
    img = (
        f'<div style="background:#fff;border:2px solid #E4E2DC;border-radius:16px;padding:14px;max-height:920px;overflow:hidden;display:flex;justify-content:center;">'
        f'<img src="{shot}" style="width:100%;height:auto;border-radius:10px;object-fit:contain;"/></div>'
        if shot
        else ""
    )
    return f"""<!doctype html><html><head><meta charset="utf-8"/><style>
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@500;600;700&family=JetBrains+Mono:wght@600&display=swap');
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{width:1080px;height:1920px;background:#FAFAF8;color:#111315;font-family:'Inter',sans-serif;border-top:14px solid {col};padding:110px 72px 120px;display:flex;flex-direction:column;justify-content:space-between}}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:23px">
      <span style="color:{col};font-weight:600">{eyebrow}</span><span style="color:#6E6C64">CraftApp Studio</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:34px;margin:auto 0">
      <div style="display:inline-block;align-self:flex-start;padding:12px 22px;border-radius:999px;background:{tint};border:2px solid {col}33;color:{col};font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:600">{pill}</div>
      <h1 style="font-family:'Instrument Serif',serif;font-size:94px;line-height:1.04;font-weight:400">{headline}</h1>
      <p style="font-size:38px;line-height:1.38;color:#5A606B">{sub}</p>
      {img}
    </div>
    <div style="background:#0F5C4A;color:#fff;border-radius:16px;padding:26px 32px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:600">craftapp-hub.vercel.app</div>
    </body></html>"""


def render_mp4(slides: list[tuple[str, float]], out_mp4: Path):
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        imgs = []
        with sync_playwright() as p:
            br = p.chromium.launch(headless=True)
            pg = br.new_page(viewport={"width": 1080, "height": 1920})
            for i, (html, _) in enumerate(slides):
                pg.set_content(html, wait_until="networkidle")
                ip = tmp / f"s_{i}.png"
                pg.screenshot(path=str(ip))
                imgs.append(ip)
            br.close()
        cmd = ["nice", "-n", "15", "ffmpeg", "-y"]
        for i, (_, d) in enumerate(slides):
            cmd += ["-loop", "1", "-t", f"{d:.2f}", "-i", str(imgs[i])]
        fade = 0.35
        filters = []
        cur = "[0:v]"
        off = slides[0][1] - fade
        for i in range(1, len(slides)):
            nxt = f"[{i}:v]"
            out = f"[v{i}]" if i < len(slides) - 1 else "[vout]"
            filters.append(f"{cur}{nxt}xfade=transition=fade:duration={fade}:offset={off:.2f}{out}")
            cur = out
            off += slides[i][1] - fade
        cmd += [
            "-filter_complex",
            ";".join(filters),
            "-map",
            "[vout]",
            "-r",
            "30",
            "-c:v",
            "libx264",
            "-preset",
            "faster",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(out_mp4),
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Rendered MP4:", out_mp4.name, out_mp4.stat().st_size)


with sync_playwright() as p:
    br = p.chromium.launch(headless=True)
    pg = br.new_page(viewport={"width": 1280, "height": 720})
    pg.set_content(COVER_HTML, wait_until="networkidle")
    pg.screenshot(path=str(OUT_COVER))
    br.close()
print("Saved cover:", OUT_COVER.stat().st_size)

m_hub = b64(HUB_SHOTS / "mobile_390_home.png")
m_rate = b64(RATE_SHOTS / "mobile_390_home.png")
m_invoice = b64(HUB_SHOTS / "mobile_390_invoice.png")

render_mp4(
    [
        (
            vslide(
                "OVERDUE INVOICE SCRIPT",
                "Your client is 14 days late paying.",
                "Stop rewriting the same uncomfortable email trying not to sound desperate.",
                "GET PAID CLEANLY",
                warn=True,
            ),
            4.0,
        ),
        (
            vslide(
                "3 TONES • 3 STAGES",
                "Friendly, Professional, or Firm in 10s.",
                "Pick days overdue, stage, and tone—copy your email plus payment timeline.",
                "FREE GENERATOR",
                shot=m_invoice,
            ),
            5.5,
        ),
        (
            vslide(
                "NO AWKWARD CHASING",
                "Lock deposits before the next project.",
                "Pairs directly with RateCraft 3-tier quotes and ScopeCraft SOWs.",
                "CRAFTAPP STUDIO",
                shot=m_hub,
            ),
            4.5,
        ),
        (
            vslide(
                "FREE LINK IN BIO",
                "InvoiceFollowUp is 100% free. Zero signup.",
                "Tap link in bio -> craftapp-hub.vercel.app/?tool=invoice",
                "FREE TOOL IN BIO",
            ),
            3.5,
        ),
    ],
    VID_DIR / "02_overdue_invoice_followup_9x16.mp4",
)

render_mp4(
    [
        (
            vslide(
                "FREELANCE INCOME LEAK",
                "Two mistakes kill agency margins before kickoff.",
                "Underquoting the price on Monday — then giving away free work by Friday.",
                "STOP WORKING FOR FREE",
                warn=True,
            ),
            4.0,
        ),
        (
            vslide(
                "STEP 01 — RATECRAFT",
                "Calculate true margin & send 3 tiers.",
                "Factor buffer + complexity automatically and export a crisp 3-package quote PDF.",
                "PRICE WITH CONFIDENCE",
                shot=m_rate,
            ),
            5.0,
        ),
        (
            vslide(
                "STEP 02 — SCOPECRAFT",
                "Audit your scope & lock boundaries.",
                "Check missing exclusions in 60s and issue paid Change Orders when clients ask for extras.",
                "PROTECT EVERY DOLLAR",
                shot=m_hub,
            ),
            5.0,
        ),
        (
            vslide(
                "FREE LINK IN BIO",
                "Both tools are free. Zero signup.",
                "Open craftapp-hub.vercel.app from our bio to launch RateCraft & ScopeCraft.",
                "CRAFTAPP STUDIO",
            ),
            3.5,
        ),
    ],
    VID_DIR / "01_two_step_freelance_system_9x16.mp4",
)
