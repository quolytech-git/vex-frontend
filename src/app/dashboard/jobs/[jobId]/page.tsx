"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_COMPANY_INTEL } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { FitBandBadge, StatusPill } from "@/components/dashboard/StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

export default function JobDetailsPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const jobId = typeof params?.jobId === "string" ? params.jobId : "";

  const {
    jobs,
    savedJobIds,
    hiddenJobIds,
    toggleSaveJob,
    hideJob,
    unhideJob,
    markJobViewed,
    prepareApplication,
  } = useVexWorkspace();

  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const [prepChecks, setPrepChecks] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vex_job_prep_${job?.id}`);
      if (saved) setPrepChecks(JSON.parse(saved));
      else setPrepChecks({});
    } catch {
      // ignore storage errors
    }
  }, [job?.id]);

  function togglePrepCheck(key: string) {
    setPrepChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`vex_job_prep_${job?.id}`, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }

  const relatedJobs = jobs.filter((j) => j.id !== job?.id).slice(0, 2);

  useEffect(() => {
    if (job?.id) {
      markJobViewed(job.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id]);

  if (!job) {
    return (
      <DashboardSubpageFrame
        parentSection="jobs"
        parentLabel="Jobs Discovery"
        pageCode="02.1"
        pageTitle="Opportunity Not Found"
        philosopherTag="Athena · Strategic Advisor"
      >
        <div className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-8 text-center space-y-3">
          <h1 className="font-serif-display text-[26px] text-[#212d3d]">
            Opportunity not found
          </h1>
          <Link
            href="/dashboard?section=jobs"
            className="inline-block rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed]"
          >
            Return to Jobs Agora
          </Link>
        </div>
      </DashboardSubpageFrame>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const isSkipped = hiddenJobIds.includes(job.id);
  const companyIntel = INITIAL_COMPANY_INTEL.find((c) =>
    c.name.toLowerCase().includes(job.company.toLowerCase().split(" ")[0])
  );

  const mandatoryCount = job.requirements.filter((r) => r.mandatory).length;
  const mandatoryMet = job.requirements.filter(
    (r) => r.mandatory && (r.status === "has" || r.status === "transferable")
  ).length;
  const shouldApplyVerdict =
    job.compatibilityScore >= 82
      ? {
          badge: "Athena Verdict: Apply Now (High Strategic Fit)",
          tone: "success" as const,
          guidance: `You satisfy ${mandatoryMet} of ${mandatoryCount} mandatory requirements with direct baseline proof. Tailor your summary diff around "${job.skillsToImprove[0] || job.matchingSkills[0]}" and review before submitting.`,
        }
      : {
          badge: "Athena Verdict: Strengthen Gap Before Applying",
          tone: "warning" as const,
          guidance: `Complete the missing requirement checks (${job.skillsToImprove.join(", ")}) inside Aristotle Learning Path first, or add stronger portfolio evidence before preparing your final pack.`,
        };

  return (
    <DashboardSubpageFrame
      parentSection="jobs"
      parentLabel="Jobs Discovery"
      pageCode="02.1"
      pageTitle={`${job.company} · ${job.title}`}
      philosopherTag="Athena · Strategic Evaluation"
    >
      <div className="space-y-6 pb-20 lg:pb-0">
        {/* Mobile Compact Athena Mentor Strip */}
        <MobilePhilosopherPill
          name="Athena"
          role="Strategic Judgment"
          image="/images/athena-strategy-owl.jpg"
          quote={shouldApplyVerdict.badge}
          guidance={shouldApplyVerdict.guidance}
        />

        {/* HERO SUMMARY + ATHENA STRATEGIC ADVISOR */}
        <section className="rounded-[26px] border border-[#cfc4a7] bg-[#faf6ed] p-6 sm:p-7">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label={`${job.company} · ${job.source} · ${job.checkedLabel}`} />
                <FitBandBadge band={job.fitBand} />
                {job.alsoFoundOn.length > 0 && (
                  <StatusPill
                    label={`Merged from ${job.alsoFoundOn.length + 1} boards`}
                    tone="neutral"
                    dot={false}
                  />
                )}
                {job.isStale && (
                  <StatusPill label="Older than 7 days" tone="warning" dot={false} />
                )}
              </div>

              <div>
                <h1 className="font-serif-display text-[clamp(2rem,3.3vw,2.9rem)] leading-[1.05] text-[#212d3d]">
                  {job.title}
                </h1>
                <p className="mt-1.5 text-[14px] text-[#5a6675]">
                  {job.company} · {job.location} · {job.arrangement} ·{" "}
                  {job.employmentType} · {job.experienceLevel} level ·{" "}
                  <strong className="font-medium text-[#212d3d]">
                    {job.salary || "Salary not disclosed by employer"}
                  </strong>
                </p>
              </div>

              <div className="rounded-[18px] border border-[#dfd4be] bg-white p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StatusPill
                    label={shouldApplyVerdict.badge}
                    tone={shouldApplyVerdict.tone}
                  />
                  <span className="font-serif-display text-[28px] leading-none text-[#212d3d]">
                    {job.compatibilityScore}% Match
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-[#212d3d]">
                  {shouldApplyVerdict.guidance}
                </p>
              </div>

              {/* Primary Job Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const app = prepareApplication(job);
                    router.push(`/dashboard/applications/${app.id}`);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#212d3d] px-5 py-2.5 text-[13px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  <span>Prepare Tailored Application</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleSaveJob(job.id)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                    isSaved
                      ? "border-[#067647] bg-[#067647] text-white"
                      : "border-[#cfc2a5] bg-white text-[#212d3d] hover:border-[#212d3d]"
                  }`}
                >
                  {isSaved ? "Saved (Amor Fati)" : "Save Job"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isSkipped) unhideJob(job.id);
                    else hideJob(job.id);
                  }}
                  className="cursor-pointer rounded-full border border-[#dfd4be] bg-white px-4 py-2 text-[12.5px] font-medium text-[#5a6675] hover:border-[#b42318] hover:text-[#b42318]"
                >
                  {isSkipped ? "Restore Skipped Role" : "Skip (Ataraxia)"}
                </button>

                <Link
                  href="/dashboard/documents/cover-letters"
                  className="rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  Draft Cover Letter (Cicero)
                </Link>

                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#cfc2a5] bg-white px-4 py-2 font-mono text-[11.5px] text-[#212d3d] hover:border-[#212d3d]"
                >
                  Original Source -&gt;
                </a>
              </div>
            </div>

            {/* Right: Athena Arched Strategic Advisor Portrait (Desktop Only) */}
            <div className="hidden flex-col items-center lg:col-span-4 lg:flex">
              <div className="w-full max-w-[300px] overflow-hidden rounded-t-[150px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-md">
                <div className="aspect-[3/3.4] w-full overflow-hidden">
                  <img
                    src="/images/athena-strategy-owl.jpg"
                    alt="Athena strategic evaluator with calipers and owl"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-3">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.13em] text-[#7a6b4e]">
                    Athena · Strategic Wisdom
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#212d3d]">
                    “{job.philosopherMaxim}”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BREAKDOWN: REQUIREMENTS & SKILLS VS COMPANY & RISKS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
            <div className="border-b border-[#ece5d5] pb-3">
              <Eyebrow label="Explainable Match Breakdown" />
              <h2 className="mt-1 font-serif-display text-[24px] text-[#212d3d]">
                Required vs Preferred Qualifications
              </h2>
              <p className="text-[12.5px] text-[#5a6675]">
                Every criterion quotes the employer&apos;s exact specification and maps
                to your attested evidence.
              </p>
            </div>

            <div className="space-y-3">
              {job.requirements.map((req) => (
                <div
                  key={req.text}
                  className="rounded-[16px] border border-[#dfd4be] bg-[#faf6ed] p-4 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#7a6b4e]">
                        {req.mandatory ? "Mandatory" : "Preferred"}
                      </span>
                      <p className="text-[14px] font-medium text-[#212d3d]">
                        {req.text}
                      </p>
                    </div>
                    <StatusPill
                      label={
                        req.status === "has"
                          ? "Matched on Profile"
                          : req.status === "transferable"
                          ? "Transferable"
                          : req.status === "improve"
                          ? "Needs Upgrade"
                          : "Missing Gap"
                      }
                      tone={
                        req.status === "has"
                          ? "success"
                          : req.status === "transferable"
                          ? "info"
                          : "warning"
                      }
                    />
                  </div>
                  <p className="text-[12px] italic text-[#5a6675]">
                    Listing quote: {req.sourceSentence}
                  </p>
                  <p className="flex items-center gap-1.5 text-[12px] text-[#212d3d]">
                    <CheckIcon className="h-3.5 w-3.5 text-[#067647]" />
                    <span>{req.profileEvidence}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-5">
            {/* Matched vs Missing Skills */}
            <div className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-4">
              <h3 className="font-serif-display text-[21px] text-[#212d3d]">
                Skills Provenance
              </h3>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#067647]">
                  Matched Skills ({job.matchingSkills.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((sk) => (
                    <StatusPill key={sk} label={sk} tone="success" dot={false} />
                  ))}
                </div>
              </div>
              <div className="border-t border-[#ece5d5] pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#b54708]">
                  Missing / Upgrade Targets ({job.skillsToImprove.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.skillsToImprove.map((sk) => (
                    <StatusPill key={sk} label={sk} tone="warning" dot={false} />
                  ))}
                </div>
                <Link
                  href="/dashboard/learning/catalog"
                  className="mt-3 inline-block text-[12px] font-medium text-[#175cd3] underline"
                >
                  Open courses &amp; assessments to close these gaps -&gt;
                </Link>
              </div>
            </div>

            {/* Company Profile & Deadline & Risks */}
            <div className="rounded-[24px] border border-[#dad6ca] bg-[#f4efe3] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-[21px] text-[#212d3d]">
                  {job.company} Brief
                </h3>
                {companyIntel && (
                  <Link
                    href={`/dashboard/companies/${companyIntel.id}`}
                    className="rounded-full border border-[#212d3d]/25 bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    Company Intel -&gt;
                  </Link>
                )}
              </div>

              {companyIntel ? (
                <div className="space-y-1.5 text-[12.5px] text-[#212d3d]">
                  <p className="text-[#5a6675]">
                    {companyIntel.sector} · {companyIntel.size} ·{" "}
                    {companyIntel.headquarters}
                  </p>
                  <p>
                    <strong>Hiring velocity:</strong>{" "}
                    {companyIntel.hiringVelocity}
                  </p>
                  <p>
                    <strong>Culture signals:</strong>{" "}
                    {companyIntel.cultureSignals}
                  </p>
                </div>
              ) : (
                <p className="text-[12.5px] text-[#5a6675]">
                  Industry: {job.industry} · ATS portal:{" "}
                  {job.atsSupported.toUpperCase()}
                </p>
              )}

              <div className="border-t border-[#dfd4be] pt-2.5 text-[12px] text-[#5a6675] space-y-1">
                <p>
                  <strong className="text-[#212d3d]">Deadline:</strong>{" "}
                  {job.deadline || "No explicit closing date listed"}
                </p>
                <p>
                  <strong className="text-[#212d3d]">Red flags check:</strong>{" "}
                  {job.redFlags.length > 0
                    ? job.redFlags.join(", ")
                    : "Zero suspicious flags detected"}
                </p>
                <p>
                  <strong className="text-[#212d3d]">Also seen on:</strong>{" "}
                  {job.alsoFoundOn.join(" · ") || job.source}
                </p>
              </div>
            </div>

            {/* Application Preparation Checklist */}
            <div className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
              <Eyebrow label="Athena Readiness Gate" />
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Application Preparation Checklist
              </h3>
              <div className="space-y-2 text-[12.5px]">
                {[
                  {
                    key: "verify-skills",
                    label: `Confirm evidence for mandatory skills (${job.matchingSkills.slice(0, 2).join(", ")})`,
                  },
                  {
                    key: "tailor-cv",
                    label: "Tailor CV bullets in Leonardo Scriptorium (truth-checked)",
                  },
                  {
                    key: "cicero-letter",
                    label: `Draft rhetorical cover letter for ${job.company}`,
                  },
                  {
                    key: "review-deadline",
                    label: `Verify compensation (${job.salary || "Undisclosed"}) & portal target`,
                  },
                ].map((item) => {
                  const checked = Boolean(prepChecks[item.key]);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => togglePrepCheck(item.key)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-[12px] border px-3 py-2 text-left ${
                        checked
                          ? "border-[#067647]/40 bg-[#067647]/10 text-[#212d3d]"
                          : "border-[#e3dac5] bg-[#faf6ed] text-[#5a6675]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <StatusPill
                        label={checked ? "Ready" : "Pending"}
                        tone={checked ? "success" : "neutral"}
                        dot={false}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Opportunities */}
        {relatedJobs.length > 0 && (
          <section className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Eyebrow label="Alternative Verified Matches" />
                <h2 className="mt-0.5 font-serif-display text-[22px] text-[#212d3d]">
                  Related Opportunities to Compare
                </h2>
              </div>
              <Link
                href="/dashboard?section=jobs"
                className="text-[12px] font-medium text-[#175cd3] underline"
              >
                Back to full board -&gt;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedJobs.map((rj) => (
                <div
                  key={rj.id}
                  className="flex items-center justify-between gap-3 rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4"
                >
                  <div>
                    <p className="text-[14.5px] font-medium text-[#212d3d]">
                      {rj.title}
                    </p>
                    <p className="text-[12px] text-[#5a6675]">
                      {rj.company} · {rj.arrangement} · {rj.compatibilityScore}% Match
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/jobs/${rj.id}`}
                    className="shrink-0 rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    Inspect -&gt;
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Primary Apply Action Above Tab Bar */}
      <div className="ios-tabbar-glass fixed inset-x-0 bottom-[calc(58px+env(safe-area-inset-bottom))] z-30 border-t border-[#d8cbb0] px-4 py-2.5 lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toggleSaveJob(job.id)}
            className={`min-h-[42px] shrink-0 cursor-pointer rounded-full border px-4 text-[12px] font-medium ${
              isSaved
                ? "border-[#067647] bg-[#067647] text-white"
                : "border-[#cfc2a5] bg-white text-[#212d3d]"
            }`}
          >
            {isSaved ? "Saved ✓" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              const app = prepareApplication(job);
              router.push(`/dashboard/applications/${app.id}`);
            }}
            className="min-h-[42px] flex-1 cursor-pointer rounded-full bg-[#212d3d] px-4 text-[12.5px] font-medium text-[#faf6ed]"
          >
            Prepare Application -&gt;
          </button>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
