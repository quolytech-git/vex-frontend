"use client";

import React from "react";
import type { FitBand, SkillEvidenceTier, SubmissionState } from "@/data/dashboard";

type BadgeTone =
  | "navy"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  navy: "bg-[#212d3d] text-[#faf6ed] border-[#212d3d]",
  success: "bg-[#067647]/10 text-[#067647] border-[#067647]/25",
  warning: "bg-[#b54708]/10 text-[#b54708] border-[#b54708]/25",
  error: "bg-[#b42318]/10 text-[#b42318] border-[#b42318]/25",
  info: "bg-[#175cd3]/10 text-[#175cd3] border-[#175cd3]/25",
  neutral: "bg-[#ece9df] text-[#212d3d] border-[#dad6ca]",
};

export function StatusPill({
  label,
  tone = "neutral",
  dot = true,
}: {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium leading-snug tracking-[-0.01em] ${TONE_CLASSES[tone]}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current opacity-85"
        />
      )}
      <span>{label}</span>
    </span>
  );
}

export function SubmissionStateBadge({ state }: { state: SubmissionState }) {
  if (state === "verified-submitted") {
    return <StatusPill label="Verified submitted" tone="navy" />;
  }
  if (state === "user-reported-submitted") {
    return <StatusPill label="User-reported submitted" tone="info" />;
  }
  return <StatusPill label="Prepared (not submitted)" tone="warning" />;
}

export function SkillTierBadge({ tier }: { tier: SkillEvidenceTier }) {
  switch (tier) {
    case "Verified credential":
      return <StatusPill label="Verified credential" tone="info" />;
    case "Demonstrated in Vex":
      return <StatusPill label="Demonstrated in Vex" tone="navy" />;
    case "CV-derived":
      return <StatusPill label="CV-derived" tone="warning" />;
    case "Self-reported":
    default:
      return <StatusPill label="Self-reported (estimate)" tone="neutral" />;
  }
}

export function FitBandBadge({ band }: { band: FitBand }) {
  if (band === "Strong fit") {
    return <StatusPill label="Strong fit" tone="success" />;
  }
  if (band === "Good fit") {
    return <StatusPill label="Good fit" tone="info" />;
  }
  return <StatusPill label="Partial gap" tone="warning" />;
}

