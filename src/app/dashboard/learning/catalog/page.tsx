"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";

export default function LearningCatalogPage() {
  const {
    catalogCourses,
    skills,
    toggleCourseEnrollment,
    updateCourseProgress,
  } = useVexWorkspace();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCourseId, setSelectedCourseId] = useState(
    catalogCourses[0]?.id || ""
  );

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogCourses.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.skillTag.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q)
      );
    });
  }, [catalogCourses, query, category]);

  const activeCourse =
    catalogCourses.find((c) => c.id === selectedCourseId) || filteredCourses[0];
  const mandatoryGaps = skills.filter((s) => s.isMandatoryGap);

  return (
    <DashboardSubpageFrame
      parentSection="learning"
      parentLabel="Learning Path"
      pageCode="08.1"
      pageTitle="Aristotle Learning Catalog"
      philosopherTag="Aristotle · Curriculum & Enrollment"
    >
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <Eyebrow label="Gap-Linked Course Catalog · Tracked Goals" />
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] text-[#212d3d]">
                Aristotle&apos;s{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Curriculum &amp; Mastery Catalog.
                </span>
              </h1>
              <p className="max-w-[62ch] text-[13px] text-[#5a6675]">
                Every module aligns to real missing requirements from your active
                jobs:{" "}
                <strong className="font-medium text-[#212d3d]">
                  {mandatoryGaps.map((g) => g.name).join(" · ") || "Core readiness"}
                </strong>
                . Enroll, track weekly milestones, and validate with an Athena
                skill check.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <input id="page-input-1" name="page-input-1" aria-label="page input 1"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses by topic or skill..."
                  className="w-full max-w-[300px] rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12.5px]"
                />
                {["All", "SQL & Data", "Frontend & APIs", "Product Ops"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium ${
                        category === cat
                          ? "bg-[#212d3d] text-[#faf6ed]"
                          : "border border-[#cfc2a5] bg-white text-[#212d3d]"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
                <Link
                  href="/dashboard/learning/assessments"
                  className="rounded-full border border-[#212d3d] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
                >
                  Open Athena Assessments -&gt;
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3">
                <img
                  src="/images/aristotle-alexander-academy.jpg"
                  alt="Aristotle teaching"
                  className="h-20 w-18 rounded-[12px] object-cover object-top"
                />
                <p className="text-[12px] text-[#212d3d]">
                  “Choose the single course that closes your highest-leverage
                  employer gap first.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-6">
            {filteredCourses.length === 0 && (
              <div className="rounded-[20px] border border-[#dad6ca] bg-[#faf6ed] p-6 text-center space-y-2.5">
                <p className="font-serif-display text-[20px] text-[#212d3d]">
                  No courses match your current search.
                </p>
                <p className="text-[12.5px] text-[#5a6675]">
                  Clear the search query or switch category to browse Aristotle&apos;s full curriculum.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                >
                  Reset Catalog Filters
                </button>
              </div>
            )}
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`cursor-pointer rounded-[20px] border p-5 transition-all ${
                  activeCourse?.id === c.id
                    ? "border-[#212d3d] bg-white shadow-sm"
                    : "border-[#dad6ca] bg-[#faf6ed]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StatusPill label={c.category} tone="neutral" dot={false} />
                  <StatusPill
                    label={c.enrolled ? `${c.progressPct}% complete` : "Open"}
                    tone={c.enrolled ? "success" : "info"}
                    dot={false}
                  />
                </div>
                <h2 className="mt-2 font-serif-display text-[21px] text-[#212d3d]">
                  {c.title}
                </h2>
                <p className="mt-1 text-[12.5px] text-[#5a6675]">
                  {c.provider} · {c.duration} · Linked to {c.gapMatchedJobs} saved
                  jobs
                </p>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-6">
            {activeCourse && (
              <div className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece5d5] pb-3">
                  <div>
                    <Eyebrow label={`Course Detail · ${activeCourse.skillTag}`} />
                    <h2 className="mt-1 font-serif-display text-[25px] text-[#212d3d]">
                      {activeCourse.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCourseEnrollment(activeCourse.id)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium ${
                      activeCourse.enrolled
                        ? "border border-[#067647] bg-[#067647] text-white"
                        : "bg-[#212d3d] text-[#faf6ed]"
                    }`}
                  >
                    {activeCourse.enrolled ? "Enrolled" : "Enroll Now"}
                  </button>
                </div>

                <p className="text-[13px] leading-relaxed text-[#212d3d]">
                  {activeCourse.summary}
                </p>

                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Syllabus Modules ({activeCourse.modules.length})
                  </p>
                  {activeCourse.modules.map((m, idx) => (
                    <div
                      key={m}
                      className="rounded-[12px] border border-[#e3dac5] bg-[#faf6ed] px-3.5 py-2 text-[12.5px] text-[#212d3d]"
                    >
                      0{idx + 1}. {m}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ece5d5] pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateCourseProgress(
                        activeCourse.id,
                        Math.min(100, activeCourse.progressPct + 25)
                      )
                    }
                    className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] text-[#faf6ed]"
                  >
                    Log +25% Module Progress
                  </button>
                  <a
                    href={activeCourse.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
                  >
                    Open External Resource -&gt;
                  </a>
                </div>
                <p className="font-mono text-[11px] text-[#7a6b4e]">
                  Note: {activeCourse.certificateNote}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
