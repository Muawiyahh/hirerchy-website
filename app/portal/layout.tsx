import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

// The portal is just another tab of the site: the shared navbar/footer wrap it,
// and it uses the site's light navy + gold palette so it matches the rest of
// the marketing site.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[calc(100vh-68px)] bg-bg text-ink">{children}</div>;
}
