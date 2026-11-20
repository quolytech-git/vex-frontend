"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { INITIAL_MCP_TOOLS } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

export default function DedicatedMcpWorkspacePage() {
  const {
    connections,
    externalApps,
    activityLog,
    toggleConnection,
    toggleExternalApp,
    clearActivity,
    recordAssistantRun,
  } = useVexWorkspace();

  const [tab, setTab] = useState<"overview" | "connections" | "tools" | "activity">(
    "overview"
  );
  const [catFilter, setCatFilter] = useState("All");
  const [toolSearch, setToolSearch] = useState("");
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
  const [confirmDisconnectId, setConfirmDisconnectId] = useState<string | null>(
    null
  );
  const [mcpEndpointDraft, setMcpEndpointDraft] = useState(
    "https://mcp.vex.careers/v1/local-preview"
  );
  const [statusBanner, setStatusBanner] = useState("");

  const connectedCount = connections.filter((c) => c.status === "Connected").length;
  const issueCount = connections.filter((c) => c.status === "Not working").length;
  const activeExternalCount = externalApps.filter((e) => e.enabled).length;

  const filteredConnections = useMemo(
    () =>
      connections.filter(
        (c) => catFilter === "All" || c.category === catFilter
      ),
    [connections, catFilter]
  );

  const filteredTools = useMemo(() => {
    const q = toolSearch.trim().toLowerCase();
    return INITIAL_MCP_TOOLS.filter((t) => {
      if (
        catFilter !== "All" &&
        t.category.toLowerCase() !== catFilter.toLowerCase()
      )
        return false;
      if (!q) return true;
      return (
        t.toolName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.integrationName.toLowerCase().includes(q)
      );
    });
  }, [toolSearch, catFilter]);

  const inspectedConnection =
    connections.find((c) => c.id === selectedConnId) || null;

  function showNotice(msg: string) {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(""), 3200);
  }

  return (
    <DashboardSubpageFrame
      parentSection="mcp"
      parentLabel="Zeus Assistant"
      pageCode="09.1"
      pageTitle="Hephaestus MCP Forge"
      philosopherTag="Hephaestus · Engineering & Tools"
    >
      <div className="space-y-6">
        <MobilePhilosopherPill
          name="Hephaestus"
          role="Engineering & Scopes"
          image="/images/hephaestus-mcp-forge.jpg"
          quote="Every instrument serves a declared scope; zero silent permissions."
          guidance={`${connectedCount} of ${connections.length} demo connectors active. Inspect scopes or run dry-run tool previews below.`}
        />

        {/* HERO WITH HEPHAESTUS ARTWORK & HONEST FRONTEND BOUNDARY */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Hephaestus Forge · Model Context Protocol Workspace" />
                <StatusPill
                  label="Frontend Sandbox Preview · No Live OAuth Tokens"
                  tone="warning"
                />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.06] text-[#212d3d]">
                MCP Connection Center &amp;{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Tool Explorer.
                </span>
              </h1>
              <p className="max-w-[66ch] text-[13px] text-[#5a6675]">
                Inspect every tool, permission boundary, and data scope before
                letting any AI assistant act inside Vex. Connections shown here
                demonstrate the exact local governance model—external OAuth
                tokens and live MCP servers require backend credentials.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Active Connectors", value: `${connectedCount}/${connections.length}` },
                  { label: "Health Alerts", value: String(issueCount) },
                  { label: "Registered Tools", value: String(INITIAL_MCP_TOOLS.length) },
                  { label: "External AI Scopes", value: `${activeExternalCount}/${externalApps.length}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[14px] border border-[#dfd4be] bg-white px-3.5 py-2.5"
                  >
                    <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 font-serif-display text-[24px] leading-none text-[#212d3d]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
              <div className="w-full max-w-[295px] overflow-hidden rounded-t-[140px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-md">
                <img
                  src="/images/hephaestus-mcp-forge.jpg"
                  alt="Hephaestus forging disciplined architectural tools"
                  className="aspect-[4/3.6] w-full object-cover object-top"
                />
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Hephaestus · Precision &amp; Craft
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#212d3d]">
                    “Every instrument serves a declared scope; zero silent permissions.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "overview", label: "01 · Overview & Health" },
                { id: "connections", label: `02 · Connections (${connections.length})` },
                { id: "tools", label: `03 · Tool Explorer (${INITIAL_MCP_TOOLS.length})` },
                { id: "activity", label: `04 · Activity, Permissions & Setup (${activityLog.length})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setCatFilter("All");
                }}
                className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${
                  tab === t.id
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "border border-[#dad6ca] bg-[#fffef9] text-[#212d3d] hover:border-[#212d3d]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/settings/integrations"
            className="rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
          >
            Open Recruiter Email Inbox -&gt;
          </Link>
        </div>

        {statusBanner && <StatusPill label={statusBanner} tone="success" />}

        {/* TAB 1: OVERVIEW & HEALTH */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
              <h2 className="font-serif-display text-[22px] text-[#212d3d]">
                Connection Health &amp; Last Sync Ledger
              </h2>
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-medium text-[#212d3d]">
                          {conn.name}
                        </p>
                        <StatusPill
                          label={conn.status}
                          tone={
                            conn.status === "Connected"
                              ? "success"
                              : conn.status === "Not working"
                              ? "warning"
                              : "neutral"
                          }
                        />
                      </div>
                      <p className="mt-0.5 text-[12px] text-[#5a6675]">
                        {conn.statusNote} · Last active: {conn.lastUsed}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedConnId(conn.id);
                        setTab("connections");
                      }}
                      className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d]"
                    >
                      Inspect Scope
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-6 lg:col-span-5">
              <Eyebrow label="Recent Execution Trace" />
              <h3 className="font-serif-display text-[21px] text-[#212d3d]">
                Latest Audited MCP Activity
              </h3>
              {activityLog.length === 0 ? (
                <p className="text-[12.5px] text-[#5a6675]">
                  No MCP actions logged yet. Run a tool check from Tool Explorer
                  or Zeus Assistant.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {activityLog.slice(0, 4).map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-[14px] border border-[#dfd4be] bg-white p-3 text-[12px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#7a6b4e]">
                          {entry.time} · {entry.tool}
                        </span>
                        <StatusPill
                          label={entry.approval}
                          tone="info"
                          dot={false}
                        />
                      </div>
                      <p className="mt-1 font-medium text-[#212d3d]">
                        {entry.action}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/dashboard?section=mcp"
                className="block rounded-full bg-[#212d3d] py-2 text-center text-[12px] font-medium text-[#faf6ed]"
              >
                Open Zeus Orchestration Hub -&gt;
              </Link>
            </aside>
          </div>
        )}

        {/* TAB 2: CONNECTION CENTER BY CATEGORY */}
        {tab === "connections" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {[
                "All",
                "Job-listing source",
                "Inbox",
                "Document storage",
                "Calendar",
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCatFilter(cat)}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium ${
                    catFilter === cat
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dad6ca] bg-white text-[#5a6675]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredConnections.map((conn) => {
                const isConfirming = confirmDisconnectId === conn.id;
                return (
                  <div
                    key={conn.id}
                    className="flex flex-col justify-between rounded-[20px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                            {conn.category} · {conn.publisher}
                          </p>
                          <h3 className="mt-0.5 font-serif-display text-[21px] text-[#212d3d]">
                            {conn.name}
                          </h3>
                        </div>
                        <StatusPill
                          label={conn.status}
                          tone={
                            conn.status === "Connected"
                              ? "success"
                              : conn.status === "Not working"
                              ? "warning"
                              : "neutral"
                          }
                        />
                      </div>
                      <p className="text-[12.5px] text-[#5a6675]">
                        <strong>Permissions:</strong> {conn.permissionSummary}
                      </p>
                      <p className="text-[12px] text-[#212d3d]">
                        <strong>Data Shared:</strong> {conn.dataShared} ·{" "}
                        <strong>Duration:</strong> {conn.duration}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ece5d5] pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedConnId(conn.id)}
                        className="cursor-pointer rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d]"
                      >
                        Configure Details
                      </button>

                      {conn.status === "Connected" ? (
                        isConfirming ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                toggleConnection(conn.id);
                                setConfirmDisconnectId(null);
                                showNotice(`Disconnected ${conn.name} locally.`);
                              }}
                              className="cursor-pointer rounded-full bg-[#b42318] px-3 py-1 text-[11px] font-medium text-white"
                            >
                              Confirm Revoke
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDisconnectId(null)}
                              className="cursor-pointer rounded-full border border-[#dad6ca] px-2.5 py-1 text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDisconnectId(conn.id)}
                            className="cursor-pointer rounded-full border border-[#b42318]/40 bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-[#b42318]"
                          >
                            Disconnect
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            toggleConnection(conn.id);
                            showNotice(`Enabled ${conn.name} (local sandbox state).`);
                          }}
                          className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[11.5px] font-medium text-[#faf6ed]"
                        >
                          Connect Preview
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {inspectedConnection && (
              <div className="rounded-[20px] border border-[#212d3d] bg-[#faf6ed] p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                    Configuration Drawer: {inspectedConnection.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedConnId(null)}
                    className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11px]"
                  >
                    Close
                  </button>
                </div>
                <p className="text-[12.5px] text-[#5a6675]">
                  Scope guarantee: {inspectedConnection.permissionSummary}. Last
                  synced: {inspectedConnection.lastUsed}. Production OAuth keys
                  must be supplied by your backend before live external queries
                  run.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MCP TOOL EXPLORER */}
        {tab === "tools" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <input
                id="mcp-tool-search"
                name="mcpToolSearch"
                type="search"
                aria-label="Search MCP tools"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Search tools, capabilities, or integrations..."
                className="w-full max-w-[360px] rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12.5px]"
              />
              <div className="flex flex-wrap gap-1.5">
                {[
                  "All",
                  "Career Platforms",
                  "Email & Communication",
                  "Documents & Storage",
                  "Productivity",
                  "AI Tools",
                  "Developer Tools",
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCatFilter(c)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium ${
                      catFilter === c
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#dad6ca] bg-white text-[#5a6675]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredTools.map((tool) => {
                const parentConn = connections.find(
                  (c) => c.id === tool.integrationId
                );
                const available = parentConn
                  ? parentConn.status === "Connected"
                  : externalApps.some((e) => e.id === tool.integrationId && e.enabled);
                return (
                  <div
                    key={tool.id}
                    className="flex flex-col justify-between rounded-[20px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <code className="rounded bg-[#f4efe3] px-2 py-0.5 font-mono text-[12px] font-semibold text-[#212d3d]">
                          {tool.toolName}()
                        </code>
                        <StatusPill
                          label={available ? "Ready (Local)" : "Paused / Inactive"}
                          tone={available ? "success" : "warning"}
                        />
                      </div>
                      <p className="text-[12.5px] text-[#212d3d]">
                        {tool.description}
                      </p>
                      <p className="font-mono text-[10.5px] text-[#7a6b4e]">
                        Integration: {tool.integrationName} · Permission:{" "}
                        {tool.permissionLevel}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {tool.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="rounded-full border border-[#e3dac5] bg-[#faf6ed] px-2.5 py-0.5 text-[11px] text-[#212d3d]"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#ece5d5] pt-3">
                      <span className="font-mono text-[10.5px] text-[#5a6675]">
                        Last used: {tool.recentUsage}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          recordAssistantRun(
                            `Tool dry-run preview: ${tool.toolName}`
                          );
                          showNotice(
                            `Recorded dry-run audit entry for ${tool.toolName}().`
                          );
                        }}
                        className="cursor-pointer rounded-full border border-[#212d3d] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                      >
                        Run Local Preview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITY, PERMISSIONS & SETUP GUIDE */}
        {tab === "activity" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-[22px] text-[#212d3d]">
                  MCP Audit Ledger ({activityLog.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    clearActivity();
                    showNotice("Cleared MCP audit ledger locally.");
                  }}
                  className="cursor-pointer rounded-full border border-[#b42318]/40 bg-white px-3.5 py-1 text-[11.5px] text-[#b42318]"
                >
                  Clear Log
                </button>
              </div>
              {activityLog.length === 0 ? (
                <p className="rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-4 text-[12.5px] text-[#5a6675]">
                  Audit log is empty. Any approved assistant step or dry-run
                  tool preview will be recorded here.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {activityLog.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-3.5 text-[12px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] text-[#7a6b4e]">
                          {entry.time} · {entry.actor} · {entry.tool}
                        </span>
                        <StatusPill
                          label={`${entry.approval} · ${entry.result}`}
                          tone={entry.result === "Succeeded" ? "success" : "neutral"}
                          dot={false}
                        />
                      </div>
                      <p className="mt-1 font-medium text-[#212d3d]">
                        {entry.action}
                      </p>
                      <p className="text-[#5a6675]">Data: {entry.dataShared}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="space-y-5 lg:col-span-5">
              <section className="space-y-3 rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5">
                <Eyebrow label="Endpoint Setup & Granular AI Scopes" />
                <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                  External AI Access Gates
                </h3>
                <input
                  id="mcp-endpoint-url"
                  name="mcpEndpointUrl"
                  aria-label="MCP Endpoint URL"
                  value={mcpEndpointDraft}
                  onChange={(e) => setMcpEndpointDraft(e.target.value)}
                  className="w-full rounded-[10px] border border-[#cfc2a5] bg-white px-3 py-2 font-mono text-[11.5px]"
                />
                <div className="space-y-2">
                  {externalApps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-[12px] border border-[#dfd4be] bg-white px-3.5 py-2 text-[12px]"
                    >
                      <div>
                        <p className="font-medium text-[#212d3d]">{app.feature}</p>
                        <p className="text-[11px] text-[#5a6675]">
                          {app.approvalRule}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExternalApp(app.id)}
                        className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium ${
                          app.enabled
                            ? "bg-[#212d3d] text-[#faf6ed]"
                            : "border border-[#dad6ca] text-[#5a6675]"
                        }`}
                      >
                        {app.enabled ? "Allowed" : "Locked"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-2 text-[12.5px] text-[#5a6675]">
                <h3 className="font-serif-display text-[19px] text-[#212d3d]">
                  MCP Setup &amp; Troubleshooting
                </h3>
                <p>
                  1. Review read-only vs confirm-first scopes in Connections
                  before connecting any external client.
                </p>
                <p>
                  2. If Calendar shows &ldquo;Not working&rdquo;, reconnect to
                  refresh your local token preview; Vex never fabricates
                  free/busy times offline.
                </p>
                <p>
                  3. Every tool call requiring sensitive profile info stays
                  behind an explicit confirmation gate.
                </p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </DashboardSubpageFrame>
  );
}
