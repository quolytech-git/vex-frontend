"use client";

import React, { useState } from "react";
import Link from "next/link";

interface MobilePhilosopherPillProps {
  name: string;
  role: string;
  image: string;
  quote: string;
  guidance: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function MobilePhilosopherPill({
  name,
  role,
  image,
  quote,
  guidance,
  actionLabel,
  actionHref,
  onAction,
}: MobilePhilosopherPillProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ios-card overflow-hidden p-3.5 lg:hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={image}
            alt={`${name} mentor portrait`}
            className="h-10 w-10 shrink-0 rounded-full border border-[#cfc2a5] object-cover object-top"
          />
          <div className="min-w-0">
            <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[#7a6b4e]">
              {name} · {role}
            </p>
            <p className="line-clamp-2 text-[12.5px] leading-snug font-medium text-[#212d3d]">
              {quote}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#f2eee2] px-2.5 py-1 font-mono text-[10px] font-medium text-[#212d3d]">
          {expanded ? "Hide" : "Insight"}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2.5 border-t border-[#e5dac2] pt-3 text-[12.5px] leading-relaxed text-[#5a6675]">
          <p className="text-[#212d3d]">{guidance}</p>
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className="inline-flex min-h-[38px] items-center rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
            >
              {actionLabel}
            </Link>
          )}
          {actionLabel && onAction && !actionHref && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex min-h-[38px] cursor-pointer items-center rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
