"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_COMPANY_INTEL, INITIAL_RECRUITER_EMAILS, type SubmissionState, type TrackerStage } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill, SubmissionStateBadge } from "@/components/dashboard/StatusBadge";

const STAGES: TrackerStage[] = [
  "Planned",
  "Prepared",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export default function ApplicationDetailPage() {
  const params = useParams<{ applicationId: string }>();
  const { applications, contacts, coverLetters, updateApplication } =
    useVexWorkspace();

  const app =
    applications.find((a) => a.id === params?.applicationId) || applications[0];

  const [newLogNote, setNewLogNote] = useState("");
  const [notesDraft, setNotesDraft] = useState(app?.notes || "");
  const [followUpDraft, setFollowUpDraft] = useState(app?.followUpDate || "");
  const [savedToast, setSavedToast] = useState("");

  if (!app) {
    return (
      <DashboardSubpageFrame
        parentSection="applications"
        parentLabel="Applications Tracker"
        pageCode="05.1"
        pageTitle="Application Not Found"
        philosopherTag="Themis · Order & Accuracy"
      >
        <p>Application dossier not found.</p>
      </DashboardSubpageFrame>
    );
  }

  const companyIntel = INITIAL_COMPANY_INTEL.find((c) =>
    c.name.toLowerCase().includes(app.company.toLowerCase().split(" ")[0])
  );
  const relatedContacts = contacts.filter((c) =>
    c.company.toLowerCase().includes(app.company.toLowerCase().split(" ")[0])
  );
  const relatedEmails = INITIAL_RECRUITER_EMAILS.filter(
    (e) =>
      e.linkedApplicationId === app.id ||
      e.company.toLowerCase().includes(app.company.toLowerCase().split(" ")[0])
  );
  const matchingLetter = coverLetters.find((cl) => cl.jobId === app.jobId);

  function addCommunicationLog(e: React.FormEvent) {
    e.preventDefault();
    if (!newLogNote.trim()) return;
    updateApplication(app.id, (prev) => ({
      ...prev,
      history: [
        {
          at: "Just now",
          actor: "User",
          event: newLogNote.trim(),
        },
        ...prev.history,
      ],
    }));
    setNewLogNote("");
  }

  function saveDossierNotes() {
    updateApplication(app.id, (prev) => ({
      ...prev,
      notes: notesDraft,
      followUpDate: followUpDraft,
    }));
    setSavedToast("Notes and follow-up date saved to Tracker.");
    setTimeout(() => setSavedToast(""), 2500);
  }

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Applications Tracker"
      pageCode="05.1"
      pageTitle={`${app.company} · ${app.title}`}
      philosopherTag="Themis · Judgment & Provenance"
    >
      <div className="space-y-6">
        {/* TOP HEADER DOSSIER WITH THEMIS ARTWORK */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label={`Themis Dossier · ${app.company}`} />
                <SubmissionStateBadge state={app.submissionState} />
                <StatusPill label={`Stage: ${app.stage}`} tone="navy" dot={false} />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] leading-tight text-[#212d3d]">
                {app.title}
              </h1>
              <p className="text-[13px] text-[#5a6675]">
                Evidence ledger: {app.evidenceText} · Deadline:{" "}
                {app.deadline || "None recorded"} · Priority: {app.priority}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href={`/dashboard/apply/review/${app.id}`}
                  className="rounded-full bg-[#212d3d] px-4 py-2 text-[12px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  Open Vex Apply Field Review
                </Link>
                <Link
                  href={`/dashboard/interviews/session/${app.id}`}
                  className="rounded-full border border-[#212d3d] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                >
                  Socratic Interview Drill -&gt;
                </Link>
                <Link
                  href={`/dashboard/jobs/${app.jobId}`}
                  className="rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d]"
                >
                  View Original Job -&gt;
                </Link>
                {companyIntel && (
                  <Link
                    href={`/dashboard/companies/${companyIntel.id}`}
                    className="rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d]"
                  >
                    Company Intel
                  </Link>
                )}
              </div>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3.5 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3">
                <img
                  src="/images/themis-governance-scales.jpg"
                  alt="Themis weighing honest application evidence"
                  className="h-24 w-20 shrink-0 rounded-[12px] border border-[#cfc2a5] object-cover object-top"
                />
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Themis · Honest Proof
                  </p>
                  <p className="text-[11.5px] leading-snug text-[#212d3d]">
                    “Prepared drafts are never conflated with verified sends.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRID: STATUS & TIMELINE (LEFT 7) + DOCUMENTS & RECRUITER (RIGHT 5) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            {/* Stage & Proof State Verification Controls */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-4">
              <h2 className="font-serif-display text-[21px] text-[#212d3d]">
                Stage &amp; Honest Submission Proof
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                    Workflow Stage
                  </label>
                  <select id="page-select-1" name="page-select-1" aria-label="page select 1"
                    value={app.stage}
                    onChange={(e) => {
                      const nextStage = e.target.value as TrackerStage;
                      updateApplication(app.id, (prev) => ({
                        ...prev,
                        stage: nextStage,
                        history: [
                          {
                            at: "Just now",
                            actor: "User",
                            event: `Updated stage to ${nextStage}`,
                          },
                          ...prev.history,
                        ],
                      }));
                    }}
                    className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                    Submission Verification State
                  </label>
                  <select id="page-select-2" name="page-select-2" aria-label="page select 2"
                    value={app.submissionState}
                    onChange={(e) => {
                      const st = e.target.value as SubmissionState;
                      const ev =
                        st === "verified-submitted"
                          ? "Confirmed by email receipt / ATS portal verification"
                          : st === "user-reported-submitted"
                          ? "Confirmed by candidate manually"
                          : "Prepared draft only — never claimed as sent";
                      updateApplication(app.id, (prev) => ({
                        ...prev,
                        submissionState: st,
                        evidenceText: ev,
                      }));
                    }}
                    className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                  >
                    <option value="prepared">Prepared (not submitted)</option>
                    <option value="user-reported-submitted">
                      User-reported submitted
                    </option>
                    <option value="verified-submitted">
                      Verified submitted
                    </option>
                  </select>
                </div>
              </div>

              {/* Personal Notes & Follow-Up */}
              <div className="space-y-2 border-t border-[#ece5d5] pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                    Notes &amp; Follow-up Date
                  </label>
                  <input id="page-input-3" name="page-input-3" aria-label="page input 3"
                    value={followUpDraft}
                    onChange={(e) => setFollowUpDraft(e.target.value)}
                    placeholder="Follow-up date"
                    className="rounded-full border border-[#dad6ca] bg-[#faf6ed] px-3 py-1 font-mono text-[11.5px]"
                  />
                </div>
                <textarea id="page-textarea-4" name="page-textarea-4" aria-label="page textarea 4"
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px]"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveDossierNotes}
                    className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                  >
                    Save Notes
                  </button>
                  {savedToast && (
                    <span className="text-[12px] text-[#067647]">{savedToast}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Full Timeline & Communication History */}
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-4">
              <h2 className="font-serif-display text-[21px] text-[#212d3d]">
                Application Timeline &amp; Communication History
              </h2>
              <form onSubmit={addCommunicationLog} className="flex gap-2">
                <input id="page-input-5" name="page-input-5" aria-label="page input 5"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  placeholder="Log outreach message, confirmation code, or panel note..."
                  className="flex-1 rounded-full border border-[#dad6ca] bg-[#faf6ed] px-4 py-1.5 text-[12.5px]"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] text-[#faf6ed]"
                >
                  Log Event
                </button>
              </form>
              <div className="divide-y divide-[#ece5d5]">
                {app.history.map((h, i) => (
                  <div key={i} className="py-2.5 text-[12.5px]">
                    <p className="font-medium text-[#212d3d]">{h.event}</p>
                    <p className="font-mono text-[10.5px] text-[#7a6b4e]">
                      {h.at} · {h.actor}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT 5: ATTACHED DOCUMENTS, RECRUITER CONTACTS & SCHEDULE */}
          <aside className="space-y-5 lg:col-span-5">
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5 space-y-3">
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Attached Documents
              </h3>
              <div className="rounded-[14px] border border-[#dfd4be] bg-white p-3.5 text-[12.5px]">
                <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                  Selected CV
                </p>
                <p className="font-medium text-[#212d3d]">{app.cvVariant}</p>
                <Link
                  href="/dashboard/documents/resume/res-main"
                  className="mt-1 inline-block text-[11.5px] text-[#175cd3] underline"
                >
                  Inspect / edit in Resume Studio -&gt;
                </Link>
              </div>
              <div className="rounded-[14px] border border-[#dfd4be] bg-white p-3.5 text-[12.5px]">
                <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                  Cover Letter Packet
                </p>
                <p className="font-medium text-[#212d3d]">
                  {matchingLetter
                    ? `${matchingLetter.title} (v${matchingLetter.version})`
                    : app.coverLetterApproved
                    ? "Approved custom letter attached"
                    : "Not yet drafted"}
                </p>
                <Link
                  href="/dashboard/documents/cover-letters"
                  className="mt-1 inline-block text-[11.5px] text-[#175cd3] underline"
                >
                  Open in Cicero Studio -&gt;
                </Link>
              </div>
            </section>

            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Recruiters, Schedule &amp; Inbox
              </h3>
              {app.interviewDate ? (
                <div className="rounded-[14px] border border-[#067647]/30 bg-[#067647]/10 p-3 text-[12.5px] text-[#067647]">
                  <strong>Scheduled Interview:</strong> {app.interviewDate} (
                  {app.interviewFormat || "Panel"})
                </div>
              ) : (
                <p className="text-[12px] text-[#5a6675]">
                  No interview confirmed yet.
                </p>
              )}

              {relatedContacts.map((rc) => (
                <Link
                  key={rc.id}
                  href={`/dashboard/network/contacts/${rc.id}`}
                  className="block rounded-[14px] border border-[#dfd4be] bg-[#faf6ed] p-3 text-[12.5px] hover:border-[#212d3d]"
                >
                  <p className="font-medium text-[#212d3d]">
                    {rc.name} · {rc.role}
                  </p>
                  <p className="text-[#5a6675]">{rc.referralPath}</p>
                </Link>
              ))}

              {relatedEmails.map((em) => (
                <div
                  key={em.id}
                  className="rounded-[14px] border border-[#dfd4be] bg-[#faf6ed] p-3 text-[12px]"
                >
                  <p className="font-medium text-[#212d3d]">{em.subject}</p>
                  <p className="mt-0.5 text-[#5a6675]">{em.extractedSummary}</p>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
