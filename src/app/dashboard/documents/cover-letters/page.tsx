"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { CoverLetterDraft } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import MobileNoteEditor from "@/components/mobile/MobileNoteEditor";

const GENERIC_PHRASES = [
  "passionate self-starter",
  "hit the ground running",
  "fast-paced environment",
  "think outside the box",
  "hardworking team player",
  "dynamic synergy",
  "[company",
  "[role",
];

function analyzeWriting(
  text: string,
  company: string,
  jobTitle: string,
  matchedSkills: string[]
) {
  const clean = text.trim();
  const wordsList = clean ? clean.toLowerCase().match(/[a-z]{4,}/g) || [] : [];
  const totalWords = clean ? clean.split(/\s+/).length : 0;

  // Repetition detector (> 3 uses for content words)
  const stopWords = new Set([
    "that",
    "this",
    "with",
    "from",
    "your",
    "have",
    "will",
    "into",
    "their",
    "about",
    "where",
    "which",
    "across",
    "through",
  ]);
  const counts: Record<string, number> = {};
  for (const w of wordsList) {
    if (!stopWords.has(w)) counts[w] = (counts[w] || 0) + 1;
  }
  const repeatedWords = Object.entries(counts)
    .filter(([, n]) => n >= 4)
    .map(([w, n]) => `${w} (${n}x)`);

  const foundGeneric = GENERIC_PHRASES.filter((p) =>
    clean.toLowerCase().includes(p)
  );
  const hasCompany = company
    ? clean.toLowerCase().includes(company.toLowerCase().split(" ")[0])
    : false;
  const skillHits = matchedSkills.filter((sk) =>
    clean.toLowerCase().includes(sk.toLowerCase().split(" ")[0])
  );
  const hasNumbers = /\d+/.test(clean);

  const relevance = Math.min(
    98,
    55 +
      (hasCompany ? 14 : 0) +
      Math.min(20, skillHits.length * 7) +
      (hasNumbers ? 9 : 0)
  );
  const clarity =
    totalWords >= 95 && totalWords <= 340 && foundGeneric.length === 0
      ? 92
      : totalWords >= 60
      ? 79
      : 62;
  const specificity = Math.min(
    96,
    50 + (hasNumbers ? 22 : 0) + skillHits.length * 8 - foundGeneric.length * 10
  );

  const tips: string[] = [];
  if (!hasCompany && company)
    tips.push(`Name "${company}" explicitly inside your opening or closing.`);
  if (!hasNumbers)
    tips.push("Include at least one measurable scope cue (e.g. number of launches or hours saved).");
  if (foundGeneric.length > 0)
    tips.push(`Replace generic cliché phrasing (${foundGeneric.join(", ")}) with concrete delivery evidence.`);
  if (repeatedWords.length > 0)
    tips.push(`Tighten repeated wording: ${repeatedWords.slice(0, 3).join(", ")}.`);
  if (totalWords < 95)
    tips.push("Expand your main body argument with one specific problem -> action example.");
  if (totalWords > 340)
    tips.push("Trim excess sentences under 340 words to preserve hiring manager reading velocity.");

  return {
    totalWords,
    relevance,
    clarity,
    specificity,
    repeatedWords,
    foundGeneric,
    hasCompany,
    skillHits,
    tips,
    overall: Math.round((relevance + clarity + specificity) / 3),
    jobTitle,
  };
}

