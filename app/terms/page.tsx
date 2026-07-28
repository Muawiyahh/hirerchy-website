import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader, Wrap } from "@/components/ui";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Hirerchy's done-for-you job application service.",
};

const LAST_UPDATED = "July 2026";

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Terms of service" title="Terms of Service" />

      <section className="px-6 pb-24 pt-12">
        <Wrap className="prose-hirerchy max-w-3xl px-0">
          <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <p>
            These terms govern your use of Hirerchy&apos;s services. By submitting our intake form
            or working with us, you agree to the terms below.
          </p>

          <H2>What we provide</H2>
          <p>
            Hirerchy searches for, selects, and submits job applications on your behalf, based on
            the background and preferences you share with us. This includes rebuilding your resume,
            preparing a generalized cover letter, and submitting a target volume of applications
            each week, currently around 120 applications per week per client.
          </p>

          <H2>Our selection guarantee</H2>
          <div className="mt-4 rounded-[10px] border-l-4 border-accent bg-cream p-5">
            <p className="!mt-0">
              If you are not satisfied with the roles we selected for you in a given week, we will
              redo that week&apos;s applications free of cost. This guarantee applies to the roles we
              select. It does not guarantee any specific number of interviews or job offers.
            </p>
          </div>

          <H2>Your input on role selection</H2>
          <p>
            You may send us specific job postings you would like us to apply to at any time. We will
            include these alongside the roles we select ourselves.
          </p>

          <H2>What we do not guarantee</H2>
          <p>
            We work hard to submit high quality, targeted applications, and our track record so far
            shows strong results. However, we cannot guarantee that any specific application will
            result in an interview or job offer, since hiring decisions are made entirely by
            employers and are outside of our control.
          </p>

          <H2>Payment and cancellation</H2>
          <p>
            Payment terms, billing cycles, and cancellation terms are agreed separately with each
            client at the time of signup. If anything in this section is unclear, contact us
            directly before starting the service.
          </p>

          <H2>Your responsibilities</H2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-[1.75] text-muted marker:text-accent">
            <li>
              You agree to provide accurate information about your background, experience, and
              qualifications.
            </li>
            <li>
              You are responsible for reviewing your resume and cover letter before we begin
              submitting applications on your behalf.
            </li>
            <li>
              You agree to respond to interview requests and next steps in a timely manner once
              applications are submitted.
            </li>
          </ul>

          <H2>Limitation of liability</H2>
          <p>
            Hirerchy is not liable for hiring decisions made by employers, delays caused by third
            party job boards or application systems, or outcomes outside of our direct control.
          </p>

          <H2>Changes to these terms</H2>
          <p>
            We may update these terms from time to time as our services evolve. We will post the
            updated version here with a new date at the top.
          </p>

          <H2>Contact us</H2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-accent hover:underline">
              {site.email}
            </a>
            .
          </p>
        </Wrap>
      </section>
    </>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-9 text-lg font-bold text-ink">{children}</h2>
  );
}
