"use client";

import React, { useMemo, useState } from "react";
import type { AlertItem, DashboardSectionId } from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon } from "@/components/Icons";
import { StatusPill } from "./StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

interface AlertsViewProps {
  alerts: AlertItem[];
  onDismissAlert: (id: string) => void;
  onNavigate: (section: DashboardSectionId) => void;
}

const PRESET_DESCRIPTIONS: Record<
  "Essential" | "Standard" | "Everything",
  string
> = {
  Essential:
    "Hermes delivers urgent deadlines and direct recruiter panel confirmations only.",
  Standard:
    "Includes deadlines, recruiter replies, and 7-day quiet follow-up nudges.",
  Everything:
    "Full Herald Ledger: deadlines, recruiter messages, matches, and system logs.",
};

export default function AlertsView({
  alerts,
  onDismissAlert,
  onNavigate,
}: AlertsViewProps) {
  const [alertPreset, setAlertPreset] = useState<
    "Essential" | "Standard" | "Everything"
  >("Standard");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [quietShield, setQuietShield] = useState(false);
  const [snoozedIds, setSnoozedIds] = useState<Record<string, boolean>>({});
  const [viewSnoozed, setViewSnoozed] = useState(false);
  const [customNotes, setCustomNotes] = useState<AlertItem[]>([]);
  const [addingNote, setAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteCategory, setNoteCategory] = useState<AlertItem["category"]>("Deadline");
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState("22:00 – 08:00");
  const [pushStatus, setPushStatus] = useState("Push: Browser default");

  const combinedAlerts = useMemo(
    () => [...customNotes, ...alerts],
    [customNotes, alerts]
  );

  const visibleAlerts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return combinedAlerts.filter((a) => {
      if (a.dismissed) return false;
      const isSnoozed = Boolean(snoozedIds[a.id]);
      if (viewSnoozed && !isSnoozed) return false;
      if (!viewSnoozed && isSnoozed) return false;

      if (quietShield && a.category === "System") return false;
      if (
        alertPreset === "Essential" &&
        a.category !== "Deadline" &&
        a.category !== "Recruiter" &&
        categoryFilter === "All"
      ) {
        return false;
      }

      if (categoryFilter !== "All" && a.category !== categoryFilter) {
        return false;
      }

      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q)
      );
    });
  }, [
    combinedAlerts,
    snoozedIds,
    viewSnoozed,
    quietShield,
    alertPreset,
    categoryFilter,
    query,
  ]);

  const todayCount = combinedAlerts.filter(
    (a) => !a.dismissed && !snoozedIds[a.id] && a.group === "Today"
  ).length;
  const deadlineCount = combinedAlerts.filter(
    (a) => !a.dismissed && !snoozedIds[a.id] && a.category === "Deadline"
  ).length;
  const recruiterCount = combinedAlerts.filter(
    (a) => !a.dismissed && !snoozedIds[a.id] && a.category === "Recruiter"
  ).length;
  const snoozedCount = combinedAlerts.filter(
    (a) => !a.dismissed && snoozedIds[a.id]
  ).length;

  function toggleSnooze(id: string) {
    setSnoozedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleAddDispatch(e: React.FormEvent) {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    setCustomNotes((prev) => [
      {
        id: `al-custom-${Date.now()}`,
        group: "Today",
        category: noteCategory,
        title: noteTitle.trim(),
        detail: "Pinned by you to the Hermes Dispatch Ledger.",
        actionLabel:
          noteCategory === "Recruiter"
            ? "Open Network"
            : noteCategory === "Deadline"
            ? "Open Tracker"
            : "Review Jobs",
        targetSection:
          noteCategory === "Recruiter"
            ? "network"
            : noteCategory === "Deadline"
            ? "applications"
            : "jobs",
        dismissed: false,
      },
      ...prev,
    ]);
    setNoteTitle("");
    setAddingNote(false);
    setViewSnoozed(false);
  }

  return (
    <div className="space-y-6">
      <MobilePhilosopherPill
        name="Hermes"
        role="Keeper of Kairos"
        image="/images/hermes-messenger-alerts.jpg"
        quote="Receive only the decisive message at the rightful hour."
        guidance={`Active rule: ${PRESET_DESCRIPTIONS[alertPreset]} Deadlines: ${deadlineCount} · Recruiters: ${recruiterCount}.`}
      />

      {/* SECTION 1: HERMES MESSENGER HERO + GATE CONTROLS */}
      <section className="rounded-[24px] border border-[#dcd2bd] bg-[#faf6ed] p-5 sm:p-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Left 8: Plain Summary & Hermes Controls */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow label="Herald of Olympus · Hermes Signal Gate" />
              <StatusPill label={`Today: ${todayCount}`} tone="navy" dot={false} />
              <StatusPill
                label={`Deadlines: ${deadlineCount}`}
                tone="warning"
                dot={false}
              />
              <StatusPill
                label={`Recruiters: ${recruiterCount}`}
                tone="success"
                dot={false}
              />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-serif-display text-[clamp(1.85rem,3vw,2.55rem)] leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                Hermes Dispatches &amp;{" "}
                <span className="italic text-[#5a6675]">Calm Radar.</span>
              </h1>
              <p className="max-w-[60ch] text-[13.5px] leading-relaxed text-[#5a6675]">
                In Greek myth, Hermes guards every threshold and delivers only
                urgent dispatches on time. Choose your signal preset, snooze
                low-priority reminders, or pin a personal deadline below.
              </p>
            </div>

            {/* Preset Switcher + Quick Herald Actions */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full border border-[#d6cbb2] bg-white p-1 text-[11.5px]">
                  <span className="px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a6b4e]">
                    Preset
                  </span>
                  {(["Essential", "Standard", "Everything"] as const).map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAlertPreset(preset)}
                        className={`cursor-pointer rounded-full px-3 py-1 font-medium transition-colors ${
                          alertPreset === preset
                            ? "bg-[#212d3d] text-[#faf6ed]"
                            : "text-[#5a6675] hover:text-[#212d3d]"
                        }`}
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setQuietShield((v) => !v)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                    quietShield
                      ? "border-[#067647] bg-[#067647] text-white"
                      : "border-[#d6cbb2] bg-white text-[#212d3d] hover:border-[#212d3d]"
                  }`}
                >
                  {quietShield ? "Quiet Shield: On" : "Quiet Shield: Off"}
                </button>

                <button
                  type="button"
                  onClick={() => setViewSnoozed((v) => !v)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                    viewSnoozed
                      ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                      : "border-[#d6cbb2] bg-white text-[#212d3d] hover:border-[#212d3d]"
                  }`}
                >
                  Snoozed ({snoozedCount})
                </button>

                <button
                  type="button"
                  onClick={() => setAddingNote((v) => !v)}
                  className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[11.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  {addingNote ? "Close" : "+ Pin Dispatch"}
                </button>
              </div>

              <p className="font-mono text-[11px] text-[#7a6b4e]">
                Active Rule: {PRESET_DESCRIPTIONS[alertPreset]}
                {quietShield ? " · System pings muted." : ""}
              </p>

              {/* Delivery Channels: Email Digest, Browser Push, Quiet Hours & Mark Read */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11.5px]">
                <button
                  type="button"
                  onClick={() => setEmailDigestEnabled((v) => !v)}
                  className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1 text-[#212d3d]"
                >
                  {emailDigestEnabled ? "Email Digest: Morning 08:30" : "Email Digest: Off"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && "Notification" in window) {
                      window.Notification.requestPermission()
                        .then((perm) => setPushStatus(`Push: ${perm}`))
                        .catch(() => setPushStatus("Push: Unsupported in context"));
                    } else {
                      setPushStatus("Push: Unsupported in browser");
                    }
                  }}
                  className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1 text-[#212d3d]"
                >
                  {pushStatus}
                </button>
                <select id="alertsview-select-1" name="alertsview-select-1" aria-label="alertsview select 1"
                  value={quietHours}
                  onChange={(e) => setQuietHours(e.target.value)}
                  className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1 text-[#212d3d]"
                >
                  <option value="22:00 – 08:00">Quiet hours: 22:00–08:00</option>
                  <option value="21:00 – 09:00">Quiet hours: 21:00–09:00</option>
                  <option value="Off">Quiet hours: Disabled</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    visibleAlerts.forEach((a) => {
                      all[a.id] = true;
                    });
                    setReadIds((p) => ({ ...p, ...all }));
                  }}
                  className="cursor-pointer rounded-full border border-[#212d3d]/25 bg-[#faf6ed] px-3 py-1 font-medium text-[#212d3d]"
                >
                  Mark visible read
                </button>
              </div>
            </div>
          </div>

          {/* Right 4: Arched Classical Hermes Portrait Card (Desktop Only) */}
          <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
            <div className="w-full max-w-[295px] overflow-hidden rounded-t-[145px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-[0_12px_28px_rgba(33,45,61,0.1)]">
              <div className="aspect-[4/4.2] w-full overflow-hidden">
                <img
                  src="/images/hermes-messenger-alerts.jpg"
                  alt="Hermes, Messenger of Olympus holding caduceus and sealed dispatch scroll"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.13em] text-[#7a6b4e]">
                  Hermes · Keeper of Kairos
                </p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[#212d3d]">
                  “Receive only the decisive message at the rightful hour.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SINGLE CLEAN HERMES DISPATCH LEDGER */}
      <section className="overflow-hidden rounded-[24px] border border-[#dad6ca] bg-[#fffef9]">
        {/* Toolbar: Category Filter + Quick Search */}
        <div className="flex flex-col justify-between gap-3 border-b border-[#ece5d5] bg-[#faf6ed]/80 px-5 py-3.5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-1.5">
            {["All", "Deadline", "Recruiter", "Follow-up", "System"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[12px] font-medium transition-colors ${
                    categoryFilter === cat
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dfd4be] bg-white text-[#212d3d] hover:border-[#212d3d]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <input id="alertsview-input-2" name="alertsview-input-2" aria-label="alertsview input 2"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter dispatches..."
            className="w-full max-w-[260px] rounded-full border border-[#d6cbb2] bg-white px-3.5 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
          />
        </div>

        {/* Collapsible Quick Pin Dispatch Form */}
        {addingNote && (
          <form
            onSubmit={handleAddDispatch}
            className="flex flex-col gap-2 border-b border-[#ece5d5] bg-[#f4efe3] px-5 py-3.5 sm:flex-row sm:items-center"
          >
            <select id="alertsview-select-3" name="alertsview-select-3" aria-label="alertsview select 3"
              value={noteCategory}
              onChange={(e) =>
                setNoteCategory(e.target.value as AlertItem["category"])
              }
              className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1.5 text-[12px] text-[#212d3d]"
            >
              <option value="Deadline">Deadline</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Follow-up">Follow-up</option>
            </select>
            <input id="alertsview-input-4" name="alertsview-input-4" aria-label="alertsview input 4"
              required
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Write a personal reminder (e.g. Follow up with Meridian recruiter Friday)..."
              className="flex-1 rounded-full border border-[#d6cbb2] bg-white px-4 py-1.5 text-[12.5px] text-[#212d3d]"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
            >
              Save Reminder
            </button>
          </form>
        )}

        {/* Crisp Divide-Y Dispatch Rows */}
        <div className="p-5 sm:p-6">
          {visibleAlerts.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-[#d6cbb2] bg-[#faf6ed] p-8 text-center space-y-2">
              <p className="font-serif-display text-[20px] text-[#212d3d]">
                {viewSnoozed
                  ? "No snoozed dispatches right now."
                  : "All dispatches cleared."}
              </p>
              <p className="text-[12.5px] text-[#5a6675]">
                {viewSnoozed
                  ? "Switch back to active alerts or snooze a low-priority item."
                  : "Hermes is standing watch. Switch preset to Standard/Everything or pin a custom reminder."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#ece5d5]">
              {[...visibleAlerts].sort((x, y) => (x.group === y.group ? 0 : x.group === "Today" ? -1 : 1)).map((al, idx, arr) => {
                const isSnoozed = Boolean(snoozedIds[al.id]);
                const isRead = Boolean(readIds[al.id]);
                const showGroup = idx === 0 || arr[idx - 1].group !== al.group;
                return (
                  <React.Fragment key={al.id}>
                  {showGroup && (
                    <p className="pt-4 pb-1 text-[10.5px] font-semibold tracking-[0.14em] text-[#7a705c] uppercase first:pt-0">
                      {al.group}
                    </p>
                  )}
                  <div
                    className={`flex flex-col justify-between gap-3 py-4 first:pt-1 last:pb-1 md:flex-row md:items-center ${
                      isRead ? "opacity-75" : ""
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill
                          label={isRead ? "Read" : "Unread"}
                          tone={isRead ? "neutral" : "info"}
                          dot={!isRead}
                        />
                        <StatusPill label={al.group} tone="neutral" dot={false} />
                        <StatusPill
                          label={al.category}
                          tone={
                            al.category === "Deadline"
                              ? "warning"
                              : al.category === "Recruiter"
                              ? "success"
                              : "info"
                          }
                          dot={false}
                        />
                        <p className="text-[14.5px] font-medium text-[#212d3d]">
                          {al.title}
                        </p>
                      </div>
                      <p className="text-[12.5px] text-[#5a6675]">{al.detail}</p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setReadIds((prev) => ({
                            ...prev,
                            [al.id]: !isRead,
                          }))
                        }
                        className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                      >
                        {isRead ? "Mark unread" : "Mark read"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReadIds((prev) => ({ ...prev, [al.id]: true }));
                          onNavigate(al.targetSection);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                      >
                        <span>{al.actionLabel}</span>
                        <ArrowRightIcon className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSnooze(al.id)}
                        className="cursor-pointer rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                      >
                        {isSnoozed ? "Wake Now" : "Snooze 24h"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (al.id.startsWith("al-custom-")) {
                            setCustomNotes((prev) =>
                              prev.filter((item) => item.id !== al.id)
                            );
                          } else {
                            onDismissAlert(al.id);
                          }
                        }}
                        className="cursor-pointer rounded-full border border-[#dfd4be] bg-white px-3 py-1.5 text-[11.5px] text-[#5a6675] hover:text-[#212d3d]"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Bottom Boundary Protocol Strip */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#ece5d5] pt-3.5 text-[11.5px] text-[#5a6675]">
            <span>
              <strong className="font-medium text-[#067647]">
                Passed by Hermes:
              </strong>{" "}
              Deadlines ≤ 3 days · Recruiter interview threads · Verified proof drops
            </span>
            <span>
              <strong className="font-medium text-[#212d3d]">
                Silenced Noise:
              </strong>{" "}
              Generic digests · Stale expired feeds
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
