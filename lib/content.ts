/* ════════════════════════════════════════════════════════════════════════════
   Hirerchy — content & stats config (SINGLE SOURCE OF TRUTH)
   ────────────────────────────────────────────────────────────────────────────
   Everything a non-developer might want to edit lives here: headline copy, the
   numbers shown on the site, pricing, testimonials. Edit this file and the whole
   site updates — you should not need to touch the components.

   ⚠️  TESTIMONIALS are placeholder quotes. Send real ones (quote + role is
   enough) and drop them into `testimonialRows` below, keeping the same shape.
   ════════════════════════════════════════════════════════════════════════════ */

export const site = {
  name: "Hirerchy",
  tagline: "Done-for-you job applications, built to get callbacks",
  title: "Hirerchy. Done-for-you job applications, built to get callbacks.",
  description:
    "Hirerchy searches, selects, and submits up to 120 targeted job applications a week on your behalf, depending on your plan.",
  url: "https://hirerchy.com",
  email: "hirerchy@gmail.com",
  portalUrl: "/portal", // client portal — bundled into this site at /portal
  privacyUrl: "/privacy",
  termsUrl: "/terms",
};

/* Live application counter in the strip under the navbar. The number is pulled
   from a published Google Sheet CSV (first cell); `fallback` shows if that
   fetch fails for any reason. */
export const liveCount = {
  fallback: "23,000+",
  csvUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnInk-kRXy_hIDv7HJ_jHV_RaiURT8-C1PLp364Cb43SetGGzWGddDG5VvC8dnqrWy1HDr2D0SH5KL/pub?output=csv",
};

/* ── Hero ──────────────────────────────────────────────────────────────────── */
export const hero = {
  words: ["Search.", "Select.", "Submit.", "Succeed."],
  tagline: "Your job applications, on autopilot.",
  title: "We handle the first three. You handle the fourth.",
  lead: "Hirerchy searches, selects, and submits up to 120 pinpoint accurate job applications every week, depending on your plan, while you spend your time preparing for interviews instead of filling out forms.",
  statNumber: "120",
  statLabel:
    "job applications submitted every week on our Pro, Champion, and Legend plans",
  statSub: "Rookie starts at 60 a week. Every plan scales up from there.",
};

/* ── Where clients have interviewed (navy band) ────────────────────────────── */
export const trustedCompanies = [
  "KKR",
  "Amazon",
  "AIG",
  "Aon",
  "Ericsson",
  "JB Hunt",
  "ADT",
  "Sanofi",
  "Advance Auto Parts",
  "Schneider Electric",
  "The Keystone Group",
  "West Monroe",
  "PMI U.S.",
  "Target Optical",
];

export const trustDisclaimer =
  "Company names reflect individual client interview outcomes and do not imply any partnership, sponsorship, or endorsement.";

/* ── What we handle ────────────────────────────────────────────────────────── */
export const services = [
  {
    num: "01 / SEARCH & SELECT",
    title: "Search and selection",
    body: "We search and screen roles against your background every day. You no longer need to spend hours checking whether a role fits. See our promise below.",
    flagship: true,
  },
  {
    num: "02 / SUBMIT",
    title: "Application submissions",
    body: "We submit up to 120 pinpoint accurate job applications every week on your behalf, depending on your plan. That is a pace no single applicant could sustain alone.",
    flagship: true,
  },
  {
    num: "03 / RESUME",
    title: "Resume rebuild",
    body: "We rebuild your resume so it is optimized for applicant tracking systems and tailored to the roles you are targeting.",
    flagship: false,
  },
  {
    num: "04 / COVER LETTER",
    title: "Cover letter",
    body: "We write one strong, generalized cover letter built around your background. On our Champion and Legend plans, that becomes a fresh cover letter tailored to each individual application instead.",
    flagship: false,
  },
];

