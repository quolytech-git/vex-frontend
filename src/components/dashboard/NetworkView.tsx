"use client";

import { useVexWorkspace } from "@/lib/vex-store";
import { useQuickAction, focusField } from "@/lib/quick-actions";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  INITIAL_COMPANY_INTEL,
  type NetworkContact,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { StatusPill } from "./StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

interface NetworkViewProps {
  contacts: NetworkContact[];
  onAddContact: (contact: NetworkContact) => void;
}

type NetworkTab = "all" | "warm" | "pinned" | "companies";
type ArtworkKey = "athens" | "stoa";
type SortKey = "followup" | "company" | "pinned";

interface FrescoOption {
  key: ArtworkKey;
  src: string;
  label: string;
  era: string;
  caption: string;
  quote: string;
}

const FRESCO_GALLERY: Record<ArtworkKey, FrescoOption> = {
  athens: {
    key: "athens",
    src: "/images/network-academy-arch.jpg",
    label: "School of Athens · Adapted",
    era: "Raphael · Adapted for Vex",
    caption: "Plato & Aristotle on the central axis — strategic vision paired with execution.",
    quote: "First principles open doors faster than cold volume.",
  },
  stoa: {
    key: "stoa",
    src: "/images/network-stoa-council.jpg",
    label: "Academy Stoa · Companion",
    era: "Companion Fresco · Guild Council",
    caption: "Mentors and builders inspecting plans beside an astrolabe before outreach.",
    quote: "Every warm referral is built on verifiable craft and shared rigor.",
  },
};

