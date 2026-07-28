"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./BrandMark";
import LiveCount from "./LiveCount";
import { site } from "@/lib/content";
import { getSession, portal, portalConfigured } from "@/lib/portal";

/* Home-page anchors plus the standalone pages. Kept to five so the bar still
   fits on one line at the narrow desktop widths the design was drawn at —
   everything else hangs off the footer. */
const NAV = [
  { label: "What we handle", href: "/#services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Results", href: "/results" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  // Gate the auth buttons until we know the session, so a signed-in client never
  // flashes the logged-out "Log in / Sign up" buttons on load. If the portal
  // isn't configured there's no session to resolve, so reveal immediately.
  const [authReady, setAuthReady] = useState(!portalConfigured);

  // Track the client-portal session so we can hide "Sign up" and swap
  // "Log in" → "My profile" while a client is signed in.
  useEffect(() => {
    if (!portalConfigured) return;
    let mounted = true;
    getSession()
      .then((s) => { if (mounted) { setLoggedIn(!!s); setAuthReady(true); } })
      .catch(() => { if (mounted) setAuthReady(true); });
    const { data } = portal().auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);

  const inPortal = pathname?.startsWith("/portal") ?? false;
  const loginHref = loggedIn ? site.portalUrl : `${site.portalUrl}?view=signin`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/[0.92] backdrop-blur-[6px]">
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-6 py-3">
          <Link href="/" aria-label="Hirerchy home" onClick={() => setOpen(false)}>
            <Wordmark size="lg" />
          </Link>

          {/* desktop nav */}
          <div className="hidden items-center gap-7 md:flex">
            <nav className="flex items-center gap-7">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap text-sm text-ink/75 transition-opacity hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3.5">
              {authReady && (
                <>
                  <a href={loginHref} className="whitespace-nowrap text-sm font-semibold text-ink/80 transition-opacity hover:text-ink">
                    {loggedIn ? "My profile" : "Log in"}
                  </a>
                  {!loggedIn && (
                    <a
                      href={site.portalUrl}
                      className="font-display whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-accent-2"
                    >
                      Sign up
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex h-[34px] w-[34px] shrink-0 flex-col items-stretch justify-center gap-[5px] md:hidden"
          >
            <span className={`block h-0.5 rounded-sm bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 rounded-sm bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 rounded-sm bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* mobile menu */}
        {open && (
          <div id="site-nav" className="mx-auto w-full max-w-[1080px] px-6 pb-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-t border-border py-3.5 text-[15px] text-ink"
              >
                {item.label}
              </Link>
            ))}
            {authReady && (
              <>
                <a
                  href={loginHref}
                  className="block border-t border-border py-3.5 text-[15px] font-semibold text-ink"
                >
                  {loggedIn ? "My profile" : "Log in"}
                </a>
                {!loggedIn && (
                  <a
                    href={site.portalUrl}
                    className="font-display mb-1 mt-2.5 block rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-navy"
                  >
                    Sign up
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </header>

      {/* Live application count — marketing surfaces only; it would just be noise
          above a signed-in client's dashboard. */}
      {!inPortal && (
        <div className="border-b border-accent/35 bg-[linear-gradient(180deg,#081426_0%,#0b1f3f_100%)] py-3.5">
          <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-center gap-3.5 px-6">
            <span className="live-dot h-[9px] w-[9px] shrink-0 rounded-full bg-[#3ddc84] shadow-[0_0_8px_rgba(61,220,132,0.9)]" />
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-bg/65 sm:text-[13px]">
              Live application count
            </span>
            <LiveCount />
          </div>
        </div>
      )}
    </>
  );
}
