"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import VexApplyNav from "@/components/dashboard/VexApplyNav";
import { StatusPill, SubmissionStateBadge } from "@/components/dashboard/StatusBadge";

export default function ApplyReviewSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const { applications, updateApplication } = useVexWorkspace();

  const app =
    applications.find((a) => a.id === params?.sessionId) || applications[0];
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [outcomeBanner, setOutcomeBanner] = useState("");

  if (!app) {
    return (
      <DashboardSubpageFrame
        parentSection="applications"
        parentLabel="Tracker"
        pageCode="05.3"
        pageTitle="Apply Review Session"
        philosopherTag="Hermes & Themis"
      >
        <p>No application session found.</p>
      </DashboardSubpageFrame>
    );
  }

  const missingCount = app.extensionFields.filter(
    (f) => f.status === "Needs input" || f.status === "Needs review"
  ).length;

  function handleMarkUserConfirmed() {
    if (!confirmChecked) {
      setOutcomeBanner(
        "Blocked: confirm the truthfulness checkbox before marking submission."
      );
      return;
    }
    updateApplication(app.id, (prev) => ({
      ...prev,
      stage: "Applied",
      submissionState: "user-reported-submitted",
      evidenceText:
        "Reviewed all populated fields & confirmed submission via Vex Apply gate",
      checklist: {
        ...prev.checklist,
        fieldsChecked: true,
        questionsAnswered: true,
      },
      history: [
        {
          at: "Just now",
          actor: "Vex Extension",
          event: "User reviewed fields & recorded confirmation in Tracker",
        },
        ...prev.history,
      ],
    }));
    setOutcomeBanner(
      "Saved cleanly! Application marked User-reported submitted & synchronized to Tracker."
    );
  }

  function handleSimulatePortalTimeoutRecovery() {
    updateApplication(app.id, (prev) => ({
      ...prev,
      submissionState: "prepared",
      evidenceText:
        "Submission interrupted on portal — all filled answers safely preserved in Prepared state",
      history: [
        {
          at: "Just now",
          actor: "Vex Extension",
          event: "Portal failure recovery: preserved draft inputs without false submitted claim",
        },
        ...prev.history,
      ],
    }));
    setOutcomeBanner(
      "Failure recovery active: edits preserved safely as Prepared. Zero false submission logged."
    );
  }

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Applications Tracker"
      pageCode="05.3"
      pageTitle={`Pre-Submit Review · ${app.company}`}
      philosopherTag="Hermes & Themis · Final Review"
    >
      <div className="space-y-6">
        <VexApplyNav active="review" sessionId={app.id} />
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Eyebrow label="Vex Apply Review · Never Implies Submission Without Confirmation" />
              <h1 className="mt-1 font-serif-display text-[28px] text-[#212d3d]">
                Review {app.title} at {app.company}
              </h1>
            </div>
            <SubmissionStateBadge state={app.submissionState} />
          </div>
          <p className="text-[13px] text-[#5a6675]">
            Inspect every populated field below. Missing or unsupported fields are
            flagged explicitly — edit them inline before marking confirmation or
            switching to manual submission.
          </p>
        </section>

        <section className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece5d5] pb-3">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              Populated Application Fields ({app.extensionFields.length})
            </h2>
            <StatusPill
              label={
                missingCount > 0
                  ? `${missingCount} field(s) need attention`
                  : "All fields reviewed"
              }
              tone={missingCount > 0 ? "warning" : "success"}
            />
          </div>

          <div className="space-y-3">
            {app.extensionFields.map((field) => (
              <div
                key={field.id}
                className="rounded-[16px] border border-[#e0d6bf] bg-[#faf6ed] p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[13.5px] font-medium text-[#212d3d]">
                      {field.label}
                    </p>
                    <p className="font-mono text-[10.5px] text-[#7a6b4e]">
                      Source: {field.source}
                    </p>
                  </div>
                  <StatusPill
                    label={field.status}
                    tone={
                      field.status === "Filled"
                        ? "success"
                        : field.status === "Needs input" ||
                          field.status === "Needs review"
                        ? "warning"
                        : "neutral"
                    }
                    dot={false}
                  />
                </div>
                <input id={`apply-field-${field.id}`} name={`apply-field-${field.id}`} aria-label={field.label}
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateApplication(app.id, (prev) => ({
                      ...prev,
                      extensionFields: prev.extensionFields.map((f) =>
                        f.id === field.id
                          ? {
                              ...f,
                              value: val,
                              status: val.trim() ? "Filled" : "Needs input",
                            }
                          : f
                      ),
                    }));
                  }}
                  placeholder="Enter verified value..."
                  className="w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-2 text-[13px] text-[#212d3d]"
                />
              </div>
            ))}
          </div>

          {/* Explicit Confirmation Gate */}
          <div className="rounded-[18px] border border-[#d6cbb2] bg-[#f4efe3] p-4 space-y-3">
            <label
              htmlFor="apply-confirm-gate"
              className="flex cursor-pointer items-start gap-2.5 text-[13px] text-[#212d3d]"
            >
              <input
                id="apply-confirm-gate"
                name="applyConfirmGate"
                aria-label="Confirm populated profile fields before submission sync"
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#212d3d]"
              />
              <span>
                I inspected all populated profile fields, attached CV variant (
                <strong>{app.cvVariant}</strong>), and personally completed or
                verified submission on the employer portal.
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleMarkUserConfirmed}
                className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
              >
                Confirm &amp; Sync Submission
              </button>
              <button
                type="button"
                onClick={handleSimulatePortalTimeoutRecovery}
                className="cursor-pointer rounded-full border border-[#b54708]/40 bg-white px-4 py-2 text-[12px] font-medium text-[#b54708]"
              >
                Test Portal Interrupt Recovery
              </button>
              <Link
                href={`/dashboard/applications/${app.id}`}
                className="rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d]"
              >
                View Application Dossier -&gt;
              </Link>
            </div>

            {outcomeBanner && (
              <p className="rounded-[12px] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#212d3d]">
                {outcomeBanner}
              </p>
            )}
          </div>
        </section>
      </div>
    </DashboardSubpageFrame>
  );
}
