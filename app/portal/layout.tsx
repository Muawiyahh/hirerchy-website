import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

// The portal is a self-contained dark app. `[color-scheme:dark]` makes native
// controls (date pickers, selects, scrollbars) render dark to match.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0a0e1a] text-white [color-scheme:dark]">{children}</div>;
}
