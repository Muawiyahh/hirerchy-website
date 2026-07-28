import Reveal from "@/components/Reveal";
import { SectionHead, Wrap } from "@/components/ui";
import { trustedCompanies, trustDisclaimer } from "@/lib/content";

/** Navy band of company chips — a gold sheen sweeps across each name in turn. */
export default function Trusted() {
  return (
    <section id="trusted" className="border-b border-accent-2/20 bg-navy py-20">
      <Wrap>
        <Reveal>
          <SectionHead
            onDark
            eyebrow="Real results"
            title="Where our clients have interviewed"
            sub="A selection of the companies our clients have interviewed with through Hirerchy."
          />
        </Reveal>

        <div className="flex flex-wrap justify-center gap-4">
          {trustedCompanies.map((name, i) => (
            <div
              key={name}
              className="flex items-center justify-center rounded-xl border border-accent-2/[0.28] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-4 py-[11px] backdrop-blur-[6px] transition duration-[250ms] hover:-translate-y-1.5 hover:border-accent-2 hover:shadow-[0_18px_36px_rgba(201,154,61,0.28)] sm:px-[22px] sm:py-3.5"
            >
              <span
                className="trust-name font-display whitespace-nowrap text-xs font-extrabold tracking-[0.01em] sm:text-[13px]"
                /* stagger the sheen so the wall shimmers rather than pulsing as one */
                style={{ animationDelay: `${-((i * 1.2) % 7)}s` }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#8b96ac]">{trustDisclaimer}</p>
      </Wrap>
    </section>
  );
}
