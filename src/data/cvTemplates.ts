/* CV template catalogue. Every template is one column and ATS-readable;
   `base` is the layout the editor understands, `style` tunes the preview. */

export type CvBase = "editorial" | "classic" | "executive";
export type CvCategory = "Professional" | "Early career" | "Technical" | "Leadership" | "Career change" | "Academic";

export interface CvTemplate {
  id: string;
  name: string;
  base: CvBase;
  category: CvCategory;
  tagline: string;
  bestFor: string[];
  sections: string[]; // order shown on the page
  pages: "1 page" | "1–2 pages" | "2+ pages";
  accent: string;
  headingFont: "serif" | "sans" | "caps";
  align: "left" | "center";
  popular?: boolean;
  tips: string[];
}

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: "editorial-clean",
    name: "Editorial Clean",
    base: "editorial",
    category: "Professional",
    tagline: "Calm serif headings, generous spacing. The Vex default.",
    bestFor: ["Product & operations", "Most office roles", "UK & EU applications"],
    sections: ["Summary", "Experience", "Skills", "Education"],
    pages: "1–2 pages",
    accent: "#212d3d",
    headingFont: "serif",
    align: "left",
    popular: true,
    tips: ["Keep the summary to 2–3 lines.", "Lead each bullet with a verb and end with a result."],
  },
  {
    id: "classic-single",
    name: "Classic Single-Column",
    base: "classic",
    category: "Professional",
    tagline: "Plain, centred header. Safest for strict applicant systems.",
    bestFor: ["Large corporates", "Public sector", "Banks & insurers"],
    sections: ["Summary", "Experience", "Education", "Skills"],
    pages: "1–2 pages",
    accent: "#33445c",
    headingFont: "sans",
    align: "center",
    popular: true,
    tips: ["Use standard headings so parsers find each section.", "Avoid tables and text boxes."],
  },
  {
    id: "executive-brief",
    name: "Executive Brief",
    base: "executive",
    category: "Leadership",
    tagline: "Uppercase headings and a results-first summary.",
    bestFor: ["Head of / Director roles", "Board & senior hires", "10+ years' experience"],
    sections: ["Profile", "Key results", "Experience", "Education"],
    pages: "2+ pages",
    accent: "#212d3d",
    headingFont: "caps",
    align: "left",
    tips: ["Open with 3 measurable results you can prove.", "Group early roles into one line."],
  },
  {
    id: "graduate-starter",
    name: "Graduate Starter",
    base: "classic",
    category: "Early career",
    tagline: "Education and projects first, for when work history is short.",
    bestFor: ["Graduates", "Internships", "First full-time role"],
    sections: ["Education", "Projects", "Skills", "Experience"],
    pages: "1 page",
    accent: "#2f6b4f",
    headingFont: "sans",
    align: "left",
    tips: ["Projects count as evidence — say what you built.", "One page is plenty."],
  },
  {
    id: "skills-first",
    name: "Skills-First",
    base: "editorial",
    category: "Career change",
    tagline: "Transferable skills up top, then the roles that prove them.",
    bestFor: ["Changing industry", "Returning to work", "Portfolio careers"],
    sections: ["Summary", "Skills", "Projects", "Experience"],
    pages: "1–2 pages",
    accent: "#6b5b95",
    headingFont: "serif",
    align: "left",
    tips: ["Tie each skill to a real example below.", "Explain gaps in one honest line."],
  },
  {
    id: "technical",
    name: "Technical",
    base: "classic",
    category: "Technical",
    tagline: "Tools and stack visible at a glance, then shipped work.",
    bestFor: ["Engineering", "Data & analytics", "IT & security"],
    sections: ["Skills", "Experience", "Projects", "Education"],
    pages: "1–2 pages",
    accent: "#3f6b8a",
    headingFont: "sans",
    align: "left",
    popular: true,
    tips: ["List only tools you could be tested on.", "Link to code or a demo you're proud of."],
  },
  {
    id: "academic",
    name: "Academic CV",
    base: "classic",
    category: "Academic",
    tagline: "Room for research, publications and teaching.",
    bestFor: ["PhD & postdoc", "Lecturer roles", "Research posts"],
    sections: ["Education", "Research", "Experience", "Skills"],
    pages: "2+ pages",
    accent: "#8a5a2b",
    headingFont: "serif",
    align: "left",
    tips: ["Newest first in every section.", "Give full citations for publications."],
  },
  {
    id: "minimal-mono",
    name: "Minimal",
    base: "editorial",
    category: "Professional",
    tagline: "Quiet and compact. Lets strong content speak.",
    bestFor: ["Design-aware companies", "Startups", "Consulting"],
    sections: ["Summary", "Experience", "Skills", "Education"],
    pages: "1 page",
    accent: "#5a6675",
    headingFont: "sans",
    align: "left",
    tips: ["Cut anything older than 10 years.", "White space is part of the design."],
  },
];

export const CV_CATEGORIES: ("All" | CvCategory)[] = ["All", "Professional", "Early career", "Technical", "Leadership", "Career change", "Academic"];

export const CHOSEN_TEMPLATE_KEY = "vex_cv_template";