export const servicesNote =
  "If you would like to choose some roles yourself, send us specific postings and we will apply to those as well. Our selection is not the only source of the roles we apply to.";

/* ── The numbers (navy band) ───────────────────────────────────────────────── */
export const numbersBand = {
  headline: "That is up to 120 job applications working for you every week.",
  stats: [
    {
      num: "40 hours",
      label:
        "Reclaimed every week from manual searching, selecting, and applying, close to 7 hours back every single day.",
      foot: "",
    },
    {
      num: "95%",
      label: "Of clients receive an interview callback within the first 4 to 8 weeks.",
      foot: "This reflects our track record so far. It is not a guaranteed outcome for every case.",
    },
  ],
};

/* ── Why this matters ──────────────────────────────────────────────────────── */
export const whyStats = [
  {
    num: "75%",
    label:
      "of resumes are filtered out by applicant tracking software before a human ever reads them.",
  },
  {
    num: "250+",
    label:
      "people apply to the average corporate job posting. You are one name in a very long line.",
  },
  {
    num: "2 to 3%",
    label:
      "of applicants ever hear back with an interview, regardless of how qualified they actually are.",
  },
  {
    num: "2-3x",
    label:
      "more interview opportunities for applicants who apply within 24 to 48 hours of a posting going live, instead of waiting a week or more.",
  },
  {
    num: "2x",
    label:
      "more interviews per application when it is targeted to the specific role, instead of a generic resume sent to everything.",
  },
  {
    num: "3x",
    label:
      "as many applicants competing for every single hire today compared to 2021, and the number keeps climbing.",
  },
  {
    num: "50%",
    label:
      "less likely candidates are to reach the interview stage today than they were five years ago, same qualifications and all.",
  },
  {
    num: "108 days",
    label:
      "the average time it now takes to go from starting a job search to actually receiving an offer.",
  },
];

export const whyFootnote =
  "None of this is a reflection of your ability. It is a numbers game, and most people are playing it wrong: applying to too few roles, too slowly, with a resume the system was never built to read. That is the exact game we play for you, every single day, so the odds finally sit in your favor instead of against you.";

/* ── Our promise ───────────────────────────────────────────────────────────── */
export const pillars = [
  {
    tag: "FIRST IN THE DOOR",
    title: "Applications submitted within hours of a role going live, not days later.",
    body: "The first wave of applicants gets a disproportionate share of recruiter attention, before a posting is buried under hundreds of competing resumes. We are built to move the moment a role appears. By the time most job seekers even find the listing, yours has already been through the door.",
  },
  {
    tag: "CHOSEN BY A PERSON",
    title: "Every role is picked by hand, never scraped in bulk.",
    body: "Our team personally reviews and curates the list of companies and roles we apply to every week. We skip the dead-end postings, the ghost jobs, and the companies with a track record of going silent, so every application we send has a genuine shot at a callback, not just a spot in someone's inbox.",
  },
];

export const selectionPromise = [
  "We search and evaluate roles for you every day, screening against your background, location, and target industry before anything is submitted.",
  "If you are not satisfied with the roles we selected for you in a given week, we will redo that week's job applications free of cost.",
  "You stay in control. Send us specific postings you want us to apply to and we will include those alongside our own picks.",
];

/* ── Process (six steps) ───────────────────────────────────────────────────── */
export const steps = [
  {
    n: "1",
    title: "Intake",
    body: "You tell us your background, target roles, and current resume.",
  },
  {
    n: "2",
    title: "Build",
    body: "We rebuild your resume specifically to bypass ATS filters, plus a new cover letter.",
  },
  { n: "3", title: "Search", body: "We screen through thousands of job postings." },
  {
    n: "4",
    title: "Select",
    body: "We create a curated list of roles for that week, up to 120 depending on your plan.",
  },
  {
    n: "5",
    title: "Submit",
    body: "We submit that week's full batch of job applications on your behalf.",
  },
  {
    n: "6",
    title: "Interview",
    body: "You show up prepared for conversations, not cold job applications.",
  },
];

