export type DashboardSectionId =
  | "overview"
  | "jobs"
  | "applications"
  | "documents"
  | "profile"
  | "network"
  | "interviews"
  | "learning"
  | "mcp"
  | "alerts"
  | "settings";

export type SubscriptionPlan = "Free" | "Pro" | "Ultra";

export type SubmissionState =
  | "prepared"
  | "user-reported-submitted"
  | "verified-submitted";

export type TrackerStage =
  | "Planned"
  | "Prepared"
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export type FitBand = "Strong fit" | "Good fit" | "Partial gap";

export type SkillEvidenceTier =
  | "Self-reported"
  | "CV-derived"
  | "Demonstrated in Vex"
  | "Verified credential";

export type ProficiencyLevel =
  | "Beginner"
  | "Basic"
  | "Intermediate"
  | "Advanced";

export interface OnboardingProfileState {
  name: string;
  email: string;
  intakeMethod: "upload" | "manual";
  currentRole: string;
  targetRole: string;
  track: string;
  workMode: string;
  priorities: string[];
  cvExcerpt: string;
  agreedBoundary: boolean;
  completedAt?: string;
}

export interface DashboardJob {
  id: string;
  title: string;
  company: string;
  location: string;
  arrangement: string;
  salary: string | null;
  source: string;
  alsoFoundOn: string[];
  checkedLabel: string;
  isStale?: boolean;
  redFlags: string[];
  deadline: string | null;
  fitBand: FitBand;
  compatibilityScore: number;
  matchingSkills: string[];
  skillsToImprove: string[];
  experienceLevel: "Entry" | "Mid" | "Senior";
  industry: string;
  employmentType: "Full-time" | "Part-time" | "Internship";
  whyFitSummary: string;
  philosopherLens: string;
  philosopherMaxim: string;
  telosTag: string;
  requirements: {
    text: string;
    mandatory: boolean;
    sourceSentence: string;
    status: "has" | "improve" | "missing" | "transferable";
    profileEvidence: string;
  }[];
  applyUrl: string;
  atsSupported: "supported" | "partial" | "unsupported";
}

export interface ExtensionFieldItem {
  id: string;
  label: string;
  value: string;
  source: string;
  status: "Filled" | "Needs input" | "Needs review" | "Unsupported" | "Skipped by user";
}

export interface DashboardApplication {
  id: string;
  jobId: string;
  title: string;
  company: string;
  stage: TrackerStage;
  submissionState: SubmissionState;
  evidenceText: string;
  quietDays: number;
  deadline?: string;
  priority: "High" | "Standard";
  interviewDate?: string;
  interviewFormat?: string;
  cvVariant: string;
  coverLetterApproved: boolean;
  checklist: {
    cvReviewed: boolean;
    letterApproved: boolean;
    questionsAnswered: boolean;
    fieldsChecked: boolean;
  };
  notes: string;
  followUpDate: string;
  history: {
    at: string;
    actor: "User" | "Vex Extension" | "Vex Workspace";
    event: string;
  }[];
  extensionFields: ExtensionFieldItem[];
}

export interface CvDiffSuggestion {
  id: string;
  section: string;
  original: string;
  suggested: string;
  reason: string;
  sourceFact: string;
  hasUnsupportedClaim: boolean;
  unsupportedNote?: string;
  status: "pending" | "accepted" | "rejected";
}

export interface CvQualityFlag {
  id: string;
  type: "Unsupported claim" | "Vague phrasing" | "Repetition" | "Consistency";
  lineRef: string;
  message: string;
  suggestion: string;
  resolved: boolean;
}

export interface SkillRecord {
  id: string;
  name: string;
  category: string;
  proficiency: ProficiencyLevel;
  confidence: "Low" | "Medium" | "High";
  confidenceReason: string;
  evidenceTier: SkillEvidenceTier;
  sourceLabel: string;
  linkedJobsCount: number;
  isMandatoryGap?: boolean;
  challengeHistory: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  origin: "External resource" | "AI-generated lesson" | "YouTube video lesson";
  provider: string;
  cost: string;
  duration: string;
  level: ProficiencyLevel;
  skillTargeted: string;
  whyRecommended: string;
  doesProve: string;
  doesNotProve: string;
  quizSummary: string;
  milestoneLabel: string;
  status: "Not started" | "In progress" | "Completed";
}

export interface DailyPlanTask {
  id: string;
  type: "Job search" | "CV" | "Learning" | "Interview";
  title: string;
  duration: string;
  targetSection: DashboardSectionId;
  done: boolean;
  rescheduled?: boolean;
}

export interface McpConnection {
  id: string;
  name: string;
  publisher: string;
  category:
    | "Job-listing source"
    | "Document storage"
    | "Calendar"
    | "Learning platform"
    | "Inbox";
  status: "Connected" | "Not working" | "Disconnected";
  statusNote: string;
  permissionSummary: string;
  duration: "This task only" | "30 days" | "Until I disconnect";
  lastUsed: string;
  dataShared: string;
}

export interface ExternalAiAppAccess {
  id: string;
  feature: string;
  description: string;
  approvalRule: "Allowed once switched on" | "Each time" | "Per request";
  enabled: boolean;
}

export interface McpActivityEntry {
  id: string;
  time: string;
  actor: string;
  tool: string;
  action: string;
  dataShared: string;
  approval: "Approved" | "Denied" | "Not needed";
  result: "Succeeded" | "Failed" | "Not run" | "Not confirmed";
}

export interface AlertItem {
  id: string;
  group: "Today" | "Earlier";
  category: "Deadline" | "Match" | "Follow-up" | "System" | "Recruiter";
  title: string;
  detail: string;
  actionLabel: string;
  targetSection: DashboardSectionId;
  dismissed: boolean;
}

export interface NetworkContact {
  id: string;
  name: string;
  role: string;
  company: string;
  linkedApplication: string;
  nextFollowUp: string;
  referralPath: string;
  note: string;
}

