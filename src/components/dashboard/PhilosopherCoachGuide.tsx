"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { DashboardSectionId } from "@/data/dashboard";

/* ------------------------------------------------------------------ */
/*  Tour content — one page per dashboard section, one step per feature */
/* ------------------------------------------------------------------ */

interface TourStep {
  /** Feature name shown as the bubble headline. */
  title: string;
  /** Visible text of the real button to spotlight. Omit for the page intro. */
  matchText?: string;
  /** What the character says (typed out). */
  say: string;
  /** Step-by-step "how to use" list. */
  how?: string[];
  /** Extra coaching tip. */
  tip?: string;
}

interface TourPage {
  section: DashboardSectionId;
  pageName: string;
  philosopher: string;
  roleTitle: string;
  accent: string;
  steps: TourStep[];
}

const TOUR: TourPage[] = [
  {
    section: "overview",
    pageName: "Agora Home",
    philosopher: "Aristotle",
    roleTitle: "Chief Strategist",
    accent: "#b88b32",
    steps: [
      {
        title: "Welcome to your Agora!",
        say: "Greetings, new explorer! I am Aristotle, and I'll walk you through every corner of Vex. This home screen is your command centre — today's tasks, live charts and your readiness score all live here.",
        how: [
          "Tap anywhere on the dark area (or press →) to continue.",
          "Press ← to go back a step, Esc to hide me at any time.",
          "Re-open me later with the Coach Guide button in the top bar.",
        ],
        tip: "The tour follows you page by page — finish one page and I'll lead you to the next.",
      },
      {
        title: "The Oracle's daily counsel",
        matchText: "CYCLE",
        say: "The Oracle card gives you a short piece of stoic or strategic advice for the job hunt. Tap CYCLE to hear from the next sage.",
        how: [
          "Tap CYCLE to rotate to the next philosopher's counsel.",
          "Each quote comes with a practical action for today.",
        ],
        tip: "Rough day of rejections? Cycle to Marcus Aurelius — he's good at those.",
      },
      {
        title: "7-Point Readiness audit",
        matchText: "7-Point Readiness",
        say: "This tab checks seven things recruiters care about — CV, profile, proof of skills, interview practice and more — and shows exactly which ones still need work.",
        how: [
          "Tap 02 · 7-Point Readiness in the bottom panel.",
          "Green checks are done; open any unchecked item to fix it.",
          "Switch back to 01 · Today for your daily task list.",
        ],
        tip: "Aim for all seven before applying to your dream roles.",
      },
      {
        title: "Horizons, Fit Math & Offer Benchmark",
        matchText: "Compare Offers",
        say: "Switch between 7 Days, 30 Days and All Time horizons, inspect how Vex calculates your Fit & Momentum score, or compare offers side by side.",
        how: [
          "Use the time horizon toggle in the top right.",
          "Tap How Fit Math Works for transparent scoring proof.",
          "Tap Compare Offers to weigh compensation and commute.",
        ],
      },
    ],
  },
  {
    section: "jobs",
    pageName: "Jobs Deck",
    philosopher: "Plato",
    roleTitle: "Agora Curator",
    accent: "#4f7a5a",
    steps: [
      {
        title: "Swipe jobs like player cards",
        say: "Welcome to the Jobs Deck! Every role is a card. Duplicates from different job boards are merged, and each card shows why it matches you before you spend a minute on it.",
        how: [
          "Read the match score and the reasons on the top card.",
          "Swipe right to keep it, left to pass — or use the buttons I'll show you.",
          "Keyboard works too: D / → to keep, A / ← to pass.",
        ],
        tip: "Don't overthink — you can recover passed roles at the end of the stack.",
      },
      {
        title: "Amor Fati — keep this role",
        matchText: "Amor Fati · Smash",
        say: "Love a role? Amor Fati seals it into your Chosen archive, ready for a tailored application.",
        how: [
          "Tap Amor Fati · Smash (or swipe the card right).",
          "The role moves to Chosen at the end of the stack.",
          "From there, tap Prepare Tailored Application to start your CV draft.",
        ],
        tip: "Keep only roles at 80%+ fit at first — quality beats quantity.",
      },
      {
        title: "Ataraxia — pass calmly",
        matchText: "Ataraxia · Pass",
        say: "Not for you? Ataraxia passes on it peacefully. No guilt, no clutter — Vex learns from what you skip.",
        how: [
          "Tap Ataraxia · Pass (or swipe the card left).",
          "Changed your mind? Passed roles can be reclaimed from the Passed tab.",
        ],
      },
      {
        title: "Filter the deck",
        matchText: "85%+",
        say: "Use these lenses to narrow the deck — strong matches only, remote, or hybrid roles.",
        how: [
          "Tap 85%+ to see only strong matches.",
          "Tap Remote or Hybrid to filter by work style.",
          "Tap All to bring every role back.",
        ],
        tip: "Saved filters can become recurring alerts, delivered by Hermes on the Alerts page.",
      },
      {
        title: "Athena Strategic Job Dossier",
        matchText: "Athena Full Job Page",
        say: "Need Athena's full fit analysis? Open the dedicated job page for skills breakdown, salary verdict, and apply prep.",
        how: [
          "Tap Athena Full Job Page on any role.",
          "Inspect matched skills, missing gaps, and competition cues.",
          "Jump straight to Vex Apply pre-submit review or Save Search.",
        ],
      },
    ],
  },
  {
    section: "applications",
    pageName: "Tracker",
    philosopher: "Leonardo da Vinci",
    roleTitle: "Time & Proof Master",
    accent: "#8a5a2b",
    steps: [
      {
        title: "Your honest application tracker",
        say: "Leonardo here! This page tracks every application — and how sure we are it was really sent. Prepared, self-reported and verified are kept separate, so you always know the truth.",
        how: [
          "Switch between board and list view at the top.",
          "Tap any application to open its details drawer.",
          "Use the calendar to see interviews and deadlines.",
        ],
      },
      {
        title: "Full application & Vex Apply review",
        matchText: "Open Full Dossier",
        say: "Open Themis's full application dossier or Hermes's Vex Apply pre-submit queue to inspect every proof field.",
        how: [
          "Select an application to inspect its drawer.",
          "Tap Open Full Dossier for timeline, attached CV, and emails.",
          "Tap Vex Apply Review before confirming automated field fills.",
        ],
      },
      {
        title: "Jump to today",
        matchText: "Today",
        say: "Lost in the calendar? Today brings you straight back to the current date with today's interviews and deadlines.",
        how: [
          "Tap Today on the calendar card.",
          "Tap any other date to see what's scheduled then.",
        ],
      },
      {
        title: "Schedule a session",
        matchText: "+ Schedule",
        say: "Plan a prep or review session on the selected day. It's pinned right onto your calendar.",
        how: [
          "Pick a date on the calendar first.",
          "Tap + Schedule, add a title and time, then Save.",
        ],
        tip: "Block 30 minutes the day before each interview for a quick review.",
      },
      {
        title: "Add an application manually",
        matchText: "+ Add application manually",
        say: "Applied somewhere outside Vex? Add it here so your pipeline stays complete.",
        how: [
          "Tap + Add application manually.",
          "Enter the company and role, then choose its stage.",
          "It's marked self-reported until you record proof of submission.",
        ],
      },
    ],
  },
  {
    section: "documents",
    pageName: "Documents",
    philosopher: "Socrates",
    roleTitle: "Scriptorium Editor",
    accent: "#6b5b95",
    steps: [
      {
        title: "The CV & Letters Studio",
        say: "Socrates speaking. Here we tailor your CV and cover letter for each role. Every suggested change is shown as a before-and-after, and you decide line by line.",
        how: [
          "Switch between CV and Cover Letter with the tabs.",
          "Review the suggested edits in the diff list.",
          "Use the right rail for the AI assistant and the audit checks.",
        ],
        tip: "A good question: 'Can I prove this line in an interview?' If not, reject it.",
      },
      {
        title: "Accept an edit",
        matchText: "Accept",
        say: "When a suggested edit is true and backed by your experience, accept it and it goes straight into your document.",
        how: [
          "Read the original line and the suggestion.",
          "Tap Accept to apply the new wording.",
        ],
      },
      {
        title: "Reject a claim",
        matchText: "Reject",
        say: "If a suggestion exaggerates or invents something, reject it. Your CV must stay 100% factual.",
        how: [
          "Tap Reject — the original line stays.",
          "You can change your decision later.",
        ],
      },
      {
        title: "AI Polish",
        matchText: "AI Polish",
        say: "AI Polish tightens grammar, tone and keyword coverage without adding new claims.",
        how: [
          "Tap AI Polish.",
          "Review the result in the diff list — nothing changes until you accept it.",
        ],
      },
      {
        title: "Export your document",
        matchText: "Export DOCX",
        say: "When every flag is resolved, export a clean Word document ready to upload to any job portal.",
        how: [
          "Resolve any open audit flags first.",
          "Tap Export DOCX to download your file.",
        ],
        tip: "Name the file with your name and the company — recruiters notice.",
      },
      {
        title: "Full CV Editor & Cicero Letters",
        matchText: "Full CV Editor",
        say: "Need structured editing, resume upload parsing, print PDF export, or Cicero's persuasive cover letter workshop? Open the dedicated studios here.",
        how: [
          "Tap Full CV Editor to edit experience, skills, and ATS score.",
          "Tap Print Preview for clean print-to-PDF layout.",
          "Tap Cicero Cover Letters to draft and score tailored letters.",
        ],
      },
    ],
  },
  {
    section: "profile",
    pageName: "Profile",
    philosopher: "Leonardo da Vinci",
    roleTitle: "Codex Architect",
    accent: "#8a651b",
    steps: [
      {
        title: "Your verified profile",
        say: "This is your codex — the single source of truth about your career. Every CV, letter and form across Vex is built from the facts stored here.",
        how: [
          "Check your target role and bio at the top.",
          "Browse your proof cases, milestones and GitHub gallery below.",
        ],
      },
      {
        title: "Edit your profile",
        matchText: "Edit Profile",
        say: "Update your target role, headline and career bio. Changes sync across the whole workspace.",
        how: [
          "Tap Edit Profile.",
          "Update your details, then save the canonical baseline.",
        ],
        tip: "Keep it current — outdated facts lead to weaker matches.",
      },
      {
        title: "Pin a proof case",
        matchText: "+ Pin Proof Case",
        say: "Proof cases are real projects or results you can show. Pinned cases appear first and power stronger CV bullets.",
        how: [
          "Tap + Pin Proof Case.",
          "Describe what you did and the measurable result.",
        ],
      },
      {
        title: "Open your roadmap",
        matchText: "Open Roadmap",
        say: "The roadmap breaks your path to the target role into phases with clear tasks.",
        how: [
          "Tap Open Roadmap.",
          "Tick tasks off as you complete them; use + Add Milestone for your own goals.",
        ],
      },
    ],
  },
  {
    section: "network",
    pageName: "Network",
    philosopher: "Plato",
    roleTitle: "Council Convener",
    accent: "#3f6b8a",
    steps: [
      {
        title: "Your professional council",
        say: "Most jobs come through people. Here you keep track of recruiters, alumni and referrals, plus briefs on the companies you're targeting.",
        how: [
          "Contacts appear on the left, company briefs on the right.",
          "Tap a contact to see your history with them.",
        ],
      },
      {
        title: "Add a contact",
        matchText: "Add Contact",
        say: "Met a recruiter or got a warm intro? Log them so you never lose track of a follow-up.",
        how: [
          "Tap Add Contact.",
          "Enter their name, company and how you know them, then save.",
        ],
      },
      {
        title: "Copy an intro pitch",
        matchText: "Copy Intro Pitch",
        say: "Need help starting the conversation? This copies a polite, ready-to-send intro message.",
        how: [
          "Tap Copy Intro Pitch.",
          "Paste it into Gmail or LinkedIn and personalise the first line.",
        ],
        tip: "Always add one specific detail about the person — it doubles reply rates.",
      },
      {
        title: "Company briefs",
        matchText: "Company Briefs",
        say: "Switch here to see target companies — typical salaries, hiring speed and open roles.",
        how: ["Tap Company Briefs.", "Use it before interviews to sound well informed."],
      },
    ],
  },
  {
    section: "interviews",
    pageName: "Interviews",
    philosopher: "Marcus Aurelius",
    roleTitle: "Stoic Sparring Coach",
    accent: "#9c4930",
    steps: [
      {
        title: "Interview sparring room",
        say: "Marcus Aurelius at your service. Pick a role you applied for, choose a mentor, and practise answers until they're calm and clear.",
        how: [
          "Select the role you're preparing for at the top.",
          "Choose a mentor style on the right.",
          "Type your answer to the question in the box.",
        ],
      },
      {
        title: "2-minute timer",
        matchText: "2:00 Timer",
        say: "Good answers are short. Start the timer and practise saying your answer out loud in under two minutes.",
        how: ["Tap 2:00 Timer.", "Answer out loud before it runs out."],
      },
      {
        title: "Insert a STAR frame",
        matchText: "Insert STAR Frame",
        say: "STAR stands for Situation, Task, Action, Result. This drops the outline into your answer box so you can fill in each part.",
        how: [
          "Tap Insert STAR Frame.",
          "Fill in each part with a real example.",
          "End with a measurable result.",
        ],
        tip: "Spend most of your time on the Action and Result — that's what they're scoring.",
      },
      {
        title: "Evaluate your answer",
        matchText: "Evaluate Answer",
        say: "When you're ready, get structured feedback — your strengths, missing metrics and what to tighten.",
        how: ["Tap Evaluate Answer.", "Read the feedback, edit, and evaluate again."],
      },
      {
        title: "Live Session & Aristotle Report",
        matchText: "Live Voice/Text Session",
        say: "Switch into Socrates's full-screen timed session with optional voice dictation, then review Aristotle's analytics breakdown.",
        how: [
          "Tap Live Voice/Text Session for focused Q&A rounds.",
          "Tap Analytics Report for topic accuracy and filler trends.",
        ],
      },
    ],
  },
  {
    section: "learning",
    pageName: "Learning Path",
    philosopher: "Aristotle",
    roleTitle: "Lyceum Preceptor",
    accent: "#2f6b4f",
    steps: [
      {
        title: "Learn in four calm steps",
        say: "Back in my Lyceum! Here you close skill gaps for your target role: watch, practise, check, and ask. Each step builds proof you can put on your CV.",
        how: [
          "Work through steps 01 to 04 in order.",
          "Completed skills move up your four-tier skill ladder.",
        ],
      },
      {
        title: "Step 01 · Watch videos",
        matchText: "Watch Videos",
        say: "Start with short lecture chapters. You can pin notes at any timestamp.",
        how: ["Tap Watch Videos.", "Play a chapter and pin notes as you go."],
      },
      {
        title: "Step 02 · Homework & quiz",
        matchText: "Homework & Quiz",
        say: "Practise with tasks linked to your target role, then pass a quick quiz to verify the skill.",
        how: ["Tap Homework & Quiz.", "Complete the task, then take the quiz."],
        tip: "Verified skills count for more than self-declared ones.",
      },
      {
        title: "Step 03 · Check a PDF",
        matchText: "Check a PDF",
        say: "Upload a course syllabus or certificate PDF and I'll show which skills it covers and what's still missing.",
        how: ["Tap Check a PDF.", "Upload your file and review matched skills and gaps."],
      },
      {
        title: "Step 04 · Ask the tutor",
        matchText: "Ask Tutor",
        say: "Stuck? Ask the tutor anything — SQL, APIs, or questions about your PDF.",
        how: ["Tap Ask Tutor.", "Type your question and follow along step by step."],
      },
      {
        title: "Catalog & Skill Assessments",
        matchText: "Full Course Catalog",
        say: "Explore the full Lyceum catalog to enrol in new tracks or challenge Athena's timed mastery quizzes.",
        how: [
          "Tap Full Course Catalog to filter and enrol in modules.",
          "Tap Athena Skill Assessments to earn verified level badges.",
        ],
      },
    ],
  },
  {
    section: "mcp",
    pageName: "Assistant",
    philosopher: "Zeus",
    roleTitle: "Temple Gatekeeper",
    accent: "#a07a28",
    steps: [
      {
        title: "Your AI assistant — under your control",
        say: "I am Zeus, keeper of this temple. The assistant can plan and prepare tasks for you, but nothing runs outside Vex until you approve it.",
        how: [
          "Describe what you need, or pick a preset prompt.",
          "Review the plan the assistant creates.",
          "Approve only the steps you're happy with.",
        ],
      },
      {
        title: "Skip a step",
        matchText: "Skip",
        say: "Don't want one part of the plan? Skip it. You decide exactly which steps are allowed to run.",
        how: ["Tap Skip on any step to exclude it.", "Tap it again to include it back."],
      },
      {
        title: "Approve & run",
        matchText: "Approve & Run Steps",
        say: "When the plan looks right, approve it. You'll see a final confirmation before anything happens.",
        how: [
          "Tap Approve & Run Steps.",
          "Confirm in the dialog — or cancel and nothing changes.",
          "Every action is recorded in the activity log.",
        ],
        tip: "The assistant never submits applications for you — final submit is always yours.",
      },
      {
        title: "Manage connected tools",
        matchText: "Manage Tools",
        say: "Connect or disconnect tools like Gmail, Greenhouse and other AI apps. You can revoke access anytime.",
        how: ["Tap Manage Tools.", "Use Connect or Disconnect next to each tool."],
      },
      {
        title: "Hephaestus Integrations & Inbox",
        matchText: "Hephaestus Integrations",
        say: "Need deep scope controls, webhook logs, or Hermes's Gmail/Outlook recruiter classifier? Step into Hephaestus's forge.",
        how: ["Tap Hephaestus Integrations & Inbox to inspect endpoints and recruiter sync."],
      },
    ],
  },
  {
    section: "alerts",
    pageName: "Alerts",
    philosopher: "Hermes",
    roleTitle: "Keeper of Kairos",
    accent: "#4a6fa5",
    steps: [
      {
        title: "Only the alerts that matter",
        say: "Hermes, swift messenger! I filter out the noise so urgent deadlines and real recruiter replies reach you on time.",
        how: [
          "Urgent alerts stay at the top.",
          "Tap any alert to jump to the related page.",
        ],
      },
      {
        title: "Quiet Shield",
        matchText: "Quiet Shield",
        say: "Need to focus? Quiet Shield mutes non-urgent notifications with one tap. Deadlines still get through.",
        how: ["Tap Quiet Shield to turn it on.", "Tap again to turn it off."],
      },
      {
        title: "Pin your own reminder",
        matchText: "+ Pin Dispatch",
        say: "Add your own reminder — a follow-up email, a deadline, anything you don't want to forget.",
        how: ["Tap + Pin Dispatch.", "Write the reminder and pick a time."],
        tip: "Follow up 5–7 days after applying if you haven't heard back.",
      },
      {
        title: "Snooze for a day",
        matchText: "Snooze 24h",
        say: "Not ready to deal with something? Snooze it for 24 hours and it'll come back tomorrow.",
        how: ["Tap Snooze 24h on any alert."],
      },
    ],
  },
  {
    section: "settings",
    pageName: "Settings",
    philosopher: "Themis",
    roleTitle: "Privacy Guardian",
    accent: "#5a6675",
    steps: [
      {
        title: "Your plan, privacy and data",
        say: "I am Themis, guardian of fairness. Here you manage your plan, your connected inboxes, your consent settings and your data.",
        how: [
          "Compare Free, Pro and Ultra at the top.",
          "Connect Gmail or Outlook so recruiter replies are tracked.",
        ],
      },
      {
        title: "Verify your email",
        matchText: "Verify email",
        say: "Verify your email to secure your account and receive important alerts.",
        how: ["Tap Verify email and follow the link sent to your inbox."],
      },
      {
        title: "Plutus Billing & Usage Quotas",
        matchText: "Plutus Billing",
        say: "Inspect AI usage meters, payment preview controls, and invoice history with Plutus.",
        how: ["Tap Plutus Billing & Invoices to review quotas and past invoices."],
      },
      {
        title: "Reset your workspace",
        matchText: "Reset & clear local workspace",
        say: "Want a fresh start? This clears your local workspace data and restores the sample data.",
        how: ["Tap Reset & clear local workspace.", "Confirm — this cannot be undone."],
        tip: "That's the whole tour! You can replay it anytime with the Coach Guide button. Good luck, explorer!",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Character — an animated philosopher bust drawn in SVG             */
/* ------------------------------------------------------------------ */

function PhilosopherCharacter({
  accent,
  talking,
  className,
}: {
  accent: string;
  talking: boolean;
  className?: string;
}) {
  // Laurel leaves around the head
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vex-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8f2e4" />
          <stop offset="1" stopColor="#e6dac0" />
        </linearGradient>
        <linearGradient id="vex-toga" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f0e2" />
          <stop offset="1" stopColor="#d6c9ab" />
        </linearGradient>
      </defs>

      {/* Toga body */}
      <path
        d="M24 240 C28 192 58 166 100 164 C142 166 172 192 176 240 Z"
        fill="url(#vex-toga)"
        stroke="#c8b991"
        strokeWidth="1.5"
      />
      {/* Accent sash */}
      <path
        d="M56 182 C88 202 120 216 148 240 L124 240 C104 222 80 206 50 194 Z"
        fill={accent}
        opacity="0.9"
      />
      <path d="M78 176 C88 196 96 214 98 240" stroke="#c8b991" strokeWidth="1.2" fill="none" />

      {/* Pointing arm (right side of figure) */}
      <motion.g
        animate={{ rotate: [0, -6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "150px 200px" }}
      >
        {/* Draped sleeve */}
        <path
          d="M130 214 C136 190 150 170 164 156 L186 168 C176 184 166 204 158 226 Z"
          fill="url(#vex-toga)"
          stroke="#c8b991"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M146 196 C154 184 162 174 172 166" stroke="#d6c9ab" strokeWidth="1.2" fill="none" />
        {/* Cuff */}
        <path
          d="M162 156 Q174 158 186 168"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hand: open palm, fingers spread in a friendly wave */}
        <g transform="translate(177 146) rotate(12)">
          {/* Four fingers, fanned out */}
          {[
            { x: -9, len: 13, rot: -14 },
            { x: -3.5, len: 16, rot: -5 },
            { x: 2, len: 15, rot: 4 },
            { x: 7, len: 12, rot: 14 },
          ].map((f) => (
            <rect
              key={f.x}
              x={f.x - 2.6}
              y={-4 - f.len}
              width="5.2"
              height={f.len + 4}
              rx="2.6"
              fill="url(#vex-skin)"
              stroke="#c9b99a"
              strokeWidth="1.2"
              transform={`rotate(${f.rot} ${f.x} -2)`}
            />
          ))}
          {/* Palm */}
          <rect x="-12" y="-6" width="23" height="19" rx="9" fill="url(#vex-skin)" stroke="#c9b99a" strokeWidth="1.3" />
          {/* Thumb, out to the side */}
          <rect
            x="-21"
            y="-1"
            width="13"
            height="5.6"
            rx="2.8"
            fill="url(#vex-skin)"
            stroke="#c9b99a"
            strokeWidth="1.2"
            transform="rotate(-35 -10 2)"
          />
          {/* Palm crease */}
          <path d="M-5 4 C-1 7 3 7 6 4" stroke="#d6c8a9" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      </motion.g>

      {/* Neck */}
      <rect x="88" y="138" width="24" height="32" rx="9" fill="url(#vex-skin)" />

      {/* Head */}
      <ellipse cx="100" cy="98" rx="40" ry="46" fill="url(#vex-skin)" stroke="#d3c4a3" strokeWidth="1.2" />
      {/* Ears */}
      <ellipse cx="60" cy="102" rx="6" ry="10" fill="url(#vex-skin)" stroke="#d3c4a3" />
      <ellipse cx="140" cy="102" rx="6" ry="10" fill="url(#vex-skin)" stroke="#d3c4a3" />

      {/* Curly hair */}
      {[
        [66, 74, 13],
        [80, 60, 14],
        [100, 54, 15],
        [120, 60, 14],
        [134, 74, 13],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ebe1cb" stroke="#cbbd9c" strokeWidth="1.2" />
      ))}

      {/* Laurel wreath */}
      {leaves.map((i) => {
        const toXY = (deg: number) => {
          const rad = (deg * Math.PI) / 180;
          return [100 + Math.cos(rad) * 44, 82 + Math.sin(rad) * 34];
        };
        // Left branch sweeps 190°→256°, right branch mirrors 350°→284°.
        const [lx, ly] = toXY(190 + i * 11);
        const [rx, ry] = toXY(350 - i * 11);
        return (
          <g key={i}>
            <ellipse cx={lx} cy={ly} rx="7" ry="3.2" fill={accent} transform={`rotate(${-30 + i * 10} ${lx} ${ly})`} />
            <ellipse cx={rx} cy={ry} rx="7" ry="3.2" fill={accent} transform={`rotate(${30 - i * 10} ${rx} ${ry})`} />
          </g>
        );
      })}

      {/* Eyebrows */}
      <motion.g
        animate={talking ? { y: [0, -1.5, 0] } : { y: 0 }}
        transition={{ duration: 0.9, repeat: talking ? Infinity : 0 }}
      >
        <path d="M76 88 C82 84 90 84 94 87" stroke="#b9a988" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M106 87 C110 84 118 84 124 88" stroke="#b9a988" strokeWidth="3" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Eyes (blink) */}
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4.2, times: [0, 0.9, 0.95, 1], repeat: Infinity }}
        style={{ transformOrigin: "100px 98px" }}
      >
        <ellipse cx="86" cy="98" rx="4.2" ry="5.2" fill="#2c3644" />
        <ellipse cx="114" cy="98" rx="4.2" ry="5.2" fill="#2c3644" />
        <circle cx="87.5" cy="96.5" r="1.3" fill="#fff" />
        <circle cx="115.5" cy="96.5" r="1.3" fill="#fff" />
      </motion.g>

      {/* Nose */}
      <path d="M100 100 C97 110 95 114 100 116" stroke="#c9b99a" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Beard */}
      <path
        d="M60 106 C62 150 84 174 100 176 C116 174 138 150 140 106 C130 128 116 134 100 134 C84 134 70 128 60 106 Z"
        fill="#ebe1cb"
        stroke="#cbbd9c"
        strokeWidth="1.2"
      />
      <path d="M80 142 C86 156 92 164 100 168 M120 142 C114 156 108 164 100 168" stroke="#d6c8a9" strokeWidth="1.2" fill="none" />

      {/* Mouth (talks while typing) */}
      <motion.ellipse
        cx="100"
        cy="128"
        rx="6"
        ry={1.2}
        initial={{ ry: 1.2 }}
        fill="#6b4b3a"
        animate={talking ? { ry: [1.2, 4.2, 1.6, 3.4, 1.2] } : { ry: 1.2 }}
        transition={{ duration: 0.55, repeat: talking ? Infinity : 0 }}
      />
      {/* Moustache */}
      <path
        d="M82 122 C90 116 97 118 100 121 C103 118 110 116 118 122 C110 125 105 126 100 124 C95 126 90 125 82 122 Z"
        fill="#d8cbb0"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

function findTarget(matchText: string): HTMLElement | null {
  const root = document.querySelector("main");
  if (!root) return null;
  const needle = norm(matchText);
  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>("button, a, [role='tab'], [role='button']")
  ).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && norm(el.textContent || "").includes(needle);
  });
  if (!candidates.length) return null;
  // Prefer the most specific (shortest text) match, e.g. "Today" over "Today's tasks".
  candidates.sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);
  return candidates[0];
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8;

