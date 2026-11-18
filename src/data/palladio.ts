export const ASSETS = {
  logoWordmark:
    "https://framerusercontent.com/images/KglYVNZlRUuFn4SanJULsEPXGP0.svg?width=478",
  favicon: "https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png",
  frescoHands:
    "https://framerusercontent.com/images/G66F0gll6wEzW8nrpIfRrsI0mc.png?width=1376",
  aboutFresco:
    "https://framerusercontent.com/images/nn0lkuGf5JPDqJANiuC9FiwXDXM.png?width=1376",
  aboutHero:
    "https://framerusercontent.com/images/aU60ZiuPaktS5wGRxzs0Uxrf8yU.jpg?width=2000",
  caseStudiesHero:
    "https://framerusercontent.com/images/cJvc10C7p1HYlhnFVZxM9kQuM.jpg?width=2000",
  blogHero:
    "https://framerusercontent.com/images/nYX4mWODfU3ImXnFiYW4EXHqtY.jpg?width=2000",
  clientLogos: [
    {
      name: "Aldermere",
      src: "https://framerusercontent.com/images/lwDBtqkw31U9ZzHsfQgc2MU9GiQ.svg",
    },
    {
      name: "Vesper & Co.",
      src: "https://framerusercontent.com/images/8dhApx4WRibO4HlGTesuPisMNgE.svg",
    },
    {
      name: "Thorne Group",
      src: "https://framerusercontent.com/images/0NDss4ZK4LfbAR5If8bMXKzBg.svg",
    },
    {
      name: "Meridian",
      src: "https://framerusercontent.com/images/BFqRCp7JR8IgDiMIqc1qvaRP98o.svg",
    },
    {
      name: "Halcyon Infrastructure",
      src: "https://framerusercontent.com/images/Px2PrcUEnU8CCRyGRNhPwgDA0.svg",
    },
    {
      name: "Barrow & Sons",
      src: "https://framerusercontent.com/images/nxDNoz70rFyGqoXllI5Te8dcj0.svg",
    },
    {
      name: "Northbridge",
      src: "https://framerusercontent.com/images/A9kGHFNSHRXw42JlAy5QkwfByjo.svg",
    },
  ],
  teamPortraits: {
    adrian:
      "https://framerusercontent.com/images/WFwByUwu53sr9iFsog5q9AnysA.png?width=896",
    clara:
      "https://framerusercontent.com/images/mbr31GLKslla8wjg4ndXDNSbI.png?width=896",
    marcus:
      "https://framerusercontent.com/images/w3iuAL6kOfpp3lCL3sgriUUGLw.png?width=896",
    ines:
      "https://framerusercontent.com/images/HbIADdzsAj4OJIQvXf1uxQ1MJHY.png?width=896",
  },
} as const;

export const SITE_META = {
  brand: "Vex",
  legalName: "Vex Platform",
  tagline: "Your next interview starts here. We help you earn it honestly.",
  email: "office@vex.careers",
  phone: "+44 20 7946 0000",
  location: "London, United Kingdom",
  copyright: "© 2026 Vex®",
  credit: "Career Readiness Platform",
} as const;

export const ABOUT_CHIPS = [
  "Write-once candidate profile",
  "Evidence-grounded CV edits",
  "Human-in-the-loop autofill",
  "Honest three-state tracking",
] as const;

export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  headline: string;
  description: string;
  deliverables: string[];
  image: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "profile-jobs",
    number: "001",
    name: "Profile & Jobs",
    headline: "Start in four minutes, not forty.",
    description:
      "Import your CV or complete only essential fields once. Discover deduplicated live roles with explicit freshness timestamps and transparent reasons explaining why each job fits.",
    deliverables: [
      "Write-once fact inventory",
      "Deduplicated job discovery",
      "Explicit role freshness cues",
      "Explainable match rationale",
    ],
    image:
      "https://framerusercontent.com/images/8MITd7rBK6FeU5zOAiglFzibYuc.png?width=1024",
  },
  {
    id: "cv-studio",
    number: "002",
    name: "CV & Letters",
    headline: "Tailored drafts built strictly from truth.",
    description:
      "Align your CV and cover letter to a role without inventing metrics or buzzword padding. Every suggested change appears side-by-side in a clear diff with unsupported-claim checks.",
    deliverables: [
      "Fact-locked CV tailoring",
      "Visible line-by-line diffs",
      "Unsupported-claim alerts",
      "Structured cover letters",
    ],
    image:
      "https://framerusercontent.com/images/Ktmk6s0f2748XbaZOvv429fBEY.png?width=1024",
  },
  {
    id: "extension",
    number: "003",
    name: "Extension",
    headline: "Assisted autofill that stops before submit.",
    description:
      "Eliminate repetitive field re-entry on external employer portals while staying firmly in charge. Vex prepares answers for your review and never fires off blind auto-applications.",
    deliverables: [
      "Field mapping across portals",
      "Saved screening Q&A draft",
      "Mandatory final human check",
      "Zero unsolicited auto-submit",
    ],
    image:
      "https://framerusercontent.com/images/Ard6gbDcNvLYtFl1egYllbEbIH8.png?width=1024",
  },
  {
    id: "interviews",
    number: "004",
    name: "Mock Prep",
    headline: "Rehearse hard questions before the room.",
    description:
      "Run realistic text-first interview sessions anchored to your real experience and target role rubric — building calm articulation without covert live-call overlays.",
    deliverables: [
      "Role-specific question sets",
      "Evidence-backed feedback",
      "Gap and follow-up drills",
      "Ethical prep boundaries",
    ],
    image:
      "https://framerusercontent.com/images/pmY3Pp462IkXPXhhHH7tJySW3k.png?width=1024",
  },
  {
    id: "skills-mcp",
    number: "005",
    name: "Skill & MCP",
    headline: "Verified proof, portable by design.",
    description:
      "Every skill carries an explicit evidence badge instead of an opaque score. Connect approved workflows through the Vex MCP Connection Hub with clear scoped permissions.",
    deliverables: [
      "Four skill proof tiers",
      "Readiness milestone tracker",
      "Scoped MCP workspace hub",
      "Portable candidate record",
    ],
    image:
      "https://framerusercontent.com/images/fdpjne7vfh3ZdHTRHFLnOZVf6w.png?width=1024",
  },
];