export interface RecruiterEmailItem {
  id: string;
  provider: "Gmail" | "Outlook";
  sender: string;
  company: string;
  subject: string;
  receivedAt: string;
  classification:
    | "Interview Invitation"
    | "Assessment Invite"
    | "Application Confirmation"
    | "Rejection Notice";
  extractedSummary: string;
  linkedApplicationId: string;
  suggestedReply: string;
}

export interface CompanyIntelItem {
  id: string;
  name: string;
  sector: string;
  size: string;
  headquarters: string;
  hiringVelocity: string;
  cultureSignals: string;
  salaryRange: string;
  openMatchedRoles: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  role: string;
  outcome: string;
  verifiedSkills: string[];
  linkLabel: string;
}

export interface OfferComparisonRow {
  id: string;
  company: string;
  role: string;
  baseSalary: number;
  bonusOrEquity: string;
  arrangement: string;
  commuteMinutes: number;
  growthFit: string;
  benefitsNote: string;
}

export interface MarketDemandBenchmark {
  skill: string;
  demandChange: string;
  medianSalaryLift: string;
  openRolesMatched: number;
  priority: "Immediate" | "Quarter 1" | "Long-term";
}

export const SUBSCRIPTION_TIERS: {
  plan: SubscriptionPlan;
  price: string;
  tagline: string;
  features: string[];
}[] = [
  {
    plan: "Free",
    price: "£0",
    tagline: "Core honest job readiness baseline",
    features: [
      "Guided intake & canonical profile",
      "Explained fit bands & saved searches",
      "Up to 3 tailored CV diffs / week",
      "Manual tracker & 24h checklist",
    ],
  },
  {
    plan: "Pro",
    price: "£19 / mo",
    tagline: "Full 24-hour acquisition workflow",
    features: [
      "Unlimited job-specific CVs & cover letters",
      "Vex Apply browser extension prefill",
      "Text + timed mock interview evaluator",
      "Skill Intelligence & weekly market demand",
    ],
  },
  {
    plan: "Ultra",
    price: "£39 / mo",
    tagline: "Executive & recruiter intelligence suite",
    features: [
      "Gmail / Outlook recruiter email classification",
      "Offer comparator & salary benchmark briefings",
      "Scoped MCP external assistant bridge",
      "Priority company & referral intelligence",
    ],
  },
];

export const FIRST_24H_MILESTONES: {
  window: string;
  title: string;
  outcome: string;
  section: DashboardSectionId;
}[] = [
  {
    window: "0–15 min",
    title: "Account & start onboarding",
    outcome: "Registration + essential baseline",
    section: "profile",
  },
  {
    window: "15–30 min",
    title: "Essential profile & CV",
    outcome: "Write-once facts confirmed",
    section: "documents",
  },
  {
    window: "30–60 min",
    title: "Relevant jobs & why",
    outcome: "87% score + requirement breakdown",
    section: "jobs",
  },
  {
    window: "Hours 1–3",
    title: "Prepare CV & cover letter",
    outcome: "User-approved tailored variant",
    section: "documents",
  },
  {
    window: "Hours 3–6",
    title: "Review fields & submit",
    outcome: "Authorised submit + evidence",
    section: "applications",
  },
  {
    window: "Hours 6–12",
    title: "Organise & start interview prep",
    outcome: "Tracker + HR/technical drills",
    section: "interviews",
  },
  {
    window: "Hours 12–24",
    title: "Mock sessions & close gaps",
    outcome: "Readiness score + learning step",
    section: "learning",
  },
];

export const PHILOSOPHER_COUNCIL = [
  {
    id: "marcus",
    name: "Marcus Aurelius",
    school: "Stoic Praxis",
    greekTerm: "Amor Fati · Embrace Your Craft",
    quote:
      "Waste no more hours debating what an ideal candidate looks like. Verify one truth today, then strike toward the interview.",
    focusHint: "Discipline of action & honest self-audit",
  },
  {
    id: "aristotle",
    name: "Aristotle",
    school: "The Golden Mean",
    greekTerm: "Arete · Proven Excellence",
    quote:
      "We are what we repeatedly demonstrate. An 87% match backed by real proof outweighs a hollow boast every time.",
    focusHint: "Evidence-backed skills & balanced judgement",
  },
  {
    id: "seneca",
    name: "Seneca",
    school: "High Leverage",
    greekTerm: "Telos · Purpose Over Noise",
    quote:
      "It is not that we have a short twenty-four hours, but that we waste most of it on unaligned forms. Release distractions with Ataraxia.",
    focusHint: "Focused 24-hour momentum & calm pruning",
  },
  {
    id: "socrates",
    name: "Socrates",
    school: "Examined Claim",
    greekTerm: "Gnothi Seauton · Know Thyself",
    quote:
      "An unexamined CV invites rejection; an examined skill gap reveals the shortest bridge to mastery.",
    focusHint: "Interrogate requirements & sharpen weak spots",
  },
] as const;

