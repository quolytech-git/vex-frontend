import React from "react";
import Eyebrow from "./Eyebrow";
import PalladioButton from "./PalladioButton";
import Reveal from "./Reveal";

interface SectionHeadProps {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  ctaLabel?: string;
  ctaHref?: string;
  tone?: "light" | "dark";
  layout?: "split" | "stacked";
}

export default function SectionHead({
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaHref,
  tone = "light",
  layout = "split",
}: SectionHeadProps) {
  const isDark = tone === "dark";

  if (layout === "stacked") {
    return (
      <Reveal className="flex flex-col items-start gap-5">
        <Eyebrow label={eyebrow} tone={tone} />
        <h2
          className={`font-serif-display text-[clamp(2.5rem,4.1vw,3.95rem)] font-normal leading-[1.04] tracking-[-0.025em] ${
            isDark ? "text-[#faf6ed]" : "text-[#212d3d]"
          }`}
        >
          {title}
        </h2>
        <p
          className={`max-w-[44ch] font-serif-display text-[19px] leading-[1.38] ${
            isDark ? "text-[#faf6ed]/80" : "text-[#5a6675]"
          }`}
        >
          {lead}
        </p>
        {ctaLabel && ctaHref ? (
          <div className="pt-2">
            <PalladioButton
              label={ctaLabel}
              href={ctaHref}
              variant={isDark ? "onDark" : "primary"}
            />
          </div>
        ) : null}
      </Reveal>
    );
  }

  return (
    <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
      <div className="flex flex-col items-start gap-4 lg:col-span-7">
        <Eyebrow label={eyebrow} tone={tone} />
        <h2
          className={`font-serif-display text-[clamp(2.65rem,4.3vw,4rem)] font-normal leading-[1.03] tracking-[-0.03em] ${
            isDark ? "text-[#faf6ed]" : "text-[#212d3d]"
          }`}
        >
          {title}
        </h2>
      </div>

      <div className="flex flex-col items-start justify-end gap-5 lg:col-span-5 lg:items-start">
        <p
          className={`max-w-[42ch] font-serif-display text-[19.5px] leading-[1.34] ${
            isDark ? "text-[#faf6ed]/80" : "text-[#5a6675]"
          }`}
        >
          {lead}
        </p>
        {ctaLabel && ctaHref ? (
          <PalladioButton
            label={ctaLabel}
            href={ctaHref}
            variant={isDark ? "onDark" : "primary"}
          />
        ) : null}
      </div>
    </Reveal>
  );
}
