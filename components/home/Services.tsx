import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "@/components/ui";
import { services, servicesNote } from "@/lib/content";

/** The four jobs we take off the client's plate. The first two are the flagship
 *  pair and sit on cream so they read as the headline offer. */
export default function Services() {
  return (
    <Section id="services">
      <Reveal>
        <SectionHead
          eyebrow="What we handle"
          title="The jobs that eat your week."
          sub={
            <>
              Searching, selecting, and submitting job applications eat into your week.{" "}
              <strong className="font-bold text-ink">We take all three off your plate</strong>, so
              you can focus on securing your interviews.
            </>
          }
        />
      </Reveal>

      {/* 1px gaps over a border-coloured backdrop draw the grid rules */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 wide:grid-cols-4">
        {services.map((s, i) => (
          <Reveal
            key={s.num}
            delay={(i % 4) * 70}
            className={`px-6 py-[30px] ${s.flagship ? "bg-cream" : "bg-surface"}`}
          >
            <div className="font-display mb-4 text-[12.5px] font-bold tracking-[0.04em] text-accent">
              {s.num}
            </div>
            <h3 className="mb-2.5 text-[17px] font-bold text-ink">{s.title}</h3>
            <p className="text-[14.5px] text-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6 border-l-[3px] border-accent pl-4 text-[14.5px] text-muted">
        {servicesNote}
      </Reveal>
    </Section>
  );
}