export const INITIAL_JOBS: DashboardJob[] = [
  {
    id: "job-northbridge",
    title: "Product Operations Lead",
    company: "Northbridge Systems",
    location: "London (Hybrid)",
    arrangement: "Hybrid",
    salary: "£68,000 – £78,000",
    source: "Employer Career Board",
    alsoFoundOn: ["Hacker News", "Northbridge Careers"],
    checkedLabel: "Checked today · 10:42",
    redFlags: [],
    deadline: "In 3 days",
    fitBand: "Strong fit",
    compatibilityScore: 87,
    matchingSkills: [
      "JavaScript & Tooling",
      "Cross-functional Rollout",
      "Executive Briefs",
      "Problem Solving",
    ],
    skillsToImprove: ["SQL Cohort Funnel", "Webhook Triage", "System Design"],
    experienceLevel: "Mid",
    industry: "B2B FinTech SaaS",
    employmentType: "Full-time",
    whyFitSummary:
      "Because: 87% match — 5 of 6 must-haves align with your confirmed baseline.",
    philosopherLens: "Aristotle · Golden Mean (87%)",
    philosopherMaxim:
      "Worthy of your Telos: five pillars stand proven on your ledger. Conquer the lone SQL gap and claim the Agora.",
    telosTag: "Praxis & Command",
    requirements: [
      {
        text: "Structured cross-functional rollout workflows",
        mandatory: true,
        sourceSentence:
          '"Own launch readiness across product, compliance, and customer teams."',
        status: "has",
        profileEvidence:
          "CV-derived: led 3 cross-team rollouts at previous employer",
      },
      {
        text: "SQL reporting & conversion funnel diagnostics",
        mandatory: true,
        sourceSentence:
          '"Build weekly conversion diagnostics in SQL and surface drop-off points."',
        status: "improve",
        profileEvidence:
          "Self-reported Basic SQL — below target Intermediate",
      },
      {
        text: "Stakeholder documentation & executive briefs",
        mandatory: true,
        sourceSentence:
          '"Write concise weekly decision memos for product leadership."',
        status: "has",
        profileEvidence: "Confirmed in baseline & experience notes",
      },
      {
        text: "UK work authorisation (no sponsorship restriction)",
        mandatory: true,
        sourceSentence: '"Right to work in the United Kingdom required."',
        status: "has",
        profileEvidence: "Matched from onboarding work arrangement",
      },
      {
        text: "API webhook incident triage familiarity",
        mandatory: false,
        sourceSentence:
          '"Bonus: comfort reading REST API responses during triage."',
        status: "transferable",
        profileEvidence:
          "Transferable from technical support escalation experience",
      },
    ],
    applyUrl: "https://boards.greenhouse.io/northbridge-example",
    atsSupported: "supported",
  },
  {
    id: "job-aldermere",
    title: "Frontend Platform Engineer",
    company: "Aldermere Financial",
    location: "Manchester / Remote UK",
    arrangement: "Remote UK",
    salary: "£62,000 – £72,000",
    source: "RemoteOK",
    alsoFoundOn: ["GitHub Jobs", "Aldermere Careers"],
    checkedLabel: "Checked today · 09:15",
    redFlags: ["Custom portfolio question requires manual copy"],
    deadline: "In 6 days",
    fitBand: "Good fit",
    compatibilityScore: 81,
    matchingSkills: ["React 18+", "TypeScript", "WCAG AA Accessibility"],
    skillsToImprove: ["API Error Recovery", "Playwright Smoke Tests"],
    experienceLevel: "Mid",
    industry: "Financial Infrastructure",
    employmentType: "Full-time",
    whyFitSummary:
      "Because: 81% match — strong React/TypeScript overlap; add API retry evidence.",
    philosopherLens: "Socrates · Craft & Techne",
    philosopherMaxim:
      "True builders test failure before Fortune strikes: your React craft shines — arm it with resilient API proof.",
    telosTag: "Techne & Systems",
    requirements: [
      {
        text: "React 18+ & TypeScript UI architecture",
        mandatory: true,
        sourceSentence:
          '"Develop accessible React and TypeScript flows for client workspaces."',
        status: "has",
        profileEvidence:
          "CV-derived: shipped component library across 2 products",
      },
      {
        text: "REST API integration & explicit error recovery states",
        mandatory: true,
        sourceSentence:
          '"Design resilient API clients with clear retry and fallback UI states."',
        status: "missing",
        profileEvidence:
          "No verified assessment or project evidence on profile yet",
      },
      {
        text: "WCAG AA keyboard & focus accessibility",
        mandatory: true,
        sourceSentence:
          '"Ensure 4.5:1 text contrast and full keyboard navigability."',
        status: "has",
        profileEvidence: "Confirmed accessibility audit experience in CV",
      },
      {
        text: "Automated Vitest / Playwright coverage",
        mandatory: false,
        sourceSentence: '"Preferred: end-to-end smoke checks on key journeys."',
        status: "improve",
        profileEvidence:
          "Self-reported exposure; add one verifiable repo example",
      },
    ],
    applyUrl: "https://careers.aldermere-example.co.uk/frontend",
    atsSupported: "partial",
  },
  {
    id: "job-meridian",
    title: "Strategy & Readiness Associate",
    company: "Meridian Advisory",
    location: "London (On-site)",
    arrangement: "London On-site",
    salary: "£56,000 – £64,000",
    source: "Hacker News",
    alsoFoundOn: ["Employer Career Board"],
    checkedLabel: "Checked 9 days ago",
    isStale: true,
    redFlags: [
      "Last verified 9 days ago — confirm opening on employer page before tailoring",
    ],
    deadline: null,
    fitBand: "Partial gap",
    compatibilityScore: 68,
    matchingSkills: ["Primary Market Synthesis", "Executive Writing"],
    skillsToImprove: ["SQL Cohort Modelling", "Financial Sensitivity Tables"],
    experienceLevel: "Entry",
    industry: "Strategy Consulting",
    employmentType: "Full-time",
    whyFitSummary:
      "Because: 68% match — analytical communication aligns; cohort SQL is missing.",
    philosopherLens: "Seneca · Temperance & Scrutiny",
    philosopherMaxim:
      "Nine days stale on the forum wall — inspect with calm Ataraxia before pouring gold-standard hours here.",
    telosTag: "Measured Scrutiny",
    requirements: [
      {
        text: "Primary market synthesis & concise executive writing",
        mandatory: true,
        sourceSentence:
          '"Turn primary interviews into structured brief slides."',
        status: "has",
        profileEvidence: "Confirmed research & writing history in baseline",
      },
      {
        text: "SQL & spreadsheet cohort modelling",
        mandatory: true,
        sourceSentence:
          '"Model retention cohorts cleanly in SQL and spreadsheet workbooks."',
        status: "missing",
        profileEvidence:
          "Recurring gap across 3 saved roles — plan SQL step first",
      },
    ],
    applyUrl: "https://jobs.lever.co/meridian-example",
    atsSupported: "unsupported",
  },
  {
    id: "job-cairn",
    title: "Developer Experience Intern",
    company: "Cairn Cloud",
    location: "Remote Europe / UK",
    arrangement: "Remote UK",
    salary: "£2,600 / mo",
    source: "GitHub",
    alsoFoundOn: ["RemoteOK"],
    checkedLabel: "Checked today · 11:05",
    redFlags: [],
    deadline: "In 11 days",
    fitBand: "Strong fit",
    compatibilityScore: 84,
    matchingSkills: ["Documentation Audits", "React UI", "TypeScript"],
    skillsToImprove: ["CLI Telemetry Basics"],
    experienceLevel: "Entry",
    industry: "Developer Tools",
    employmentType: "Internship",
    whyFitSummary:
      "Because: 84% match — your React clarity and docs work cover almost all core tasks.",
    philosopherLens: "Marcus Aurelius · Agile Forge",
    philosopherMaxim:
      "High clarity, clean scope, transparent compensation — an honourable opening to cultivate new mastery.",
    telosTag: "Logos & Clarity",
    requirements: [
      {
        text: "Interactive docs examples in TypeScript & React",
        mandatory: true,
        sourceSentence:
          '"Author clear quickstart apps and interactive snippets."',
        status: "has",
        profileEvidence: "Matched from React/TypeScript UI evidence",
      },
      {
        text: "Part-time or internship schedule availability (16–32 hrs)",
        mandatory: false,
        sourceSentence: '"Supports flexible part-time university term rhythm."',
        status: "has",
        profileEvidence: "Matches flexible UK remote setup",
      },
    ],
    applyUrl: "https://github.com/cairn-cloud/careers",
    atsSupported: "supported",
  },
  {
    id: "job-veritas",
    title: "AI Workflow Strategist",
    company: "Veritas Civic Labs",
    location: "London / Hybrid",
    arrangement: "Hybrid",
    salary: "£74,000 – £86,000",
    source: "Hacker News",
    alsoFoundOn: ["Employer Career Board"],
    checkedLabel: "Checked 2 hours ago",
    redFlags: [],
    deadline: "In 5 days",
    fitBand: "Strong fit",
    compatibilityScore: 91,
    matchingSkills: [
      "Executive Briefs",
      "Cross-functional Rollout",
      "TypeScript Tooling",
      "Human-in-the-Loop QA",
    ],
    skillsToImprove: ["Evaluation Harnesses"],
    experienceLevel: "Mid",
    industry: "Applied AI Governance",
    employmentType: "Full-time",
    whyFitSummary:
      "Because: 91% match — directly mirrors your operational rollouts and UI verification background.",
    philosopherLens: "Plato · Sovereign Reason (91%)",
    philosopherMaxim:
      "Rare alignment of Logos and Praxis: claim this scroll with Amor Fati before competitors finish reading it.",
    telosTag: "Summum Bonum",
    requirements: [
      {
        text: "Design verifiable human-in-the-loop approval workflows",
        mandatory: true,
        sourceSentence:
          '"Build audit trails where users approve every high-impact AI action."',
        status: "has",
        profileEvidence: "Confirmed directly from Vex UX & Ops track record",
      },
      {
        text: "Structured rubric evaluations across prompts",
        mandatory: false,
        sourceSentence: '"Bonus: familiarity with structured output grading."',
        status: "transferable",
        profileEvidence: "Transferable from release quality checklists",
      },
    ],
    applyUrl: "https://news.ycombinator.com/jobs",
    atsSupported: "supported",
  },
  {
    id: "job-obsidian",
    title: "Junior Growth Outreach Rep",
    company: "HyperScale Cold Email Co.",
    location: "Manchester (Full On-site)",
    arrangement: "London On-site",
    salary: "£28,000 + uncapped dial commission",
    source: "RemoteOK",
    alsoFoundOn: ["Generic Aggregator"],
    checkedLabel: "Checked 12 days ago",
    isStale: true,
    redFlags: [
      "Heavy cold-calling mismatch vs your product/engineering target",
      "Listing stale >10 days",
    ],
    deadline: null,
    fitBand: "Partial gap",
    compatibilityScore: 34,
    matchingSkills: ["Clear Writing"],
    skillsToImprove: ["B2B Cold Dialing", "Quota Crushing"],
    experienceLevel: "Entry",
    industry: "High-Volume Outbound Agency",
    employmentType: "Full-time",
    whyFitSummary:
      "Because: 34% match — deviates sharply from your Product Ops / Frontend career trajectory.",
    philosopherLens: "Diogenes · Cynic's Lantern (34%)",
    philosopherMaxim:
      "Set down the lantern and pass with serene Ataraxia — chasing hollow volume robs tomorrow's true calling.",
    telosTag: "Pass Candidate",
    requirements: [
      {
        text: "80 outbound cold calls daily from office desk",
        mandatory: true,
        sourceSentence: '"Must love relentless daily cold outreach quotas."',
        status: "missing",
        profileEvidence: "Conflicts with confirmed target role & hybrid preference",
      },
    ],
    applyUrl: "https://remoteok.com/example-outbound",
    atsSupported: "unsupported",
  },
];

