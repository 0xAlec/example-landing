import type { Metadata, Viewport } from "next";
import { Geist, Nunito } from "next/font/google";

import styles from "./landing.module.css";
import { NoriLanding } from "@/components/landing/nori/NoriLanding";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_IMAGE,
} from "@/lib/site-metadata";

const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-loaded",
  weight: "variable",
});

const nunito = Nunito({
  display: "swap",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-nunito-loaded",
  weight: "variable",
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/brand/desa-apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SOCIAL_IMAGE.url,
        alt: SOCIAL_IMAGE.alt,
      },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FFF5E3",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL.href,
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return (
    <div
      className={`${styles.landingPage} ${geist.variable} ${nunito.variable}`}
      data-landing-page
      data-theme="light"
    >
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</gu, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <NoriLanding />
    </div>
  );
}