/* ── Testimonials — two marquee rows, second one scrolls the other way ─────── */
export const testimonialRows: { quote: string; who: string }[][] = [
  [
    {
      quote:
        "I didn't have time to apply to dozens of roles every week. Hirerchy did it for me, and I started getting responses within weeks.",
      who: "Business Student",
    },
    {
      quote:
        "I had no idea where to even start my job search. Having someone handle the applications took so much pressure off.",
      who: "Recent Graduate",
    },
    {
      quote:
        "Between work and everything else, I simply couldn't keep up with applying consistently. This filled that gap completely.",
      who: "Finance Professional",
    },
    {
      quote:
        "The volume of applications going out every week was something I could never have managed on my own.",
      who: "Software Engineer",
    },
  ],
  [
    {
      quote:
        "I was skeptical at first, but the process felt genuinely thoughtful, not just a numbers game.",
      who: "Marketing Student",
    },
    {
      quote:
        "I got my first interview request within the second week, and it only kept going from there.",
      who: "Data Analyst",
    },
    {
      quote: "Job searching used to eat my evenings. Now that time is actually mine again.",
      who: "Operations Coordinator",
    },
    {
      quote:
        "It felt like having a dedicated team working on my job search in the background.",
      who: "Consulting Analyst",
    },
  ],
];

export const testimonialBadge = "95% receive a callback in 4 to 8 weeks";

/* ── Pricing ───────────────────────────────────────────────────────────────── */
export const pricingHero = {
  title: "Real people running your applications. Honest pricing to match.",
  lead: "No bots blasting your resume into the void, and no hidden fees buried in fine print. Every plan is handled by an actual specialist, priced to be one of the most affordable done-for-you job application services out there, without cutting corners.",
  stats: [
    { big: "0", label: "automated bots touching your job applications, ever" },
    { big: "100%", label: "of job applications hand reviewed before they go out" },
    { big: "24 hours", label: "our typical window to apply once a role goes live" },
  ],
};

export type Plan = {
  tier: string;
  name: string;
  tagline: string;
  /** per-week price on the 4-week and 8-week terms */
  perWeek: { "4": string; "8": string };
  /** total line under the price, per term */
  total: { "4": string; "8": string };
  badge?: string;
  /** first entry may be an "Everything in X, plus:" roll-up line */
  features: string[];
  rollUp?: string;
};

export const plans: Plan[] = [
  {
    tier: "TIER 01 / ROOKIE",
    name: "Rookie",
    tagline: "Get in the game and start applying.",
    perWeek: { "4": "$30", "8": "$27" },
    total: { "4": "$120 total · 4 weeks", "8": "$216 total · 8 weeks" },
    features: [
      "60 targeted job applications every week",
      "Full resume rebuild, optimized for applicant tracking systems|Free",
      "Free introduction call before we start|Free",
      "One strong, generalized cover letter built around your background",
      "Weekly dashboard access to track every application",
    ],
  },
  {
    tier: "TIER 02 / PRO",
    name: "Pro",
    tagline: "Double the reach. Same sharp aim.",
    perWeek: { "4": "$60", "8": "$54" },
    total: { "4": "$240 total · 4 weeks", "8": "$432 total · 8 weeks" },
    badge: "Most Popular",
    rollUp: "Everything in Rookie, plus:",
    features: [
      "120 targeted job applications every week, double the volume",
      "Broader targeting across more job boards and direct company career sites",
      "Faster turnaround catching new roles as they go live",
      "Monthly strategy call with your specialist",
    ],
  },
  {
    tier: "TIER 03 / CHAMPION",
    name: "Champion",
    tagline:
      "Same volume as Pro. Treated like the most important search in the building.",
    perWeek: { "4": "$85", "8": "$76.50" },
    total: { "4": "$340 total · 4 weeks", "8": "$612 total · 8 weeks" },
    badge: "Best Value",
    rollUp: "Everything in Pro, plus:",
    features: [
      "Cover letter tailored per application, not just once",
      "LinkedIn profile rebuild aligned to your new resume",
      "One dedicated specialist handles everything for you, start to finish",
    ],
  },
  {
    tier: "TIER 04 / LEGEND",
    name: "Legend",
    tagline: "Every single application, built like it is the only one that matters.",
    perWeek: { "4": "$120", "8": "$108" },
    total: { "4": "$480 total · 4 weeks", "8": "$864 total · 8 weeks" },
    badge: "White Glove",
    rollUp: "Everything in Champion, plus:",
    features: [
      "Your resume rebuilt and tailored individually for every single application, not just the cover letter",
      "Priority queue, your applications go out ahead of every other plan each day",
      "Strategy calls every two weeks instead of monthly",
    ],
  },
];

