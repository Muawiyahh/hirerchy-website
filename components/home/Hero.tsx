import CountUp from "@/components/CountUp";
import { Button, Wrap } from "@/components/ui";
import { hero } from "@/lib/content";

export default function Hero() {
  return (
    <section className="border-b border-border pb-[60px] pt-[76px]">
      <Wrap className="grid items-center gap-12 wide:grid-cols-[1.1fr_0.75fr]">
        <div>
          {/* The four words drop in one after another; "Succeed." keeps glowing. */}
          <div className="font-display mb-[18px] flex flex-wrap gap-x-4 text-[30px] font-extrabold uppercase leading-[1.1] text-accent wide:text-[52px]">
            {hero.words.map((w, i) => (
              <span
                key={w}
                className={`tag-word ${i === hero.words.length - 1 ? "tag-succeed" : ""}`}
              >
                {w}
              </span>
            ))}
          </div>

          <p className="font-display mb-4 text-base font-bold text-muted wide:text-[19px]">
            {hero.tagline}
          </p>

          <h1 className="mb-[22px] text-2xl font-semibold leading-[1.2] tracking-[-0.005em] text-ink wide:text-[32px]">
            {hero.title}
          </h1>

          <p className="mb-8 max-w-[48ch] text-[17.5px] text-muted">{hero.lead}</p>

          <div className="flex flex-wrap gap-3.5">
            <Button href="#intake">Start your intake</Button>
            <Button href="#guarantee" variant="ghost">
              See our promise
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[320px] rounded-[14px] bg-navy px-6 py-11 text-center shadow-[0_24px_48px_rgba(11,31,63,0.18)] wide:max-w-none wide:-rotate-[2.5deg]">
          <CountUp
            value={hero.statNumber}
            duration={2600}
            trigger="load"
            className="font-display block text-[84px] font-extrabold leading-[0.9] tracking-[-0.02em] text-accent-2 wide:text-[108px]"
          />
          <div className="font-display mt-4 text-base font-semibold text-bg">{hero.statLabel}</div>
          <div className="mt-2 text-[12.5px] text-bg/60">{hero.statSub}</div>
        </div>
      </Wrap>
    </section>
  );
}
