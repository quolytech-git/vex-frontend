"use client";

import React from "react";
import type { ResumeDocument } from "@/data/dashboard";
import type { CvTemplate } from "@/data/cvTemplates";

/* ------------------------------------------------------------------ */
/*  Renders the user's own CV in a template's style on an A4 sheet.   */
/*  `scale` shrinks it for gallery thumbnails.                         */
/* ------------------------------------------------------------------ */

export default function CvTemplatePreview({
  template: t,
  resume: r,
  scale = 1,
}: {
  template: CvTemplate;
  resume: ResumeDocument;
  scale?: number;
}) {
  const W = 595; // A4 at 72 dpi
  const H = 842;
  const headCls =
    t.headingFont === "caps"
      ? "font-sans text-[10px] font-semibold tracking-[0.18em] uppercase"
      : t.headingFont === "sans"
      ? "font-sans text-[11.5px] font-semibold"
      : "font-serif-display text-[15px]";

  const blocks: Record<string, React.ReactNode> = {
    Summary: <p className="text-[10px] leading-[1.5] text-[#333]">{r.summary}</p>,
    Profile: <p className="text-[10px] leading-[1.5] text-[#333]">{r.summary}</p>,
    "Key results": (
      <ul className="space-y-1 text-[10px] leading-[1.45] text-[#333]">
        {r.experience.flatMap((e) => e.bullets).filter(Boolean).slice(0, 3).map((b, i) => <li key={i}>▪ {b}</li>)}
      </ul>
    ),
    Experience: (
      <div className="space-y-2.5">
        {r.experience.map((e) => (
          <div key={e.id}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[10.5px] font-semibold text-[#111]">{e.role} · {e.company}</p>
              <p className="shrink-0 text-[9px] text-[#666]">{e.period}</p>
            </div>
            <ul className="mt-0.5 space-y-0.5 text-[9.5px] leading-[1.45] text-[#333]">
              {e.bullets.filter(Boolean).slice(0, 3).map((b, i) => <li key={i}>• {b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    ),
    Skills: <p className="text-[10px] leading-[1.5] text-[#333]">{r.skills.join(" · ")}</p>,
    Education: (
      <div className="space-y-1">
        {r.education.map((e) => (
          <div key={e.id} className="flex items-baseline justify-between gap-2 text-[10px] text-[#333]">
            <span><strong className="text-[#111]">{e.degree}</strong> · {e.institution}</span>
            <span className="shrink-0 text-[9px] text-[#666]">{e.year}</span>
          </div>
        ))}
      </div>
    ),
    Projects: (
      <ul className="space-y-1 text-[10px] leading-[1.45] text-[#333]">
        {(r.projects.length ? r.projects : [{ id: "p", title: "Your project", detail: "What you built and the result." }]).map((p) => (
          <li key={p.id}><strong className="text-[#111]">{p.title}</strong> — {p.detail}</li>
        ))}
      </ul>
    ),
    Research: (
      <ul className="space-y-1 text-[10px] leading-[1.45] text-[#333]">
        {(r.certifications.length ? r.certifications : ["Research interests and publications go here"]).map((c, i) => <li key={i}>• {c}</li>)}
      </ul>
    ),
  };

  return (
    <div style={{ width: W * scale, height: H * scale }} className="relative overflow-hidden rounded-[6px] bg-white shadow-[0_8px_24px_rgba(33,45,61,0.12)] ring-1 ring-black/5">
      <div
        aria-hidden={scale < 1}
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}
        className="absolute top-0 left-0 px-10 py-9 font-sans"
      >
        <header className={t.align === "center" ? "text-center" : ""}>
          <p
            className={
              t.headingFont === "caps"
                ? "font-sans text-[22px] font-semibold tracking-[0.12em] uppercase"
                : t.headingFont === "sans"
                ? "font-sans text-[24px] font-bold tracking-tight"
                : "font-serif-display text-[30px] leading-none"
            }
            style={{ color: t.accent }}
          >
            {r.personalInfo.fullName || "Your Name"}
          </p>
          <p className="mt-1.5 text-[10px] text-[#555]">
            {[r.personalInfo.headline, r.personalInfo.email, r.personalInfo.location].filter(Boolean).join("  ·  ")}
          </p>
          <div className="mt-3 h-[2px]" style={{ background: t.accent, opacity: t.headingFont === "sans" ? 0.25 : 0.9 }} />
        </header>
        <div className="mt-4 space-y-4">
          {t.sections.map((s) => (
            <section key={s}>
              <h3 className={`${headCls} mb-1.5`} style={{ color: t.accent }}>{s}</h3>
              {blocks[s]}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