export const INITIAL_APPLICATIONS: DashboardApplication[] = [
  {
    id: "app-1",
    jobId: "job-northbridge",
    title: "Product Operations Lead",
    company: "Northbridge Systems",
    stage: "Prepared",
    submissionState: "prepared",
    evidenceText:
      "Prepared, not submitted — CV diff & letter ready for your review",
    quietDays: 0,
    deadline: "In 3 days",
    priority: "High",
    cvVariant: "Northbridge_Product_Ops_v2 (Draft)",
    coverLetterApproved: false,
    checklist: {
      cvReviewed: true,
      letterApproved: false,
      questionsAnswered: true,
      fieldsChecked: false,
    },
    notes:
      "Emphasise 2025 onboarding workflow redesign; omit unverified revenue claims.",
    followUpDate: "2026-11-18",
    history: [
      {
        at: "Today · 10:51",
        actor: "Vex Extension",
        event:
          "Pre-filled 12 supported Greenhouse fields (paused before submit)",
      },
      {
        at: "Today · 10:15",
        actor: "Vex Workspace",
        event: "Created role-specific CV variant from untouched base profile",
      },
    ],
    extensionFields: [
      {
        id: "ef-1",
        label: "Full legal name",
        value: "From confirmed profile",
        source: "Profile baseline",
        status: "Filled",
      },
      {
        id: "ef-2",
        label: "Tailored CV attachment",
        value: "Northbridge_Product_Ops_v2.pdf",
        source: "CV Studio (Diff reviewed)",
        status: "Filled",
      },
      {
        id: "ef-3",
        label: "Why Northbridge Systems? (Free-text screening)",
        value: "Drafted from job requirements — awaiting your final edit",
        source: "Question assistance",
        status: "Needs review",
      },
      {
        id: "ef-4",
        label: "Earliest start date / notice period",
        value: "",
        source: "Not in onboarding baseline",
        status: "Needs input",
      },
      {
        id: "ef-5",
        label: "Equal opportunities & diversity disclosure",
        value: "Never auto-filled",
        source: "Sensitive field policy",
        status: "Skipped by user",
      },
    ],
  },
  {
    id: "app-2",
    jobId: "job-aldermere",
    title: "Frontend Platform Engineer",
    company: "Aldermere Financial",
    stage: "Applied",
    submissionState: "verified-submitted",
    evidenceText:
      "Verified submitted — confirmation page hash captured (Today · 08:40)",
    quietDays: 6,
    deadline: "Closed",
    priority: "High",
    cvVariant: "Aldermere_Frontend_v1 (Submitted)",
    coverLetterApproved: true,
    checklist: {
      cvReviewed: true,
      letterApproved: true,
      questionsAnswered: true,
      fieldsChecked: true,
    },
    notes:
      "Prepare 2 STAR stories around API retry states before screening call.",
    followUpDate: "2026-11-15",
    history: [
      {
        at: "6 days ago · 08:40",
        actor: "User",
        event:
          "Explicitly clicked Submit on employer portal; confirmation recorded",
      },
    ],
    extensionFields: [
      {
        id: "ef-6",
        label: "Core profile & GitHub link",
        value: "Filled & approved",
        source: "Profile baseline",
        status: "Filled",
      },
      {
        id: "ef-7",
        label: "Custom portfolio question",
        value: "Copied via manual fallback pack",
        source: "Application Pack",
        status: "Unsupported",
      },
    ],
  },
  {
    id: "app-3",
    jobId: "job-meridian",
    title: "Strategy & Readiness Associate",
    company: "Meridian Advisory",
    stage: "Interview",
    submissionState: "user-reported-submitted",
    evidenceText:
      "User-reported submitted — marked applied by you; invitation forwarded",
    quietDays: 2,
    priority: "Standard",
    interviewDate: "Tue 17 Nov · 10:00 GMT",
    interviewFormat: "45 min Structured Panel (Video)",
    cvVariant: "Base_Profile_CV (Clean copy)",
    coverLetterApproved: true,
    checklist: {
      cvReviewed: true,
      letterApproved: true,
      questionsAnswered: true,
      fieldsChecked: true,
    },
    notes:
      "Employer invited via email — practice SQL cohort question before Tuesday.",
    followUpDate: "2026-11-18",
    history: [
      {
        at: "2 days ago",
        actor: "User",
        event: "Recorded interview invitation (source: forwarded email)",
      },
      {
        at: "9 days ago",
        actor: "User",
        event: "Marked as User-reported submitted after external form",
      },
    ],
    extensionFields: [
      {
        id: "ef-8",
        label: "Meridian custom PDF portal",
        value: "Manual copy pack used — portal blocks extension writes",
        source: "Unsupported-form fallback",
        status: "Unsupported",
      },
    ],
  },
];

