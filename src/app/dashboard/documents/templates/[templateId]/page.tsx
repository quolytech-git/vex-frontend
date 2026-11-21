"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import CvTemplatePreview from "@/components/dashboard/CvTemplatePreview";
import { EmptyState, KitButton, KitCard, Pill } from "@/components/dashboard/kit/Kit";
import { useVexWorkspace } from "@/lib/vex-store";
import { CHOSEN_TEMPLATE_KEY, CV_TEMPLATES } from "@/data/cvTemplates";

export default function CvTemplateDetailPage() {
  const params = useParams<{ templateId: string }>();
  const router = useRouter();
  const { resumes, saveResume } = useVexWorkspace();
  const idx = CV_TEMPLATES.findIndex((t) => t.id === params?.templateId);
  const t = CV_TEMPLATES[idx];
  const [resumeId, setResumeId] = useState(resumes[0]?.id || "");
  const resume = resumes.find((r) => r.id === resumeId) || resumes[0];
  const [applied, setApplied] = useState(false);

  // Fit the A4 preview to the available width (phone and PC).
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, (el.clientWidth - 16) / 595)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [t]);

  if (!t || !resume) {
    return (
      <DashboardSubpageFrame parentSection="documents" parentLabel="Resume" pageCode="03.4" pageTitle="Template not found" philosopherTag="Leonardo · Proportion">
        <EmptyState
          title="Template not found"
          text="It may have been renamed. Browse all templates instead."
          action={<Link href="/dashboard/documents/templates" className="rounded-full bg-[#212d3d] px-4 py-2 text-[13px] font-semibold text-[#faf6ed]">All templates</Link>}
        />
      </DashboardSubpageFrame>
    );
  }

  const prev = CV_TEMPLATES[(idx - 1 + CV_TEMPLATES.length) % CV_TEMPLATES.length];
  const next = CV_TEMPLATES[(idx + 1) % CV_TEMPLATES.length];

  function applyTemplate() {
    saveResume({ ...resume, template: t.base, updatedAt: `Template: ${t.name}` });
    try {
      localStorage.setItem(CHOSEN_TEMPLATE_KEY, t.id);
    } catch {
      /* ignore */
    }
    setApplied(true);
  }

  return (
    <DashboardSubpageFrame parentSection="documents" parentLabel="Resume" pageCode="03.4" pageTitle={t.name} philosopherTag="Leonardo · Proportion">
      <div className="mx-auto max-w-[1180px]">
        <Link href="/dashboard/documents/templates" className="mb-4 inline-flex text-[13px] font-semibold text-[#5a6675] hover:text-[#212d3d]">
          ‹ All templates
        </Link>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Preview */}
          <div ref={box} className="flex justify-center rounded-[24px] bg-[#f2eee2] p-2 sm:p-5 lg:col-span-7">
            <CvTemplatePreview template={t} resume={resume} scale={scale} />
          </div>

          {/* Details */}
          <div className="space-y-4 lg:col-span-5">
            <section className="vex-kit rounded-[22px] border border-[#e3dccb] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap gap-1.5">
                <Pill tone="navy">{t.category}</Pill>
                <Pill>{t.pages}</Pill>
                <Pill tone="good">ATS-readable</Pill>
              </div>
              <h1 className="mt-3 font-serif-display text-[32px] leading-tight text-[#212d3d]">{t.name}</h1>
              <p className="mt-1 text-[14px] leading-snug text-[#5a6675]">{t.tagline}</p>

              <label className="mt-4 block text-[12.5px] font-medium text-[#5a6675]">
                Preview with
                <select
                  value={resume.id}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="mt-1 w-full cursor-pointer rounded-[14px] border border-[#d6cbb2] bg-white px-3.5 py-2.5 text-[14px] text-[#212d3d]"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </label>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <KitButton className="flex-1" onClick={applyTemplate} disabled={applied}>
                  {applied ? "Applied ✓" : "Use this template"}
                </KitButton>
                <KitButton className="flex-1" variant="light" onClick={() => router.push(`/dashboard/documents/resume/${resume.id}`)}>
                  Open in editor
                </KitButton>
              </div>
              {applied && (
                <p role="status" className="mt-2 text-[12.5px] text-[#067647]">
                  “{resume.name}” now uses {t.name}. Your text didn't change.
                </p>
              )}
            </section>

            <KitCard eyebrow="Good for" title="Who it suits">
              <ul className="space-y-1.5 text-[13.5px] text-[#212d3d]">
                {t.bestFor.map((b) => <li key={b}>✓ {b}</li>)}
              </ul>
            </KitCard>

            <KitCard tone="cream" eyebrow="Section order" title="How it reads">
              <ol className="flex flex-wrap gap-1.5">
                {t.sections.map((s, i) => (
                  <li key={s} className="rounded-full bg-white px-3 py-1 text-[12.5px] text-[#212d3d]">{i + 1}. {s}</li>
                ))}
              </ol>
              <ul className="mt-3 space-y-1 text-[12.5px] leading-snug text-[#5a6675]">
                {t.tips.map((tip) => <li key={tip}>• {tip}</li>)}
              </ul>
            </KitCard>

            <div className="flex justify-between gap-2">
              <Link href={`/dashboard/documents/templates/${prev.id}`} className="min-w-0 truncate rounded-full border border-[#d6cbb2] bg-white px-4 py-2 text-[13px] font-semibold text-[#212d3d]">‹ {prev.name}</Link>
              <Link href={`/dashboard/documents/templates/${next.id}`} className="min-w-0 truncate rounded-full border border-[#d6cbb2] bg-white px-4 py-2 text-[13px] font-semibold text-[#212d3d]">{next.name} ›</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
