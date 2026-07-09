import Link from "next/link";
import { Wordmark } from "./BrandMark";
import { site, referral } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Wordmark size="lg" onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Done-for-you job applications. We do the search and the paperwork —
              you do the interviews.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/how-it-works" className="text-white/75 hover:text-white">How it works</Link></li>
              <li><Link href="/results" className="text-white/75 hover:text-white">Results</Link></li>
              <li><Link href="/pricing" className="text-white/75 hover:text-white">Pricing</Link></li>
              <li><Link href="/free-review" className="text-white/75 hover:text-white">Free resume review</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/contact" className="text-white/75 hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="text-white/75 hover:text-white">Privacy</Link></li>
              <li>
                <a href={site.portalUrl} className="text-white/75 hover:text-white">
                  Client login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {referral.title}
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-white/60">{referral.body}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>
            Powered by <strong className="font-semibold text-white">Hirerchy</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