export const INITIAL_CV_DIFFS: CvDiffSuggestion[] = [
  {
    id: "diff-1",
    section: "Experience · Latest Role",
    original:
      "Responsible for coordinating product releases and updating internal spreadsheets.",
    suggested:
      "Coordinated cross-functional product launches across engineering and support, standardising release readiness checklists.",
    reason:
      "Aligns wording with Northbridge's mandatory rollout requirement using only confirmed duties.",
    sourceFact:
      "Baseline bullet #2: 'Coordinated product launches with eng & support'",
    hasUnsupportedClaim: false,
    status: "pending",
  },
  {
    id: "diff-2",
    section: "Experience · Metrics",
    original: "Improved onboarding completion for new accounts.",
    suggested:
      "Delivered a 42% jump in 24-hour onboarding activation across 1,200 enterprise accounts.",
    reason: "Matches quantitative impact preference in listing.",
    sourceFact: "Not found in baseline or uploaded CV excerpt.",
    hasUnsupportedClaim: true,
    unsupportedNote:
      "Blocked for export: '42%' and '1,200 enterprise accounts' were not supplied by you. Replace with real numbers or reject.",
    status: "pending",
  },
  {
    id: "diff-3",
    section: "Summary · Opening",
    original:
      "Results-driven professional passionate about scaling excellence.",
    suggested:
      "Operations & product delivery generalist experienced in documented rollouts and SQL reporting.",
    reason:
      "Removes generic AI-slop clichés in favour of plain, specific terms.",
    sourceFact: "Role trajectory + confirmed tools",
    hasUnsupportedClaim: false,
    status: "pending",
  },
];

