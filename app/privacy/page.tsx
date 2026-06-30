import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Hirerchy collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "June 9, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />

      <section className="px-5 pb-24 sm:px-8">
        <div className="prose-hirerchy mx-auto w-full max-w-3xl">
          <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <p>
            This Privacy Policy explains how Hirerchy (&ldquo;Hirerchy,&rdquo;
            &ldquo;we&rdquo;) handles personal information across our website, our
            client portal, and the Hirerchy Autofill browser extension. Hirerchy
            provides a service in which authorized team members help complete online
            job applications on behalf of our clients.
          </p>

          <Callout>
            This policy covers: <strong>website visitors</strong> who contact us or
            request a free resume review; <strong>clients</strong>, whose information
            is processed so applications can be completed for them; and{" "}
            <strong>authorized team members</strong> who complete those applications.
          </Callout>

          <H2>1. Information we collect</H2>
          <p>From <strong>website visitors</strong>, when you submit a contact form or
          request a free resume review, we collect the details you provide — typically
          your name, email, target role, any links you share, and your message.</p>
          <p>From <strong>clients</strong>, through the client portal (or entered by
          Hirerchy on your behalf), we may handle:</p>
          <Ul items={[
            "Identity and contact details — name, email, phone, and mailing address.",
            "Work-eligibility information — work authorization status, visa/sponsorship details, and related answers.",
            "Professional information — work history, education, skills, and links (e.g., LinkedIn, portfolio).",
            "Documents — résumé and cover letter files you choose to upload.",
            "Voluntary demographic information — used only to complete equal-opportunity questions where an application asks for them. Providing this is optional.",
          ]} />
          <p>
            The browser extension does <strong>not</strong> collect browsing history,
            and does not read or transmit page contents beyond the form fields it fills
            when a team member triggers it.
          </p>

          <H2>2. How we use information</H2>
          <p>
            We use your information to respond to your enquiries and reviews, and — for
            clients — for a single core purpose: to complete job application forms on
            your behalf. When an authorized team member clicks &ldquo;Autofill,&rdquo;
            the extension retrieves the selected client&apos;s saved profile and enters
            the relevant values into the application being viewed.
          </p>
          <p>We do not use your information for advertising, and we do not sell it.</p>

          <H2>3. Who can access information</H2>
          <p>
            Profile information is stored in Hirerchy&apos;s backend, hosted on Supabase,
            and protected by authenticated access. It can be accessed by the client (who
            can view and edit their own profile in the portal) and by authorized Hirerchy
            team members assigned to that client. Website form submissions are accessible
            only to Hirerchy.
          </p>

          <H2>4. Information sharing and disclosure</H2>
          <Ul items={[
            "We do not sell personal information.",
            "Client information is transmitted only between the extension and Hirerchy's backend, and into the job application website being completed when a team member triggers autofill.",
            "Once an application is submitted, the information in that form is handled by the relevant employer or job platform under their own privacy policy.",
            "We may disclose information if required by law.",
          ]} />

          <H2>5. Data retention and deletion</H2>
          <p>
            A client&apos;s profile is retained while their account is active. You can
            review, update, or remove your information at any time through the portal, or
            by contacting us to request deletion. Website enquiries are retained only as
            long as needed to respond and keep reasonable records.
          </p>

          <H2>6. Security</H2>
          <p>
            We use industry-standard measures, including encrypted connections (HTTPS) and
            authenticated access. No method of transmission or storage is completely
            secure, but we work to protect your data against unauthorized access.
          </p>

          <H2>7. Children&apos;s privacy</H2>
          <p>
            Our service is intended for adult job seekers and is not directed to children
            under 16. We do not knowingly collect information from children.
          </p>

          <H2>8. Changes to this policy</H2>
          <p>
            We may update this policy from time to time. Material changes will be reflected
            by updating the &ldquo;Last updated&rdquo; date above.
          </p>

          <H2>9. Contact us</H2>
          <p>
            Questions about this policy or your data? Email us at{" "}
            <a className="text-accent hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>

          <Callout>
            Note: The browser extension is distributed privately to Hirerchy clients and
            their authorized team members and requires sign-in to function.
          </Callout>

          <p className="mt-12 text-sm text-muted">© {new Date().getFullYear()} Hirerchy. All rights reserved.</p>
        </div>
      </section>
    </>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-bold text-ink">{children}</h2>;
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-border border-l-[3px] border-l-accent bg-surface/50 px-5 py-4 text-sm text-muted">
      {children}
    </div>
  );
}
function Ul({ items }: { items: string[] }) {
  return (
    <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] text-ink/85 marker:text-accent">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}