export interface IndustryItem {
  name: string;
  summary: string;
  image: string;
}

export const INDUSTRIES: IndustryItem[] = [
  {
    name: "Finance & Banking",
    summary: "Corporate finance, risk analytics, wealth management & compliance roles.",
    image:
      "https://framerusercontent.com/images/MRjNZGQiEG0MJ2LBxRokRYtSWTc.png?width=1024",
  },
  {
    name: "Operations & Supply",
    summary: "Logistics coordination, plant operations, procurement & quality leads.",
    image:
      "https://framerusercontent.com/images/VdP4xXBNzfp2uQmlfvSUz8l3Wgg.png?width=1024",
  },
  {
    name: "Software & Product",
    summary: "Backend engineering, product management, design systems & cloud roles.",
    image:
      "https://framerusercontent.com/images/EWzBLv8vZ60cpPwqXextpjKzc.png?width=1024",
  },
  {
    name: "Healthcare & Clinical",
    summary: "Clinical operations, health informatics, regulatory & hospital administration.",
    image:
      "https://framerusercontent.com/images/akG41pgFZ8SdPfVwMTtklWW11g.png?width=1024",
  },
  {
    name: "Energy & Infrastructure",
    summary: "Grid engineering, renewable project delivery & utility commercial teams.",
    image:
      "https://framerusercontent.com/images/5l6tLy6O8E68zvMmZDYFktnbt0.png?width=1024",
  },
  {
    name: "Consumer & Commercial",
    summary: "Merchandising, growth marketing, retail operations & category strategy.",
    image:
      "https://framerusercontent.com/images/CdhZopqSCQr9Fk5VRmnZssJbqJQ.png?width=1024",
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  chips: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "001",
    title: "Capture Your Record Once",
    description:
      "Upload an existing CV or walk through a four-minute guided setup. Vex structures your verified dates, roles, deliverables and credentials into one clean canonical inventory.",
    chips: [
      "Minimal intake flow",
      "Fact inventory parser",
      "Skill tier tagging",
      "Editable baseline",
    ],
  },
  {
    number: "002",
    title: "Spot Fresh, Real Opportunities",
    description:
      "Filter out stale reposts and duplicate listings. Every match card shows concrete alignment evidence and highlights missing requirements before you invest an hour.",
    chips: [
      "Duplicate clustering",
      "Post freshness signal",
      "Why-this-fit notes",
      "Honest gap check",
    ],
  },
  {
    number: "003",
    title: "Tailor & Review with Diffs",
    description:
      "Generate a targeted CV revision and cover letter grounded exclusively in your stored facts, then autofill portal fields via the browser extension under your final approval.",
    chips: [
      "Side-by-side diff",
      "No invented claims",
      "Extension autofill",
      "Manual submit gate",
    ],
  },
  {
    number: "004",
    title: "Rehearse & Track Honestly",
    description:
      "Complete structured mock interviews aligned to the role and log outcomes cleanly under three honest states — Prepared, User-reported submitted, or Verified submitted.",
    chips: [
      "Mock Q&A drills",
      "Prepared state",
      "User-reported state",
      "Verified state",
    ],
  },
];

