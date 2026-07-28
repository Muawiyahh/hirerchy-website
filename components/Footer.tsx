import Link from "next/link";
import { site } from "@/lib/content";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Service",
    links: [
      { label: "What we handle", href: "/#services" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Process", href: "/#process" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Proof",
    links: [
      { label: "Results", href: "/results" },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "Our promise", href: "/#guarantee" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Free resume review", href: "/free-review" },
      { label: "Start your intake", href: "/#intake" },
      { label: "Contact", href: "/contact" },
      { label: "Client login", href: `${site.portalUrl}?view=signin` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border pb-10 pt-14">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="font-display text-[13px] font-extrabold uppercase tracking-[0.06em] text-accent">
                {col.title}
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13.5px] text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="text-[13px] text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            <Link href={site.privacyUrl} className="text-[13px] text-muted transition-colors hover:text-ink">
              Privacy policy
            </Link>
            <Link href={site.termsUrl} className="text-[13px] text-muted transition-colors hover:text-ink">
              Terms of service
            </Link>
            <a href={`mailto:${site.email}`} className="text-[13px] text-muted transition-colors hover:text-ink">
              {site.email}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
