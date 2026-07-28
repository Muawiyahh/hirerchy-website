import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "@/components/ui";
import { pillars, selectionPromise } from "@/lib/content";

/** Speed + hand-curation, then the promise itself spelled out in the cream box. */
export default function Promise() {
  return (
    <Section id="guarantee">
      <Reveal>
        <SectionHead
          eyebrow="Our promise"
          title="We hand pick every role, or we redo the week for free."
          sub={
            <>
              <strong className="font-bold text-ink">
                Here is the actual promise: a real person reviews every job before we apply, so what
                goes out is pinpoint accurate, and if you are not happy with a week&apos;s picks, we
                redo them at no charge.
              </strong>{" "}
              This is the part of the service we built first and trust the most, speed on the roles
              that matter, and zero effort wasted on the ones that never would.
            </>
          }
        />
      </Reveal>

      <div className="mb-10 grid gap-6 wide:grid-cols-2">
        {pillars.map((p, i) => (
          <Reveal
            key={p.tag}
            delay={i * 70}
            className="rounded-xl bg-navy px-[30px] py-[34px] text-white"
          >
            <div className="font-display mb-4 text-xs font-bold tracking-[0.08em] text-accent-2">
              {p.tag}
            </div>
            <h3 className="mb-3.5 text-[19px] font-bold leading-[1.3] text-white">{p.title}</h3>
            <p className="text-[14.5px] text-[#c7d0e0]">{p.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="rounded-[10px] border-2 border-accent bg-cream p-6 sm:p-9">
        <span className="font-display mb-5 inline-block rounded bg-accent px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-navy">
          SELECTION PROMISE
        </span>
        <ul className="mt-[18px] list-disc pl-[22px] marker:text-accent">
          {selectionPromise.map((item) => (
            <li key={item} className="mb-3 text-[15.5px] text-ink">
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