export const INITIAL_CV_QUALITY_FLAGS: CvQualityFlag[] = [
  {
    id: "qf-1",
    type: "Unsupported claim",
    lineRef: "Diff #2 (Experience)",
    message:
      "Unverified percentage ('42%') not backed by your baseline facts.",
    suggestion: "Reject or enter exact figure you can defend in interview.",
    resolved: false,
  },
  {
    id: "qf-2",
    type: "Vague phrasing",
    lineRef: "Summary line 1",
    message: "Phrase 'passion for excellence' reads like generic template filler.",
    suggestion: "Replace with specific domains and confirmed scope.",
    resolved: false,
  },
  {
    id: "qf-3",
    type: "Consistency",
    lineRef: "Employment dates",
    message:
      "Verify Oct 2024 end month matches both your LinkedIn and cover letter.",
    suggestion: "Confirm month once inside your canonical baseline.",
    resolved: true,
  },
];

export const INITIAL_SKILLS: SkillRecord[] = [
  {
    id: "sk-1",
    name: "Cross-functional Delivery & Rollout",
    category: "Operations & Execution",
    proficiency: "Advanced",
    confidence: "High",
    confidenceReason:
      "Confirmed across 2 prior roles + documented interview story",
    evidenceTier: "CV-derived",
    sourceLabel: "Imported CV + Onboarding Baseline",
    linkedJobsCount: 3,
    challengeHistory: [],
  },
  {
    id: "sk-2",
    name: "SQL & Cohort Diagnostics",
    category: "Analytical & Data",
    proficiency: "Basic",
    confidence: "Low",
    confidenceReason:
      "Mentioned in preferences; required by 3 saved jobs without proof yet",
    evidenceTier: "Self-reported",
    sourceLabel: "Manual entry during setup",
    linkedJobsCount: 3,
    isMandatoryGap: true,
    challengeHistory: [],
  },
  {
    id: "sk-3",
    name: "API Integration & Error Recovery",
    category: "Frontend Engineering",
    proficiency: "Basic",
    confidence: "Medium",
    confidenceReason:
      "Present in code coursework; pending practical Vex exercise",
    evidenceTier: "Self-reported",
    sourceLabel: "Coursework list",
    linkedJobsCount: 2,
    isMandatoryGap: true,
    challengeHistory: [],
  },
  {
    id: "sk-4",
    name: "Accessible React & TypeScript UI",
    category: "Frontend Engineering",
    proficiency: "Intermediate",
    confidence: "High",
    confidenceReason:
      "Demonstrated inside Vex practical review + CV history",
    evidenceTier: "Demonstrated in Vex",
    sourceLabel: "Completed Vex UI accessibility check",
    linkedJobsCount: 2,
    challengeHistory: [],
  },
  {
    id: "sk-5",
    name: "UK PRINCE2 Foundation",
    category: "Governance",
    proficiency: "Intermediate",
    confidence: "High",
    confidenceReason: "Certificate ID cross-checked against external register",
    evidenceTier: "Verified credential",
    sourceLabel: "External issuer record #UK-88412",
    linkedJobsCount: 1,
    challengeHistory: [],
  },
];

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: "crs-1",
    title: "SQL Funnel & Cohort Queries in 90 Minutes",
    origin: "YouTube video lesson",
    provider: "Mode Analytics + Curated SQL Walk-through (Free)",
    cost: "Free",
    duration: "1h 30m",
    level: "Intermediate",
    skillTargeted: "SQL & Cohort Diagnostics",
    whyRecommended: "Closes mandatory gap shared across 3 saved roles.",
    doesProve:
      "Shows exposure once practical query check is passed inside Vex.",
    doesNotProve:
      "Does not guarantee an employer interview or SQL certification.",
    quizSummary: "5-question funnel SELECT / GROUP BY quiz included",
    milestoneLabel: "Milestone 1 of 3 · Funnel Diagnostics",
    status: "In progress",
  },
  {
    id: "crs-2",
    title: "API Error States & Retry Patterns",
    origin: "AI-generated lesson",
    provider: "Vex Lesson Studio (Targeted to Aldermere spec)",
    cost: "Included",
    duration: "25 min",
    level: "Basic",
    skillTargeted: "API Integration & Error Recovery",
    whyRecommended: "Directly requested in Aldermere Financial listing line 4.",
    doesProve: "Demonstrated skill inside Vex if practical exercise passes.",
    doesNotProve: "Not an accredited external credential.",
    quizSummary: "3-part HTTP 429 / 503 retry recovery drill",
    milestoneLabel: "Milestone 1 of 1 · Practical Evidence",
    status: "Not started",
  },
  {
    id: "crs-3",
    title: "Structured STAR Answers Under Pressure",
    origin: "External resource",
    provider: "Vex Interview Lab",
    cost: "Included",
    duration: "20 min",
    level: "Intermediate",
    skillTargeted: "Cross-functional Delivery & Rollout",
    whyRecommended: "Prepares concise answers for Tuesday's Meridian panel.",
    doesProve: "Ready phrasing & rehearsed examples from your own background.",
    doesNotProve: "Vex never predicts employer hiring decisions.",
    quizSummary: "2 timed verbal framing checkpoints",
    milestoneLabel: "Completed · Ready for Panel",
    status: "Completed",
  },
];

export const INITIAL_DAILY_PLAN: DailyPlanTask[] = [
  {
    id: "dp-1",
    type: "CV",
    title: "Resolve Diff #2 unsupported claim for Northbridge application",
    duration: "5 min",
    targetSection: "documents",
    done: false,
  },
  {
    id: "dp-2",
    type: "Job search",
    title:
      "Review notice period & submit authorised Northbridge Greenhouse form",
    duration: "10 min",
    targetSection: "applications",
    done: false,
  },
  {
    id: "dp-3",
    type: "Interview",
    title: "Practise 1 behavioural + SQL question for Tuesday Meridian panel",
    duration: "15 min",
    targetSection: "interviews",
    done: false,
  },
  {
    id: "dp-4",
    type: "Learning",
    title:
      "Complete API Error Recovery 3-question check to upgrade skill tier",
    duration: "15 min",
    targetSection: "learning",
    done: false,
  },
];

