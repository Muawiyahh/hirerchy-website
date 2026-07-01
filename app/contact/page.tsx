import type { Metadata } from "next";
import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about Hirerchy? Get in touch — we usually reply within a business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your search"
        sub="Have a question before you start? Send us a note and a real person will get back to you."
      />

      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          <Reveal>
            <div className="space-y-4">
              <ContactItem icon="pen" title="Email us" value={site.email} href={`mailto:${site.email}`} />
              <ContactItem
                icon="users"
                title="Already a client?"
                value="Open your client portal"
                href={site.portalUrl}
              />
              <ContactItem
                icon="doc"
                title="Just exploring?"
                value="Get a free resume review"
                href="/free-review"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink">Send a message</h2>
              <p className="mt-1 text-sm text-muted">We typically reply within one business day.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactItem({
  icon,
  title,
  value,
  href,
  external,
}: {
  icon: string;
  title: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-4 rounded-card border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/25">
        <Icon name={icon} size={20} />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wider text-muted">{title}</span>
        <span className="block text-sm font-semibold text-ink">{value}</span>
      </span>
    </a>
  );
}
