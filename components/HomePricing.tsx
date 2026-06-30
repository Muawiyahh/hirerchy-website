import Reveal from "./Reveal";
import PricingCards from "./PricingCards";
import { Section, Heading, Button } from "./ui";

export default function HomePricing() {
  return (
    <Section id="pricing" className="border-t border-border/60">
      <Reveal>
        <Heading
          center
          eyebrow="Pricing"
          title="Simple plans. Real outcomes."
          sub="Pick the level of support you want. Cancel anytime — no long contracts."
        />
      </Reveal>
      <div className="mt-14">
        <PricingCards />
      </div>
      <div className="mt-8 text-center">
        <Button href="/pricing" variant="ghost">
          Compare plans in detail
        </Button>
      </div>
    </Section>
  );
}