export const DIFFERENCE = {
  without: {
    title: "Applying the old way",
    items: [
      "Re-typing the same CV forty times",
      "Generic AI slop recruiters spot fast",
      "Guessing why a role didn’t reply",
      "Stale, duplicated job board clutter",
      "Opaque match scores with zero proof",
      "Risky auto-apply spam blasting portals",
    ],
  },
  with: {
    title: "With Vex",
    items: [
      "Write once, adapt cleanly per role",
      "Every edit tied to verified experience",
      "Clear three-tier application ledger",
      "Live freshness & deduplicated feeds",
      "Four explicit skill evidence labels",
      "Human-reviewed submit every time",
    ],
  },
};

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  outcome: string;
  image: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "delia",
    name: "Delia Rathbone",
    role: "Senior Product Manager",
    company: "London",
    quote:
      "After forty applications with copy-pasted buzzwords, my response rate had stalled. Vex stripped out the generic claims, highlighted two concrete delivery metrics from my own record, and had me interview-ready in one evening.",
    outcome: "Ready for 3 target shortlist roles within 24 hours",
    image:
      "https://framerusercontent.com/images/BEVB1NHUCKfXmD1BWzlITnIOc.png?width=880",
  },
  {
    id: "rosalind",
    name: "Rosalind Hale",
    role: "Infrastructure Programme Lead",
    company: "Manchester",
    quote:
      "Re-entering work history into fragmented employer portals used to eat two hours a night. The Vex extension mapped ninety percent of the fields cleanly, flagged one open question I needed to write myself, and never rushed my submit button.",
    outcome: "Cut per-application portal friction to under 10 minutes",
    image:
      "https://framerusercontent.com/images/QSQwGVGANFlhtOI5H2OZygOc9c0.png?width=880",
  },
  {
    id: "julian",
    name: "Julian Frost",
    role: "Financial Controller",
    company: "Edinburgh",
    quote:
      "What convinced me was what Vex refused to do. When I tested a stretch Senior FP&A role, it caught a treasury certification gap upfront instead of hallucinating proficiency onto my CV — saving an awkward screening call.",
    outcome: "Zero unsupported claims across 11 tailored applications",
    image:
      "https://framerusercontent.com/images/gHfjwDfl6qsaWCMG2sLqTfE8yQ.png?width=880",
  },
  {
    id: "priya",
    name: "Priya Raman",
    role: "Backend Software Engineer",
    company: "Bristol",
    quote:
      "The text-based mock interview felt like an actual technical debrief. Seeing my distributed systems skills separated into ‘CV-derived’ versus ‘Demonstrated in Vex’ gave me structured stories I actually remembered during panel rounds.",
    outcome: "4 verified skill drills completed ahead of panel interviews",
    image:
      "https://framerusercontent.com/images/cQaQQsT12h5vxk71Wlow6WLOzck.png?width=880",
  },
  {
    id: "duncan",
    name: "Duncan Speirs",
    role: "Supply Chain Operations Manager",
    company: "Birmingham",
    quote:
      "Other trackers told me I had ‘applied’ when I had only clicked a link. Having Vex separate Prepared, User-reported, and Verified submissions alongside real role freshness finally gave my job search an honest ledger.",
    outcome: "Full audit trail across 18 active employer portals",
    image:
      "https://framerusercontent.com/images/e7Ka5rK2NherAcVXrpaJsomdts.png?width=880",
  },
];

export interface PricingPlan {
  id: "counsel" | "partnership";
  name: string;
  eyebrow: string;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyUnit: string;
  yearlyUnit: string;
  summary: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "counsel",
    name: "Core Path",
    eyebrow: "Complete the 24-hour readiness loop for free",
    monthlyPrice: "£0",
    yearlyPrice: "£0",
    monthlyUnit: "/ month",
    yearlyUnit: "/ forever free starter",
    summary:
      "Built so every candidate can import a CV, discover deduplicated roles with transparent fit notes, run core evidence-locked tailoring, and track honest submission states.",
    features: [
      "4-minute essential profile & fact inventory",
      "Deduplicated job discovery & freshness timestamps",
      "Evidence-checked CV diffs (weekly quota)",
      "Three-state honest application tracker",
      "Introductory structured mock interview drill",
    ],
    ctaLabel: "Start with Core",
  },
  {
    id: "partnership",
    name: "Vex Pro",
    eyebrow: "Full workflow power for active job searches",
    monthlyPrice: "£18",
    yearlyPrice: "£180",
    monthlyUnit: "/ month",
    yearlyUnit: "/ year (two months free)",
    summary:
      "For focused candidates running high-conviction searches across multiple portals — unlimited tailored CV diffs, full browser extension autofill, deep mock interviews and MCP sync.",
    features: [
      "Unlimited evidence-checked CV & letter revisions",
      "Full browser extension portal autofill & Q&A drafts",
      "Unlimited role-specific mock interviews & rubrics",
      "Full 4-tier skill proof & gap roadmap",
      "Scoped MCP Connection Hub workspace integrations",
    ],
    featured: true,
    ctaLabel: "Choose Vex Pro",
  },
];

