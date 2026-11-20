"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";

export default function ResumeExportPreviewPage() {
  const params = useParams<{ resumeId: string }>();
  const { resumes } = useVexWorkspace();
  const doc = resumes.find((r) => r.id === params?.resumeId) || resumes[0];
  const [template, setTemplate] = useState<"editorial" | "classic" | "executive">(
    doc?.template || "editorial"
  );
  const [exportStatus, setExportStatus] = useState("");

  function downloadFile(format: "doc" | "txt") {
    const plainText = [
      doc.personalInfo.fullName,
      `${doc.personalInfo.headline} | ${doc.personalInfo.email} | ${doc.personalInfo.location}`,
      "",
      "SUMMARY",
      doc.summary,
      "",
      "EXPERIENCE",
      ...doc.experience.flatMap((e) => [
        `${e.role} — ${e.company} (${e.period})`,
        ...e.bullets.map((b) => `• ${b}`),
        "",
      ]),
      "EDUCATION",
      ...doc.education.map((ed) => `${ed.degree}, ${ed.institution} (${ed.year})`),
      "",
      "SKILLS",
      doc.skills.join(" · "),
    ].join("\n");

    const blob = new Blob([plainText], {
      type: format === "doc" ? "application/msword" : "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus(`Downloaded ${a.download} cleanly from browser.`);
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
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
            >
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={() => downloadFile("doc")}
              className="cursor-pointer rounded-full border border-[#212d3d] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
            >
              Export Word (.doc)
            </button>
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
