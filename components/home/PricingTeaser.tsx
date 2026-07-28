import Reveal from "@/components/Reveal";
import { Button, Section, SectionHead } from "@/components/ui";

export default function PricingTeaser() {
  return (
    <Section id="pricing">
      <Reveal>
        <SectionHead
          eyebrow="Pricing"
          title="Real people running your applications. Honest pricing to match."
          sub={
            <>
              Rookie, Pro, Champion, and Legend, built to be one of the most affordable
              done-for-you job application services around.{" "}
              <strong className="font-bold text-ink">
                Full breakdown, live 4 vs 8-week comparison, and every feature side by side.
              </strong>
            </>
          }
        />
      </Reveal>
      <Reveal>
        <Button href="/pricing" variant="gold">
          See full pricing
        </Button>
      </Reveal>
    </Section>
  );
}
