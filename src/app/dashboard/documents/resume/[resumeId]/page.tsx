"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ResumeDocument } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import MobileNoteEditor, { type NoteBlock } from "@/components/mobile/MobileNoteEditor";

export default function ResumeEditorPage() {
  const params = useParams<{ resumeId: string }>();
  const router = useRouter();
  const { resumes, jobs, profile, saveResume, createResume } = useVexWorkspace();

  const currentDoc =
    resumes.find((r) => r.id === params?.resumeId) || resumes[0];
  const [draft, setDraft] = useState<ResumeDocument>(currentDoc);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const [parseNotice, setParseNotice] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [compareId, setCompareId] = useState(
    resumes.find((r) => r.id !== currentDoc.id)?.id || ""
  );

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const compareDoc = resumes.find((r) => r.id === compareId);

  // Honest ATS readability & evidence check computed from draft contents
  const bulletCount = draft.experience.reduce(
    (sum, ex) => sum + ex.bullets.filter((b) => b.trim()).length,
    0
  );
  const atsChecks = [
    {
      label: "Contact & Headline Present",
      ok: Boolean(draft.personalInfo.fullName.trim() && draft.personalInfo.email.trim()),
    },
    {
      label: "Focused Executive Summary (>= 15 words)",
      ok: draft.summary.trim().split(/\s+/).length >= 15,
    },
    {
      label: "Quantified / Concrete Experience Bullets (>= 2)",
      ok: bulletCount >= 2,
    },
    {
      label: "Attested Skills Listed (>= 4)",
      ok: draft.skills.length >= 4,
    },
  ];
  const atsScore = Math.round(
    (atsChecks.filter((c) => c.ok).length / atsChecks.length) * 96
  );

  function handleSwitchVersion(id: string) {
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setDraft(found);
      router.push(`/dashboard/documents/resume/${found.id}`);
    }
  }

  function handleCreateBlankCv() {
    const fresh: ResumeDocument = {
      id: `res-${Date.now()}`,
      name: `Tailored CV Draft (${new Date().toLocaleDateString()})`,
      targetRole: selectedJob?.title || profile.targetRole,
      template: "editorial",
      sourceFile: "Created from scratch",
      updatedAt: "Just now",
      personalInfo: {
        fullName: profile.name || "Candidate",
        email: profile.email || "candidate@vex.careers",
        location: "UK",
        headline: selectedJob?.title || profile.targetRole,
      },
      summary:
        "Add a concise, factual summary grounded in verified career history only.",
      experience: [
        {
          id: `exp-${Date.now()}`,
          company: "Your Organization",
          role: profile.currentRole || "Current Role",
          period: "2023 – Present",
          bullets: ["Describe one verified outcome you personally delivered."],
        },
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: "Your University / Credential",
          degree: "Degree / Certification",
          year: "2021",
        },
      ],
      skills: draft.skills.slice(0, 3),
      certifications: [],
      projects: [],
    };
    createResume(fresh);
    setDraft(fresh);
    router.push(`/dashboard/documents/resume/${fresh.id}`);
  }

  function handleFileParse(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPlain =
      file.name.endsWith(".txt") || file.name.endsWith(".md") || file.type.startsWith("text/");
    if (isPlain) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        setDraft((prev) => ({
          ...prev,
          sourceFile: file.name,
          updatedAt: "Parsed just now",
          summary: lines.slice(0, 3).join(" ").slice(0, 320) || prev.summary,
        }));
        setParseNotice(
          `Extracted ${lines.length} readable lines from "${file.name}" into your draft.`
        );
      };
      reader.readAsText(file);
    } else {
      setDraft((prev) => ({
        ...prev,
        sourceFile: file.name,
        updatedAt: "Attached · Ready for manual field check",
      }));
      setParseNotice(
        `Attached "${file.name}" (${Math.max(1, Math.round(file.size / 1024))} KB). Binary PDF/DOCX server extraction requires backend parser — review or edit structured sections below without inventing facts.`
      );
    }
  }


  // ---------- Phone note-editor view of the same draft ----------
  const setPersonal = (k: keyof ResumeDocument["personalInfo"]) => (v: string) =>
    setDraft((d) => ({ ...d, personalInfo: { ...d.personalInfo, [k]: v } }));
  const setExp = (i: number, patch: Partial<ResumeDocument["experience"][number]>) =>
    setDraft((d) => ({ ...d, experience: d.experience.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const setEdu = (i: number, patch: Partial<ResumeDocument["education"][number]>) =>
    setDraft((d) => ({ ...d, education: d.education.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const splitList = (v: string) => v.split(/\s*[·,\n]\s*/).map((x) => x.trim()).filter(Boolean);

  const noteBlocks: NoteBlock[] = [
    { key: "name", section: "Header", style: "title", text: draft.personalInfo.fullName, placeholder: "Your full name", onChange: setPersonal("fullName") },
    { key: "headline", section: "Header", style: "meta", text: draft.personalInfo.headline, placeholder: "Headline", onChange: setPersonal("headline") },
    { key: "contact", section: "Header", style: "meta", text: `${draft.personalInfo.email}${draft.personalInfo.location ? " · " + draft.personalInfo.location : ""}`, onChange: (v) => { const [e, ...rest] = v.split("·").map((x) => x.trim()); setDraft((d) => ({ ...d, personalInfo: { ...d.personalInfo, email: e || "", location: rest.join(" · ") } })); } },
    { key: "summary", section: "Profile", text: draft.summary, placeholder: "Write a 2–3 sentence summary…", tone: draft.summary.trim().split(/\s+/).length < 15 ? "warn" : "none", onChange: (v) => setDraft((d) => ({ ...d, summary: v })) },
    ...draft.experience.flatMap((ex, i): NoteBlock[] => [
      { key: `role-${ex.id}`, section: `Role ${i + 1}`, style: "chip", text: `${ex.role}`, placeholder: "Job title", onChange: (v) => setExp(i, { role: v }), onRemove: () => setDraft((d) => ({ ...d, experience: d.experience.filter((_, j) => j !== i) })) },
      { key: `co-${ex.id}`, section: `Role ${i + 1}`, style: "meta", text: `${ex.company} · ${ex.period}`, onChange: (v) => { const [c, ...per] = v.split("·").map((x) => x.trim()); setExp(i, { company: c || "", period: per.join(" · ") }); } },
      ...ex.bullets.map((b, k): NoteBlock => ({
        key: `b-${ex.id}-${k}`, section: `Role ${i + 1}`, text: b, placeholder: "Describe a concrete result…",
        onChange: (v) => setExp(i, { bullets: ex.bullets.map((x, j) => (j === k ? v : x)) }),
        onRemove: () => setExp(i, { bullets: ex.bullets.filter((_, j) => j !== k) }),
      })),
    ]),
    ...draft.education.map((ed, i): NoteBlock => ({
      key: `ed-${ed.id}`, section: "Education", style: "chip", text: `${ed.degree} · ${ed.institution} · ${ed.year}`,
      onChange: (v) => { const [deg, inst, yr] = v.split("·").map((x) => x.trim()); setEdu(i, { degree: deg || "", institution: inst || "", year: yr || "" }); },
      onRemove: () => setDraft((d) => ({ ...d, education: d.education.filter((_, j) => j !== i) })),
    })),
    { key: "skills", section: "Skills", text: draft.skills.join(" · "), placeholder: "Skill · Skill · Skill", tone: draft.skills.length < 4 ? "warn" : "none", onChange: (v) => setDraft((d) => ({ ...d, skills: splitList(v) })) },
    ...(draft.certifications.length ? [{ key: "certs", section: "Certs", text: draft.certifications.join(" · "), onChange: (v: string) => setDraft((d) => ({ ...d, certifications: splitList(v) })) }] : []),
  ];

  const noteAdds = [
    ...draft.experience.map((ex, i) => ({ section: `Role ${i + 1}`, label: "+ Add bullet", onAdd: () => setExp(i, { bullets: [...ex.bullets, ""] }) })),
    { section: "Education", label: "+ Add education", onAdd: () => setDraft((d) => ({ ...d, education: [...d.education, { id: `ed-${Date.now()}`, institution: "", degree: "", year: "" }] })) },
  ];
  const lastRoleSection = draft.experience.length ? `Role ${draft.experience.length}` : "Profile";
  noteAdds.push({ section: lastRoleSection, label: "+ Add role", onAdd: () => setDraft((d) => ({ ...d, experience: [...d.experience, { id: `ex-${Date.now()}`, role: "New role", company: "Company", period: "Year – Year", bullets: [""] }] })) });

  function handleSaveVersion() {
    saveResume({ ...draft, updatedAt: "Saved just now" });
    setSavedMsg(`Saved "${draft.name}" across your Vex Workspace.`);
    setTimeout(() => setSavedMsg(""), 3000);
  }

  return (
    <DashboardSubpageFrame
      parentSection="documents"
      parentLabel="Documents Scriptorium"
      pageCode="04.1"
      pageTitle="Complete Resume Studio"
      philosopherTag="Leonardo · Precision Craft"
    >
      <MobileNoteEditor
        eyebrow={`${draft.updatedAt} · ${draft.targetRole || "CV"}`}
        title={draft.name}
        chips={
          <>
            <select
              aria-label="CV version"
              value={draft.id}
              onChange={(e) => handleSwitchVersion(e.target.value)}
              className="max-w-[170px] shrink-0 cursor-pointer truncate rounded-full border border-[#e3dccb] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <span className="shrink-0 rounded-full border border-[#e3dccb] bg-white px-2.5 py-1 text-[11.5px] text-[#5a6675]">
              {bulletCount} bullets
            </span>
            <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ${atsScore >= 90 ? "bg-[#067647]/10 text-[#067647]" : "bg-[#b88b32]/15 text-[#8a651b]"}`}>
              ATS {atsScore}%
            </span>
            <Link href={`/dashboard/documents/resume/${draft.id}/preview`} className="shrink-0 rounded-full bg-[#212d3d] px-3 py-1 text-[11.5px] font-medium text-[#faf6ed]">
              Preview
            </Link>
          </>
        }
        blocks={noteBlocks}
        adds={noteAdds}
        score={atsScore}
        scoreLabel="ATS"
        primaryLabel="Save"
        onPrimary={handleSaveVersion}
        message={savedMsg || parseNotice}
        tools={{
          label: "More tools · upload, compare, tailor",
          onToggle: setShowTools,
        }}
      />

      <div className={`${showTools ? "mt-4 pb-28" : "hidden"} space-y-6 lg:block lg:pb-0`}>
        {/* TOP HEADER + VERSION & FILE CONTROLS */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3.5 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Leonardo da Vinci · Structured CV Architect" />
                <StatusPill label={`ATS Score: ${atsScore}%`} tone="success" />
                <StatusPill
                  label={`${resumes.length} CV Versions`}
                  tone="navy"
                  dot={false}
                />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.06] text-[#212d3d]">
                Complete Resume{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Editor &amp; Tailor.
                </span>
              </h1>
              <p className="max-w-[64ch] text-[13px] text-[#5a6675]">
                Upload a manuscript, inspect structured experience/education/skills
                sections, compare CV versions side-by-side, and tailor safely for
                your target role — zero invented credentials.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <select id="page-select-1" name="page-select-1" aria-label="page select 1"
                  value={draft.id}
                  onChange={(e) => handleSwitchVersion(e.target.value)}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d]"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.updatedAt})
                    </option>
                  ))}
                </select>

                <label className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]">
                  Upload PDF / DOCX / TXT
                  <input id="page-input-2" name="page-input-2" aria-label="page input 2"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md"
                    onChange={handleFileParse}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleCreateBlankCv}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-[#f4efe3] px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  + New CV Version
                </button>

                <button
                  type="button"
                  onClick={handleSaveVersion}
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-2 text-[12px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  Save Changes
                </button>

                <Link
                  href={`/dashboard/documents/resume/${draft.id}/preview`}
                  className="rounded-full border border-[#212d3d] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                >
                  Live Preview &amp; Export -&gt;
                </Link>
              </div>

              {parseNotice && (
                <p className="rounded-[12px] border border-[#175cd3]/30 bg-white px-3.5 py-2 text-[12px] text-[#212d3d]">
                  {parseNotice}
                </p>
              )}
              {savedMsg && (
                <p className="rounded-[12px] border border-[#067647]/30 bg-[#067647]/10 px-3.5 py-2 text-[12px] text-[#067647]">
                  {savedMsg}
                </p>
              )}
            </div>

            {/* Right: Leonardo Craft Mentor */}
            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3.5 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3.5 shadow-xs">
                <img
                  src="/images/davinci-profile-bust.jpg"
                  alt="Leonardo da Vinci portrait"
                  className="h-24 w-20 shrink-0 rounded-[14px] border border-[#cfc2a5] object-cover object-top"
                />
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Leonardo da Vinci
                  </p>
                  <p className="text-[12px] leading-snug text-[#212d3d]">
                    “Proportion and truthful clarity make every line pass both
                    human and ATS inspection.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN 2-COLUMN STRUCTURED EDITOR + JOB TAILORING & COMPARISON */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT 7: STRUCTURED SECTIONS */}
          <div className="space-y-5 lg:col-span-7">
            {/* Personal Info & Headline */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif-display text-[21px] text-[#212d3d]">
                  Personal Details, Template &amp; Version Title
                </h2>
                <div className="flex items-center gap-1.5">
                  {(["editorial", "classic", "executive"] as const).map((tpl) => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => setDraft({ ...draft, template: tpl })}
                      className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium capitalize ${
                        draft.template === tpl
                          ? "bg-[#212d3d] text-[#faf6ed]"
                          : "border border-[#dad6ca] bg-[#faf6ed] text-[#5a6675]"
                      }`}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input id="page-input-3" name="page-input-3" aria-label="page input 3"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="CV version name"
                  className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                />
                <input id="page-input-4" name="page-input-4" aria-label="page input 4"
                  value={draft.personalInfo.fullName}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      personalInfo: {
                        ...draft.personalInfo,
                        fullName: e.target.value,
                      },
                    })
                  }
                  placeholder="Full Name"
                  className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                />
                <input id="page-input-5" name="page-input-5" aria-label="page input 5"
                  value={draft.personalInfo.email}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      personalInfo: {
                        ...draft.personalInfo,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="Email"
                  className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                />
                <input id="page-input-6" name="page-input-6" aria-label="page input 6"
                  value={draft.personalInfo.location}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      personalInfo: {
                        ...draft.personalInfo,
                        location: e.target.value,
                      },
                    })
                  }
                  placeholder="Location"
                  className="rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                />
              </div>
              <input id="page-input-7" name="page-input-7" aria-label="page input 7"
                value={draft.personalInfo.headline}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      headline: e.target.value,
                    },
                  })
                }
                placeholder="Professional headline"
                className="w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
              />
              <textarea id="page-textarea-8" name="page-textarea-8" aria-label="page textarea 8"
                rows={3}
                value={draft.summary}
                onChange={(e) =>
                  setDraft({ ...draft, summary: e.target.value })
                }
                placeholder="Professional summary grounded in verified accomplishments..."
                className="w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px]"
              />
            </section>

            {/* Experience Editor */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-[21px] text-[#212d3d]">
                  Work Experience ({draft.experience.length})
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      experience: [
                        ...draft.experience,
                        {
                          id: `exp-${Date.now()}`,
                          company: "Company Name",
                          role: "Role Title",
                          period: "2024 – Present",
                          bullets: ["Describe verified measurable contribution."],
                        },
                      ],
                    })
                  }
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
                >
                  + Add Role
                </button>
              </div>

              <div className="space-y-4">
                {draft.experience.map((exp, eIdx) => (
                  <div
                    key={exp.id}
                    className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                        Role Position #{eIdx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={eIdx === 0}
                          onClick={() => {
                            const next = [...draft.experience];
                            [next[eIdx - 1], next[eIdx]] = [next[eIdx], next[eIdx - 1]];
                            setDraft({ ...draft, experience: next });
                          }}
                          className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-2.5 py-0.5 text-[11px] disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={eIdx === draft.experience.length - 1}
                          onClick={() => {
                            const next = [...draft.experience];
                            [next[eIdx + 1], next[eIdx]] = [next[eIdx], next[eIdx + 1]];
                            setDraft({ ...draft, experience: next });
                          }}
                          className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-2.5 py-0.5 text-[11px] disabled:opacity-40"
                        >
                          Down
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <input id={`resume-exp-role-${exp.id}`} name={`resume-exp-role-${exp.id}`} aria-label={`Role title ${eIdx + 1}`}
                        value={exp.role}
                        onChange={(e) => {
                          const next = [...draft.experience];
                          next[eIdx] = { ...exp, role: e.target.value };
                          setDraft({ ...draft, experience: next });
                        }}
                        className="rounded-[8px] border border-[#dad6ca] bg-white px-2.5 py-1.5 text-[12.5px] font-medium"
                      />
                      <input id={`resume-exp-company-${exp.id}`} name={`resume-exp-company-${exp.id}`} aria-label={`Company ${eIdx + 1}`}
                        value={exp.company}
                        onChange={(e) => {
                          const next = [...draft.experience];
                          next[eIdx] = { ...exp, company: e.target.value };
                          setDraft({ ...draft, experience: next });
                        }}
                        className="rounded-[8px] border border-[#dad6ca] bg-white px-2.5 py-1.5 text-[12.5px]"
                      />
                      <input id={`resume-exp-period-${exp.id}`} name={`resume-exp-period-${exp.id}`} aria-label={`Period ${eIdx + 1}`}
                        value={exp.period}
                        onChange={(e) => {
                          const next = [...draft.experience];
                          next[eIdx] = { ...exp, period: e.target.value };
                          setDraft({ ...draft, experience: next });
                        }}
                        className="rounded-[8px] border border-[#dad6ca] bg-white px-2.5 py-1.5 font-mono text-[11.5px]"
                      />
                    </div>
                    <textarea id={`resume-exp-bullets-${exp.id}`} name={`resume-exp-bullets-${exp.id}`} aria-label={`Experience bullets ${eIdx + 1}`}
                      rows={2}
                      value={exp.bullets.join("\n")}
                      onChange={(e) => {
                        const next = [...draft.experience];
                        next[eIdx] = {
                          ...exp,
                          bullets: e.target.value.split("\n"),
                        };
                        setDraft({ ...draft, experience: next });
                      }}
                      className="w-full rounded-[8px] border border-[#dad6ca] bg-white p-2.5 text-[12.5px]"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Education, Skills & Certifications */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-4">
              <h2 className="font-serif-display text-[21px] text-[#212d3d]">
                Education, Skills &amp; Certifications
              </h2>
              {draft.education.map((ed, idx) => (
                <div key={ed.id} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <input id={`resume-ed-inst-${ed.id}`} name={`resume-ed-inst-${ed.id}`} aria-label={`Institution ${idx + 1}`}
                    value={ed.institution}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...ed, institution: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    className="rounded-[8px] border border-[#dad6ca] bg-[#faf6ed] px-2.5 py-1.5 text-[12.5px]"
                  />
                  <input id={`resume-ed-deg-${ed.id}`} name={`resume-ed-deg-${ed.id}`} aria-label={`Degree ${idx + 1}`}
                    value={ed.degree}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...ed, degree: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    className="rounded-[8px] border border-[#dad6ca] bg-[#faf6ed] px-2.5 py-1.5 text-[12.5px]"
                  />
                  <input id={`resume-ed-year-${ed.id}`} name={`resume-ed-year-${ed.id}`} aria-label={`Year ${idx + 1}`}
                    value={ed.year}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...ed, year: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    className="rounded-[8px] border border-[#dad6ca] bg-[#faf6ed] px-2.5 py-1.5 font-mono text-[12px]"
                  />
                </div>
              ))}

              <div className="space-y-2 border-t border-[#ece5d5] pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {draft.skills.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          skills: draft.skills.filter((s) => s !== sk),
                        })
                      }
                      className="cursor-pointer rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3 py-1 text-[11.5px] text-[#212d3d] hover:border-[#b42318]"
                    >
                      {sk} ×
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input id="page-input-16" name="page-input-16" aria-label="page input 16"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add verified skill..."
                    className="flex-1 rounded-full border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-1.5 text-[12.5px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSkill.trim()) return;
                      setDraft({
                        ...draft,
                        skills: [...draft.skills, newSkill.trim()],
                      });
                      setNewSkill("");
                    }}
                    className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] text-[#faf6ed]"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Projects & Certifications */}
              <div className="space-y-2.5 border-t border-[#ece5d5] pt-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                    Attested Projects ({draft.projects.length}) &amp; Certifications ({draft.certifications.length})
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        projects: [
                          ...draft.projects,
                          {
                            id: `proj-${Date.now()}`,
                            title: "New Proof Project",
                            detail: "Summarize architecture, tools, and verified impact.",
                          },
                        ],
                      })
                    }
                    className="cursor-pointer rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-2.5 py-0.5 text-[11px] text-[#212d3d]"
                  >
                    + Add Project
                  </button>
                </div>
                {draft.projects.map((p, pIdx) => (
                  <div key={p.id} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <input id={`resume-proj-title-${p.id}`} name={`resume-proj-title-${p.id}`}
                      aria-label={`Project ${pIdx + 1} title`}
                      value={p.title}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[pIdx] = { ...p, title: e.target.value };
                        setDraft({ ...draft, projects: next });
                      }}
                      className="rounded-[8px] border border-[#dad6ca] bg-[#faf6ed] px-2.5 py-1.5 text-[12px] font-medium"
                    />
                    <input id={`resume-proj-detail-${p.id}`} name={`resume-proj-detail-${p.id}`}
                      aria-label={`Project ${pIdx + 1} detail`}
                      value={p.detail}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[pIdx] = { ...p, detail: e.target.value };
                        setDraft({ ...draft, projects: next });
                      }}
                      className="sm:col-span-2 rounded-[8px] border border-[#dad6ca] bg-[#faf6ed] px-2.5 py-1.5 text-[12px]"
                    />
                  </div>
                ))}
                <input id="page-input-19" name="page-input-19"
                  aria-label="Certifications comma separated"
                  value={draft.certifications.join(", ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      certifications: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Certifications (comma separated)"
                  className="w-full rounded-[8px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px]"
                />
              </div>
            </section>
          </div>

          {/* RIGHT 5: JOB TAILORING, ATS DIAGNOSTIC & VERSION COMPARISON */}
          <aside className="space-y-5 lg:col-span-5">
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
              <Eyebrow label="ATS & Truthfulness Audit" />
              <h3 className="font-serif-display text-[21px] text-[#212d3d]">
                Readability &amp; Grounding
              </h3>
              <div className="space-y-2">
                {atsChecks.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between rounded-[12px] border border-[#e3dac5] bg-[#faf6ed] px-3 py-2 text-[12px]"
                  >
                    <span className="text-[#212d3d]">{c.label}</span>
                    <StatusPill
                      label={c.ok ? "Pass" : "Needs attention"}
                      tone={c.ok ? "success" : "warning"}
                      dot={false}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Job-Specific Keyword Match */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                  Tailor Against Job
                </h3>
              </div>
              <select id="page-select-20" name="page-select-20" aria-label="page select 20"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3.5 py-2 text-[12px] font-medium"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.title}
                  </option>
                ))}
              </select>
              {selectedJob && (
                <div className="space-y-2 text-[12px]">
                  <p className="text-[#212d3d]">
                    <strong>Matched on CV:</strong>{" "}
                    {selectedJob.matchingSkills.join(", ")}
                  </p>
                  <p className="text-[#b54708]">
                    <strong>Unverified / Gap Keywords:</strong>{" "}
                    {selectedJob.skillsToImprove.join(", ")} (only add if genuinely
                    completed)
                  </p>
                </div>
              )}
            </section>

            {/* Side-by-Side Version Comparison */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                  Side-by-Side Comparison
                </h3>
                <select id="page-select-21" name="page-select-21" aria-label="page select 21"
                  value={compareId}
                  onChange={(e) => setCompareId(e.target.value)}
                  className="cursor-pointer rounded-full border border-[#dad6ca] bg-[#faf6ed] px-3 py-1 text-[11px]"
                >
                  {resumes
                    .filter((r) => r.id !== draft.id)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        Compare vs {r.name}
                      </option>
                    ))}
                </select>
              </div>
              {compareDoc ? (
                <div className="rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-3.5 space-y-2 text-[12px]">
                  <p className="font-semibold text-[#212d3d]">{compareDoc.name}</p>
                  <p className="text-[#5a6675]">
                    <strong>Headline:</strong> {compareDoc.personalInfo.headline}
                  </p>
                  <p className="text-[#5a6675]">
                    <strong>Skills count:</strong> {compareDoc.skills.length} vs your{" "}
                    {draft.skills.length}
                  </p>
                  <p className="line-clamp-3 text-[#212d3d]">
                    {compareDoc.summary}
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-[#5a6675]">
                  Create another CV version to compare variations side by side.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