export const INITIAL_MCP_CONNECTIONS: McpConnection[] = [
  {
    id: "mcp-jobs",
    name: "Greenhouse & Public Career Feed",
    publisher: "Vex Pilot Read-Only Connector",
    category: "Job-listing source",
    status: "Connected",
    statusNote: "Healthy — tested today at 10:42",
    permissionSummary: "Read only · Search terms & open status only",
    duration: "30 days",
    lastUsed: "Today · 10:42",
    dataShared: "Role keywords, city, remote preference",
  },
  {
    id: "mcp-inbox",
    name: "Gmail Recruiter Filter (Read-Only)",
    publisher: "Google Workspace OAuth Scope",
    category: "Inbox",
    status: "Connected",
    statusNote: "Scoped — recruiter & ATS sender labels only",
    permissionSummary: "Read interview & confirmation threads only",
    duration: "30 days",
    lastUsed: "Today · 09:58",
    dataShared: "Sender domain, subject, interview time parse",
  },
  {
    id: "mcp-docs",
    name: "Google Drive — Selected Portfolio Folder",
    publisher: "Google Workspace MCP (Pilot)",
    category: "Document storage",
    status: "Connected",
    statusNote: "Scoped — read chosen files only",
    permissionSummary: "Read chosen files only · Never edits source",
    duration: "Until I disconnect",
    lastUsed: "3 days ago",
    dataShared: "Baseline CV file selected by you",
  },
  {
    id: "mcp-cal",
    name: "Calendar Free/Busy Reader",
    publisher: "Workspace Calendar Connector",
    category: "Calendar",
    status: "Not working",
    statusNote:
      "Sign-in expired — Vex will never guess free slots while offline",
    permissionSummary: "Read free/busy only",
    duration: "This task only",
    lastUsed: "4 days ago",
    dataShared: "None while disconnected",
  },
];

export const INITIAL_EXTERNAL_AI_APPS: ExternalAiAppAccess[] = [
  {
    id: "ext-matches",
    feature: "Top job matches & reasons",
    description:
      "Lets an approved AI assistant read match reasons (no personal contact info).",
    approvalRule: "Allowed once switched on",
    enabled: false,
  },
  {
    id: "ext-tracker",
    feature: "Application tracker summary",
    description: "Read company, role, 3-state status, and quiet days.",
    approvalRule: "Allowed once switched on",
    enabled: false,
  },
  {
    id: "ext-gaps",
    feature: "Role skill-gap list",
    description: "Read missing mandatory & preferred skills for selected jobs.",
    approvalRule: "Allowed once switched on",
    enabled: false,
  },
  {
    id: "ext-fullcv",
    feature: "Full CV & personal contact details",
    description:
      "Strict per-request gate — never shared silently; passwords never accessible.",
    approvalRule: "Per request",
    enabled: false,
  },
];

export const INITIAL_MCP_ACTIVITY: McpActivityEntry[] = [
  {
    id: "act-1",
    time: "Today · 10:51",
    actor: "You",
    tool: "Vex Browser Extension",
    action: "Prepared 12 Greenhouse fields (stopped before send)",
    dataShared: "Profile baseline, Northbridge draft CV",
    approval: "Approved",
    result: "Succeeded",
  },
  {
    id: "act-2",
    time: "Today · 10:42",
    actor: "You",
    tool: "Greenhouse & Public Feed",
    action: "Checked freshness & deduplicated 3 listings",
    dataShared: "Target role title, UK hybrid preference",
    approval: "Not needed",
    result: "Succeeded",
  },
  {
    id: "act-3",
    time: "Yesterday · 16:10",
    actor: "Vex Assistant",
    tool: "Calendar Free/Busy",
    action: "Check Tuesday interview availability",
    dataShared: "None — sign-in expired",
    approval: "Denied",
    result: "Not run",
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "al-1",
    group: "Today",
    category: "Deadline",
    title: "Northbridge Systems closes in 3 days",
    detail:
      "Your application is Prepared (not submitted). 1 screening question needs final review.",
    actionLabel: "Review application",
    targetSection: "applications",
    dismissed: false,
  },
  {
    id: "al-2",
    group: "Today",
    category: "Recruiter",
    title: "Gmail detected interview schedule confirmation from Meridian",
    detail:
      "Hannah Patel confirmed Tue 17 Nov · 10:00 GMT structured panel. Mock briefing ready.",
    actionLabel: "Open interview prep",
    targetSection: "interviews",
    dismissed: false,
  },
  {
    id: "al-3",
    group: "Today",
    category: "Follow-up",
    title: "Aldermere Financial quiet for 6 days",
    detail:
      "Verified submitted 6 days ago. Polite check-in note drafted in Tracker.",
    actionLabel: "Open tracker",
    targetSection: "applications",
    dismissed: false,
  },
  {
    id: "al-4",
    group: "Earlier",
    category: "System",
    title: "Calendar MCP sign-in expired",
    detail:
      "Reconnect in Assistant & MCP Hub to check free slots before replying to invites.",
    actionLabel: "Open MCP Hub",
    targetSection: "mcp",
    dismissed: false,
  },
];

