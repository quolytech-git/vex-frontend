"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import { downloadWord, printPdf, safeFileName, type ExportDoc } from "@/lib/exportDoc";
import { CHOSEN_TEMPLATE_KEY, CV_TEMPLATES } from "@/data/cvTemplates";

export default function ResumeExportPreviewPage() {
  const params = useParams<{ resumeId: string }>();
  const { resumes } = useVexWorkspace();
  const doc = resumes.find((r) => r.id === params?.resumeId) || resumes[0];
  const [template, setTemplate] = useState<"editorial" | "classic" | "executive">(
    doc?.template || "editorial"
  );
  const [exportStatus, setExportStatus] = useState("");

  // The template picked in the gallery (if it matches this layout) sets colour & headings.
  const [chosenId, setChosenId] = useState("");
  useEffect(() => {
    try {
      setChosenId(localStorage.getItem(CHOSEN_TEMPLATE_KEY) || "");
    } catch {
      /* ignore */
    }
  }, []);
  const styleTpl =
    CV_TEMPLATES.find((t) => t.id === chosenId && t.base === template) ||
    CV_TEMPLATES.find((t) => t.base === template)!;

  function buildDoc(): ExportDoc {
    const sec: Record<string, ExportDoc["sections"][number]> = {
      Summary: { heading: "Summary", lines: [doc.summary] },
      Profile: { heading: "Profile", lines: [doc.summary] },
      "Key results": { heading: "Key results", lines: doc.experience.flatMap((e) => e.bullets).slice(0, 3), bullets: true },
      Experience: {
        heading: "Experience",
        lines: doc.experience.flatMap((e) => [`${e.role} — ${e.company} (${e.period})`, ...e.bullets.filter(Boolean).map((b) => `• ${b}`)]),
      },
      Skills: { heading: "Skills", lines: [doc.skills.join(" · ")] },
      Education: { heading: "Education", lines: doc.education.map((ed) => `${ed.degree}, ${ed.institution} (${ed.year})`) },
      Projects: { heading: "Projects", lines: doc.projects.map((p) => `${p.title} — ${p.detail}`), bullets: true },
      Research: { heading: "Research", lines: doc.certifications, bullets: true },
    };
    return {
      fileName: safeFileName(doc.personalInfo.fullName || doc.name, "CV"),
      title: doc.personalInfo.fullName || doc.name,
      subtitle: [doc.personalInfo.headline, doc.personalInfo.email, doc.personalInfo.location].filter(Boolean).join(" · "),
      accent: styleTpl.accent,
      headingStyle: styleTpl.headingFont,
      center: styleTpl.align === "center",
      sections: styleTpl.sections.map((k) => sec[k]).filter(Boolean),
    };
  }

  function downloadFile() {
    const d = buildDoc();
    downloadWord(d);
    setExportStatus(`Downloaded ${d.fileName}.doc in the ${styleTpl.name} style.`);
  }

  function savePdf() {
    const d = buildDoc();
    setExportStatus(
      printPdf(d)
        ? `Print view opened — choose “Save as PDF” to save ${d.fileName}.pdf.`
        : "Your browser blocked the print window. Allow pop-ups for Vex and try again."
    );
  }

  return (
    <DashboardSubpageFrame
      parentSection="documents"
      parentLabel="Documents Scriptorium"
      pageCode="04.2"
      pageTitle={`Export Preview · ${doc.name}`}
      philosopherTag="Leonardo · Export Sheet"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#cfc4a7] bg-[#faf6ed] p-5">
          <div>
            <Eyebrow label="1-Column Single-Pass ATS Export Preview" />
            <h1 className="mt-0.5 font-serif-display text-[28px] text-[#212d3d]">
              {doc.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["editorial", "classic", "executive"] as const).map((tpl) => (
              <button
                key={tpl}
                type="button"
                onClick={() => setTemplate(tpl)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium capitalize ${
                  template === tpl
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "border border-[#cfc2a5] bg-white text-[#212d3d]"
                }`}
              >
                {tpl}
              </button>
            ))}

            <button
              type="button"
              onClick={savePdf}
              className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
            >
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={downloadFile}
              className="cursor-pointer rounded-full border border-[#212d3d] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
            >
              Export Word (.doc)
            </button>
            <Link
              href="/dashboard/documents/templates"
              className="rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
            >
              Templates · {styleTpl.name}
            </Link>
            <Link
              href={`/dashboard/documents/resume/${doc.id}`}
              className="rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
            >
              Back to Editor
            </Link>
          </div>
        </div>

        {exportStatus && (
          <StatusPill label={exportStatus} tone="success" />
        )}

        {/* CRISP A4 MANUSCRIPT SHEET */}
        <article
          className={`mx-auto max-w-[820px] rounded-[12px] border border-[#d6cbb2] bg-white p-10 shadow-md ${
            template === "classic"
              ? "font-serif-editorial"
              : template === "executive"
              ? "border-t-4 border-t-[#212d3d]"
              : ""
          }`}
        >
          <header className="border-b border-[#dad6ca] pb-4">
            <h2 className="font-serif-display text-[32px] leading-tight text-[#212d3d]">
              {doc.personalInfo.fullName}
            </h2>
            <p className="mt-1 text-[13.5px] font-medium text-[#212d3d]">
              {doc.personalInfo.headline}
            </p>
            <p className="mt-1 font-mono text-[11.5px] text-[#5a6675]">
              {doc.personalInfo.email} · {doc.personalInfo.location}
            </p>
          </header>

          <section className="mt-5 space-y-2">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
              Summary
            </h3>
            <p className="text-[13.5px] leading-relaxed text-[#212d3d]">
              {doc.summary}
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
              Experience
            </h3>
            {doc.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[14.5px] font-semibold text-[#212d3d]">
                    {exp.role} · {exp.company}
                  </p>
                  <span className="font-mono text-[11.5px] text-[#5a6675]">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc pl-5 text-[13px] leading-relaxed text-[#212d3d]">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mt-6 space-y-2">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
              Education
            </h3>
            {doc.education.map((ed) => (
              <div
                key={ed.id}
                className="flex flex-wrap justify-between text-[13px] text-[#212d3d]"
              >
                <span>
                  <strong>{ed.degree}</strong> — {ed.institution}
                </span>
                <span className="font-mono text-[11.5px] text-[#5a6675]">
                  {ed.year}
                </span>
              </div>
            ))}
          </section>

          <section className="mt-6 space-y-2">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
              Verified Skills
            </h3>
            <p className="text-[13px] text-[#212d3d]">
              {doc.skills.join(" · ")}
            </p>
          </section>
        </article>
      </div>
    </DashboardSubpageFrame>
  );
}
