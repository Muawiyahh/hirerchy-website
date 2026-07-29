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
   AND keep you legally safe vs. a round, unprovable claim.
   ════════════════════════════════════════════════════════════════════════════ */

export const site = {
  name: "Hirerchy",
  tagline: "We get you interviews",
  description:
    "Hirerchy is a done-for-you job-application agency. We rebuild your resume, write tailored cover letters, and apply to up to 120 roles a week on your behalf — so you spend your time in interviews, not in application forms.",
  url: "https://hirerchy.com", // TODO: set your real domain
  email: "hirerchy@gmail.com", // contact email
  portalUrl: "/portal", // client portal — now bundled into this site at /portal
  privacyUrl: "/privacy",
};

/* ── Headline numbers (shown in the hero stat bar & proof page) ────────────── */
export const stats = {
  callbackRate: 95,
  callbackRateLabel: "of clients get an interview callback in 4–8 weeks",
  appsPerWeek: 120,
  appsPerWeekLabel: "applications a week on Pro, Champion & Legend",
  hoursReclaimed: 40,
  hoursReclaimedLabel: "hours a week reclaimed from searching & applying",
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
    body: "Our team rewrites your resume to beat the filters, drafts tailored cover letters, then hand-applies to up to 120 matched roles every week under your name. No bots spraying junk — real, targeted applications.",
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
    title: "Cover letters that fit the role",
    body: "One strong, generalized letter on Rookie and Pro; a fresh one written for every single application on Champion and Legend.",
    icon: "pen",
  },
  {
    title: "Up to 120 applications a week",
    body: "We hand-apply to a high volume of carefully matched roles every single week on your behalf.",
    icon: "bolt",
  },
  {
    title: "Live application tracker",
    body: "A private dashboard showing every company, role, date applied and status — updated as we go.",
    icon: "chart",
  },
  {
    title: "LinkedIn profile rebuild",
    body: "We sharpen your headline, About section and keywords so recruiters find you too. Included on Champion and Legend.",
    icon: "link",
  },
  {
    title: "A real human team",
    body: "You're assigned to people who know your search — not a faceless queue. Message us anytime.",
    icon: "users",
  },
];

/* ── Pricing ───────────────────────────────────────────────────────────────
   Four tiers, priced per week and sold in 4-week or 8-week terms (8 weeks
   saves 10%). `badge` marks a card; `rollUp` is the "everything in X" line. */
export type Plan = {
  name: string;
  blurb: string;
  perWeek: { "4": string; "8": string };
  total: { "4": string; "8": string };
  rollUp?: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
};

export const plans: Plan[] = [
  {
    name: "Rookie",
    blurb: "Get in the game and start applying.",
    perWeek: { "4": "$30", "8": "$27" },
    total: { "4": "$120 total · 4 weeks", "8": "$216 total · 8 weeks" },
    features: [
      "60 targeted applications every week",
      "Full ATS resume rebuild (free)",
      "Free introduction call before we start",
      "One strong, generalized cover letter",
      "Live application tracker",
    ],
    cta: "Start with Rookie",
  },
  {
    name: "Pro",
    blurb: "Double the reach. Same sharp aim.",
    perWeek: { "4": "$60", "8": "$54" },
    total: { "4": "$240 total · 4 weeks", "8": "$432 total · 8 weeks" },
    rollUp: "Everything in Rookie, plus:",
    features: [
      "120 targeted applications every week",
      "Broader targeting across more job boards and company career sites",
      "Faster turnaround on roles as they go live",
      "Monthly strategy call with your specialist",
    ],
    cta: "Start with Pro",
    featured: true,
    badge: "Most popular",
  },
  {
    name: "Champion",
    blurb: "Same volume as Pro, treated like the most important search in the building.",
    perWeek: { "4": "$85", "8": "$76.50" },
    total: { "4": "$340 total · 4 weeks", "8": "$612 total · 8 weeks" },
    rollUp: "Everything in Pro, plus:",
    features: [
      "Cover letter tailored per application",
      "LinkedIn profile rebuild aligned to your new resume",
      "One dedicated specialist, start to finish",
    ],
    cta: "Start with Champion",
    badge: "Best value",
  },
  {
    name: "Legend",
    blurb: "Every single application built like it is the only one that matters.",
    perWeek: { "4": "$120", "8": "$108" },
    total: { "4": "$480 total · 4 weeks", "8": "$864 total · 8 weeks" },
    rollUp: "Everything in Champion, plus:",
    features: [
      "Resume tailored individually for every application",
      "Priority queue — your applications go out first each day",
      "Strategy calls every two weeks",
    ],
    cta: "Start with Legend",
    badge: "White glove",
  },
];

