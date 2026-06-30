import Reveal from "./Reveal";
import { Section, Heading } from "./ui";
import { testimonials } from "@/lib/content";

export default function Testimonials({
  withHeading = true,
}: {
  withHeading?: boolean;
}) {
  return (
    <Section id="testimonials" className="border-t border-border/60">
      {withHeading && (
        <Reveal>
          <Heading
            center
            eyebrow="In their words"
            title="People who stopped applying — and started interviewing"
          />
        </Reveal>
      )}

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal as="div" key={i} delay={i * 90}>
            <figure className="flex h-full flex-col rounded-card border border-border bg-surface/60 p-6">
              <div className="mb-4 flex gap-0.5 text-accent" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.4 21.2 6.7 14l-5-4.8 7-.9z" />
                  </svg>
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-ink/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-ink">{t.name}</div>
                    <div className="text-xs text-success">{t.detail}</div>
                  </div>
                  {t.linkedin && (
                    <a
                      href={t.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                      aria-label={`${t.name} on LinkedIn`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 17V10H6v7h2.34zM7.17 8.9a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72zM18 17v-3.86c0-2.06-1.1-3.02-2.57-3.02a2.22 2.22 0 0 0-2 1.1V10H11.1c.03.66 0 7 0 7h2.33v-3.91c0-.21.02-.42.08-.57.17-.42.55-.85 1.2-.85.84 0 1.18.64 1.18 1.58V17H18z" /></svg>
                      Verify
                    </a>
                  )}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