export default function NetworkView({
  contacts,
  onAddContact,
}: NetworkViewProps) {
  const { applications } = useVexWorkspace();
  const [activeTab, setActiveTab] = useState<NetworkTab>("all");
  const [artwork, setArtwork] = useState<ArtworkKey>("athens");
  const [sortBy, setSortBy] = useState<SortKey>("pinned");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  useQuickAction("add-contact", () => {
    setComposerOpen(true);
    window.setTimeout(() => focusField("main form input, main input[placeholder*='ame']"), 150);
  });

  // Interactive per-contact micro-actions
  const [pinnedIds, setPinnedIds] = useState<Record<string, boolean>>({
    "nc-1": true,
  });
  const [loggedIds, setLoggedIds] = useState<Record<string, string>>({});
  const [draftOpenId, setDraftOpenId] = useState<string | null>(null);
  const [draftTexts, setDraftTexts] = useState<Record<string, string>>({});
  const [sentIds, setSentIds] = useState<Record<string, boolean>>({});
  const [watchedCompanies, setWatchedCompanies] = useState<
    Record<string, boolean>
  >({
    "co-1": true,
  });

  // Top action toolbar feedback states
  const [pitchCopied, setPitchCopied] = useState(false);
  const [inboxSynced, setInboxSynced] = useState(true);
  const [followUpBanner, setFollowUpBanner] = useState<string | null>(null);

  // Inline composer fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [referralPath, setReferralPath] = useState("Warm intro");
  const [note, setNote] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;
    onAddContact({
      id: `nc-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Hiring Contact",
      company: company.trim(),
      linkedApplication: "Active Target Pipeline",
      nextFollowUp: "In 3 days",
      referralPath: referralPath.trim() || "Added manually",
      note: note.trim() || "Track polite follow-up after submission.",
    });
    setName("");
    setRole("");
    setCompany("");
    setNote("");
    setComposerOpen(false);
    setActiveTab("all");
  }

  function handleCopyGlobalPitch() {
    const template =
      "Hi [Name], I noticed your team's recent work at [Company] and just prepared an application for the open role. I put together a short 2-minute rollout summary and would value any candid perspective on team priorities.";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(template).catch(() => {});
    }
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2000);
  }

  function handleQueueTodayFollowUps() {
    const first = contacts[0];
    setFollowUpBanner(
      first
        ? `Prepared polite follow-up reminders for ${contacts.length} contacts (next: ${first.name} at ${first.company}).`
        : "No pending follow-ups to queue."
    );
    setTimeout(() => setFollowUpBanner(null), 4000);
  }

  function togglePin(id: string) {
    setPinnedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function logTouchpoint(c: NetworkContact) {
    setLoggedIds((prev) => ({ ...prev, [c.id]: "Logged today · +7d" }));
  }

  function openDraft(c: NetworkContact) {
    setDraftTexts((prev) => ({
      ...prev,
      [c.id]:
        prev[c.id] ??
        `Hi ${c.name.split(" ")[0]}, following up briefly on ${c.linkedApplication} at ${c.company}. Happy to share my relevant build metrics whenever convenient.`,
    }));
    setDraftOpenId((cur) => (cur === c.id ? null : c.id));
  }

  function copyContactDraft(id: string) {
    const text = draftTexts[id];
    if (text && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setSentIds((prev) => ({ ...prev, [id]: true }));
  }

  const filteredContacts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = contacts.filter((c) => {
      if (activeTab === "warm") {
        const path = c.referralPath.toLowerCase();
        if (
          !path.includes("warm") &&
          !path.includes("alumni") &&
          !path.includes("direct")
        ) {
          return false;
        }
      }
      if (activeTab === "pinned" && !pinnedIds[c.id]) {
        return false;
      }
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.referralPath.toLowerCase().includes(q)
      );
    });

    if (sortBy === "company") {
      list = [...list].sort((a, b) => a.company.localeCompare(b.company));
    } else if (sortBy === "pinned") {
      list = [...list].sort(
        (a, b) => Number(Boolean(pinnedIds[b.id])) - Number(Boolean(pinnedIds[a.id]))
      );
    }
    return list;
  }, [contacts, activeTab, pinnedIds, query, sortBy]);

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INITIAL_COMPANY_INTEL;
    return INITIAL_COMPANY_INTEL.filter(
      (co) =>
        co.name.toLowerCase().includes(q) ||
        co.sector.toLowerCase().includes(q) ||
        co.headquarters.toLowerCase().includes(q)
    );
  }, [query]);

  const activeFresco = FRESCO_GALLERY[artwork];
  const warmCount = contacts.filter((c) => {
    const p = c.referralPath.toLowerCase();
    return p.includes("warm") || p.includes("alumni") || p.includes("direct");
  }).length;
  const pinnedCount = contacts.filter((c) => pinnedIds[c.id]).length;

  return (
    <div className="space-y-5">
      {/* CARD 1: SIMPLIFIED HERO STUDIO + ADAPTED CLASSICAL ARCH GALLERY */}
      <section className="overflow-hidden rounded-[26px] border border-[#dcd2bd] bg-[#faf6ed]">
        <div className="grid grid-cols-1 items-center gap-6 p-5 sm:p-7 lg:grid-cols-12">
          {/* Left: Clean Editorial Copy + Interactive Action Buttons */}
          <div className="space-y-5 lg:col-span-7">
            <MobilePhilosopherPill
              name="Plato"
              role="Stoa Council"
              image={activeFresco.src}
              quote={activeFresco.quote}
              guidance={`${contacts.length} warm contacts · ${INITIAL_COMPANY_INTEL.length} target companies tracked cleanly.`}
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="The Academy · Network & Council" />
                <StatusPill
                  label={`${contacts.length} Contacts · ${INITIAL_COMPANY_INTEL.length} Companies`}
                  tone="navy"
                  dot={false}
                />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3.1vw,2.75rem)] leading-[1.04] tracking-[-0.025em] text-[#212d3d]">
                The Council &amp;{" "}
                <span className="italic text-[#5a6675]">Warm Paths.</span>
              </h1>
              <p className="max-w-[58ch] text-[13.5px] leading-relaxed text-[#5a6675]">
                Fewer menus, clearer momentum. Keep every hiring manager, warm
                alumni intro, and employer brief in one calm architectural index.
              </p>
            </div>

            {/* Cool Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setComposerOpen((v) => !v);
                  if (activeTab === "companies") setActiveTab("all");
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#212d3d] px-4 py-2 text-[12.5px] font-medium text-[#faf6ed] transition-all hover:bg-[#314158] active:scale-[0.98]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {composerOpen ? "Close Composer" : "Add Contact"}
              </button>

              <button
                type="button"
                onClick={handleCopyGlobalPitch}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all active:scale-[0.98] ${
                  pitchCopied
                    ? "border-[#067647] bg-[#067647] text-white"
                    : "border-[#cfc5ae] bg-white text-[#212d3d] hover:border-[#212d3d]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {pitchCopied ? "Pitch Copied" : "Copy Intro Pitch"}
              </button>

              <button
                type="button"
                onClick={handleQueueTodayFollowUps}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#cfc5ae] bg-white px-4 py-2 text-[12.5px] font-medium text-[#212d3d] transition-all hover:border-[#212d3d] active:scale-[0.98]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                Queue Follow-Ups
              </button>

              <button
                type="button"
                onClick={() => setInboxSynced((s) => !s)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all ${
                  inboxSynced
                    ? "border-[#4b6f54]/40 bg-[#4b6f54]/10 text-[#234d30]"
                    : "border-[#dad6ca] bg-[#f2eee2] text-[#5a6675]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    inboxSynced ? "bg-[#067647]" : "bg-[#8d8473]"
                  }`}
                />
                {inboxSynced ? "Signal Sync: Live" : "Signal Sync: Paused"}
              </button>
            </div>

            {followUpBanner && (
              <div className="rounded-[12px] border border-[#067647]/30 bg-[#067647]/10 px-3.5 py-2 text-[12.5px] text-[#067647]">
                {followUpBanner}
              </div>
            )}

            {/* Mode Switcher Tabs (replaces stacked card walls with 1 clean switcher) */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-[16px] border border-[#e3dac5] bg-[#f2ece0] p-1.5">
              {(
                [
                  { id: "all", label: `All Contacts (${contacts.length})` },
                  { id: "warm", label: `Warm Intros (${warmCount})` },
                  { id: "pinned", label: `Pinned Council (${pinnedCount})` },
                  {
                    id: "companies",
                    label: `Company Briefs (${INITIAL_COMPANY_INTEL.length})`,
                  },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer rounded-[11px] px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                      active
                        ? "bg-[#212d3d] text-[#faf6ed] shadow-sm"
                        : "text-[#5a6675] hover:bg-white/70 hover:text-[#212d3d]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Arched Dual-Artwork Classical Showcase (Desktop Only) */}
          <div className="hidden flex-col items-center gap-3 lg:col-span-5 lg:flex">
            <div className="relative w-full max-w-[330px] overflow-hidden rounded-t-[165px] rounded-b-[20px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-[0_14px_34px_rgba(33,45,61,0.1)]">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={activeFresco.src}
                  alt={activeFresco.label}
                  className="h-full w-full object-cover object-center transition-opacity duration-300"
                />
              </div>
              <div className="border-t border-[#d8cbb0] bg-[#fffef9]/95 px-4 py-2.5">
                <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.13em] text-[#7a6b4e]">
                  {activeFresco.era}
                </p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[#212d3d]">
                  {activeFresco.quote}
                </p>
              </div>
            </div>

            {/* Interactive Artwork Switcher Buttons (Toggle between Adapted & Companion Generated Fresco) */}
            <div className="flex w-full max-w-[330px] items-center gap-2">
              {(["athens", "stoa"] as const).map((key) => {
                const item = FRESCO_GALLERY[key];
                const isSelected = artwork === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setArtwork(key)}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-[14px] border p-1.5 text-left transition-all ${
                      isSelected
                        ? "border-[#212d3d] bg-white shadow-sm"
                        : "border-[#dfd4be] bg-[#f4ede0] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      className="h-9 w-9 shrink-0 rounded-[9px] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-[#212d3d]">
                        {key === "athens" ? "School of Athens" : "Stoa Council"}
                      </p>
                      <p className="font-mono text-[9.5px] text-[#6d6250]">
                        {key === "athens" ? "Adapted" : "Generated"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2: SINGLE UNIFIED WORKSPACE PANEL (Clean Index Rows, No Card Clutter) */}
      <section className="overflow-hidden rounded-[24px] border border-[#dad6ca] bg-[#fffef9]">
        {/* Toolbar Bar */}
        <div className="flex flex-col justify-between gap-3 border-b border-[#ece5d5] bg-[#faf6ed]/70 px-5 py-3.5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <input id="networkview-input-1" name="networkview-input-1" aria-label="networkview input 1"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === "companies"
                  ? "Search companies, sector, or location..."
                  : "Search contact name, company, or referral path..."
              }
              className="w-full max-w-[360px] rounded-full border border-[#d6cbb2] bg-white px-4 py-1.5 text-[12.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Clear
              </button>
            )}
          </div>

          {activeTab !== "companies" && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7a6b4e]">
                Order:
              </span>
              {(
                [
                  { id: "pinned", label: "Pinned First" },
                  { id: "company", label: "Company A-Z" },
                  { id: "followup", label: "Default" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortBy(s.id)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                    sortBy === s.id
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dfd6c3] bg-white text-[#5a6675] hover:text-[#212d3d]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Inline Contact Composer */}
        {composerOpen && (
          <form
            onSubmit={handleAdd}
            className="border-b border-[#ece5d5] bg-[#f5efe2] px-5 py-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#5a6675]">
                New Recruiter or Warm Intro
              </p>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="cursor-pointer text-[12px] font-medium text-[#5a6675] hover:text-[#212d3d]"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
              <input id="networkview-input-2" name="networkview-input-2" aria-label="networkview input 2"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact name *"
                className="rounded-[12px] border border-[#dad6ca] bg-white px-3 py-2 text-[12.5px] focus:border-[#212d3d] focus:outline-none"
              />
              <input id="networkview-input-3" name="networkview-input-3" aria-label="networkview input 3"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role (e.g. Staff Eng)"
                className="rounded-[12px] border border-[#dad6ca] bg-white px-3 py-2 text-[12.5px] focus:border-[#212d3d] focus:outline-none"
              />
              <input id="networkview-input-4" name="networkview-input-4" aria-label="networkview input 4"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company *"
                className="rounded-[12px] border border-[#dad6ca] bg-white px-3 py-2 text-[12.5px] focus:border-[#212d3d] focus:outline-none"
              />
              <select id="networkview-select-5" name="networkview-select-5" aria-label="networkview select 5"
                value={referralPath}
                onChange={(e) => setReferralPath(e.target.value)}
                className="cursor-pointer rounded-[12px] border border-[#dad6ca] bg-white px-3 py-2 text-[12.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="Warm intro">Warm intro</option>
                <option value="2nd-degree Alumni Network">
                  2nd-degree Alumni
                </option>
                <option value="Direct recruiter thread">
                  Direct recruiter thread
                </option>
                <option value="Added manually">Added manually</option>
              </select>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input id="networkview-input-6" name="networkview-input-6" aria-label="networkview input 6"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Follow-up context or mutual topic..."
                className="flex-1 rounded-[12px] border border-[#dad6ca] bg-white px-3 py-2 text-[12.5px] focus:border-[#212d3d] focus:outline-none"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
              >
                Save to Network
              </button>
            </div>
          </form>
        )}

        {/* CONTENT MODE A: CONTACTS CLEAN INDEX ROWS */}
        {activeTab !== "companies" && (
          <div className="divide-y divide-[#ece5d5]">
            {filteredContacts.length === 0 ? (
              <div className="px-6 py-10 text-center space-y-3">
                <p className="font-serif-display text-[20px] text-[#212d3d]">
                  No matching contacts in this view.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("all");
                      setQuery("");
                    }}
                    className="cursor-pointer rounded-full border border-[#cfc5ae] bg-[#faf6ed] px-4 py-1.5 text-[12px] font-medium text-[#212d3d]"
                  >
                    Show All Contacts
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                  >
                    + Add Contact
                  </button>
                </div>
              </div>
            ) : (
              filteredContacts.map((c) => {
                const isPinned = Boolean(pinnedIds[c.id]);
                const followUpLabel = loggedIds[c.id] ?? c.nextFollowUp;
                const isDraftOpen = draftOpenId === c.id;
                const isSent = Boolean(sentIds[c.id]);

                return (
                  <div
                    key={c.id}
                    className="px-5 py-4 transition-colors hover:bg-[#faf6ed]/70"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-medium text-[#212d3d]">
                            {c.name}
                          </p>
                          <span className="text-[12.5px] text-[#5a6675]">
                            {c.role} ·{" "}
                            <strong className="font-medium text-[#212d3d]">
                              {c.company}
                            </strong>
                          </span>
                          <StatusPill
                            label={c.referralPath}
                            tone="info"
                            dot={false}
                          />
                          {isPinned && (
                            <StatusPill label="Pinned" tone="navy" dot={false} />
                          )}
                        </div>
                        <p className="text-[12.5px] text-[#5a6675]">
                          {c.note} ·{" "}
                          {(() => {
                            const app = applications.find(
                              (a) =>
                                a.company.toLowerCase() === c.company.toLowerCase() ||
                                c.linkedApplication.toLowerCase().includes(a.title.toLowerCase())
                            );
                            return app ? (
                              <Link
                                href={`/dashboard/applications/${app.id}`}
                                className="font-mono text-[11px] font-semibold text-[#212d3d] underline underline-offset-2"
                              >
                                Application: {app.title} ›
                              </Link>
                            ) : (
                              <span className="font-mono text-[11px] text-[#7a6b4e]">
                                Role: {c.linkedApplication}
                              </span>
                            );
                          })()}
                        </p>
                      </div>

                      {/* Cool Interactive Per-Row Buttons */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <StatusPill
                          label={followUpLabel}
                          tone={loggedIds[c.id] ? "success" : "neutral"}
                          dot={false}
                        />
                        <button
                          type="button"
                          onClick={() => togglePin(c.id)}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${
                            isPinned
                              ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                              : "border-[#d8ceb9] bg-white text-[#212d3d] hover:border-[#212d3d]"
                          }`}
                        >
                          {isPinned ? "Pinned" : "Pin"}
                        </button>
                        <button
                          type="button"
                          onClick={() => logTouchpoint(c)}
                          className="cursor-pointer rounded-full border border-[#d8ceb9] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d] transition-colors hover:border-[#067647] hover:text-[#067647]"
                        >
                          {loggedIds[c.id] ? "Touched" : "Log Touch"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openDraft(c)}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${
                            isDraftOpen
                              ? "border-[#175cd3] bg-[#175cd3] text-white"
                              : "border-[#d8ceb9] bg-[#faf6ed] text-[#212d3d] hover:border-[#212d3d]"
                          }`}
                        >
                          {isDraftOpen ? "Hide Draft" : "Draft Intro"}
                        </button>
                        <Link
                          href={`/dashboard/network/contacts/${c.id}`}
                          className="rounded-full border border-[#d8ceb9] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                        >
                          Dossier -&gt;
                        </Link>
                      </div>
                    </div>

                    {/* Inline Expandable Quick-Send Note */}
                    {isDraftOpen && (
                      <div className="mt-3 flex flex-col gap-2 rounded-[14px] border border-[#dcd2bd] bg-[#faf6ed] p-3 sm:flex-row sm:items-center">
                        <input id="networkview-input-7" name="networkview-input-7" aria-label="networkview input 7"
                          value={draftTexts[c.id] ?? ""}
                          onChange={(e) =>
                            setDraftTexts((prev) => ({
                              ...prev,
                              [c.id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-[10px] border border-[#dad6ca] bg-white px-3 py-1.5 text-[12.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => copyContactDraft(c.id)}
                          className={`cursor-pointer rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
                            isSent
                              ? "bg-[#067647] text-white"
                              : "bg-[#212d3d] text-[#faf6ed] hover:bg-[#314158]"
                          }`}
                        >
                          {isSent ? "Copied & Logged" : "Copy Note"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* CONTENT MODE B: COMPANY INTELLIGENCE CLEAN INDEX ROWS */}
        {activeTab === "companies" && (
          <div className="divide-y divide-[#ece5d5]">
            {filteredCompanies.map((co) => {
              const watched = Boolean(watchedCompanies[co.id]);
              return (
                <div
                  key={co.id}
                  className="flex flex-col justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#faf6ed]/70 md:flex-row md:items-center"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-medium text-[#212d3d]">
                        {co.name}
                      </p>
                      <StatusPill
                        label={`${co.openMatchedRoles} matched roles`}
                        tone="success"
                        dot={false}
                      />
                      <span className="font-mono text-[11px] text-[#7a6b4e]">
                        {co.salaryRange}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#5a6675]">
                      {co.sector} · {co.size} · {co.headquarters}
                    </p>
                    <p className="text-[12.5px] text-[#212d3d]">
                      <strong className="font-medium">Hiring Velocity:</strong>{" "}
                      {co.hiringVelocity} — {co.cultureSignals}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setWatchedCompanies((prev) => ({
                          ...prev,
                          [co.id]: !prev[co.id],
                        }))
                      }
                      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                        watched
                          ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                          : "border-[#d8ceb9] bg-white text-[#212d3d] hover:border-[#212d3d]"
                      }`}
                    >
                      {watched ? "Watching" : "+ Watch"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCompany(co.name);
                        setComposerOpen(true);
                        setActiveTab("all");
                      }}
                      className="cursor-pointer rounded-full border border-[#d8ceb9] bg-[#faf6ed] px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                    >
                      + Add Contact Here
                    </button>
                    <Link
                      href={`/dashboard/companies/${co.id}`}
                      className="rounded-full border border-[#212d3d]/25 bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                    >
                      Athena Intel -&gt;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
