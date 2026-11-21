"use client";

/**
 * First-day analytics, stored only on this device (no network).
 * A backend can later read the same event names and send them to a server.
 */

export type VexEvent =
  | "section_viewed"
  | "next_action_clicked"
  | "quick_action_used"
  | "job_refreshed"
  | "cv_edit_decided"
  | "application_prepared"
  | "interview_practised"
  | "tool_connected"
  | "plan_changed";

export interface VexEventRecord {
  name: VexEvent;
  detail?: string;
  at: string; // ISO time
}

const KEY = "vex_first_day_events";
const MAX = 200;

export function logEvent(name: VexEvent, detail?: string) {
  if (typeof window === "undefined") return;
  try {
    const list: VexEventRecord[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    list.unshift({ name, detail, at: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new Event("vex:analytics"));
  } catch {
    /* storage blocked — analytics are optional */
  }
}

export function readEvents(): VexEventRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearEvents() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("vex:analytics"));
  } catch {
    /* ignore */
  }
}
