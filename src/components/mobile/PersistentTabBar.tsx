"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DashboardSectionId } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import MobileTabBar, { type PrimaryMobileTab } from "./MobileTabBar";

/* ------------------------------------------------------------------ */
/*  One tab bar for the whole dashboard, mounted once in the dashboard */
/*  layout so it never disappears or re-animates when pages change.    */
/*                                                                      */
/*  - On /dashboard it asks the shell to switch section (instant).     */
/*  - On sub-pages it routes back to /dashboard?section=…              */
/*  The shell announces its current section with "vex:section".        */
/* ------------------------------------------------------------------ */

export const SECTION_EVENT = "vex:section";
export const GOTO_SECTION_EVENT = "vex:goto-section";

const PRIMARY: PrimaryMobileTab[] = ["overview", "jobs", "applications", "learning", "profile"];

// Which tab a sub-page belongs to.
function tabForPath(path: string): PrimaryMobileTab | "other" {
  if (path.startsWith("/dashboard/jobs")) return "jobs";
  if (
    path.startsWith("/dashboard/applications") ||
    path.startsWith("/dashboard/apply") ||
    path.startsWith("/dashboard/extension")
  )
    return "applications";
  if (path.startsWith("/dashboard/learning")) return "learning";
  if (path.startsWith("/dashboard/intelligence")) return "overview";
  return "other";
}

export function announceSection(section: DashboardSectionId) {
  window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: section }));
}

export default function PersistentTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { jobs, hiddenJobIds, applications } = useVexWorkspace();
  const [section, setSection] = useState<DashboardSectionId>("overview");

  useEffect(() => {
    const onSection = (e: Event) => setSection((e as CustomEvent<DashboardSectionId>).detail);
    window.addEventListener(SECTION_EVENT, onSection);
    return () => window.removeEventListener(SECTION_EVENT, onSection);
  }, []);

  const onRoot = pathname === "/dashboard";
  const active: PrimaryMobileTab | "other" = onRoot
    ? PRIMARY.includes(section as PrimaryMobileTab)
      ? (section as PrimaryMobileTab)
      : "other"
    : tabForPath(pathname);

  function select(next: DashboardSectionId) {
    if (onRoot) {
      window.dispatchEvent(new CustomEvent(GOTO_SECTION_EVENT, { detail: next }));
    } else {
      router.push(`/dashboard?section=${next}`);
    }
  }

  return (
    <MobileTabBar
      activeTab={active}
      onSelectSection={select}
      jobsCount={jobs.filter((j) => !hiddenJobIds.includes(j.id)).length}
      appsCount={applications.length}
    />
  );
}
