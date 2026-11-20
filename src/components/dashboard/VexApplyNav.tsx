"use client";

import React from "react";
import Link from "next/link";

export type VexApplyTab =
  | "overview"
  | "download"
  | "install"
  | "tutorial"
  | "settings"
  | "review";

export default function VexApplyNav({
  active,
  sessionId = "app-1",
}: {
  active: VexApplyTab;
  sessionId?: string;
}) {
  const items: { id: VexApplyTab; label: string; href: string }[] = [
    { id: "overview", label: "01 · Overview & Mapping", href: "/dashboard/apply" },
    { id: "download", label: "02 · Package & Download", href: "/dashboard/apply/download" },
    { id: "install", label: "03 · Install Guide", href: "/dashboard/apply/install" },
    { id: "tutorial", label: "04 · Workflow Tutorial", href: "/dashboard/apply/tutorial" },
    { id: "settings", label: "05 · Extension Settings", href: "/dashboard/apply/settings" },
    {
      id: "review",
      label: "06 · Application Review",
      href: `/dashboard/apply/review/${sessionId}`,
    },
  ];

  return (
    <nav
      aria-label="Vex Apply Chrome Extension sections"
      className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#d6cbb2] bg-[#fffef9] px-4 py-2.5"
    >
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-medium transition-colors ${
              active === item.id
                ? "bg-[#212d3d] text-[#faf6ed]"
                : "border border-[#e3dac5] bg-[#faf6ed] text-[#212d3d] hover:border-[#212d3d]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#7a6b4e]">
        Desktop Chrome Only
      </span>
    </nav>
  );
}