export const guarantee = {
  title: "The selection promise",
  body: "A real person reviews every job before we apply, so what goes out is pinpoint accurate. If you're not happy with a week's picks, we redo that week's applications free of charge. We can't promise a specific number of interviews — hiring decisions are the employer's — but we can promise the work.",
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
    a: "No. A real person reviews every role before we apply, and we skip the dead-end postings and ghost jobs. Rookie and Pro include one strong generalized cover letter; on Champion and Legend a fresh one is written for every single application.",
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
    q: "What if I don't like the roles you picked?",
    a: "Tell us and we redo that week's applications free of charge. You can also send us specific postings you want us to apply to, and we'll include those alongside our own picks.",
  },
  {
    q: "Do you guarantee I'll get a job?",
    a: "No, and be wary of anyone who does — hiring decisions belong to employers. What we guarantee is the work: hand-picked roles, applications submitted within hours of a posting going live, and a redo at no cost if a week's selection misses the mark.",
  },
];

/* ── Where clients have interviewed ────────────────────────────────────────── */
export const trustedCompanies = [
  "KKR", "Amazon", "AIG", "Aon", "Ericsson", "JB Hunt", "ADT", "Sanofi",
  "Advance Auto Parts", "Schneider Electric", "The Keystone Group", "West Monroe",
  "PMI U.S.", "Target Optical",
];

export const trustDisclaimer =
  "Company names reflect individual client interview outcomes and do not imply any partnership, sponsorship, or endorsement.";

/* ── Why this matters — the state of the job market ────────────────────────── */
export const whyStats = [
  { num: "75%", label: "of resumes are filtered out by applicant tracking software before a human ever reads them." },
  { num: "250+", label: "people apply to the average corporate job posting. You are one name in a very long line." },
  { num: "2 to 3%", label: "of applicants ever hear back with an interview, regardless of how qualified they actually are." },
  { num: "2–3x", label: "more interview opportunities for applicants who apply within 24 to 48 hours of a posting going live." },
  { num: "2x", label: "more interviews per application when it is targeted to the specific role, instead of a generic resume." },
  { num: "3x", label: "as many applicants competing for every single hire today compared to 2021, and the number keeps climbing." },
  { num: "50%", label: "less likely candidates are to reach the interview stage today than five years ago, same qualifications and all." },
  { num: "108 days", label: "the average time it now takes to go from starting a job search to actually receiving an offer." },
];

export const whyFootnote =
  "None of this is a reflection of your ability. It's a numbers game, and most people are playing it wrong: applying to too few roles, too slowly, with a resume the system was never built to read. That's the exact game we play for you, every single day, so the odds finally sit in your favour instead of against you.";

/* ── Our promise (the two things we get right before anything else) ────────── */
export const pillars = [
  {
    tag: "First in the door",
    title: "Applications submitted within hours of a role going live, not days later.",
    body: "The first wave of applicants gets a disproportionate share of recruiter attention, before a posting is buried under hundreds of competing resumes. We're built to move the moment a role appears — by the time most job seekers even find the listing, yours has already been through the door.",
    icon: "bolt",
  },
  {
    tag: "Chosen by a person",
    title: "Every role is picked by hand, never scraped in bulk.",
    body: "Our team personally reviews and curates the list of companies and roles we apply to every week. We skip the dead-end postings, the ghost jobs, and the companies with a track record of going silent — so every application has a genuine shot at a callback.",
    icon: "users",
  },
];

export const selectionPromise = [
  "We search and evaluate roles for you every day, screening against your background, location and target industry before anything is submitted.",
  "If you're not satisfied with the roles we selected in a given week, we redo that week's applications free of cost.",
  "You stay in control — send us specific postings you want us to apply to and we'll include those alongside our own picks.",
];

/* ── Referral program ──────────────────────────────────────────────────────── */
export const referral = {
  title: "Refer a friend, you both win",
  body: "Every client gets a referral code. When a friend signs up with it, you both get a free week of applications. Good help spreads — we just make it pay.",
};
