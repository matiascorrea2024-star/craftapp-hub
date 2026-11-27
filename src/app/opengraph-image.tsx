import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CraftApp Studio — Free Freelance Pricing & Scope Protection Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAFAF8",
          padding: "64px 72px",
          borderTop: "10px solid #0F5C4A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              backgroundColor: "#0F5C4A",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#111315" }}>
              CraftApp Studio
            </span>
            <span style={{ fontSize: "14px", color: "#6E6C64", letterSpacing: "0.08em" }}>
              FREELANCE WORKFLOW SUITE
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "940px" }}>
          <span
            style={{
              fontSize: "18px",
              color: "#0F5C4A",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            RateCraft + ScopeCraft
          </span>
          <div
            style={{
              fontSize: "60px",
              lineHeight: 1.08,
              color: "#111315",
              fontWeight: 600,
            }}
          >
            Price the project cleanly. Lock the scope before kickoff.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E4E2DC",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#5A606B",
          }}
        >
          <span>No-Signup US Letter PDFs • 60 Industry Templates &amp; Benchmarks</span>
          <span style={{ color: "#0F5C4A", fontWeight: 600 }}>Free to start</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
