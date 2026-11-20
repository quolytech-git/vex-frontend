"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  ExternalAiAppAccess,
  McpActivityEntry,
  McpConnection,
  OnboardingProfileState,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon } from "@/components/Icons";
import { GreekTempleWordFrame } from "./IonicColumnDecoration";
import { StatusPill } from "./StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

interface McpAssistantViewProps {
  profile: OnboardingProfileState;
  connections: McpConnection[];
  externalApps: ExternalAiAppAccess[];
  activityLog: McpActivityEntry[];
  onToggleConnection: (id: string) => void;
  onToggleExternalApp: (id: string) => void;
  onClearActivity: () => void;
  onRecordAssistantPlanRun: (prompt: string) => void;
}

type SanctuaryTab = "plan" | "tools" | "history";
type OraclePersonaKey = "zeus" | "council" | "socrates" | "davinci";

const ORACLE_GALLERY: Record<
  OraclePersonaKey,
  {
    key: OraclePersonaKey;
    title: string;
    subtitle: string;
    image: string;
    maxim: string;
  }
> = {
  zeus: {
    key: "zeus",
    title: "Zeus · High Command",
    subtitle: "Temple of Olympia",
    image: "/images/zeus-temple-crown.jpg",
    maxim: "Nothing executes beyond the gate without your sovereign sign-off.",
  },
  council: {
    key: "council",
    title: "Philosopher Council",
    subtitle: "Plato · Aristotle · Zeno",
    image: "/images/assistant-philosopher-olympus.jpg",
    maxim: "External listings are weighed as raw evidence — never blind orders.",
  },
  socrates: {
    key: "socrates",
    title: "Socrates · Audit Logic",
    subtitle: "Dialectical Check",
    image: "/images/interview-socrates-dialectic.jpg",
    maxim: "Verify each step of the plan before touching a single external form.",
  },
  davinci: {
    key: "davinci",
    title: "Leonardo · Systems",
    subtitle: "Codex Schematics",
    image: "/images/davinci-profile-bust.jpg",
    maxim: "Precision connectors keep every application trace transparent.",
  },
};