export interface FaqItem {
  id: string;
  category: "Platform" | "Results";
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "twenty-four-hours",
    category: "Platform",
    question: "What does ‘interview-ready in 24 hours’ actually promise?",
    answer:
      "Vex separates what the platform controls from what employers control. Within 24 hours you move from sign-up to a structured fact profile, relevant fresh roles with clear fit reasons, tailored evidence-checked application documents, and completed mock prep. Employer response speed and hiring decisions remain strictly outside anyone's promise.",
  },
  {
    id: "no-fabricated-claims",
    category: "Platform",
    question: "Will Vex rewrite my CV with exaggerated or invented achievements?",
    answer:
      "No. Vex operates an unsupported-claim blocker: every bullet refinement, keyword alignment, and cover-letter paragraph must trace back to facts stored in your canonical profile. Any proposed edit is shown as a visible diff you accept or reject before exporting.",
  },
  {
    id: "auto-apply-policy",
    category: "Platform",
    question: "Does the browser extension automatically submit applications for me?",
    answer:
      "Never. Blind auto-apply harms candidate credibility and violates employer portal expectations. The Vex extension eliminates tedious form re-typing by pre-filling verified fields and drafting open responses, then stops intentionally so you inspect and press Submit yourself.",
  },
  {
    id: "three-states",
    category: "Platform",
    question: "Why are applications split into Prepared, User-reported, and Verified?",
    answer:
      "Most tools conflate opening an external tab with applying. Vex keeps your tracker truthful: Prepared means tailored assets are ready; User-reported means you confirmed pressing Submit externally; Verified means the portal confirmation or receipt was directly observed.",
  },
  {
    id: "mcp-hub",
    category: "Platform",
    question: "How does the MCP Connection Hub work with my data?",
    answer:
      "The MCP Connection Hub exposes structured, permission-scoped access to your verified career record, saved role notes, and prep sessions so you can work across approved AI workspaces without copying private CVs into untrusted prompts or granting unreviewed write access.",
  },
  {
    id: "sign-up-time",
    category: "Platform",
    question: "How long does initial onboarding take?",
    answer:
      "Upload an existing PDF or DOCX CV — or start manually with essential fields only — and you reach your working career workspace in roughly four minutes, with optional deep enrichment saved for when a specific job calls for it.",
  },
  {
    id: "guarantee-hires",
    category: "Results",
    question: "Does Vex guarantee interviews or job offers?",
    answer:
      "No, and we distrust any platform that claims it does. Employers decide shortlist outcomes based on budget, timing, headcount and competing applicants. Vex guarantees readiness quality, honest gap identification, and removing repetitive workflow friction.",
  },
  {
    id: "conversion-evidence",
    category: "Results",
    question: "Why focus so heavily on tailored applications rather than volume?",
    answer:
      "Industry hiring studies show tailored applications convert at roughly 5.8% into interviews compared with 3.73% for generic untailored submissions, while 58% of candidates point to tedious field re-entry and 43% abandon long forms inside fifteen minutes. Precision beats volume without sacrificing energy.",
  },
  {
    id: "skill-confidence",
    category: "Results",
    question: "How are my skills scored inside Vex?",
    answer:
      "Instead of hiding behind an arbitrary percentage, Vex tags every capability with one of four clear provenance labels: Self-reported, CV-derived, Demonstrated in Vex (via structured drills), or Verified credential — so both you and future exports show where proof actually sits.",
  },
  {
    id: "live-copilot",
    category: "Results",
    question: "Do you offer a hidden live-call interview copilot?",
    answer:
      "No. Vex is strictly built around authentic pre-interview preparation — realistic text-first and structured scenario practice beforehand, never covert teleprompter overlays during live candidate assessments.",
  },
  {
    id: "stale-listings",
    category: "Results",
    question: "How does Vex handle duplicate or suspected ghost job listings?",
    answer:
      "With 67% of surveyed candidates encountering suspected misleading or stale listings, Vex clusters cross-posted duplicates, surfaces first-seen freshness timestamps, and highlights active hiring signals so you spend time where roles are genuinely open.",
  },
  {
    id: "data-portability",
    category: "Results",
    question: "Do I retain full ownership of my tailored CVs and career history?",
    answer:
      "Yes. Your underlying fact inventory, exported DOCX/PDF resumes, cover letters, and practice transcripts belong completely to you and can be edited, exported, or permanently deleted at any time.",
  },
];

