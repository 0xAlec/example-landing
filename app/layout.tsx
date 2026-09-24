import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site-metadata";
import "@/styles/site.css";
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/images/lisbon.webp",
        width: 1800,
        height: 600,
        alt: "Illustrated Lisbon rooftops beside the river",
      },
    ],
  },
};
export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
