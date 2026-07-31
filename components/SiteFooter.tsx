"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

/** The marketing footer has no place under a signed-in dashboard, and the
 *  portal supplies its own chrome, so it's dropped on /portal entirely. */
export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal")) return null;
  return <Footer />;
}