export interface CaseStudy {
  slug: string;
  sector: string;
  year: string;
  duration: string;
  title: string;
  summary: string;
  metricHighlight: string;
  image: string;
  context: string;
  challenge: string[];
  whatWeBuilt: string[];
  outcomes: { label: string; value: string }[];
  closingNote: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "from-signup-to-interview-ready-in-24-hours",
    sector: "Software & Product",
    year: "2026",
    duration: "24 hours",
    title: "From sign-up to interview-ready in 24 hours",
    summary:
      "Compressing profile setup, role selection, verified CV tailoring and structured mock prep into one coherent first day.",
    metricHighlight: "24-hr readiness loop",
    image:
      "https://framerusercontent.com/images/uSsLgWPC3iyDQSw8kMFZuhIHo.png?width=1200",
    context:
      "Most candidates spend their first weekend reorganising fragmented folders, rewriting old job descriptions from scratch, and losing momentum before sending a single high-conviction application.",
    challenge: [
      "Long mandatory onboarding questionnaires cause sharp abandonment before users even see relevant live roles.",
      "Disjointed job boards, resume editors, and note apps force manual copy-pasting at every transition.",
      "Tools that promise effortless automation routinely slip fabricated metrics past tired applicants.",
    ],
    whatWeBuilt: [
      "Four-minute essential intake parser extracting verified dates, skills, and achievements into a canonical profile.",
      "Single-workspace loop connecting role freshness checks, diff-reviewed CV tailoring, and pre-submit portal autofill.",
      "Anchored end-of-day mock interview sequence drawn straight from target role criteria and the user's real history.",
    ],
    outcomes: [
      { label: "Onboarding to first shortlist", value: "< 15 mins" },
      { label: "Verified readiness loop", value: "Inside 24 hrs" },
      { label: "Unverified claims shipped", value: "0 allowed" },
    ],
    closingNote:
      "Every step respects a clean three-tier boundary: Vex guarantees structured readiness tools, candidates own submission review, and employers govern hiring calls.",
  },
  {
    slug: "eliminating-15-minute-ats-form-drop-off",
    sector: "Operations & Supply",
    year: "2026",
    duration: "Continuous",
    title: "Eliminating 15-minute portal form fatigue",
    summary:
      "Stopping tedious re-entry without surrendering final human review before an application leaves your hands.",
    metricHighlight: "43% drop-off addressed",
    image:
      "https://framerusercontent.com/images/vQovBLEQgpqbuzj1MVUHBZlj58.png?width=1200",
    context:
      "Across candidate research benchmarks, 58% of applicants point to re-entering CV fields on web forms as a top frustration and 43% abandon applications taking more than fifteen minutes.",
    challenge: [
      "Legacy enterprise ATS portals parse uploaded PDFs poorly, scrambling employment timelines and degree metadata.",
      "Fully autonomous auto-apply bots destroy signal quality, mismatch answers, and risk blacklisting candidates.",
      "Candidates lose track of which portal forms were merely drafted versus genuinely submitted.",
    ],
    whatWeBuilt: [
      "Structured Vex browser extension mapping canonical education, role history, and work-rights fields directly into portal inputs.",
      "Evidence-locked scratchpad drafting responses for open screening questions while clearly marking unverified details.",
      "Deliberate final-step pause requiring conscious user review and recording Verified vs User-reported submission status.",
    ],
    outcomes: [
      { label: "Repeated field typing", value: "Write once" },
      { label: "Blind auto-submissions", value: "0 (blocked)" },
      { label: "Form review cadence", value: "Under 6 mins" },
    ],
    closingNote:
      "Removing mechanical friction frees candidate energy for writing honest role-specific answers and preparing properly for interviews.",
  },
  {
    slug: "lifting-tailored-interview-conversion",
    sector: "Finance & Banking",
    year: "2026",
    duration: "Search cycle",
    title: "Evidence-led tailoring over mass blasting",
    summary:
      "Replacing generic keyword stuffing with transparent fact-checked CV alignment for regulated commercial roles.",
    metricHighlight: "5.8% vs 3.73% tailored",
    image:
      "https://framerusercontent.com/images/bCLrZy90y4zUNBdFxg8JAwjCgOE.png?width=1200",
    context:
      "Benchmarks across modern hiring pipelines show tailored applications converting at roughly 5.8% compared with 3.73% for untailored blasts — yet most AI writers undermine credibility with cliché ‘AI slop’.",
    challenge: [
      "Hiring managers in regulated finance immediately discount inflated buzzword prose that fails technical probing.",
      "Manual tailoring across ten open applications regularly consumes six or more hours of careful editing.",
      "Opaque single-click ‘optimisers’ overwrite candidate voice silently without showing what changed.",
    ],
    whatWeBuilt: [
      "Line-level diff workspace proposing targeted emphasis reorderings strictly bound to the user's factual history.",
      "Automated slop & cliché lint catching empty superlatives before a PDF or DOCX leaves the studio.",
      "Inline gap summary warning the candidate plainly where a job spec requires a credential they do not yet hold.",
    ],
    outcomes: [
      { label: "Tailored benchmark lift", value: "+55% relative" },
      { label: "Diff transparency", value: "100% inline" },
      { label: "Fact-checking coverage", value: "Every bullet" },
    ],
    closingNote:
      "Candidates keep complete control of voice and factual integrity while cutting per-role tailoring time to minutes.",
  },
  {
    slug: "removing-stale-and-duplicate-listings",
    sector: "Energy & Infrastructure",
    year: "2026",
    duration: "Live feed",
    title: "Filtering duplicate and stale job noise",
    summary:
      "Surfacing real hiring freshness and explainable fit criteria across fragmented energy and engineering boards.",
    metricHighlight: "67% ghost-post defense",
    image:
      "https://framerusercontent.com/images/zDq7QowHYX04DrdSHKMfXJFD1I.png?width=1200",
    context:
      "67% of surveyed job seekers report encountering suspected fake or stale postings, while 60% cite never knowing if a human actually reviewed their application as a primary source of burnout.",
    challenge: [
      "Reposted roles across five aggregators create false urgency and waste tailoring effort on identical vacancies.",
      "Black-box ‘Top Match’ tags hide whether a match came from genuine technical overlap or a coincidental city name.",
      "Expired evergreen requisitions stay pinned on boards weeks after hiring managers closed shortlists.",
    ],
    whatWeBuilt: [
      "Cross-source canonical role deduplication merging identical employer requisitions into one clean dossier.",
      "Explicit freshness scoring showing first-observed date and source origin directly on every discovery card.",
      "Structured ‘Why this matched / What is missing’ breakdown replacing ambiguous black-box percentages.",
    ],
    outcomes: [
      { label: "Duplicate listings", value: "Merged cleanly" },
      { label: "Match reasoning", value: "Plain-English" },
      { label: "Freshness visibility", value: "First-class UI" },
    ],
    closingNote:
      "Fewer wasted hours on dead links means sharper focus on active teams with open decision timelines.",
  },
  {
    slug: "grounding-every-cv-claim-in-evidence",
    sector: "Consumer & Commercial",
    year: "2026",
    duration: "Platform standard",
    title: "Four-tier skill provenance instead of guesswork",
    summary:
      "Distinguishing self-reported comfort from CV-derived history, Vex-demonstrated drills and verified credentials.",
    metricHighlight: "4 skill proof tiers",
    image:
      "https://framerusercontent.com/images/c6sXXWhU7H0WUh5c5iP2kjVMc.png?width=1200",
    context:
      "Generic resume builders collapse decades of uneven competence into flat bullet lists or speculative percentage bars that erode trust in technical screening.",
    challenge: [
      "Familiarity with a tool from a weekend tutorial looks indistinguishable on paper from five years in production.",
      "Candidates undersell transferable operational skills because they lack structured framing tied to real outputs.",
      "External AI agents connected without structure risk citing unverified skills as established expertise.",
    ],
    whatWeBuilt: [
      "Four explicit evidence states attached to every skill record: Self-reported, CV-derived, Demonstrated in Vex, Verified credential.",
      "Promotion pathway allowing candidates to upgrade CV claims into Demonstrated status through structured scenario assessments.",
      "Scoped MCP Connection Hub exposing clean provenance metadata to user-authorised AI workflows.",
    ],
    outcomes: [
      { label: "Provenance labels", value: "4 explicit tiers" },
      { label: "Opaque fit scores", value: "Eliminated" },
      { label: "MCP consent model", value: "Granular opt-in" },
    ],
    closingNote:
      "Clarity about what you can already prove today turns interview prep into targeted sharpening rather than anxiety.",
  },
  {
    slug: "structured-mock-interviews-without-shortcuts",
    sector: "Healthcare & Clinical",
    year: "2026",
    duration: "Interview prep",
    title: "Structured rehearsal without covert gimmicks",
    summary:
      "Text-first, evidence-referenced interview drills built to hold up cleanly under real panel questioning.",
    metricHighlight: "Zero covert copilots",
    image:
      "https://framerusercontent.com/images/itspH5ZcmaGbp0prudCSG3Qk.png?width=1200",
    context:
      "A wave of stealth teleprompter apps trains candidates to read synthetic answers awkwardly on live calls — creating brittle performance the moment an interviewer asks a follow-up.",
    challenge: [
      "Clinical, regulatory and product panels test judgment under follow-up probing rather than rehearsed definitions.",
      "Busy working professionals need focused 15-minute rehearsal blocks between shifts, not two-hour generic courses.",
      "Generic chatbot prompts fail to challenge missing metrics or vague STAR-method framing.",
    ],
    whatWeBuilt: [
      "Role-aware mock interview simulator probing directly against the candidate's tailored CV and job criteria.",
      "Turn-by-turn rubric feedback separating substance, evidence specificity, and concise structure.",
      "Explicit ethics guardrail: Vex prepares you thoroughly beforehand and declines stealth in-call assistance.",
    ],
    outcomes: [
      { label: "Prep mode", value: "Text-first & fast" },
      { label: "Follow-up probing", value: "Role-grounded" },
      { label: "Stealth overlay policy", value: "Prohibited" },
    ],
    closingNote:
      "Real poise in the interview room comes from testing your actual stories beforehand — not hiding a script behind your webcam.",
  },
];