/* ------------------------------------------------------------------ */
/*  Main guide                                                         */
/* ------------------------------------------------------------------ */

export default function PhilosopherCoachGuide({
  open,
  activeSection,
  onNavigate,
  onClose,
}: {
  open: boolean;
  activeSection: DashboardSectionId;
  onNavigate: (section: DashboardSectionId) => void;
  onClose: () => void;
}) {
  const pageIdx = Math.max(
    0,
    TOUR.findIndex((p) => p.section === activeSection)
  );
  const page = TOUR[pageIdx];

  const [stepIdx, setStepIdx] = useState(0);
  const enterAtEndRef = useRef(false);
  const step = page.steps[Math.min(stepIdx, page.steps.length - 1)];

  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: 1280, h: 800 });
  const [typed, setTyped] = useState(0);
  const typingDone = typed >= step.say.length;

  // Reset to first step (or last, when going back) whenever the page changes.
  useEffect(() => {
    setStepIdx(enterAtEndRef.current ? page.steps.length - 1 : 0);
    enterAtEndRef.current = false;
  }, [activeSection, page.steps.length]);

  // Typewriter effect.
  useEffect(() => {
    if (!open) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(step.say.length);
      return;
    }
    setTyped(0);
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= step.say.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 2;
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [open, step.say]);

  // Locate the real button and keep the spotlight glued to it.
  useLayoutEffect(() => {
    if (!open) return;
    setRect(null);
    if (!step.matchText) return;

    let raf = 0;
    let target: HTMLElement | null = null;
    let tries = 0;

    const locate = window.setInterval(() => {
      target = findTarget(step.matchText!);
      tries += 1;
      if (target || tries > 12) {
        window.clearInterval(locate);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          const track = () => {
            if (target && target.isConnected) {
              const r = target.getBoundingClientRect();
              setRect((prev) =>
                prev &&
                Math.abs(prev.top - r.top) < 0.5 &&
                Math.abs(prev.left - r.left) < 0.5 &&
                Math.abs(prev.width - r.width) < 0.5 &&
                Math.abs(prev.height - r.height) < 0.5
                  ? prev
                  : { top: r.top, left: r.left, width: r.width, height: r.height }
              );
            }
            raf = window.requestAnimationFrame(track);
          };
          track();
        }
      }
    }, 120);

    return () => {
      window.clearInterval(locate);
      window.cancelAnimationFrame(raf);
    };
  }, [open, step.matchText, activeSection]);

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isLastStep = stepIdx >= page.steps.length - 1;
  const isLastPage = pageIdx === TOUR.length - 1;
  const nextPage = TOUR[(pageIdx + 1) % TOUR.length];

  const finish = useCallback(() => {
    try {
      window.localStorage.setItem("vex_coach_tour_done", "1");
    } catch {
      // storage unavailable — ignore
    }
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    if (!typingDone) {
      setTyped(step.say.length);
      return;
    }
    if (!isLastStep) {
      setStepIdx((i) => i + 1);
    } else if (isLastPage) {
      finish();
    } else {
      onNavigate(nextPage.section);
    }
  }, [typingDone, step.say.length, isLastStep, isLastPage, finish, onNavigate, nextPage.section]);

  const goBack = useCallback(() => {
    if (stepIdx > 0) {
      setStepIdx((i) => i - 1);
    } else if (pageIdx > 0) {
      enterAtEndRef.current = true;
      onNavigate(TOUR[pageIdx - 1].section);
    }
  }, [stepIdx, pageIdx, onNavigate]);

  // Keyboard controls.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goNext, goBack, onClose]);

  if (!open || typeof document === "undefined") return null;

  // Spotlight geometry
  const hole = rect
    ? {
        x: Math.max(0, rect.left - PAD),
        y: Math.max(0, rect.top - PAD),
        w: rect.width + PAD * 2,
        h: rect.height + PAD * 2,
      }
    : null;

  // Put the dialog on the opposite half of the screen from the target,
  // and the character on the opposite side so it points toward it.
  const targetLow = hole ? hole.y + hole.h / 2 > viewport.h * 0.52 : false;
  const targetLeft = hole ? hole.x + hole.w / 2 < viewport.w / 2 : false;
  const dialogTop = targetLow;
  const characterRight = targetLeft;
  const arrowAbove = hole ? hole.y > 90 : false;

  const blockerProps = {
    onClick: goNext,
    className: "absolute cursor-pointer",
  };

  // Portal to <body>: the page template wraps content in a transformed element,
  // which would otherwise break `position: fixed`.
  return createPortal(
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label={`Guided tour: ${page.pageName}, ${step.title}`}
    >
      {/* Dimmed backdrop with a spotlight hole */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <mask id="vex-tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {hole && (
              <motion.rect
                initial={false}
                animate={{ x: hole.x, y: hole.y, width: hole.w, height: hole.h }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                rx="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(10,16,24,0.72)" mask="url(#vex-tour-mask)" />
      </svg>

      {/* Click-catchers around the hole (the hole itself lets clicks reach the real button) */}
      {hole ? (
        <>
          <div {...blockerProps} style={{ top: 0, left: 0, right: 0, height: hole.y }} />
          <div {...blockerProps} style={{ top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }} />
          <div {...blockerProps} style={{ top: hole.y, left: 0, width: hole.x, height: hole.h }} />
          <div
            {...blockerProps}
            style={{ top: hole.y, left: hole.x + hole.w, right: 0, height: hole.h }}
          />
        </>
      ) : (
        <div {...blockerProps} style={{ inset: 0 }} />
      )}

      {/* Pulsing ring + bouncing arrow on the target */}
      {hole && (
        <>
          <motion.div
            className="pointer-events-none absolute rounded-[14px] border-2"
            style={{ borderColor: page.accent }}
            initial={false}
            animate={{
              top: hole.y,
              left: hole.x,
              width: hole.w,
              height: hole.h,
              boxShadow: [
                `0 0 0 0px ${page.accent}aa`,
                `0 0 0 10px ${page.accent}00`,
              ],
            }}
            transition={{
              top: { type: "spring", stiffness: 260, damping: 30 },
              left: { type: "spring", stiffness: 260, damping: 30 },
              width: { type: "spring", stiffness: 260, damping: 30 },
              height: { type: "spring", stiffness: 260, damping: 30 },
              boxShadow: { duration: 1.4, repeat: Infinity },
            }}
          />
          <motion.div
            className="pointer-events-none absolute flex flex-col items-center"
            style={{
              left: hole.x + hole.w / 2 - 18,
              top: arrowAbove ? hole.y - 46 : hole.y + hole.h + 8,
            }}
            animate={{ y: arrowAbove ? [0, 8, 0] : [0, -8, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="36"
              height="38"
              viewBox="0 0 36 38"
              style={{ transform: arrowAbove ? "rotate(180deg)" : undefined }}
            >
              <path
                d="M18 2 L33 20 H24 V36 H12 V20 H3 Z"
                fill={page.accent}
                stroke="#fffef9"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </>
      )}

      {/* Character + speech bubble */}
      <div
        className={`pointer-events-none absolute inset-x-0 flex items-end gap-1 px-3 sm:gap-2 sm:px-6 ${
          dialogTop ? "top-3 sm:top-5" : "bottom-3 sm:bottom-5"
        } ${characterRight ? "flex-row-reverse" : "flex-row"}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page.section}
            initial={{ opacity: 0, x: characterRight ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: characterRight ? 60 : -60 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="pointer-events-auto relative shrink-0"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhilosopherCharacter
                accent={page.accent}
                talking={!typingDone}
                className={`h-[118px] w-[98px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] sm:h-[210px] sm:w-[175px] ${
                  characterRight ? "-scale-x-100" : ""
                }`}
              />
            </motion.div>
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-0.5 text-center text-[10.5px] font-semibold text-white shadow-md sm:text-[12px]"
              style={{ backgroundColor: page.accent }}
            >
              {page.philosopher}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Speech bubble */}
        <motion.div
          key={`${page.section}-${stepIdx}`}
          initial={{ opacity: 0, y: dialogTop ? -12 : 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={goNext}
          className="pointer-events-auto relative mb-4 max-h-[52vh] w-full max-w-[560px] cursor-pointer overflow-y-auto rounded-[22px] border-2 bg-[#fffef9] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:mb-8 sm:p-5"
          style={{ borderColor: page.accent }}
        >
          {/* Header */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
                style={{ backgroundColor: page.accent }}
              >
                {page.pageName}
              </span>
              <span className="font-mono text-[10px] text-[#7a6b4e]">
                {page.roleTitle}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                finish();
              }}
              className="cursor-pointer rounded-full border border-[#d6cbb2] px-2.5 py-0.5 text-[11px] font-medium text-[#5a6675] hover:border-[#212d3d] hover:text-[#212d3d]"
            >
              Skip tour
            </button>
          </div>

          <h3 className="font-serif-display text-[19px] leading-tight text-[#212d3d] sm:text-[22px]">
            {step.title}
          </h3>

          <p className="mt-1.5 min-h-[3.2em] text-[13.5px] leading-[1.55] text-[#212d3d] sm:text-[14.5px]">
            {step.say.slice(0, typed)}
            {!typingDone && (
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#212d3d]" />
            )}
          </p>

          <AnimatePresence>
            {typingDone && (step.how || step.tip) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                {step.how && (
                  <div className="mt-3 rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-3">
                    <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a6b4e]">
                      How to use it
                    </p>
                    <ol className="space-y-1">
                      {step.how.map((line, i) => (
                        <li key={line} className="flex gap-2 text-[12.5px] leading-snug text-[#212d3d]">
                          <span
                            className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                            style={{ backgroundColor: page.accent }}
                          >
                            {i + 1}
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {step.tip && (
                  <p className="mt-2 rounded-[12px] bg-[#212d3d] px-3 py-2 text-[12px] leading-snug text-[#faf6ed]">
                    <strong className="font-semibold text-[#e8c873]">Pro tip: </strong>
                    {step.tip}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {step.matchText && !rect && typingDone && (
            <p className="mt-2 text-[11.5px] italic text-[#7a6b4e]">
              This button isn&apos;t on screen right now — scroll the page to find “{step.matchText}”.
            </p>
          )}

          {/* Footer */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#ece5d5] pt-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {page.steps.map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === stepIdx ? 16 : 6,
                      backgroundColor: i <= stepIdx ? page.accent : "#d6cbb2",
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#7a6b4e]">
                Page {pageIdx + 1}/{TOUR.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {(stepIdx > 0 || pageIdx > 0) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goBack();
                  }}
                  className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  Back
                </button>
              )}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                animate={typingDone ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 1.2, repeat: typingDone ? Infinity : 0 }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold text-white shadow-md"
                style={{ backgroundColor: page.accent }}
              >
                {!typingDone
                  ? "Skip text"
                  : !isLastStep
                  ? "Next"
                  : isLastPage
                  ? "Finish tour"
                  : `Next page: ${nextPage.pageName}`}
                <span aria-hidden="true">▶</span>
              </motion.button>
            </div>
          </div>

          <p className="mt-1.5 text-center text-[10px] text-[#9a8d72]">
            Tap anywhere to continue · ← → keys · Esc to hide
          </p>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
