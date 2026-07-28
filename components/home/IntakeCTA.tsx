import Reveal from "@/components/Reveal";
import { Button, Wrap } from "@/components/ui";
import { intake, site } from "@/lib/content";

/** Closing navy panel. `showTagline` is off on the pricing page, which repeats
 *  this panel without the "Apply less. Interview more." line. */
export default function IntakeCTA({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <section id="intake" className="py-20">
      <Wrap>
        <Reveal className="rounded-[14px] bg-navy px-6 py-9 text-center sm:p-14">
          <h2 className="font-display mb-4 text-[26px] font-extrabold text-bg wide:text-4xl">
            {intake.title}
          </h2>
          {showTagline && (
            <p className="font-display mx-auto mb-3.5 text-[19px] font-bold text-accent-2">
              {intake.tagline}
            </p>
          )}
          <p className="mx-auto mb-8 max-w-[48ch] text-base text-bg/80">{intake.body}</p>
          <Button href={site.portalUrl} variant="gold" external>
            {intake.cta}
          </Button>
        </Reveal>
      </Wrap>
    </section>
  );
}