export interface BlogPost {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  title: string;
  summary: string;
  image: string;
  sections: { heading?: string; paragraphs: string[] }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "from-signup-to-interview-ready-in-24-hours",
    category: "Architecture",
    date: "25 October 2026",
    readTime: "6 min read",
    author: "Adrian Vance",
    authorRole: "Product Lead",
    title: "From sign-up to interview-ready in 24 hours",
    summary:
      "Why Vex separates candidate readiness from employer hiring — and how a focused first day beats weeks of fragmented busywork.",
    image:
      "https://framerusercontent.com/images/2VYbsTyBR3HN8NwDy9G6wFsP9dc.png?width=1200",
    sections: [
      {
        paragraphs: [
          "Job-search tools fail in one of two opposite ways: either they hand you a blank document and leave every step manual, or they promise effortless magic offers powered by mass auto-apply spam.",
          "Vex draws a plain ethical line through the middle using a three-tier promise. Within 24 hours, Vex takes responsibility for giving you a structured fact profile, relevant fresh roles with clear match logic, truth-checked tailored drafts, and realistic mock prep. Pushing Submit stays with you; shortlisting stays with the employer.",
        ],
      },
      {
        heading: "Momentum comes from eliminating re-work",
        paragraphs: [
          "When you only enter your core career record once — in four focused minutes — every downstream artifact inherits clean structured facts. You spend your evening thinking about role fit and interview stories instead of fighting formatting.",
        ],
      },
    ],
  },
  {
    slug: "why-58-percent-quit-long-ats-forms",
    category: "Candidate Research",
    date: "14 October 2026",
    readTime: "5 min read",
    author: "Clara Benn",
    authorRole: "Head of Research",
    title: "Why 58% of applicants dread form re-entry",
    summary:
      "Unpacking the two research numbers behind modern candidate burnout: 58% form frustration and 43% abandonment inside fifteen minutes.",
    image:
      "https://framerusercontent.com/images/2QLGbWdfXCkXRf26AVBDmVhQw.png?width=1200",
    sections: [
      {
        paragraphs: [
          "Candidate surveys show a remarkably consistent pattern: 58% of applicants cite re-entering CV details on multi-page application forms among their sharpest frustrations, and 43% walk away completely when an application drags past fifteen minutes.",
          "Worse still, 55% hear nothing back and 60% say their biggest stressor is never knowing whether a real human saw their submission.",
        ],
      },
      {
        heading: "Assisted autofill without surrendering judgment",
        paragraphs: [
          "The answer is not firing off blind automated packets across three hundred portals. The answer is browser-assisted pre-fill grounded in your clean record — stopping right before final confirmation so every role still receives your deliberate eye.",
        ],
      },
    ],
  },
  {
    slug: "honest-application-states-prepared-reported-verified",
    category: "Product Craft",
    date: "2 October 2026",
    readTime: "4 min read",
    author: "Marcus Oyelaran",
    authorRole: "Engineering Lead",
    title: "Prepared, User-reported, Verified: keeping trackers honest",
    summary:
      "Why blurring click-outs into ‘Applied’ corrupts every search metric — and how three distinct submission states fix it.",
    image:
      "https://framerusercontent.com/images/EppVo9KMiZRyyefjgcDlRT8g.png?width=1200",
    sections: [
      {
        paragraphs: [
          "Almost every consumer job tracker commits the same quiet inaccuracy: the moment you click an external job link, your dashboard marks the role as Applied even if you closed the tab ten seconds later.",
          "Weeks later, your response rate looks mysteriously broken when half those applications never left draft stage.",
        ],
      },
      {
        heading: "Three clean boundaries in one ledger",
        paragraphs: [
          "Inside Vex, Prepared means tailored assets sit ready for your review. User-reported submitted means you told the tracker you finished the portal flow. Verified submitted is reserved strictly for observed confirmation receipts or tracked extension completions.",
        ],
      },
    ],
  },
  {
    slug: "four-tiers-of-skill-proof-over-percentages",
    category: "Skill Intelligence",
    date: "19 September 2026",
    readTime: "5 min read",
    author: "Ines Duarte",
    authorRole: "Head of Curriculum",
    title: "Four tiers of skill proof instead of vague percentages",
    summary:
      "How separating Self-reported, CV-derived, Demonstrated in Vex, and Verified credentials builds real candidate confidence.",
    image:
      "https://framerusercontent.com/images/OzHuUazxyMsgeLd07xp3mkjF8LE.png?width=1200",
    sections: [
      {
        paragraphs: [
          "A ‘92% skill match’ badge with no provenance underneath teaches a candidate nothing about whether a recruiter will trust that claim under technical questioning.",
          "Vex replaces opaque match gauges with four honest evidence labels: Self-reported, CV-derived, Demonstrated in Vex through structured scenario drills, and Verified credential.",
        ],
      },
      {
        heading: "Practice turns claims into readiness",
        paragraphs: [
          "When you spot a gap between a CV-derived line and a target role requirement, you know immediately whether to run a focused mock drill or acknowledge the boundary openly before applying.",
        ],
      },
    ],
  },
  {
    slug: "tailored-vs-untailed-conversion-58-vs-373",
    category: "Evidence",
    date: "4 September 2026",
    readTime: "6 min read",
    author: "Adrian Vance",
    authorRole: "Product Lead",
    title: "Tailored precision vs untailored volume (5.8% vs 3.73%)",
    summary:
      "How deliberate fact-locked CV diffs win more callbacks without drifting into synthetic AI clichés.",
    image:
      "https://framerusercontent.com/images/xPc7ey7adfTX7OOol6mkBBbY.png?width=1200",
    sections: [
      {
        paragraphs: [
          "Controlled application data backs what seasoned hiring managers say plainly: thoughtfully tailored applications generate roughly 5.8% interview conversion compared with 3.73% for untailored mass submissions.",
          "Yet blind AI rewriting often backfires by stuffing every CV with identical abstract phrasing and invented impact percentages that fall apart in a five-minute screen.",
        ],
      },
      {
        heading: "Show the diff, block the invention",
        paragraphs: [
          "By anchoring every revision to verified evidence in your profile and displaying inline diffs, Vex gives you tailored clarity in minutes while preserving your real voice.",
        ],
      },
    ],
  },
  {
    slug: "no-auto-apply-no-covert-copilots",
    category: "Ethics",
    date: "22 August 2026",
    readTime: "5 min read",
    author: "Clara Benn",
    authorRole: "Head of Research",
    title: "Why Vex refuses blind auto-apply and live interview copilots",
    summary:
      "Two product shortcuts we deliberately ruled out — and why protecting candidate trust pays off long term.",
    image:
      "https://framerusercontent.com/images/R80Tvrc9kWy01EyVhBql3QMjK40.png?width=1200",
    sections: [
      {
        paragraphs: [
          "In a crowded market of job tools, the loudest promises cluster around two extremes: scripts that shotgun-apply to hundreds of roles while you sleep, and covert screen overlays whispering scripted answers during live video interviews.",
          "Both destroy the credibility of the very candidates they claim to help.",
        ],
      },
      {
        heading: "High-agency tools built for real scrutiny",
        paragraphs: [
          "Vex automates preparation, organisation, form-filling drudgery and mock rehearsal — and stops cleanly at the threshold where human accountability matters most.",
        ],
      },
    ],
  },
];

