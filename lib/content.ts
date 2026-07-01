/* ════════════════════════════════════════════════════════════════════════════
   Hirerchy — content & stats config (SINGLE SOURCE OF TRUTH)
   ────────────────────────────────────────────────────────────────────────────
   Everything a non-developer might want to edit lives here: headline copy, the
   numbers shown on the site, pricing, testimonials and FAQs. Edit this file and
   the whole site updates — you should not need to touch the components.

   ⚠️  HONESTY NOTE — READ BEFORE LAUNCH
   The numbers below are PLACEHOLDERS. Replace every value marked
   `// TODO: real data` with figures you can actually substantiate from your
   application tracker. Specific, true numbers ("9 of 10 clients") convert better
   AND keep you legally safe vs. a round, unprovable "95%".
   ════════════════════════════════════════════════════════════════════════════ */

export const site = {
  name: "Hirerchy",
  tagline: "We get you interviews",
  description:
    "Hirerchy is a done-for-you job-application agency. We rebuild your resume, write tailored cover letters, and apply to 100+ roles a week on your behalf — so you spend your time in interviews, not in application forms.",
  url: "https://hirerchy.com", // TODO: set your real domain
  email: "hello@hirerchy.com", // TODO: real contact email
  portalUrl: "/portal", // client portal — now bundled into this site at /portal
  privacyUrl: "/privacy",
};

/* ── Headline numbers (shown in the hero stat bar & proof page) ────────────── */
export const stats = {
  callbackRate: 92, // TODO: real data — % of clients who got ≥1 interview callback
  callbackRateLabel: "of clients land an interview callback",
  appsPerWeek: 115, // TODO: real data — applications sent per client, per week
  appsPerWeekLabel: "applications sent per client / week",
  avgDaysToInterview: 14, // TODO: real data — avg days to first interview callback
  avgDaysLabel: "days to first interview, on average",
  totalApplications: 12480, // TODO: real data — total apps sent across all clients to date
  totalApplicationsLabel: "applications sent for clients to date",
  callbacksThisMonth: 86, // TODO: real data — interview callbacks generated this month
  clientsServed: 140, // TODO: real data — total clients served
};

/* Weekly application volume — drives the bar chart on /results.
   TODO: replace with your real weekly totals from the tracker. */
export const weeklyVolume: { week: string; applications: number }[] = [
  { week: "Wk 1", applications: 96 },
  { week: "Wk 2", applications: 104 },
  { week: "Wk 3", applications: 118 },
  { week: "Wk 4", applications: 112 },
  { week: "Wk 5", applications: 121 },
  { week: "Wk 6", applications: 117 },
  { week: "Wk 7", applications: 124 },
  { week: "Wk 8", applications: 119 },
];

/* ── How it works (3 steps) ────────────────────────────────────────────────── */
export const steps = [
  {
    n: "01",
    title: "Share your details, once",
    body: "Create your account and fill a single guided profile — your experience, target roles, locations and work authorization. Upload your current resume; that's all we need to get moving.",
  },
  {
    n: "02",
    title: "We rebuild & apply",
    body: "Our team rewrites your resume to beat the filters, drafts tailored cover letters, then hand-applies to 100+ matched roles every week under your name. No bots spraying junk — real, targeted applications.",
  },
  {
    n: "03",
    title: "You take the interviews",
    body: "Track every application in your dashboard — company, role, date and status — and watch the callbacks come in. You show up to interviews; we handle everything before them.",
  },
];

/* ── What's included ───────────────────────────────────────────────────────── */
export const features = [
  {
    title: "ATS-grade resume rebuild",
    body: "A complete rewrite engineered to pass applicant-tracking filters and land in front of a human.",
    icon: "doc",
  },
  {
    title: "Tailored cover letters",
    body: "Role-specific letters written for the jobs that matter — not one generic template on repeat.",
    icon: "pen",
  },
  {
    title: "100+ applications a week",
    body: "We hand-apply to a high volume of carefully matched roles every single week on your behalf.",
    icon: "bolt",
  },
  {
    title: "Live application tracker",
    body: "A private dashboard showing every company, role, date applied and status — updated as we go.",
    icon: "chart",
  },
  {
    title: "LinkedIn optimization",
    body: "We sharpen your headline, About section and keywords so recruiters find you, too.",
    icon: "link",
  },
  {
    title: "A real human team",
    body: "You're assigned to people who know your search — not a faceless queue. Message us anytime.",
    icon: "users",
  },
];

