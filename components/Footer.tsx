import Link from "next/link";
import { Wordmark } from "./BrandMark";
import { site, referral } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Wordmark size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Done-for-you job applications. We do the search and the paperwork —
              you do the interviews.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/how-it-works" className="text-ink/80 hover:text-ink">How it works</Link></li>
              <li><Link href="/results" className="text-ink/80 hover:text-ink">Results</Link></li>
              <li><Link href="/pricing" className="text-ink/80 hover:text-ink">Pricing</Link></li>
              <li><Link href="/free-review" className="text-ink/80 hover:text-ink">Free resume review</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/contact" className="text-ink/80 hover:text-ink">Contact</Link></li>
              <li><Link href="/privacy" className="text-ink/80 hover:text-ink">Privacy</Link></li>
              <li>
                <a href={site.portalUrl} className="text-ink/80 hover:text-ink">
                  Client login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {referral.title}
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-muted">{referral.body}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>
            Powered by <strong className="font-semibold text-ink">Hirerchy</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
