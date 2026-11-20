"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { SkillTierBadge, StatusPill } from "@/components/dashboard/StatusBadge";

export default function SkillAssessmentsPage() {
  const { assessments, skills, recordAssessmentResult } = useVexWorkspace();
  const [activeId, setActiveId] = useState(assessments[0]?.id || "");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [gradeNote, setGradeNote] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "stepper">("stepper");
  const [stepIndex, setStepIndex] = useState(0);

  const active =
    assessments.find((a) => a.id === activeId) || assessments[0];
  const answeredCount = active
    ? active.questions.filter((q) => Boolean(answers[q.id])).length
    : 0;
  const visibleQuestions =
    active && viewMode === "stepper"
      ? [active.questions[Math.min(stepIndex, active.questions.length - 1)]].filter(Boolean)
      : active?.questions || [];

  function submitAssessment() {
    if (!active) return;
    let correct = 0;
    active.questions.forEach((q) => {
      if (answers[q.id] === q.correctId) correct += 1;
    });
    const pct = Math.round((correct / Math.max(1, active.questions.length)) * 100);
    const passed = pct >= 80;
    recordAssessmentResult(active.id, pct, passed);
    setGradeNote(
      passed
        ? `Passed (${pct}%)! "${active.skillName}" promoted to Demonstrated in Vex.`
        : `Scored ${pct}%. Review explanations below and retry anytime.`
    );
  }

  return (
    <DashboardSubpageFrame
      parentSection="learning"
      parentLabel="Learning Path"
      pageCode="08.2"
      pageTitle="Athena Skill Assessments"
      philosopherTag="Athena · Mastery Verification"
    >
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <Eyebrow label="Athena Verification Assessments" />
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] text-[#212d3d]">
                Prove Your Craft with{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Measured Assessments.
                </span>
              </h1>
              <p className="max-w-[62ch] text-[13px] text-[#5a6675]">
                Passing an assessment upgrades that skill on your Vex ledger
                from self-reported estimate to <strong>Demonstrated in Vex</strong>{" "}
                without falsely claiming third-party accreditation.
              </p>
            </div>
            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <img
                src="/images/athena-strategy-owl.jpg"
                alt="Athena verifying skills"
                className="h-28 w-28 rounded-full border-2 border-[#cfc2a5] object-cover object-top"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="space-y-3 lg:col-span-4">
            {assessments.map((a) => {
              const linkedSkill = skills.find((s) => s.id === a.skillId);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setActiveId(a.id);
                    setGradeNote("");
                    setStepIndex(0);
                  }}
                  className={`w-full cursor-pointer rounded-[18px] border p-4 text-left space-y-2 ${
                    a.id === active?.id
                      ? "border-[#212d3d] bg-white shadow-sm"
                      : "border-[#dad6ca] bg-[#faf6ed]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[#7a6b4e]">
                      {a.estimatedMins} mins · {a.difficulty}
                    </span>
                    <StatusPill
                      label={
                        a.passed
                          ? `Passed (${a.lastScorePct}%)`
                          : a.lastScorePct !== null
                          ? `Score ${a.lastScorePct}%`
                          : "Ready"
                      }
                      tone={a.passed ? "success" : "info"}
                      dot={false}
                    />
                  </div>
                  <p className="font-serif-display text-[19px] text-[#212d3d]">
                    {a.title}
                  </p>
                  {linkedSkill && <SkillTierBadge tier={linkedSkill.evidenceTier} />}
                </button>
              );
            })}
            <Link
              href="/dashboard/learning/catalog"
              className="block rounded-full border border-[#cfc2a5] bg-white py-2 text-center text-[12px] font-medium text-[#212d3d]"
            >
              &lt;- Back to Course Catalog
            </Link>
          </aside>

          <section className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-8">
            {active && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece5d5] pb-3">
                  <div>
                    <h2 className="font-serif-display text-[23px] text-[#212d3d]">
                      {active.title}
                    </h2>
                    <p className="text-[12.5px] text-[#5a6675]">
                      Passing threshold: 80% · Linked skill: {active.skillName} · Answered {answeredCount}/{active.questions.length}
                    </p>
                  </div>
                  <div className="inline-flex rounded-full border border-[#cfc2a5] bg-[#faf6ed] p-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setViewMode("stepper")}
                      className={`cursor-pointer rounded-full px-3 py-1 font-medium ${
                        viewMode === "stepper" ? "bg-[#212d3d] text-[#faf6ed]" : "text-[#5a6675]"
                      }`}
                    >
                      Step-by-Step
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("all")}
                      className={`cursor-pointer rounded-full px-3 py-1 font-medium ${
                        viewMode === "all" ? "bg-[#212d3d] text-[#faf6ed]" : "text-[#5a6675]"
                      }`}
                    >
                      Review All ({active.questions.length})
                    </button>
                  </div>
                </div>

                {viewMode === "stepper" && active.questions.length > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] px-4 py-2 text-[11.5px]">
                    <span className="font-mono text-[#7a6b4e]">
                      Question {stepIndex + 1} of {active.questions.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {active.questions.map((qItem, qIdx) => (
                        <button
                          key={qItem.id}
                          type="button"
                          onClick={() => setStepIndex(qIdx)}
                          className={`h-6 w-6 cursor-pointer rounded-full font-mono text-[10.5px] font-semibold ${
                            stepIndex === qIdx
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : answers[qItem.id]
                              ? "bg-[#067647]/15 text-[#067647]"
                              : "border border-[#cfc2a5] bg-white text-[#5a6675]"
                          }`}
                        >
                          {qIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {visibleQuestions.map((q) => {
                    const realIdx = active.questions.findIndex((item) => item.id === q.id);
                    const isCorrect = answers[q.id] === q.correctId;
                    return (
                    <div
                      key={q.id}
                      className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-2.5"
                    >
                      <p className="text-[13.5px] font-medium text-[#212d3d]">
                        {realIdx + 1}. {q.prompt}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.id]: opt.id,
                              }))
                            }
                            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border px-3.5 py-2 text-left text-[12.5px] ${
                              answers[q.id] === opt.id
                                ? "border-[#212d3d] bg-white font-medium"
                                : "border-[#dad6ca] bg-white/60"
                            }`}
                          >
                            <span className="h-3 w-3 shrink-0 rounded-full border border-[#212d3d] flex items-center justify-center">
                              {answers[q.id] === opt.id && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#212d3d]" />
                              )}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        ))}
                      </div>
                      {active.lastScorePct !== null && (
                        <div
                          className={`rounded-[10px] border px-3 py-2 text-[11.5px] ${
                            isCorrect
                              ? "border-[#067647]/35 bg-[#067647]/10 text-[#067647]"
                              : "border-[#b54708]/35 bg-[#b54708]/10 text-[#b54708]"
                          }`}
                        >
                          <strong>{isCorrect ? "Correct:" : "Review:"}</strong>{" "}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {viewMode === "stepper" && active.questions.length > 1 && (
                      <>
                        <button
                          type="button"
                          disabled={stepIndex === 0}
                          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                          className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium disabled:opacity-40"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={stepIndex >= active.questions.length - 1}
                          onClick={() =>
                            setStepIndex((i) =>
                              Math.min(active.questions.length - 1, i + 1)
                            )
                          }
                          className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium disabled:opacity-40"
                        >
                          Next Question
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={submitAssessment}
                      className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed]"
                    >
                      Submit Assessment
                    </button>
                  </div>
                  {gradeNote && (
                    <span className="text-[12.5px] font-medium text-[#067647]">
                      {gradeNote}
                    </span>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