function composeParagraphs(
  recipientName: string,
  opening: string,
  mainBody: string,
  closing: string,
  signature: string
) {
  return [
    recipientName ? `Dear ${recipientName},` : "Dear Hiring Team,",
    opening.trim(),
    mainBody.trim(),
    closing.trim(),
    signature.trim() || "Sincerely,\nCandidate",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export default function CoverLettersStudioPage() {
  const {
    jobs,
    resumes,
    profile,
    coverLetters,
    saveCoverLetter,
    createCoverLetter,
    deleteCoverLetter,
  } = useVexWorkspace();

  const [activeId, setActiveId] = useState(coverLetters[0]?.id || "");
  const activeLetter =
    coverLetters.find((l) => l.id === activeId) || coverLetters[0];

  // Dashboard filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "completed" | "archived"
  >("all");
  const [sortMode, setSortMode] = useState<"recent" | "company" | "words">(
    "recent"
  );

  // Structured paragraph editor state synced cleanly with selected letter
  const [selectedJobId, setSelectedJobId] = useState(
    activeLetter?.jobId || jobs[0]?.id || ""
  );
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || "");
  const [editorTitle, setEditorTitle] = useState(activeLetter?.title || "");
  const [recipientName, setRecipientName] = useState(
    activeLetter?.recipientName || "Hiring Team"
  );
  const [companyInput, setCompanyInput] = useState(
    activeLetter?.company || ""
  );
  const [jobTitleInput, setJobTitleInput] = useState(
    activeLetter?.jobTitle || ""
  );
  const [openingParagraph, setOpeningParagraph] = useState(
    activeLetter?.openingParagraph || ""
  );
  const [mainBody, setMainBody] = useState(
    activeLetter?.mainBody || activeLetter?.body || ""
  );
  const [closingParagraph, setClosingParagraph] = useState(
    activeLetter?.closingParagraph || ""
  );
  const [signature, setSignature] = useState(
    activeLetter?.signature || `Sincerely,\n${profile.name || "Candidate"}`
  );
  const [tone, setTone] = useState<CoverLetterDraft["tone"]>(
    activeLetter?.tone || "Crisp Analytical"
  );
  const [style, setStyle] = useState<CoverLetterDraft["style"]>(
    activeLetter?.style || "Rhetorical Proof"
  );
  const [letterStatus, setLetterStatus] = useState<
    "draft" | "completed" | "archived"
  >(activeLetter?.status || "draft");
  const [customInstruction, setCustomInstruction] = useState("");

  // Secondary panels & modals
  const [workspaceTab, setWorkspaceTab] = useState<
    "editor" | "preview" | "compare"
  >("editor");
  const [compareLetterId, setCompareLetterId] = useState(
    coverLetters.find((l) => l.id !== coverLetters[0]?.id)?.id || ""
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [showTools, setShowTools] = useState(false);

  function selectLetter(letter: CoverLetterDraft) {
    const parts = letter.body.split(/\n\n+/);
    setActiveId(letter.id);
    setSelectedJobId(letter.jobId);
    setEditorTitle(letter.title);
    setRecipientName(letter.recipientName || `${letter.company} Hiring Team`);
    setCompanyInput(letter.company);
    setJobTitleInput(
      letter.jobTitle || letter.title.split("—")[1]?.trim() || "Target Role"
    );
    setOpeningParagraph(letter.openingParagraph || parts[1] || parts[0] || "");
    setMainBody(letter.mainBody || parts[2] || letter.body);
    setClosingParagraph(
      letter.closingParagraph || parts[3] || "Thank you for reviewing my credentials."
    );
    setSignature(
      letter.signature || `Sincerely,\n${profile.name || "Candidate"}`
    );
    setTone(letter.tone);
    setStyle(letter.style);
    setLetterStatus(letter.status || "draft");
    setConfirmDeleteOpen(false);
  }

  const composedBody = useMemo(
    () =>
      composeParagraphs(
        recipientName,
        openingParagraph,
        mainBody,
        closingParagraph,
        signature
      ),
    [recipientName, openingParagraph, mainBody, closingParagraph, signature]
  );

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const selectedResume =
    resumes.find((r) => r.id === selectedResumeId) || resumes[0];

  const analysis = useMemo(
    () =>
      analyzeWriting(
        composedBody,
        companyInput || selectedJob?.company || "",
        jobTitleInput || selectedJob?.title || "",
        selectedJob?.matchingSkills || selectedResume?.skills || []
      ),
    [composedBody, companyInput, jobTitleInput, selectedJob, selectedResume]
  );

  // Filtered & sorted dashboard library
  const filteredLetters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...coverLetters]
      .filter((cl) => {
        const st = cl.status || "draft";
        if (statusFilter !== "all" && st !== statusFilter) return false;
        if (!q) return true;
        return (
          cl.title.toLowerCase().includes(q) ||
          cl.company.toLowerCase().includes(q) ||
          cl.body.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortMode === "company") return a.company.localeCompare(b.company);
        if (sortMode === "words")
          return b.body.split(/\s+/).length - a.body.split(/\s+/).length;
        return b.version - a.version;
      });
  }, [coverLetters, searchQuery, statusFilter, sortMode]);

  const totalCount = coverLetters.length;
  const draftCount = coverLetters.filter(
    (c) => (c.status || "draft") === "draft"
  ).length;
  const completedCount = coverLetters.filter(
    (c) => c.status === "completed"
  ).length;
  const uniqueJobsLinked = new Set(coverLetters.map((c) => c.jobId)).size;

  const compareLetter = coverLetters.find((l) => l.id === compareLetterId);
  const compareAnalysis = useMemo(() => {
    if (!compareLetter) return null;
    const jobForCompare =
      jobs.find((j) => j.id === compareLetter.jobId) || selectedJob;
    return analyzeWriting(
      compareLetter.body,
      compareLetter.company,
      compareLetter.jobTitle || "",
      jobForCompare?.matchingSkills || []
    );
  }, [compareLetter, jobs, selectedJob]);

  function notify(msg: string) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3200);
  }

  function handleCreateBlankOrTailored(fromScratch: boolean) {
    const job = jobs.find((j) => j.id === selectedJobId) || jobs[0];
    const cv = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
    if (!job || !cv) return;

    const firstRole = cv.experience[0];
    const proofBullet =
      firstRole?.bullets[0] ||
      "Delivered structured cross-functional releases with verified checklists.";
    const matchedSkills = job.matchingSkills.slice(0, 3).join(", ");

    const opening = fromScratch
      ? `Write your opening hook connecting your work to ${job.company}'s priorities.`
      : `Across my work as ${firstRole?.role || cv.personalInfo.headline} at ${
          firstRole?.company || "ClearLedger Software"
        }, I focused directly on ${matchedSkills}—turning ambiguous cross-team handoffs into measurable delivery.`;
    const main = fromScratch
      ? `Outline one concrete example from your CV ("${cv.name}") that proves readiness for ${job.title}.`
      : `Specifically, I ${proofBullet.charAt(0).toLowerCase() + proofBullet.slice(1)}${
          customInstruction.trim()
            ? ` Focus highlight: ${customInstruction.trim()}.`
            : ""
        } For ${job.company}, this means immediate fluency across ${job.matchingSkills
          .slice(0, 2)
          .join(" and ")}, while closing remaining ramp items openly.`;
    const closing =
      style === "Metric Brief"
        ? `Key verified alignment for ${job.company}: ${matchedSkills} (${job.arrangement}). I welcome the chance to discuss how these facts support your roadmap.`
        : `Thank you for reviewing my background cleanly grounded in verified results. I look forward to speaking with the ${job.company} team.`;

    const recipient = `${job.company} Hiring Team`;
    const sig = `Sincerely,\n${cv.personalInfo.fullName}`;
    const body = composeParagraphs(recipient, opening, main, closing, sig);

    const newDraft: CoverLetterDraft = {
      id: `cl-${Date.now()}`,
      title: `${job.company} — ${job.title}`,
      jobId: job.id,
      company: job.company,
      jobTitle: job.title,
      recipientName: recipient,
      tone,
      style,
      status: "draft",
      updatedAt: "Created just now",
      version: 1,
      openingParagraph: opening,
      mainBody: main,
      closingParagraph: closing,
      signature: sig,
      body,
    };
    createCoverLetter(newDraft);
    selectLetter(newDraft);
    setWorkspaceTab("editor");
    notify(
      fromScratch
        ? `Created structured blank draft for ${job.company}.`
        : `Generated grounded Cicero draft using "${cv.name}".`
    );
  }

  function handleSaveCurrent(nextStatus?: "draft" | "completed" | "archived") {
    if (!activeLetter) return;
    const finalStatus = nextStatus || letterStatus;
    setLetterStatus(finalStatus);
    saveCoverLetter({
      ...activeLetter,
      title: editorTitle.trim() || `${companyInput} — ${jobTitleInput}`,
      jobId: selectedJobId,
      company: companyInput || selectedJob?.company || activeLetter.company,
      jobTitle: jobTitleInput,
      recipientName,
      tone,
      style,
      status: finalStatus,
      openingParagraph,
      mainBody,
      closingParagraph,
      signature,
      previousBody: activeLetter.body,
      body: composedBody,
      version: activeLetter.version + 1,
      updatedAt: "Saved just now",
    });
    notify(`Saved v${activeLetter.version + 1} (${finalStatus}) to workspace.`);
  }

  function handleDuplicateCurrent() {
    if (!activeLetter) return;
    const copy: CoverLetterDraft = {
      ...activeLetter,
      id: `cl-${Date.now()}`,
      title: `${editorTitle || activeLetter.title} (Copy)`,
      status: "draft",
      version: 1,
      updatedAt: "Duplicated just now",
      openingParagraph,
      mainBody,
      closingParagraph,
      signature,
      body: composedBody,
    };
    createCoverLetter(copy);
    selectLetter(copy);
    notify(`Duplicated "${copy.title}".`);
  }

  function handleCopyClipboard() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(composedBody).catch(() => {});
      notify("Copied full cover letter text to clipboard.");
    }
  }

  function handleDownload(format: "txt" | "doc") {
    const content = `${editorTitle}\n\n${composedBody}`;
    const blob = new Blob([content], {
      type:
        format === "doc"
          ? "application/msword"
          : "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(editorTitle || "cover_letter")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Downloaded ${a.download}.`);
  }

  function insertEvidenceIntoMain(snippet: string) {
    setMainBody((prev) =>
      prev.trim() ? `${prev.trim()} Verified evidence: ${snippet}.` : snippet
    );
    notify("Inserted verified fact snippet into Main Body paragraph.");
  }

  return (
    <DashboardSubpageFrame
      parentSection="documents"
      parentLabel="Documents Scriptorium"
      pageCode="04.3"
      pageTitle="Cicero Cover Letter Studio"
      philosopherTag="Cicero · Rhetoric & Persuasion"
    >
      <MobileNoteEditor
        eyebrow={`v${activeLetter?.version ?? 1} · ${tone} · ${letterStatus || "draft"}`}
        title={editorTitle || "Cover Letter"}
        chips={
          <>
            <select
              aria-label="Choose letter"
              value={activeId}
              onChange={(e) => {
                const l = coverLetters.find((x) => x.id === e.target.value);
                if (l) selectLetter(l);
              }}
              className="max-w-[170px] shrink-0 cursor-pointer truncate rounded-full border border-[#e3dccb] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
            >
              {coverLetters.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
            <span className="shrink-0 rounded-full border border-[#e3dccb] bg-white px-2.5 py-1 text-[11.5px] text-[#5a6675]">
              {analysis.totalWords} Words
            </span>
            {(["Executive", "Crisp Analytical", "Warm Builder"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`shrink-0 cursor-pointer rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
                  tone === t ? "bg-[#212d3d] text-[#faf6ed]" : "border border-[#e3dccb] bg-white text-[#5a6675]"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="shrink-0 cursor-pointer rounded-full border border-[#e3dccb] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#212d3d]"
            >
              Copy all
            </button>
          </>
        }
        blocks={[
          { key: "to", section: "To", style: "meta", text: recipientName, placeholder: "Hiring manager's name", onChange: setRecipientName },
          { key: "role", section: "To", style: "meta", text: [jobTitleInput, companyInput].filter(Boolean).join(" · "), placeholder: "Role · Company", onChange: (v) => { const [r, ...c] = v.split("·").map((x) => x.trim()); setJobTitleInput(r || ""); setCompanyInput(c.join(" · ")); } },
          { key: "open", section: "Open", text: openingParagraph, placeholder: "Hook: why this role, with one concrete fact…", tone: analysis.foundGeneric.length ? "warn" : "none", onChange: setOpeningParagraph },
          { key: "main", section: "Body", text: mainBody, placeholder: "Your strongest verified evidence…", onChange: setMainBody },
          { key: "close", section: "Close", text: closingParagraph, placeholder: "Thank them and suggest a next step…", onChange: setClosingParagraph },
          { key: "sig", section: "Close", style: "chip", text: signature, placeholder: "Sincerely, your name", onChange: setSignature },
          ...analysis.tips.slice(0, 3).map((tip, i) => ({ key: `tip-${i}`, section: "Tips", style: "chip" as const, tone: "good" as const, text: tip })),
        ]}
        score={analysis.overall}
        scoreLabel="Rhetoric"
        primaryLabel="Save"
        onPrimary={() => handleSaveCurrent()}
        message={statusMsg}
        tools={{ label: "More tools · library, compare, export", onToggle: setShowTools }}
      />

      <div className={`${showTools ? "mt-4 pb-28" : "hidden"} space-y-6 lg:block lg:pb-0`}>
        <MobilePhilosopherPill
          name="Cicero"
          role="Rhetoric & Persuasion"
          image="/images/cicero-rhetoric-scroll.jpg"
          quote="Specific facts win the forum; generic adjectives forfeit attention."
          guidance={`Current Rhetoric Score: ${analysis.overall}/100 across ${analysis.totalWords} words. Use paragraph fields below to refine ethos and concrete proof.`}
        />

        {/* HERO DASHBOARD & KPI OVERVIEW WITH CICERO */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Marcus Tullius Cicero · Rhetoric Dashboard & Writing Studio" />
                <StatusPill
                  label={`Overall Rhetoric Score: ${analysis.overall}/100`}
                  tone={analysis.overall >= 82 ? "success" : "warning"}
                />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.06] text-[#212d3d]">
                Cicero&apos;s Persuasive{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Cover Letter Atelier.
                </span>
              </h1>
              <p className="max-w-[66ch] text-[13px] text-[#5a6675]">
                Cicero taught that persuasion rests on three pillars:{" "}
                <strong>ethos</strong> (verified credibility),{" "}
                <strong>logos</strong> (specific role proof), and clarity. Draft
                paragraph by paragraph using real job requirements and your
                verified CV evidence—never generic templates.
              </p>

              {/* COVER LETTER DASHBOARD KPI STRIP */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Total Letters", value: totalCount },
                  { label: "Active Drafts", value: draftCount },
                  { label: "Completed", value: completedCount },
                  { label: "Jobs Linked", value: uniqueJobsLinked },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-[14px] border border-[#dfd4be] bg-white px-3.5 py-2.5"
                  >
                    <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                      {kpi.label}
                    </p>
                    <p className="mt-0.5 font-serif-display text-[24px] leading-none text-[#212d3d]">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
              <div className="w-full max-w-[295px] overflow-hidden rounded-t-[140px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-md">
                <img
                  src="/images/cicero-rhetoric-scroll.jpg"
                  alt="Cicero composing letter with quill in Roman forum"
                  className="aspect-[4/3.6] w-full object-cover object-top"
                />
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Cicero · Ethos &amp; Proof
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#212d3d]">
                    “Specific facts win the forum; generic adjectives forfeit attention.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTEXT GENERATOR TOOLBAR */}
        <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Eyebrow label="Contextual Draft Composer" />
              <h2 className="font-serif-display text-[20px] text-[#212d3d]">
                Pair a Target Job &amp; Verified CV Baseline
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCreateBlankOrTailored(true)}
                className="cursor-pointer rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-4 py-1.5 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                + New Blank Letter
              </button>
              <button
                type="button"
                onClick={() => handleCreateBlankOrTailored(false)}
                className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed] hover:bg-[#314158]"
              >
                Generate Grounded Draft
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            <select
              id="cl-job-select"
              name="clJobId"
              aria-label="Associate target job"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="rounded-[12px] border border-[#cfc2a5] bg-[#faf6ed] px-3 py-2 text-[12px]"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  Job: {j.company} — {j.title}
                </option>
              ))}
            </select>
            <select
              id="cl-cv-select"
              name="clResumeId"
              aria-label="Associate resume baseline"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="rounded-[12px] border border-[#cfc2a5] bg-[#faf6ed] px-3 py-2 text-[12px]"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  CV: {r.name}
                </option>
              ))}
            </select>
            <select
              id="cl-tone-select"
              name="clTone"
              aria-label="Writing tone"
              value={tone}
              onChange={(e) =>
                setTone(e.target.value as CoverLetterDraft["tone"])
              }
              className="rounded-[12px] border border-[#cfc2a5] bg-[#faf6ed] px-3 py-2 text-[12px]"
            >
              <option value="Crisp Analytical">Tone: Crisp Analytical</option>
              <option value="Executive">Tone: Executive</option>
              <option value="Warm Builder">Tone: Warm Builder</option>
            </select>
            <select
              id="cl-style-select"
              name="clStyle"
              aria-label="Rhetoric style"
              value={style}
              onChange={(e) =>
                setStyle(e.target.value as CoverLetterDraft["style"])
              }
              className="rounded-[12px] border border-[#cfc2a5] bg-[#faf6ed] px-3 py-2 text-[12px]"
            >
              <option value="Rhetorical Proof">Style: Rhetorical Proof</option>
              <option value="Metric Brief">Style: Metric Brief</option>
              <option value="Concise Note">Style: Concise Note</option>
            </select>
            <input
              id="cl-focus-note"
              name="clFocusNote"
              aria-label="Optional emphasis instruction"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Optional focus metric..."
              className="rounded-[12px] border border-[#cfc2a5] bg-white px-3 py-2 text-[12px]"
            />
          </div>

          {statusMsg && <StatusPill label={statusMsg} tone="success" />}
        </section>

        {/* MAIN 3-PART STUDIO: LIBRARY (LEFT 4) + WORKSPACE (RIGHT 8) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT 4: SEARCHABLE FILTERABLE LIBRARY */}
          <aside className="space-y-3 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 lg:col-span-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif-display text-[21px] text-[#212d3d]">
                Letter Library ({filteredLetters.length})
              </h2>
              <select
                id="cl-sort-select"
                name="clSortMode"
                aria-label="Sort cover letters"
                value={sortMode}
                onChange={(e) =>
                  setSortMode(e.target.value as "recent" | "company" | "words")
                }
                className="rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-2.5 py-1 text-[11px]"
              >
                <option value="recent">Sort: Version</option>
                <option value="company">Sort: Company</option>
                <option value="words">Sort: Length</option>
              </select>
            </div>

            <input
              id="cl-library-search"
              name="clLibrarySearch"
              type="search"
              aria-label="Search cover letters"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, company, or phrase..."
              className="w-full rounded-full border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-1.5 text-[12px]"
            />

            <div className="flex flex-wrap gap-1">
              {(["all", "draft", "completed", "archived"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                    statusFilter === st
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dad6ca] bg-[#faf6ed] text-[#5a6675]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-0.5">
              {filteredLetters.length === 0 ? (
                <div className="rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-4 text-center space-y-2">
                  <p className="text-[12.5px] text-[#5a6675]">
                    No cover letters match your current filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11px]"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredLetters.map((cl) => (
                  <button
                    key={cl.id}
                    type="button"
                    onClick={() => selectLetter(cl)}
                    className={`w-full cursor-pointer rounded-[14px] border p-3.5 text-left transition-all ${
                      cl.id === activeLetter?.id
                        ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                        : "border-[#dfd4be] bg-[#faf6ed] text-[#212d3d] hover:border-[#8f7d5d]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-medium">
                        {cl.title}
                      </span>
                      <span className="shrink-0 rounded-full border border-current/25 px-2 py-0.5 font-mono text-[9.5px] uppercase">
                        {cl.status || "draft"}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] opacity-80">
                      v{cl.version} · {cl.tone} · {cl.updatedAt}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* RIGHT 8: STRUCTURED PARAGRAPH STUDIO + PREVIEW + COMPARE + ANALYSIS */}
          <section className="space-y-5 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-8">
            {/* Title, Workspace Tabs & Management Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece5d5] pb-4">
              <input
                id="cl-title-input"
                name="clTitleInput"
                aria-label="Cover letter title"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                className="w-full min-w-0 sm:w-auto sm:flex-1 font-serif-display text-[17px] sm:text-[22px] text-[#212d3d] focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "editor", label: "Paragraph Editor" },
                    { id: "preview", label: "Live Sheet Preview" },
                    { id: "compare", label: "Compare Drafts" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setWorkspaceTab(t.id)}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11.5px] font-medium ${
                      workspaceTab === t.id
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#cfc2a5] bg-[#faf6ed] text-[#212d3d]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Management & Export Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] px-3.5 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSaveCurrent()}
                  className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1 text-[11.5px] font-medium text-[#faf6ed]"
                >
                  Save Draft (v{(activeLetter?.version || 1) + 1})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSaveCurrent(
                      letterStatus === "completed" ? "draft" : "completed"
                    )
                  }
                  className="cursor-pointer rounded-full border border-[#067647]/40 bg-white px-3 py-1 text-[11.5px] font-medium text-[#067647]"
                >
                  {letterStatus === "completed"
                    ? "Reopen as Draft"
                    : "Mark Completed"}
                </button>
                <button
                  type="button"
                  onClick={handleDuplicateCurrent}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11.5px] text-[#212d3d]"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSaveCurrent(
                      letterStatus === "archived" ? "draft" : "archived"
                    )
                  }
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11.5px] text-[#5a6675]"
                >
                  {letterStatus === "archived" ? "Unarchive" : "Archive"}
                </button>
                {coverLetters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen((v) => !v)}
                    className="cursor-pointer rounded-full border border-[#b42318]/40 bg-white px-3 py-1 text-[11.5px] text-[#b42318]"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11.5px] text-[#212d3d]"
                >
                  Copy Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") window.print();
                  }}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11.5px] text-[#212d3d]"
                >
                  Print / PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload("doc")}
                  className="cursor-pointer rounded-full border border-[#212d3d] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
                >
                  Export .doc
                </button>
              </div>
            </div>

            {confirmDeleteOpen && activeLetter && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#b42318]/40 bg-[#b42318]/10 px-4 py-2.5 text-[12.5px] text-[#b42318]">
                <span>
                  Permanently delete &ldquo;{activeLetter.title}&rdquo; from your
                  local workspace?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = coverLetters.filter(
                        (c) => c.id !== activeLetter.id
                      );
                      deleteCoverLetter(activeLetter.id);
                      if (remaining[0]) selectLetter(remaining[0]);
                      setConfirmDeleteOpen(false);
                      notify("Cover letter removed.");
                    }}
                    className="cursor-pointer rounded-full bg-[#b42318] px-3.5 py-1 text-[11.5px] font-medium text-white"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(false)}
                    className="cursor-pointer rounded-full border border-[#b42318]/40 bg-white px-3 py-1 text-[11.5px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: STRUCTURED PARAGRAPH EDITOR + CONTEXTUAL EVIDENCE */}
            {workspaceTab === "editor" && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div className="space-y-3 xl:col-span-8">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <input
                      id="cl-recipient-input"
                      name="clRecipient"
                      aria-label="Recipient name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Recipient / Hiring Team"
                      className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[12.5px]"
                    />
                    <input
                      id="cl-company-input"
                      name="clCompany"
                      aria-label="Target company"
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      placeholder="Target Company"
                      className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[12.5px]"
                    />
                    <input
                      id="cl-position-input"
                      name="clPosition"
                      aria-label="Target job title"
                      value={jobTitleInput}
                      onChange={(e) => setJobTitleInput(e.target.value)}
                      placeholder="Target Position"
                      className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[12.5px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cl-opening-para"
                      className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                    >
                      01 · Opening Hook (Role Fit &amp; Concrete Anchor)
                    </label>
                    <textarea
                      id="cl-opening-para"
                      name="clOpening"
                      rows={3}
                      value={openingParagraph}
                      onChange={(e) => setOpeningParagraph(e.target.value)}
                      className="mt-1 w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px] leading-relaxed text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cl-main-para"
                      className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                    >
                      02 · Main Argument (Verified Evidence &amp; Company Alignment)
                    </label>
                    <textarea
                      id="cl-main-para"
                      name="clMain"
                      rows={5}
                      value={mainBody}
                      onChange={(e) => setMainBody(e.target.value)}
                      className="mt-1 w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px] leading-relaxed text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cl-closing-para"
                        className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                      >
                        03 · Closing Conviction
                      </label>
                      <textarea
                        id="cl-closing-para"
                        name="clClosing"
                        rows={2}
                        value={closingParagraph}
                        onChange={(e) => setClosingParagraph(e.target.value)}
                        className="mt-1 w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cl-signature-para"
                        className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                      >
                        04 · Sign-off Signature
                      </label>
                      <textarea
                        id="cl-signature-para"
                        name="clSignature"
                        rows={2}
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="mt-1 w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CONTEXTUAL JOB & CICERO DIAGNOSTIC RAIL */}
                <div className="space-y-4 xl:col-span-4">
                  {/* Writing Quality Breakdown */}
                  <div className="rounded-[16px] border border-[#dfd4be] bg-[#faf6ed] p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                        Cicero Rhetoric Check
                      </p>
                      <span className="font-mono text-[11px] font-semibold text-[#212d3d]">
                        {analysis.totalWords} words
                      </span>
                    </div>
                    {[
                      { label: "Job Relevance", val: analysis.relevance },
                      { label: "Specificity", val: analysis.specificity },
                      { label: "Tone & Clarity", val: analysis.clarity },
                    ].map((m) => (
                      <div key={m.label} className="space-y-1 text-[11.5px]">
                        <div className="flex justify-between">
                          <span className="text-[#5a6675]">{m.label}</span>
                          <span className="font-mono font-semibold text-[#212d3d]">
                            {m.val}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#e5dac2]">
                          <div
                            className="h-full rounded-full bg-[#212d3d]"
                            style={{ width: `${m.val}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {analysis.tips.length > 0 ? (
                      <ul className="space-y-1 border-t border-[#e3dac5] pt-2 text-[11.5px] text-[#b54708]">
                        {analysis.tips.map((tip) => (
                          <li key={tip}>• {tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="border-t border-[#e3dac5] pt-2 text-[11.5px] font-medium text-[#067647]">
                        Zero cliché filler or missing company cues detected.
                      </p>
                    )}
                  </div>

                  {/* Contextual Linked Job Requirements */}
                  {selectedJob && (
                    <div className="rounded-[16px] border border-[#dfd4be] bg-[#f4efe3] p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                          Linked Role Signals
                        </p>
                        <Link
                          href={`/dashboard/jobs/${selectedJob.id}`}
                          className="text-[11px] font-medium text-[#175cd3] underline"
                        >
                          Job Dossier -&gt;
                        </Link>
                      </div>
                      <p className="text-[12px] font-medium text-[#212d3d]">
                        {selectedJob.company} — {selectedJob.title}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.matchingSkills.slice(0, 4).map((sk) => (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => insertEvidenceIntoMain(sk)}
                            className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-2.5 py-0.5 text-[10.5px] text-[#212d3d] hover:border-[#212d3d]"
                          >
                            + Cite &ldquo;{sk}&rdquo;
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: LIVE PRINT-READY MANUSCRIPT PREVIEW */}
            {workspaceTab === "preview" && (
              <div className="mx-auto max-w-[760px] rounded-[14px] border border-[#cfc2a5] bg-white p-8 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-[#ece5d5] pb-4">
                  <div>
                    <p className="font-serif-display text-[26px] text-[#212d3d]">
                      {profile.name || "Candidate"}
                    </p>
                    <p className="font-mono text-[11px] text-[#5a6675]">
                      {profile.email || "candidate@vex.careers"} · Target:{" "}
                      {jobTitleInput || selectedJob?.title}
                    </p>
                  </div>
                  <StatusPill
                    label={`${tone} · ${style}`}
                    tone="neutral"
                    dot={false}
                  />
                </div>
                <pre className="whitespace-pre-wrap font-serif-editorial text-[15px] leading-[1.7] text-[#212d3d]">
                  {composedBody}
                </pre>
              </div>
            )}

            {/* TAB 3: SIDE-BY-SIDE DRAFT COMPARISON */}
            {workspaceTab === "compare" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#dfd4be] bg-[#faf6ed] p-3.5">
                  <span className="font-mono text-[10.5px] uppercase text-[#7a6b4e]">
                    Compare Current Draft Against:
                  </span>
                  <select
                    id="cl-compare-select"
                    name="clCompareId"
                    aria-label="Select cover letter draft to compare"
                    value={compareLetterId}
                    onChange={(e) => setCompareLetterId(e.target.value)}
                    className="rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1 text-[12px]"
                  >
                    {coverLetters
                      .filter((l) => l.id !== activeLetter?.id)
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title} (v{l.version})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-[16px] border border-[#212d3d] bg-[#faf6ed] p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[13.5px] text-[#212d3d]">
                        Active: {editorTitle}
                      </p>
                      <StatusPill
                        label={`Score ${analysis.overall}/100`}
                        tone={
                          !compareAnalysis ||
                          analysis.overall >= compareAnalysis.overall
                            ? "success"
                            : "info"
                        }
                        dot={false}
                      />
                    </div>
                    <p className="font-mono text-[10.5px] text-[#5a6675]">
                      {analysis.totalWords} words · Relevance {analysis.relevance}% ·
                      Specificity {analysis.specificity}%
                    </p>
                    <pre className="max-h-[260px] overflow-auto whitespace-pre-wrap rounded-[12px] border border-[#dfd4be] bg-white p-3 font-sans text-[12px] leading-relaxed text-[#212d3d]">
                      {composedBody}
                    </pre>
                  </div>

                  {compareLetter && compareAnalysis ? (
                    <div className="rounded-[16px] border border-[#dad6ca] bg-[#fffef9] p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[13.5px] text-[#212d3d]">
                          Compare: {compareLetter.title}
                        </p>
                        <StatusPill
                          label={`Score ${compareAnalysis.overall}/100`}
                          tone={
                            compareAnalysis.overall > analysis.overall
                              ? "success"
                              : "neutral"
                          }
                          dot={false}
                        />
                      </div>
                      <p className="font-mono text-[10.5px] text-[#5a6675]">
                        {compareAnalysis.totalWords} words · Relevance{" "}
                        {compareAnalysis.relevance}% · Specificity{" "}
                        {compareAnalysis.specificity}%
                      </p>
                      <pre className="max-h-[260px] overflow-auto whitespace-pre-wrap rounded-[12px] border border-[#dfd4be] bg-[#faf6ed] p-3 font-sans text-[12px] leading-relaxed text-[#212d3d]">
                        {compareLetter.body}
                      </pre>
                      <button
                        type="button"
                        onClick={() => {
                          selectLetter(compareLetter);
                          setWorkspaceTab("editor");
                          notify(`Selected "${compareLetter.title}" as active draft.`);
                        }}
                        className="w-full cursor-pointer rounded-full border border-[#212d3d] bg-white py-1.5 text-[12px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                      >
                        Switch to &amp; Edit This Version
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-6 text-center text-[12.5px] text-[#5a6675]">
                      Create or duplicate another cover letter to compare variations side by side.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