export const INITIAL_CONTACTS: NetworkContact[] = [
  {
    id: "nc-1",
    name: "Hannah Patel",
    role: "Talent Partner",
    company: "Meridian Advisory",
    linkedApplication: "Strategy & Readiness Associate",
    nextFollowUp: "Mon 16 Nov",
    referralPath: "Direct recruiter thread (Gmail matched)",
    note: "Sent structured panel invite for Tue 17 Nov 10:00 GMT. Confirm availability once checked.",
  },
  {
    id: "nc-2",
    name: "Daniel Okafor",
    role: "Head of Product Ops (Hiring Manager)",
    company: "Northbridge Systems",
    linkedApplication: "Product Operations Lead",
    nextFollowUp: "After authorised submit",
    referralPath: "London Product Ops Roundtable (Warm intro)",
    note: "Spoke at roundtable on launch checklists; reference clean operational cadence.",
  },
  {
    id: "nc-3",
    name: "Claire Benton",
    role: "Staff Frontend Engineer",
    company: "Aldermere Financial",
    linkedApplication: "Frontend Platform Engineer",
    nextFollowUp: "Fri 20 Nov",
    referralPath: "2nd-degree Alumni Network",
    note: "Shared public engineering blog on React resilience and accessibility standards.",
  },
];

export const INITIAL_RECRUITER_EMAILS: RecruiterEmailItem[] = [
  {
    id: "em-1",
    provider: "Gmail",
    sender: "hannah.patel@meridian-advisory.example",
    company: "Meridian Advisory",
    subject: "Panel Interview Confirmation — Strategy & Readiness Associate",
    receivedAt: "Today · 09:45",
    classification: "Interview Invitation",
    extractedSummary:
      "45 min panel on Tue 17 Nov at 10:00 GMT · Includes 1 SQL cohort walkthrough.",
    linkedApplicationId: "app-3",
    suggestedReply:
      "Hi Hannah, thank you for confirming Tuesday 17 November at 10:00 GMT. I look forward to speaking with the panel and walking through my rollout and SQL cohort examples.",
  },
  {
    id: "em-2",
    provider: "Outlook",
    sender: "noreply@aldermere-careers.example",
    company: "Aldermere Financial",
    subject: "Application received: Frontend Platform Engineer",
    receivedAt: "6 days ago · 08:42",
    classification: "Application Confirmation",
    extractedSummary:
      "Auto-matched to verified submission ID #ALD-9942. Typical review window 7–10 working days.",
    linkedApplicationId: "app-2",
    suggestedReply:
      "Optional follow-up note ready at day 7: polite check-in linking your API retry state demo.",
  },
];

export const INITIAL_COMPANY_INTEL: CompanyIntelItem[] = [
  {
    id: "co-1",
    name: "Northbridge Systems",
    sector: "B2B Payments & Treasury SaaS",
    size: "240 employees (Series B)",
    headquarters: "London, UK",
    hiringVelocity: "Active — 4 Ops & Product hires this month",
    cultureSignals:
      "Written decision memos over slide decks; structured onboarding KPIs.",
    salaryRange: "£65k – £80k",
    openMatchedRoles: 2,
  },
  {
    id: "co-2",
    name: "Aldermere Financial",
    sector: "Clearing & Embedded Finance",
    size: "480 employees",
    headquarters: "Manchester / Remote UK",
    hiringVelocity: "Moderate — Frontend Platform & Risk tooling focus",
    cultureSignals:
      "Strong emphasis on WCAG accessibility and fault-tolerant client states.",
    salaryRange: "£60k – £75k",
    openMatchedRoles: 1,
  },
  {
    id: "co-3",
    name: "Cairn Cloud",
    sector: "Developer Tooling & SDKs",
    size: "65 employees (Seed+)",
    headquarters: "Remote Europe",
    hiringVelocity: "High growth — hiring DevEx & docs engineers",
    cultureSignals: "Open-source changelog transparency; GitHub-first workflow.",
    salaryRange: "£30k – £45k (Intern/Junior)",
    openMatchedRoles: 1,
  },
];

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "Cross-Team Release Readiness Kit",
    role: "Product Ops Case Study",
    outcome: "Standardised launch handoffs across Product, Support & Compliance.",
    verifiedSkills: ["Rollout Workflows", "Executive Briefs"],
    linkLabel: "notion.so/launch-kit-summary",
  },
  {
    id: "proj-2",
    title: "Accessible Multi-Step Intake Workspace",
    role: "Frontend Architecture Sample",
    outcome: "Keyboard-navigable React 18 & TypeScript state flow.",
    verifiedSkills: ["React 18+", "TypeScript", "WCAG AA"],
    linkLabel: "github.com/candidate/vex-intake-demo",
  },
];

export const INITIAL_OFFER_COMPARISONS: OfferComparisonRow[] = [
  {
    id: "off-1",
    company: "Northbridge Systems (Target Pipeline)",
    role: "Product Operations Lead",
    baseSalary: 73000,
    bonusOrEquity: "8% performance + 0.05% options",
    arrangement: "Hybrid (2 days London)",
    commuteMinutes: 35,
    growthFit: "Direct path to Head of Product Ops",
    benefitsNote: "£1,500 annual L&D budget",
  },
  {
    id: "off-2",
    company: "Aldermere Financial (Active Process)",
    role: "Frontend Platform Engineer",
    baseSalary: 68000,
    bonusOrEquity: "10% discretionary cash",
    arrangement: "Remote UK (1 day/month Manchester)",
    commuteMinutes: 0,
    growthFit: "Senior UI Platform track",
    benefitsNote: "Home office stipend + private health",
  },
];

export const MARKET_DEMAND_BENCHMARKS: MarketDemandBenchmark[] = [
  {
    skill: "SQL Cohort & Funnel Diagnostics",
    demandChange: "+31% in matched UK Ops/Product specs",
    medianSalaryLift: "+£6,500",
    openRolesMatched: 14,
    priority: "Immediate",
  },
  {
    skill: "TypeScript API Resilience & Retry States",
    demandChange: "+24% across FinTech Frontend roles",
    medianSalaryLift: "+£5,000",
    openRolesMatched: 9,
    priority: "Quarter 1",
  },
  {
    skill: "Product Analytics & Experiment Design",
    demandChange: "+19% across Senior Ops Lead roles",
    medianSalaryLift: "+£9,000",
    openRolesMatched: 7,
    priority: "Long-term",
  },
];
