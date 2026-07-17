"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./BrandMark";
import { site } from "@/lib/content";

const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Results", href: "/results" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free review", href: "/free-review" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Hirerchy home" onClick={() => setOpen(false)}>
          <Wordmark size="lg" />
        </Link>

        {/* desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`${site.portalUrl}?view=signin`}
            aria-current={pathname?.startsWith("/portal") ? "page" : undefined}
            className={`text-sm font-medium transition-colors ${
              pathname?.startsWith("/portal") ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Client login
          </a>
          <a
            href={site.portalUrl}
            className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,31,61,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-2"
          >
            Get started
          </a>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-border text-ink md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-border bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-navy/[0.04]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <a
                href={`${site.portalUrl}?view=signin`}
                className="rounded-full px-4 py-3 text-center text-sm font-semibold text-ink ring-1 ring-border"
              >
                Client login
              </a>
              <a
                href={site.portalUrl}
                className="rounded-full bg-navy px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