export const ABOUT_PAGE = {
  stats: [
    {
      value: "24h",
      description:
        "Guided path from four-minute sign-up to verified CV diffs, matched roles and mock interview readiness.",
    },
    {
      value: "58%",
      description:
        "Of job seekers dread re-entering CV fields across fragmented web portals — solved by write-once autofill.",
    },
    {
      value: "67%",
      description:
        "Have encountered suspected ghost or stale job postings — addressed through canonical deduplication and freshness.",
    },
    {
      value: "0",
      description:
        "Blind auto-submissions, covert live-call copilots, or fabricated CV claims permitted anywhere inside Vex.",
    },
  ],
  team: [
    {
      name: "Adrian Vance",
      role: "Product Lead",
      bio: "Led hiring systems and structured career tooling before founding Vex around evidence-first readiness and honest workflow boundaries.",
      image: ASSETS.teamPortraits.adrian,
    },
    {
      name: "Clara Benn",
      role: "Head of Research",
      bio: "Directs candidate frustration studies, freshness verification heuristics, and transparent three-tier outcome reporting.",
      image: ASSETS.teamPortraits.clara,
    },
    {
      name: "Marcus Oyelaran",
      role: "Engineering Lead",
      bio: "Architects Vex’s canonical profile parser, browser extension portal mapper, and permission-scoped MCP Connection Hub.",
      image: ASSETS.teamPortraits.marcus,
    },
    {
      name: "Ines Duarte",
      role: "Head of Curriculum",
      bio: "Designs Vex’s four-tier skill provenance framework and text-first structured mock interview evaluation rubrics.",
      image: ASSETS.teamPortraits.ines,
    },
  ],
  careers: [
    {
      title: "Staff Product Engineer",
      practice: "Core Platform",
      location: "London",
      type: "Full-time",
    },
    {
      title: "Extension Systems Engineer",
      practice: "Browser Extension",
      location: "London",
      type: "Full-time",
    },
    {
      title: "Applied AI & Eval Engineer",
      practice: "CV & Prep Studio",
      location: "London",
      type: "Full-time",
    },
    {
      title: "Head of Candidate Research",
      practice: "Skill Intelligence",
      location: "London",
      type: "Full-time",
    },
    {
      title: "Product Designer, Systems",
      practice: "Design",
      location: "London",
      type: "Part-time",
    },
  ],
};

