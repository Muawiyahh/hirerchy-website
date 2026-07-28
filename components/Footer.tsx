import Link from "next/link";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 px-6">
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
    </footer>
  );
}
