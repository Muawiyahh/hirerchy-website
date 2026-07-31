import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { THEME_BOOT } from "@/components/ThemeToggle";
import { site } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/* Used only by the Hirerchy wordmark, so the logotype matches the brand mark
   rather than the body copy. Everything else on the site stays Inter. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "job application service",
    "done for you job applications",
    "resume writing",
    "interview callbacks",
    "career agency",
    "Hirerchy",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} h-full`}>
      <head>
        {/* Applies the saved theme before first paint — without this the page
            renders light for a frame and then snaps to dark. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