export const LEGAL_DOCS = {
  termsOfService: {
    updated: "Last updated: 25 October 2026",
    intro:
      "These terms govern your use of the Vex website, workspace, browser extension, and career readiness platform. Please read them carefully before creating an account.",
    sections: [
      {
        heading: "Who we are",
        body: "Vex Platform operates career readiness software and tools from London, United Kingdom. References to we, us and our mean Vex; references to you mean the candidate, visitor, or user accessing this website or workspace.",
      },
      {
        heading: "What Vex promises and does not promise",
        body: "We design Vex around an explicit three-tier promise: we work to help you go from sign-up to interview-ready within 24 hours by structuring your profile, surfacing relevant fresh roles, preparing grounded application drafts, and offering mock prep. Submission decisions belong solely to you, and interview invites or offers depend strictly on independent employers — we never guarantee employment outcomes.",
      },
      {
        heading: "Truthfulness & anti-fabrication rules",
        body: "Vex tools require that every tailored CV line, cover letter sentence, and screening answer be grounded in facts you confirm. You remain solely responsible for reviewing diffs and verifying the truthfulness of every application you choose to submit on external portals.",
      },
      {
        heading: "Human-in-the-loop extension use",
        body: "The Vex browser extension assists you by pre-filling verified profile data onto third-party application forms. You must review completed fields and execute submission manually. You agree not to automate unsupervised mass applications or bypass employer verification controls.",
      },
      {
        heading: "Mock interviews & ethical prep boundaries",
        body: "Interview rehearsal tools inside Vex are strictly for pre-interview practice and feedback. Vex does not offer, endorse, or support covert assistance or live hidden overlays during actual employer interviews or technical tests.",
      },
      {
        heading: "Subscriptions & pricing",
        body: "Core Path tools are available free of charge subject to published usage quotas. Vex Pro subscriptions are billed monthly or annually at the stated rate and may be cancelled at any time prior to the next billing cycle.",
      },
      {
        heading: "Your content & portability",
        body: "You retain full ownership of your career history, source CVs, tailored documents, and personal notes. You grant Vex a limited licence solely to process and format that content at your direction inside your workspace or authorised MCP connections.",
      },
      {
        heading: "MCP Connection Hub",
        body: "Connecting external AI clients or tools via the MCP Connection Hub is opt-in and governed by the scopes you explicitly grant. You may revoke any external client token at any time inside settings.",
      },
      {
        heading: "Governing law",
        body: "These terms and any dispute arising from them are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.",
      },
      {
        heading: "Contact",
        body: "Questions about these terms can be sent to office@vex.careers or to Vex Platform, London, United Kingdom.",
      },
    ],
  },
  privacyPolicy: {
    updated: "Last updated: 25 October 2026",
    intro:
      "This policy explains what personal career information Vex collects, why we collect it, and how you control your profile, documents, and MCP permissions.",
    sections: [
      {
        heading: "Who we are",
        body: "Vex Platform operates from London, United Kingdom and acts as data controller for personal information handled through this website and application. You can reach us at office@vex.careers with any privacy question.",
      },
      {
        heading: "The information we collect",
        bullets: [
          "Canonical profile details: your name, email, work history, education, credentials and skills you upload or enter.",
          "Tailored artifacts: job descriptions you save, generated CV diffs, cover letters and screening-question drafts.",
          "Application ledger records: honest submission statuses (Prepared, User-reported submitted, Verified submitted) and role notes.",
          "Practice sessions: mock interview responses, rubric scores and verified skill demonstration records.",
          "Consent & telemetry logs: scoped MCP access tokens and aggregated, anonymised performance metrics.",
        ],
      },
      {
        heading: "How we use it",
        bullets: [
          "To extract your verified career fact inventory and remove repetitive portal typing.",
          "To rank deduplicated job listings with explainable fit reasons and skill provenance tags.",
          "To generate truth-checked CV revisions and structured pre-interview practice drills.",
          "To send monthly product notes where you explicitly opt in.",
          "To protect security, prevent abuse and comply with legal obligations.",
        ],
      },
      {
        heading: "No selling candidate data",
        body: "We do not sell candidate CVs, practice transcripts, or contact details to data brokers or third-party advertisers. Employer-facing or external MCP exposure happens only when you explicitly initiate and approve it.",
      },
      {
        heading: "Retention & deletion",
        body: "You can export or permanently delete individual documents, mock interview logs, or your entire Vex account at any time. Routine enquiries are retained for up to twelve months unless deleted earlier at your request.",
      },
      {
        heading: "Your rights",
        bullets: [
          "Access a structured export of every career fact and tailored document stored in Vex.",
          "Correct inaccurate extracted dates, employers, or skill credentials.",
          "Revoke browser extension or MCP Connection Hub permissions immediately.",
          "Request full account erasure at any time.",
        ],
        footerNote:
          "To exercise any of these rights, write to office@vex.careers. We respond within one month.",
      },
      {
        heading: "Security",
        body: "Candidate records are encrypted in transit and at rest with strict least-privilege access controls. If a breach occurs that is likely to affect your rights, we notify affected users and relevant supervisory authorities promptly.",
      },
      {
        heading: "Contact and complaints",
        body: "Raise any concern with us directly at office@vex.careers. You also hold the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk.",
      },
    ],
  },
};
