"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_COMPANY_INTEL } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { FitBandBadge, StatusPill, SubmissionStateBadge } from "@/components/dashboard/StatusBadge";

export default function CompanyDetailPage() {
  const params = useParams<{ companyId: string }>();
  const { jobs, applications, contacts } = useVexWorkspace();

  const company =
    INITIAL_COMPANY_INTEL.find((c) => c.id === params?.companyId) ||
    INITIAL_COMPANY_INTEL[0];

  const [prepNote, setPrepNote] = useState("");
  const [noteSaved, setNoteSaved] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vex_company_note_${company.id}`);
      if (saved) setPrepNote(saved);
    } catch {
      // ignore storage errors
    }
  }, [company.id]);

  function savePrepNote() {
    try {
      localStorage.setItem(`vex_company_note_${company.id}`, prepNote);
      setNoteSaved("Research notes saved locally.");
      setTimeout(() => setNoteSaved(""), 2500);
    } catch {
      // ignore storage errors
    }
  }

  const matchingJobs = jobs.filter((j) =>
    j.company.toLowerCase().includes(company.name.toLowerCase().split(" ")[0])
  );
  const matchingApps = applications.filter((a) =>
    a.company.toLowerCase().includes(company.name.toLowerCase().split(" ")[0])
  );
  const matchingContacts = contacts.filter((c) =>
    c.company.toLowerCase().includes(company.name.toLowerCase().split(" ")[0])
  );

  return (
    <DashboardSubpageFrame
      parentSection="network"
      parentLabel="Network & Companies"
      pageCode="06.2"
      pageTitle={`Athena Company Brief · ${company.name}`}
      philosopherTag="Athena · Company Intelligence"
    >
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label={`${company.sector} · ${company.headquarters}`} />
                <StatusPill
                  label={`${matchingJobs.length} Open Matched Roles`}
                  tone="success"
                  dot={false}
                />
                <StatusPill label={company.salaryRange} tone="navy" dot={false} />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.7rem)] text-[#212d3d]">
                {company.name}
              </h1>
              <p className="text-[13.5px] text-[#5a6675]">
                Size: {company.size} · Hiring Velocity:{" "}
                <strong className="font-medium text-[#212d3d]">
                  {company.hiringVelocity}
                </strong>
              </p>
              <div className="rounded-[16px] border border-[#dfd4be] bg-white p-4 text-[13px] text-[#212d3d]">
                <strong>Athena Strategic Guidance:</strong>{" "}
                {company.cultureSignals} Lead your cover memo and interviews with
                documented checklists, quantitative metrics, and fault-tolerant
                execution notes.
              </div>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3.5 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3">
                <img
                  src="/images/athena-strategy-owl.jpg"
                  alt="Athena research guide"
                  className="h-24 w-20 rounded-[12px] object-cover object-top"
                />
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] font-semibold uppercase text-[#7a6b4e]">
                    Athena Research
                  </p>
                  <p className="text-[11.5px] text-[#212d3d]">
                    “Understand how a firm decides before stepping into its forum.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Open Roles & Active Applications */}
          <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              Matched Opportunities ({matchingJobs.length})
            </h2>
            <div className="space-y-3">
              {matchingJobs.map((j) => (
                <div
                  key={j.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14.5px] font-medium text-[#212d3d]">
                        {j.title}
                      </p>
                      <FitBandBadge band={j.fitBand} />
                    </div>
                    <p className="text-[12px] text-[#5a6675]">
                      {j.location} · {j.salary || "Undisclosed"} ·{" "}
                      {j.compatibilityScore}% Match
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/jobs/${j.id}`}
                    className="rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                  >
                    Open Role -&gt;
                  </Link>
                </div>
              ))}
            </div>

            <div className="border-t border-[#ece5d5] pt-4 space-y-2.5">
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Your Application History Here ({matchingApps.length})
              </h3>
              {matchingApps.length === 0 ? (
                <p className="text-[12.5px] text-[#5a6675]">
                  No prepared or submitted applications at {company.name} yet.
                </p>
              ) : (
                matchingApps.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#e3dac5] bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-[13.5px] font-medium text-[#212d3d]">
                        {a.title} ({a.stage})
                      </p>
                      <SubmissionStateBadge state={a.submissionState} />
                    </div>
                    <Link
                      href={`/dashboard/applications/${a.id}`}
                      className="rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
                    >
                      Open Dossier -&gt;
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recruiters & Prep Shortcuts */}
          <aside className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-6 lg:col-span-5">
            <h2 className="font-serif-display text-[21px] text-[#212d3d]">
              Contacts &amp; Referral Paths ({matchingContacts.length})
            </h2>
            {matchingContacts.length === 0 ? (
              <p className="text-[12.5px] text-[#5a6675]">
                No contacts logged at {company.name} yet.
              </p>
            ) : (
              matchingContacts.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/network/contacts/${c.id}`}
                  className="block rounded-[14px] border border-[#dfd4be] bg-white p-3.5 hover:border-[#212d3d]"
                >
                  <p className="text-[13.5px] font-medium text-[#212d3d]">
                    {c.name} · {c.role}
                  </p>
                  <p className="text-[12px] text-[#175cd3]">{c.referralPath}</p>
                </Link>
              ))
            )}
            <Link
              href="/dashboard?section=interviews"
              className="block rounded-full bg-[#212d3d] py-2.5 text-center text-[12.5px] font-medium text-[#faf6ed]"
            >
              Run Company-Specific Interview Drill -&gt;
            </Link>

            <div className="border-t border-[#dfd4be] pt-4 space-y-2">
              <label
                htmlFor="company-prep-notes"
                className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#7a6b4e]"
              >
                Candidate Research &amp; Prep Notes
              </label>
              <textarea aria-label="page textarea 1"
                id="company-prep-notes"
                name="companyPrepNotes"
                rows={3}
                value={prepNote}
                onChange={(e) => setPrepNote(e.target.value)}
                placeholder={`Capture hiring manager insights, product memos, or questions for ${company.name}...`}
                className="w-full rounded-[12px] border border-[#cfc2a5] bg-white p-3 text-[12.5px] text-[#212d3d]"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={savePrepNote}
                  className="cursor-pointer rounded-full border border-[#212d3d] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                >
                  Save Research Notes
                </button>
                {noteSaved && (
                  <span className="text-[11.5px] font-medium text-[#067647]">
                    {noteSaved}
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