export default function McpAssistantView({
  profile,
  connections,
  externalApps,
  activityLog,
  onToggleConnection,
  onToggleExternalApp,
  onClearActivity,
  onRecordAssistantPlanRun,
}: McpAssistantViewProps) {
  const [assistantInput, setAssistantInput] = useState(
    "Find fresh roles matching my skills, highlight gaps, and draft a clean CV diff for review."
  );
  const [persona, setPersona] = useState<OraclePersonaKey>("zeus");
  const [activeTab, setActiveTab] = useState<SanctuaryTab>("plan");

  const [planSteps, setPlanSteps] = useState([
    {
      id: "ps-1",
      scope: "Vex can do" as const,
      title: "Search Greenhouse & Career Feeds (Read-only)",
      included: true,
    },
    {
      id: "ps-2",
      scope: "Vex can do" as const,
      title: "Compare job specs with Skill Profile & flag gaps",
      included: true,
    },
    {
      id: "ps-3",
      scope: "Vex can do" as const,
      title: "Draft line-by-line CV diff (kept as Draft)",
      included: true,
    },
    {
      id: "ps-4",
      scope: "Needs approval" as const,
      title: "Pre-fill supported application fields",
      included: true,
    },
    {
      id: "ps-5",
      scope: "You do it" as const,
      title: "Review CAPTCHA / details & click final Submit",
      included: true,
    },
  ]);

  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [runStatus, setRunStatus] = useState("");

  function approveRun() {
    setApprovalDialogOpen(false);
    setRunStatus(
      "Approved plan completed cleanly: roles scanned, gaps mapped, and CV diff saved to Drafts. Logged under Activity."
    );
    onRecordAssistantPlanRun(assistantInput);
  }

  const activeOracle = ORACLE_GALLERY[persona];
  const connectedCount = connections.filter(
    (c) => c.status === "Connected"
  ).length;
  const activeStepCount = planSteps.filter((s) => s.included).length;

  return (
    <GreekTempleWordFrame
      inscription="TEMPLE OF ZEUS · VEX ORACLE"
      apexVariant="zeus"
    >
      <div className="space-y-6 p-4 sm:p-7 max-lg:p-0">
        <MobilePhilosopherPill
          name={activeOracle.title}
          role={activeOracle.subtitle}
          image={activeOracle.image}
          quote={activeOracle.maxim}
          guidance="Describe your task or choose a preset prompt; nothing runs externally until you approve each step."
          actionLabel="Open MCP Forge"
          actionHref="/dashboard/integrations/mcp"
        />

        {/* SECTION 1: CLEAN SANCTUARY HERO WITH ZEUS & PHILOSOPHERS */}
        <section className="vex-m-flat rounded-[24px] border border-[#dcd2bd] bg-[#fffef9] p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            {/* Left 7: Simple Controls & Command Bar */}
            <div className="space-y-4 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Temple of Zeus · Supervised AI Assistant" />
                <StatusPill
                  label={`${connectedCount}/${connections.length} Tools Live`}
                  tone="navy"
                  dot={false}
                />
                <StatusPill label="Human Approval Gate" tone="success" dot={false} />
              </div>

              <div className="space-y-1.5">
                <h1 className="font-serif-display text-[clamp(1.85rem,3vw,2.55rem)] leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                  Sovereign Oracle &amp;{" "}
                  <span className="italic text-[#5a6675]">Clean Control.</span>
                </h1>
                <p className="max-w-[58ch] text-[13.5px] leading-relaxed text-[#5a6675]">
                  Ask your assistant to scan roles, audit skill gaps, or draft a
                  CV update for{" "}
                  <strong className="font-medium text-[#212d3d]">
                    {profile.name || "your workspace"}
                  </strong>
                  . Nothing sends or submits without your preview approval.
                </p>
              </div>

              {/* 1-Click Quick Command Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Scan fresh roles matching my skills",
                  "Find mandatory gaps before panel calls",
                  "Draft tailored CV summary diff",
                  "Audit connected read-only tools",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAssistantInput(preset);
                      setRunStatus("");
                    }}
                    className="cursor-pointer rounded-full border border-[#dfd4be] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d] transition-colors hover:border-[#212d3d] hover:bg-white"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Clean Single Command Bar */}
              <div className="space-y-2.5">
                <textarea id="mcpassistantview-textarea-1" name="mcpassistantview-textarea-1" aria-label="mcpassistantview textarea 1"
                  rows={2}
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  className="w-full rounded-[16px] border border-[#d6cbb2] bg-[#faf6ed] p-3.5 text-[13.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setApprovalDialogOpen(true);
                      setRunStatus("");
                      setActiveTab("plan");
                    }}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] transition-all hover:bg-[#314158]"
                  >
                    <span>Preview &amp; Run ({activeStepCount} Steps)</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("tools")}
                    className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    Manage Tools ({connectedCount})
                  </button>
                  <Link
                    href="/dashboard/integrations/mcp"
                    className="rounded-full border border-[#212d3d] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                  >
                    MCP Workspace &amp; Tools -&gt;
                  </Link>
                  <Link
                    href="/dashboard/settings/integrations"
                    className="rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:bg-white"
                  >
                    Recruiter Inbox &amp; OAuth
                  </Link>
                </div>
              </div>
            </div>

            {/* Right 5: Arched Temple of Zeus & Philosopher Artwork Gallery (Desktop Only) */}
            <div className="hidden flex-col items-center gap-3 lg:col-span-5 lg:flex">
              <div className="w-full max-w-[330px] overflow-hidden rounded-t-[165px] rounded-b-[20px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-[0_14px_34px_rgba(33,45,61,0.12)]">
                <div className="aspect-[4/4.3] w-full overflow-hidden">
                  <img
                    src={activeOracle.image}
                    alt={activeOracle.title}
                    className="h-full w-full object-cover object-top transition-all duration-300"
                  />
                </div>
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-3">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.13em] text-[#7a6b4e]">
                    {activeOracle.title} · {activeOracle.subtitle}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#212d3d]">
                    “{activeOracle.maxim}”
                  </p>
                </div>
              </div>

              {/* Famous Philosophers & Zeus Image Switcher */}
              <div className="grid w-full max-w-[330px] grid-cols-4 gap-1.5">
                {(Object.keys(ORACLE_GALLERY) as OraclePersonaKey[]).map((k) => {
                  const item = ORACLE_GALLERY[k];
                  const selected = persona === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPersona(k)}
                      className={`flex cursor-pointer flex-col items-center gap-1 rounded-[12px] border p-1.5 transition-all ${
                        selected
                          ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                          : "border-[#dfd4be] bg-[#faf6ed] text-[#212d3d] hover:border-[#8f7d5d]"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-9 w-full rounded-[8px] object-cover object-top"
                      />
                      <span className="w-full truncate text-center text-[10px] font-medium">
                        {item.title.split(" · ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ONE SIMPLIFIED TABBED WORKSPACE PANEL */}
        <section className="overflow-hidden rounded-[24px] border border-[#dcd2bd] bg-[#fffef9]">
          {/* Clean 3-Tab Switcher Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece5d5] bg-[#faf6ed] px-5 py-3.5">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "plan", label: `Step Plan (${activeStepCount})` },
                  { id: "tools", label: `Connected Tools (${connectedCount})` },
                  {
                    id: "history",
                    label: `Activity Log (${activityLog.length})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dfd4be] bg-white text-[#5a6675] hover:text-[#212d3d]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#7a6b4e]">
              Outside text = Data, Never Orders
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {/* TAB 1: CLEAN STEP-BY-STEP PLAN & APPROVAL */}
            {activeTab === "plan" && (
              <div className="space-y-4">
                {approvalDialogOpen && (
                  <div className="rounded-[18px] border border-[#b54708]/35 bg-[#faf6ed] p-4 space-y-2.5">
                    <p className="text-[13.5px] font-medium text-[#212d3d]">
                      Confirm Supervised Run Before Execution
                    </p>
                    <p className="text-[12.5px] text-[#5a6675]">
                      Vex will run {activeStepCount} checked steps using your
                      CV variant and pause before any final employer submission.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={approveRun}
                        className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                      >
                        Approve &amp; Run Steps
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setApprovalDialogOpen(false);
                          setRunStatus(
                            "Cancelled cleanly — all drafts remain untouched."
                          );
                        }}
                        className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-4 py-1.5 text-[12px] text-[#5a6675]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {runStatus && (
                  <div className="rounded-[14px] border border-[#067647]/30 bg-[#067647]/10 px-4 py-2.5 text-[12.5px] text-[#067647]">
                    {runStatus}
                  </div>
                )}

                <div className="divide-y divide-[#ece5d5]">
                  {planSteps.map((st, idx) => (
                    <div
                      key={st.id}
                      className={`flex flex-wrap items-center justify-between gap-3 py-3 first:pt-1 last:pb-1 ${
                        st.included ? "" : "opacity-50"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#dfd4be] bg-[#faf6ed] font-mono text-[11px] font-semibold text-[#212d3d]">
                          {idx + 1}
                        </span>
                        <span className="text-[13.5px] font-medium text-[#212d3d]">
                          {st.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusPill
                          label={st.scope}
                          tone={
                            st.scope === "Vex can do"
                              ? "navy"
                              : st.scope === "Needs approval"
                              ? "warning"
                              : "success"
                          }
                          dot={false}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPlanSteps((prev) =>
                              prev.map((p) =>
                                p.id === st.id
                                  ? { ...p, included: !p.included }
                                  : p
                              )
                            )
                          }
                          className="cursor-pointer rounded-full border border-[#d8ceb9] bg-white px-3 py-1 text-[11px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                        >
                          {st.included ? "Skip" : "Include"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: TOOLS & PERMISSIONS IN ONE CLEAN VIEW */}
            {activeTab === "tools" && (
              <div className="space-y-5">
                <div className="divide-y divide-[#ece5d5]">
                  {connections.map((conn) => (
                    <div
                      key={conn.id}
                      className="flex flex-col justify-between gap-3 py-3.5 first:pt-1 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14.5px] font-medium text-[#212d3d]">
                            {conn.name}
                          </p>
                          <StatusPill
                            label={conn.status}
                            tone={
                              conn.status === "Connected"
                                ? "success"
                                : conn.status === "Not working"
                                ? "error"
                                : "neutral"
                            }
                            dot={false}
                          />
                        </div>
                        <p className="text-[12px] text-[#5a6675]">
                          {conn.publisher} · {conn.permissionSummary} · Leaves
                          Vex: {conn.dataShared}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleConnection(conn.id)}
                        className="shrink-0 cursor-pointer rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                      >
                        {conn.status === "Connected" ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* External Apps Access Strip */}
                <div className="border-t border-[#ece5d5] pt-4 space-y-2.5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    External AI Apps Using Vex (Off By Default)
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {externalApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between gap-3 rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-medium text-[#212d3d]">
                            {app.feature}
                          </p>
                          <p className="truncate text-[11px] text-[#5a6675]">
                            {app.approvalRule}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleExternalApp(app.id)}
                          className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium ${
                            app.enabled
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : "border border-[#d6cbb2] bg-white text-[#5a6675]"
                          }`}
                        >
                          {app.enabled ? "On" : "Off"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CLEAN AUDIT HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-[#5a6675]">
                    Showing tool categories only — private contents never leave
                    without consent.
                  </p>
                  <button
                    type="button"
                    onClick={onClearActivity}
                    className="cursor-pointer text-[12px] font-medium text-[#b42318] underline"
                  >
                    Clear Log
                  </button>
                </div>

                {activityLog.length === 0 ? (
                  <p className="rounded-[14px] bg-[#faf6ed] p-4 text-[13px] text-[#5a6675]">
                    Activity log is clean. Any supervised assistant runs appear
                    here.
                  </p>
                ) : (
                  <div className="divide-y divide-[#ece5d5]">
                    {activityLog.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-1 last:pb-1 text-[12.5px]"
                      >
                        <div>
                          <p className="font-medium text-[#212d3d]">
                            {entry.time} · {entry.actor} → {entry.tool}
                          </p>
                          <p className="text-[12px] text-[#5a6675]">
                            {entry.action} (Shared: {entry.dataShared})
                          </p>
                        </div>
                        <StatusPill
                          label={entry.result}
                          tone={
                            entry.result === "Succeeded" ? "success" : "warning"
                          }
                          dot={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </GreekTempleWordFrame>
  );
}
