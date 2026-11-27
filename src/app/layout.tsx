import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { HUB_SITE_NAME, HUB_SITE_URL } from "@/config/tools";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "Free, no-signup client workflow tools for US freelancers and boutique agencies: quote 3-tier prices with RateCraft and lock scope boundaries with ScopeCraft.";

export const metadata: Metadata = {
  metadataBase: new URL(HUB_SITE_URL),
  title: `${HUB_SITE_NAME} — Freelance Pricing & Scope Protection Tools`,
  description: DESCRIPTION,
  verification: {
    google: "Aj3hyozFjklDX3tH4JdgwTcpRNxAk3uXxp_b2AR4y94",
  },
  alternates: {
    canonical: HUB_SITE_URL,
  },
  openGraph: {
    type: "website",
    url: HUB_SITE_URL,
    siteName: HUB_SITE_NAME,
    title: `${HUB_SITE_NAME} — Price Projects & Stop Scope Creep`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${HUB_SITE_NAME} — Price Projects & Stop Scope Creep`,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-canvas text-ink min-h-screen flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
