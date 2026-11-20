"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_RECRUITER_EMAILS } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

export default function IntegrationsAndInboxPage() {
  const {
    connections,
    externalApps,
    activityLog,
    applications,
    toggleConnection,
    toggleExternalApp,
    recordAssistantRun,
  } = useVexWorkspace();

  const [gmailAuthorized, setGmailAuthorized] = useState(false);
  const [outlookAuthorized, setOutlookAuthorized] = useState(false);
  const [mcpEndpointUrl, setMcpEndpointUrl] = useState(
    "https://mcp.local.vex.internal/v1/readonly"
  );
  const [mcpScopeNote, setMcpScopeNote] = useState(
    "Read-only job listings & calendar free/busy. Never auto-submits."
  );
  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});
  const [linkedAppMap, setLinkedAppMap] = useState<Record<string, string>>({});
  const [diagnosticsMsg, setDiagnosticsMsg] = useState("");

  function handleTestDiagnostics(connName: string) {
    recordAssistantRun(`Diagnostic ping tested on ${connName} (local sandbox)`);
    setDiagnosticsMsg(
      `Diagnostic note for "${connName}": external OAuth tokens require a configured backend server — UI state remains safely local and honest.`
    );
  }

  return (
    <DashboardSubpageFrame
      parentSection="mcp"
      parentLabel="Assistant & Settings"
      pageCode="09.1"
      pageTitle="Hephaestus Integrations & Recruiter Inbox"
      philosopherTag="Hephaestus · Engineering & Connections"
    >
      <div className="space-y-6">
        <MobilePhilosopherPill
          name="Hephaestus"
          role="Integrations & Inbox"
          image="/images/hephaestus-mcp-forge.jpg"
          quote="Join only trusted gears; expose every permission clearly."
          guidance="Sandbox mode active: preview Gmail/Outlook thread matching and reply drafts safely without live OAuth tokens."
          actionLabel="Open MCP Forge"
          actionHref="/dashboard/integrations/mcp"
        />

        {/* HERO WITH HEPHAESTUS WORKSHOP */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Hephaestus Forge · MCP Servers & Mailbox Permissions" />
                <StatusPill
                  label="Honest Mode: Local sandbox (No fake OAuth)"
                  tone="warning"
                />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] text-[#212d3d]">
                Integrations, MCP Forge &amp;{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Recruiter Inbox.
                </span>
              </h1>
              <p className="max-w-[64ch] text-[13px] text-[#5a6675]">
                Configure read-only MCP connectors, inspect outbound data scopes,
                and review detected recruiter invitations &amp; confirmations. Live
                Gmail/Outlook OAuth requires backend credentials and never fakes
                cloud tokens.
              </p>
              <div className="pt-1">
                <Link
                  href="/dashboard/integrations/mcp"
                  className="inline-flex rounded-full bg-[#212d3d] px-4 py-2 text-[12px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  Open Dedicated Hephaestus MCP Forge -&gt;
                </Link>
              </div>
            </div>

            <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
              <div className="w-full max-w-[300px] overflow-hidden rounded-t-[140px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc]">
                <img
                  src="/images/hephaestus-mcp-forge.jpg"
                  alt="Hephaestus engineering brass astrolabe gears"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2">
                  <p className="font-mono text-[9.5px] font-semibold uppercase text-[#7a6b4e]">
                    Hephaestus · Measured Craft
                  </p>
                  <p className="text-[11.5px] text-[#212d3d]">
                    “Join only trusted gears; expose every permission clearly.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {diagnosticsMsg && (
          <div className="rounded-[14px] border border-[#b54708]/35 bg-[#faf6ed] px-4 py-3 text-[12.5px] text-[#212d3d]">
            {diagnosticsMsg}
          </div>
        )}

        {/* GRID: MCP & CONNECTORS (LEFT 6) + GMAIL / OUTLOOK RECRUITER INBOX (RIGHT 6) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-6">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              MCP Server &amp; Tool Registry
            </h2>

            <div className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-2.5">
              <p className="font-mono text-[10px] font-semibold uppercase text-[#7a6b4e]">
                Custom MCP Server Definition
              </p>
              <input id="page-input-1" name="page-input-1" aria-label="page input 1"
                value={mcpEndpointUrl}
                onChange={(e) => setMcpEndpointUrl(e.target.value)}
                className="w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-1.5 font-mono text-[12px]"
              />
              <input id="page-input-2" name="page-input-2" aria-label="page input 2"
                value={mcpScopeNote}
                onChange={(e) => setMcpScopeNote(e.target.value)}
                className="w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>

            <div className="divide-y divide-[#ece5d5]">
              {connections.map((conn) => (
                <div key={conn.id} className="py-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[14.5px] font-medium text-[#212d3d]">
                        {conn.name}
                      </p>
                      <p className="text-[12px] text-[#5a6675]">
                        {conn.publisher} · {conn.permissionSummary}
                      </p>
                    </div>
                    <StatusPill
                      label={conn.status}
                      tone={
                        conn.status === "Connected"
                          ? "success"
                          : conn.status === "Not working"
                          ? "error"
                          : "neutral"
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleConnection(conn.id)}
                      className="cursor-pointer rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
                    >
                      {conn.status === "Connected"
                        ? "Revoke Local Access"
                        : "Enable Local Sandbox"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestDiagnostics(conn.name)}
                      className="cursor-pointer rounded-full border border-[#dad6ca] bg-white px-3 py-1 text-[11.5px] text-[#5a6675] hover:text-[#212d3d]"
                    >
                      Test &amp; Log Diagnostic
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#ece5d5] pt-3 space-y-2">
              <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                External AI Access Scopes ({externalApps.length})
              </p>
              {externalApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-[12px] border border-[#e3dac5] bg-[#faf6ed] px-3.5 py-2 text-[12px]"
                >
                  <span>{app.feature}</span>
                  <button
                    type="button"
                    onClick={() => toggleExternalApp(app.id)}
                    className={`cursor-pointer rounded-full px-3 py-0.5 text-[11px] font-medium ${
                      app.enabled
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#cfc2a5] bg-white text-[#5a6675]"
                    }`}
                  >
                    {app.enabled ? "Enabled" : "Off"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT 6: RECRUITER & EMAIL INTELLIGENCE */}
          <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-6">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              Recruiter Email Intelligence (Hermes)
            </h2>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setGmailAuthorized((v) => !v)}
                className={`cursor-pointer rounded-[14px] border p-3.5 text-left ${
                  gmailAuthorized
                    ? "border-[#067647] bg-[#067647]/10"
                    : "border-[#dfd4be] bg-[#faf6ed]"
                }`}
              >
                <p className="text-[13px] font-medium text-[#212d3d]">
                  Gmail Read-Only Filter
                </p>
                <p className="mt-0.5 font-mono text-[10.5px] text-[#5a6675]">
                  {gmailAuthorized
                    ? "Preview active (requires Google OAuth backend)"
                    : "Disconnected — click to preview permission"}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setOutlookAuthorized((v) => !v)}
                className={`cursor-pointer rounded-[14px] border p-3.5 text-left ${
                  outlookAuthorized
                    ? "border-[#067647] bg-[#067647]/10"
                    : "border-[#dfd4be] bg-[#faf6ed]"
                }`}
              >
                <p className="text-[13px] font-medium text-[#212d3d]">
                  Outlook Work/Personal Inbox
                </p>
                <p className="mt-0.5 font-mono text-[10.5px] text-[#5a6675]">
                  {outlookAuthorized
                    ? "Preview active (requires MS Graph backend)"
                    : "Disconnected — click to preview permission"}
                </p>
              </button>
            </div>

            <div className="space-y-3">
              {INITIAL_RECRUITER_EMAILS.map((em) => (
                <div
                  key={em.id}
                  className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusPill
                      label={em.classification}
                      tone={
                        em.classification === "Interview Invitation"
                          ? "success"
                          : "info"
                      }
                      dot={false}
                    />
                    <span className="font-mono text-[10.5px] text-[#7a6b4e]">
                      {em.provider} · {em.receivedAt}
                    </span>
                  </div>
                  <p className="text-[13.5px] font-medium text-[#212d3d]">
                    {em.subject}
                  </p>
                  <p className="text-[12px] text-[#5a6675]">
                    {em.extractedSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10.5px] text-[#7a6b4e]">
                      Linked App:
                    </span>
                    <select id={`inbox-link-${em.id}`} name={`inbox-link-${em.id}`} aria-label={`Linked application for ${em.subject}`}
                      value={linkedAppMap[em.id] ?? em.linkedApplicationId}
                      onChange={(e) =>
                        setLinkedAppMap((prev) => ({
                          ...prev,
                          [em.id]: e.target.value,
                        }))
                      }
                      className="rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11.5px]"
                    >
                      {applications.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.company} — {a.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea id={`inbox-reply-${em.id}`} name={`inbox-reply-${em.id}`} aria-label={`Reply draft for ${em.subject}`}
                    rows={2}
                    value={draftReplies[em.id] ?? em.suggestedReply}
                    onChange={(e) =>
                      setDraftReplies((prev) => ({
                        ...prev,
                        [em.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-[10px] border border-[#dad6ca] bg-white p-2.5 text-[12px] text-[#212d3d]"
                  />
                </div>
              ))}
            </div>

            {activityLog.length > 0 && (
              <div className="border-t border-[#ece5d5] pt-3">
                <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                  Recent Integration Runs ({activityLog.length})
                </p>
                <p className="mt-1 text-[12px] text-[#5a6675]">
                  Latest: {activityLog[0].time} — {activityLog[0].action}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
