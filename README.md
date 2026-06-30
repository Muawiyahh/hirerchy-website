# Hirerchy — Marketing Website

The public marketing site for **Hirerchy**, the done-for-you job-application agency.
Its job is to turn a skeptical visitor into a client and funnel them into the existing
[client portal](https://hirerchy-portal.netlify.app/) for signup.

Built with **Next.js (App Router) + TypeScript + Tailwind v4**. Dark + purple theme,
matched to the client portal for visual continuity.

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev                         # http://localhost:3000
```

Build for production:

```bash
npm run build && npm run start
```

---

## ✏️ Editing copy & stats (do this before launch)

**Everything a non-developer edits lives in one file: [`lib/content.ts`](lib/content.ts).**
Headlines, stats, pricing, testimonials, FAQs and the referral blurb are all there.

> ⚠️ **The numbers are placeholders.** Every value marked `// TODO: real data` must be
> replaced with figures you can actually back up from your application tracker before you
> go live. Specific, true numbers ("9 of 10 clients got a callback in 30 days") convert
> better *and* keep you legally safe versus a round, unprovable "95%".

Key things to update in `lib/content.ts`:

- `site.url`, `site.email` — your real domain and contact email
- `stats.*` — callback rate, apps/week, totals, avg days to interview
- `weeklyVolume` — the bar chart on `/results`
- `plans` — your real prices
- `testimonials` — replace with real, permission-granted quotes; paste a real
  `linkedin` profile URL on each to show a verifiable "Verify" link (strongest trust signal)

---

## 🔌 Connecting the forms (Supabase)

The **free resume review** and **contact** forms write to a `leads` table in the existing
Hirerchy Supabase project. To enable them:

1. Open the Supabase project → **SQL Editor** and run [`supabase/leads.sql`](supabase/leads.sql).
   This creates the `leads` table with an **insert-only** policy (the public can submit,
   but can never read other people's submissions).
2. Put your Supabase URL + anon key in `.env.local` (see `.env.local.example`).
   The anon key is safe to expose in the browser.
3. New submissions appear in the Supabase **Table Editor → `leads`**.

If the env vars are missing, the forms fail gracefully with a clear message instead of crashing.

---

## 🚀 Deploy (free)

**Vercel** (recommended for Next.js):

1. Push this folder to a Git repo and import it at [vercel.com/new](https://vercel.com/new).
2. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel project settings.
3. Deploy. Point your domain at it when ready.

Netlify also works (uses `@netlify/plugin-nextjs` automatically).

---

## Project structure

```
app/
  layout.tsx          Root layout — Inter font, Navbar, Footer, SEO metadata
  page.tsx            Home (hero → proof → steps → features → pricing → FAQ → CTA)
  how-it-works/       Detailed process + dashboard preview
  results/            Proof page: stats, weekly-volume chart, before/after, testimonials
  pricing/            3 tiers, interview guarantee, referral program, FAQ
  free-review/        Lead-magnet landing + LeadForm
  contact/            ContactForm
  privacy/            Privacy policy
  globals.css         Design tokens (ported from the portal) + base styles
components/           BrandMark, Navbar, Footer, Hero, Steps, Features, PricingCards,
                      Testimonials, FAQ, StatCounter, Reveal, forms, etc.
lib/
  content.ts          ⭐ SINGLE SOURCE OF TRUTH for copy, stats, pricing, testimonials
  supabase.ts         Browser client + submitLead()
supabase/
  leads.sql           Run once to enable the forms
```

---

## Notes

- The "Get started" / "Client login" buttons link to the existing portal at
  `site.portalUrl` (set in `lib/content.ts`).
- Stat counters animate on scroll; everything respects `prefers-reduced-motion`.
- An anonymized before/after resume sample lives in `components/BeforeAfter.tsx` — swap in
  your own (still anonymized) examples when you have them.