/* Side-by-side comparison. `cells` are in plan order: Rookie, Pro, Champion,
   Legend. Use "yes" / "no" for a tick or a dash. */
export const compareGroups: {
  group: string;
  rows: { title: string; sub: string; cells: string[] }[];
}[] = [
  {
    group: "Volume & speed",
    rows: [
      {
        title: "Job applications per week",
        sub: "How many roles we apply to for you, every single week.",
        cells: ["60", "120", "120", "120"],
      },
      {
        title: "Speed on fresh postings",
        sub: "How quickly we get your application in once a role goes live.",
        cells: ["Standard", "Faster", "Faster", "Priority queue"],
      },
    ],
  },
  {
    group: "Resume & cover letter",
    rows: [
      {
        title: "Resume rebuild & ATS optimization",
        sub: "A professional resume rebuild so it actually gets past the screening software. Free, included on every plan.",
        cells: ["yes", "yes", "yes", "yes"],
      },
      {
        title: "Resume tailored per application",
        sub: "Your resume individually rewritten for each specific job, not just kept generic.",
        cells: ["no", "no", "no", "yes"],
      },
      {
        title: "Cover letter",
        sub: "Whether you get one all purpose cover letter, or a fresh one written for every single application.",
        cells: [
          "One, generalized",
          "One, generalized",
          "Tailored per application",
          "Tailored per application",
        ],
      },
      {
        title: "LinkedIn profile rebuild",
        sub: "We rewrite your LinkedIn profile to match your new resume.",
        cells: ["no", "no", "yes", "yes"],
      },
    ],
  },
  {
    group: "Support & access",
    rows: [
      {
        title: "Free introduction call",
        sub: "A quick call before we start, so your specialist understands your background and goals.",
        cells: ["yes", "yes", "yes", "yes"],
      },
      {
        title: "Same specialist, start to finish",
        sub: "One person owns your account the whole way through, instead of being passed around.",
        cells: ["no", "no", "yes", "yes"],
      },
      {
        title: "Direct manager messaging",
        sub: "Message your manager directly with questions or updates, any time.",
        cells: ["yes", "yes", "yes", "yes"],
      },
      {
        title: "Weekly dashboard access",
        sub: "Track every application we send, updated every week.",
        cells: ["yes", "yes", "yes", "yes"],
      },
      {
        title: "Specialist strategy calls",
        sub: "A recurring call with your specialist to review what is working and adjust the plan.",
        cells: ["no", "Monthly", "Monthly", "Every 2 weeks"],
      },
    ],
  },
];

export const pricingFootnote =
  "Need something longer than 8 weeks, or a plan built around a specific industry push? Message us after your intake and we will put a custom runway together.";

/* ── Closing CTA ───────────────────────────────────────────────────────────── */
export const intake = {
  title: "Start your intake.",
  tagline: "Apply less. Interview more.",
  body: "Fill out our intake form and we will follow up by email within one business day.",
  cta: "Open the intake form",
};