/* ── Pricing (placeholders — set your real prices) ─────────────────────────── */
export const plans = [
  {
    name: "Launch",
    price: "$199", // TODO: real price
    cadence: "/month",
    blurb: "Get a steady stream of applications going under your name.",
    features: [
      "60+ applications / week",
      "ATS resume rebuild (one-time)",
      "Live application tracker",
      "Email support",
    ],
    cta: "Start with Launch",
    featured: false,
  },
  {
    name: "Accelerate",
    price: "$349", // TODO: real price
    cadence: "/month",
    blurb: "Our most popular plan — more volume and the full done-for-you stack.",
    features: [
      "100+ applications / week",
      "ATS resume rebuild + ongoing tweaks",
      "Tailored cover letters",
      "LinkedIn optimization",
      "Live application tracker",
      "Priority human support",
    ],
    cta: "Start with Accelerate",
    featured: true,
  },
  {
    name: "Guaranteed",
    price: "$549", // TODO: real price
    cadence: "/month",
    blurb: "Everything in Accelerate, backed by our interview guarantee.",
    features: [
      "Everything in Accelerate",
      "120+ applications / week",
      "Interview guarantee (see below)",
      "Dedicated account manager",
      "Interview-prep session",
    ],
    cta: "Start with Guaranteed",
    featured: false,
  },
];

export const guarantee = {
  title: "The 30-day interview guarantee",
  body: "On our Guaranteed plan, if you don't receive at least one interview callback within 30 days, we keep applying for you free for another 30 — at no extra cost. We can offer this because the system works.",
};

/* ── Testimonials (replace with REAL, permission-granted quotes) ───────────── */
export const testimonials = [
  {
    quote:
      "I was sending five applications a week and hearing nothing. Hirerchy sent over a hundred and I had three interviews lined up within two weeks. It completely changed my search.",
    name: "Software Engineer", // TODO: first name + permission, or keep role-only
    detail: "3 interviews in 2 weeks",
    linkedin: "", // TODO: paste a real LinkedIn profile URL to make this verifiable
  },
  {
    quote:
      "The resume rewrite alone was worth it — I finally started getting callbacks from companies that ignored me before. Not having to fill out endless forms gave me my evenings back.",
    name: "Marketing Manager",
    detail: "Callback rate went from 0 to weekly",
    linkedin: "",
  },
  {
    quote:
      "I'm a career switcher and I had no idea how to position myself. They handled everything and I could see exactly where I'd applied in the dashboard. Landed a role in six weeks.",
    name: "Data Analyst",
    detail: "Hired in 6 weeks",
    linkedin: "",
  },
];

/* ── Outcome cards (results preview on the home page) ──────────────────────── */
export const outcomes = [
  { role: "Software Engineer", result: "3 interviews in 2 weeks" },
  { role: "Product Manager", result: "5 callbacks in month one" },
  { role: "Registered Nurse", result: "Hired in 4 weeks" },
  { role: "Financial Analyst", result: "2 final-round interviews" },
  { role: "UX Designer", result: "Interview at a FAANG company" },
  { role: "Sales Executive", result: "4 interviews, 1 offer" },
];

/* ── FAQ ───────────────────────────────────────────────────────────────────── */
export const faqs = [
  {
    q: "Do you actually apply for me, or just send me a list?",
    a: "We apply for you. Once your profile is set up, our team hand-applies to matched roles under your name every week — you don't lift a finger after onboarding.",
  },
  {
    q: "How is this different from a resume writer?",
    a: "A resume writer hands you a document and wishes you luck. We rebuild your resume AND do the applying, cover letters, LinkedIn and tracking — the whole job-search grind, done for you.",
  },
  {
    q: "Will applications look generic or spammy?",
    a: "No. These are real, targeted applications to roles that fit your goals, with tailored cover letters where it counts — not a bot blasting the same form everywhere.",
  },
  {
    q: "Can I see where you've applied?",
    a: "Yes. You get a private dashboard listing every company, role, date and status, kept up to date as we apply so you always know exactly what's happening.",
  },
  {
    q: "What do you need from me to start?",
    a: "Just a completed profile (about 15 minutes) and your current resume. We take it from there — and you can update your details anytime.",
  },
  {
    q: "What's the interview guarantee?",
    a: "On our Guaranteed plan, if you don't get at least one interview callback in 30 days, we apply for you free for another 30. Specific terms are confirmed at signup.",
  },
];

/* ── Referral program ──────────────────────────────────────────────────────── */
export const referral = {
  title: "Refer a friend, you both win",
  body: "Every client gets a referral code. When a friend signs up with it, you both get a free week of applications. Good help spreads — we just make it pay.",
};
