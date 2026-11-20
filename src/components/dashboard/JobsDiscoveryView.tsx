"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useVexWorkspace } from "@/lib/vex-store";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  type DashboardJob,
  type DashboardSectionId,
  INITIAL_COMPANY_INTEL,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import { FitBandBadge, StatusPill } from "./StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import MobileSheet from "@/components/mobile/MobileSheet";

interface JobsDiscoveryViewProps {
  jobs: DashboardJob[];
  savedJobIds: string[];
  hiddenJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onHideJob: (jobId: string) => void;
  onUnhideJob?: (jobId: string) => void;
  onPrepareApplication: (job: DashboardJob) => void;
  onNavigate: (section: DashboardSectionId) => void;
}

interface SwipeCardProps {
  job: DashboardJob;
  folioIndex: number;
  totalFolios: number;
  isSaved: boolean;
  onSwipe: (dir: "smash" | "pass") => void;
  onSuperSmash: () => void;
  onDragDirectionChange: (dir: "smash" | "pass" | "idle") => void;
}

function toRoman(num: number): string {
  const numerals: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let n = Math.max(1, num);
  let out = "";
  for (const [val, sym] of numerals) {
    while (n >= val) {
      out += sym;
      n -= val;
    }
  }
  return out;
}

const pergamentVariants = {
  enter: {
    scale: 0.945,
    opacity: 0,
    y: 22,
  },
  center: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 175,
      damping: 25,
      mass: 0.95,
    },
  },
  exit: (dir: "smash" | "pass") => ({
    x: dir === "smash" ? 560 : -560,
    y: -26,
    rotate: dir === "smash" ? 16 : -16,
    opacity: 0,
    scale: 0.91,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/**
 * Computes transparent probability breakdown for getting a role based on compatibility score,
 * requirement satisfaction ratio, skill coverage, and ATS support.
 */
function computeHireOddsMetrics(job: DashboardJob) {
  const reqCount = Math.max(1, job.requirements.length);
  const reqWeightSum = job.requirements.reduce((sum, r) => {
    if (r.status === "has") return sum + 1;
    if (r.status === "transferable") return sum + 0.82;
    if (r.status === "improve") return sum + 0.45;
    return sum + 0.15;
  }, 0);
  const requirementCoveragePct = Math.round((reqWeightSum / reqCount) * 100);

  const mandatoryReqs = job.requirements.filter((r) => r.mandatory);
  const mandatoryMet = mandatoryReqs.filter(
    (r) => r.status === "has" || r.status === "transferable"
  ).length;
  const mandatoryPct =
    mandatoryReqs.length > 0
      ? Math.round((mandatoryMet / mandatoryReqs.length) * 100)
      : requirementCoveragePct;

  const totalSkillCount = Math.max(
    1,
    job.matchingSkills.length + job.skillsToImprove.length
  );
  const skillsMatchPct = Math.round(
    (job.matchingSkills.length / totalSkillCount) * 100
  );

  const atsReadinessPct =
    job.atsSupported === "supported"
      ? 94
      : job.atsSupported === "partial"
      ? 72
      : 54;

  const overallOddsPct = Math.max(
    15,
    Math.min(
      97,
      Math.round(
        job.compatibilityScore * 0.55 +
          requirementCoveragePct * 0.25 +
          skillsMatchPct * 0.2
      )
    )
  );

  const verdict =
    overallOddsPct >= 82
      ? "High Interview Odds"
      : overallOddsPct >= 68
      ? "Strong Contender"
      : "Stretch · Bridge Gaps";

  const toneColor =
    overallOddsPct >= 82
      ? "#0b5e3c"
      : overallOddsPct >= 68
      ? "#9a5d1f"
      : "#8b2c1d";

  return {
    overallOddsPct,
    verdict,
    toneColor,
    bars: [
      {
        label: "Compatibility Match",
        value: job.compatibilityScore,
        hint: "Baseline profile vs role",
      },
      {
        label: "Skills Overlap",
        value: skillsMatchPct,
        hint: `${job.matchingSkills.length}/${totalSkillCount} skills ready`,
      },
      {
        label: "Requirement Proof",
        value: requirementCoveragePct,
        hint: `${mandatoryMet}/${Math.max(1, mandatoryReqs.length)} mandatory`,
      },
      {
        label: "ATS Tailoring Fit",
        value: atsReadinessPct,
        hint: `Mandatory ${mandatoryPct}%`,
      },
    ],
  };
}

/**
 * Animated Radial Gauge + Horizontal Probability Factor Bar Graph for a job
 */
function HireOddsGraph({
  job,
  variant = "vellum",
}: {
  job: DashboardJob;
  variant?: "vellum" | "card";
}) {
  const metrics = computeHireOddsMetrics(job);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference * (1 - metrics.overallOddsPct / 100);

  const isVellum = variant === "vellum";

  return (
    <div
      className={
        isVellum
          ? "rounded-[9px] border border-[#6e522d]/50 bg-[#e6d2aa]/55 p-3 shadow-[inset_0_1px_4px_rgba(88,58,24,0.12)]"
          : "rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4"
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* Radial Percentage Gauge */}
        <div className="flex shrink-0 flex-col items-center">
          <div className="relative flex h-[92px] w-[92px] items-center justify-center">
            <svg
              viewBox="0 0 92 92"
              className="h-full w-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="46"
                cy="46"
                r={radius}
                fill="none"
                stroke={isVellum ? "rgba(110, 82, 45, 0.24)" : "#e3dccb"}
                strokeWidth="7.5"
              />
              <motion.circle
                cx="46"
                cy="46"
                r={radius}
                fill="none"
                stroke={metrics.toneColor}
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.75, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="font-serif-display text-[26px] leading-none"
                style={{ color: isVellum ? "#24190d" : "#212d3d" }}
              >
                {metrics.overallOddsPct}%
              </span>
              <span className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-[#5c4529]">
                Hire Odds
              </span>
            </div>
          </div>
          <span
            className="mt-1 rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em]"
            style={{
              backgroundColor:
                metrics.overallOddsPct >= 82
                  ? "rgba(11, 94, 60, 0.14)"
                  : metrics.overallOddsPct >= 68
                  ? "rgba(154, 93, 31, 0.15)"
                  : "rgba(139, 44, 29, 0.14)",
              color: metrics.toneColor,
            }}
          >
            {metrics.verdict}
          </span>
        </div>

        {/* 4-Factor Animated Horizontal Probability Bar Graph */}
        <div className="w-full flex-1 space-y-2">
          {metrics.bars.map((bar, idx) => (
            <div key={bar.label} className="space-y-0.5">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span
                  className={
                    isVellum
                      ? "font-medium text-[#24190d]"
                      : "font-medium text-[#212d3d]"
                  }
                >
                  {bar.label}{" "}
                  <span className="font-mono text-[9.5px] text-[#6d5334]">
                    ({bar.hint})
                  </span>
                </span>
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: metrics.toneColor }}
                >
                  {bar.value}%
                </span>
              </div>
              <div
                className={
                  isVellum
                    ? "h-2 w-full overflow-hidden rounded-full bg-[#cdb487]/60"
                    : "h-2 w-full overflow-hidden rounded-full bg-[#e5dfd0]"
                }
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ duration: 0.55 + idx * 0.08, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      bar.value >= 80
                        ? "linear-gradient(90deg, #0b5e3c 0%, #1c8c5e 100%)"
                        : bar.value >= 65
                        ? "linear-gradient(90deg, #8b5a22 0%, #bf8337 100%)"
                        : "linear-gradient(90deg, #8b2c1d 0%, #b84230 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Ultra-realistic calfskin vellum fiber grain, organic foxing flecks, tea-stain patina,
 * crossed antique fold creases, deep burnt-umber deckle edge vignette, and iron-gall filigree.
 */
function RealisticPergamentTexture() {
  const uid = useId().replace(/:/g, "");
  const filterId = `vellum-fiber-${uid}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]"
    >
      {/* Procedural calfskin grain via multi-octave feTurbulence + oblique light */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.36] mix-blend-multiply"
        preserveAspectRatio="none"
      >
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.036 0.048"
            numOctaves={6}
            seed={21}
            result="paperNoise"
          />
          <feDiffuseLighting
            in="paperNoise"
            lightingColor="#f5e2ba"
            surfaceScale={2.35}
          >
            <feDistantLight azimuth={46} elevation={58} />
          </feDiffuseLighting>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      {/* Tea-stain organic aging blotches & warm oxidized edges */}
      <div
        className="absolute inset-0 opacity-85"
        style={{
          background:
            "radial-gradient(circle at 12% 14%, rgba(148, 102, 42, 0.25) 0%, transparent 40%), radial-gradient(circle at 88% 20%, rgba(132, 84, 30, 0.22) 0%, transparent 38%), radial-gradient(circle at 78% 86%, rgba(118, 72, 24, 0.28) 0%, transparent 44%), radial-gradient(circle at 16% 84%, rgba(154, 108, 48, 0.22) 0%, transparent 36%)",
        }}
      />

      {/* Organic foxing age spots around the vellum margins */}
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-[0.26] mix-blend-multiply"
      >
        <circle cx="28" cy="34" r="2.2" fill="#704a1e" />
        <circle cx="36" cy="26" r="1.1" fill="#5e3c14" />
        <circle cx="368" cy="48" r="2.8" fill="#6d461c" />
        <circle cx="352" cy="36" r="1.4" fill="#785024" />
        <circle cx="46" cy="264" r="2.5" fill="#6b441a" />
        <circle cx="344" cy="258" r="3.1" fill="#5d3912" />
        <circle cx="362" cy="242" r="1.3" fill="#744b1e" />
        <circle cx="212" cy="22" r="1.8" fill="#6b441a" />
        <circle cx="188" cy="282" r="2.1" fill="#643e16" />
        <ellipse cx="92" cy="46" rx="6" ry="3.2" fill="#8d5e29" opacity="0.35" />
        <ellipse cx="318" cy="244" rx="7.5" ry="4" fill="#825320" opacity="0.35" />
      </svg>

      {/* Deep burnt-amber weathered deckle vignette + sunlit paper bevel */}
      <div
        className="absolute inset-0 rounded-[6px]"
        style={{
          boxShadow:
            "inset 0 0 74px rgba(88, 52, 16, 0.42), inset 0 0 22px rgba(48, 26, 6, 0.34), inset 0 1px 0 rgba(255, 250, 232, 0.78)",
        }}
      />

      {/* Crossed antique letter fold creases */}
      <div
        className="absolute inset-x-0 top-[48%] h-[3px] opacity-45"
        style={{
          background:
            "linear-gradient(180deg, rgba(72, 42, 14, 0.32) 0%, rgba(255, 248, 224, 0.65) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-[50%] w-[2px] opacity-25"
        style={{
          background:
            "linear-gradient(90deg, rgba(72, 42, 14, 0.25) 0%, rgba(255, 248, 224, 0.55) 55%, transparent 100%)",
        }}
      />

      {/* Double Iron-Gall Ink Manuscript Margins & Classical Filigree Frame */}
      <div className="absolute inset-[11px] rounded-[2px] border border-[#523b1e]/45" />
      <div className="absolute inset-[15px] rounded-[1px] border border-[#6e522d]/26" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-[15px] h-[calc(100%-30px)] w-[calc(100%-30px)] opacity-[0.25]"
      >
        <path
          d="M0,4 L0,0 L4,0 M96,0 L100,0 L100,4 M0,96 L0,100 L4,100 M96,100 L100,100 L100,96"
          fill="none"
          stroke="#422e14"
          strokeWidth="0.7"
        />
        <circle
          cx="50"
          cy="50"
          r="23"
          fill="none"
          stroke="#6b4e29"
          strokeWidth="0.34"
          strokeDasharray="1.3 1.7"
        />
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="#6b4e29"
          strokeWidth="0.24"
        />
        <line x1="50" y1="14" x2="50" y2="86" stroke="#6b4e29" strokeWidth="0.22" />
        <line x1="14" y1="50" x2="86" y2="50" stroke="#6b4e29" strokeWidth="0.22" />
      </svg>
    </div>
  );
}

/**
 * Sculpted 3D molten dripping SVG wax seal stamp revealed during swipe/drag
 */
function WaxSealStamp({
  label,
  sublabel,
  tone,
}: {
  label: string;
  sublabel: string;
  tone: "smash" | "pass";
}) {
  const isSmash = tone === "smash";
  const rimOuter = isSmash ? "#0d5939" : "#7e2017";
  const waxCore = isSmash ? "#14754d" : "#a32b20";
  const waxDeep = isSmash ? "#073822" : "#52100a";
  const highlight = isSmash ? "#41a67a" : "#d96457";

  return (
    <div
      className="relative flex h-[108px] w-[108px] items-center justify-center select-none"
      style={{
        filter: "drop-shadow(0 10px 18px rgba(34, 20, 8, 0.48))",
      }}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={`wax-${tone}`} cx="38%" cy="34%" r="65%">
            <stop offset="0%" stopColor={highlight} />
            <stop offset="45%" stopColor={waxCore} />
            <stop offset="85%" stopColor={rimOuter} />
            <stop offset="100%" stopColor={waxDeep} />
          </radialGradient>
        </defs>
        <path
          d="M60 7 C71 6,83 11,92 17 C101 23,110 31,112 44 C114 55,112 67,108 79 C104 91,99 102,86 108 C75 113,65 116,54 112 C42 108,33 114,22 104 C13 95,8 84,8 71 C8 59,4 48,11 35 C18 22,29 14,42 10 C49 8,54 8,60 7 Z"
          fill={`url(#wax-${tone})`}
          stroke={waxDeep}
          strokeWidth="1.4"
        />
        <circle
          cx="60"
          cy="60"
          r="41"
          fill="none"
          stroke={waxDeep}
          strokeOpacity="0.65"
          strokeWidth="3.2"
        />
        <circle
          cx="60"
          cy="60"
          r="39"
          fill="none"
          stroke={highlight}
          strokeOpacity="0.45"
          strokeWidth="1"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center text-[#fdf3de] [text-shadow:0_1px_2px_rgba(0,0,0,0.65)]">
        <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] opacity-90">
          {label}
        </span>
        <span className="mt-0.5 font-serif-display text-[16px] leading-none italic">
          {sublabel}
        </span>
      </div>
    </div>
  );
}

/**
 * Slim realistic cylindrical turned Walnut/Brass & Rolled Parchment Scroll Rod
 */
function PergamentScrollRod({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative mx-auto flex w-[calc(100%+22px)] -ml-[11px] items-center ${
        position === "top" ? "-mt-[9px] mb-2" : "mt-2.5 -mb-[9px]"
      }`}
    >
      {/* Left Turned Walnut Finial */}
      <div
        className="h-[16px] w-[13px] shrink-0 rounded-l-[6px] border border-[#2d1a0b]"
        style={{
          background:
            "linear-gradient(180deg, #432b17 0%, #9b7346 28%, #d2ab78 44%, #5e3e20 74%, #27170a 100%)",
          boxShadow:
            "inset 0 1px 1px rgba(255,240,210,0.45), 0 3px 8px rgba(20,12,4,0.5)",
        }}
      />
      {/* Brass Collar */}
      <div
        className="h-[14px] w-[4px] shrink-0 border-y border-[#4a3515]"
        style={{
          background:
            "linear-gradient(180deg, #7d5d2b 0%, #f5da94 38%, #a6823f 74%, #4f3a15 100%)",
        }}
      />
      {/* Curled Calfskin Roll */}
      <div
        className="h-[11px] flex-1 border-y border-[#5f4321]/85"
        style={{
          background:
            position === "top"
              ? "linear-gradient(180deg, #876940 0%, #ebdcc0 22%, #fdf6e3 42%, #dfc698 74%, #7e6038 100%)"
              : "linear-gradient(180deg, #7e6038 0%, #dfc698 26%, #fdf6e3 58%, #ebdcc0 78%, #876940 100%)",
          boxShadow:
            position === "top"
              ? "0 6px 11px -1px rgba(38, 22, 6, 0.45)"
              : "0 -5px 11px -1px rgba(38, 22, 6, 0.35)",
        }}
      />
      {/* Right Brass Collar */}
      <div
        className="h-[14px] w-[4px] shrink-0 border-y border-[#4a3515]"
        style={{
          background:
            "linear-gradient(180deg, #7d5d2b 0%, #f5da94 38%, #a6823f 74%, #4f3a15 100%)",
        }}
      />
      {/* Right Turned Walnut Finial */}
      <div
        className="h-[16px] w-[13px] shrink-0 rounded-r-[6px] border border-[#2d1a0b]"
        style={{
          background:
            "linear-gradient(180deg, #432b17 0%, #9b7346 28%, #d2ab78 44%, #5e3e20 74%, #27170a 100%)",
          boxShadow:
            "inset 0 1px 1px rgba(255,240,210,0.45), 0 3px 8px rgba(20,12,4,0.5)",
        }}
      />
    </div>
  );
}

const PhilosopherSwipeCard = React.forwardRef<HTMLDivElement, SwipeCardProps>(
  function PhilosopherSwipeCard(
    {
      job,
      folioIndex,
      totalFolios,
      isSaved,
      onSwipe,
      onSuperSmash,
      onDragDirectionChange,
    },
    ref
  ) {
    const x = useMotionValue(0);
    const rawRotate = useTransform(x, [-240, 0, 240], [-13, 0, 13]);
    const rotate = useSpring(rawRotate, {
      stiffness: 210,
      damping: 26,
      mass: 0.85,
    });
    const smashOpacity = useTransform(x, [25, 115], [0, 1]);
    const smashScale = useSpring(useTransform(x, [25, 115], [0.8, 1.04]), {
      stiffness: 240,
      damping: 24,
    });
    const passOpacity = useTransform(x, [-115, -25], [1, 0]);
    const passScale = useSpring(useTransform(x, [-115, -25], [1.04, 0.8]), {
      stiffness: 240,
      damping: 24,
    });

    return (
      <motion.div
        ref={ref}
        variants={pergamentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      style={{
        x,
        rotate,
        background:
          "radial-gradient(ellipse at 25% 15%, #faf0d8 0%, #efdcba 46%, #e1c79b 84%, #d3b380 100%)",
        boxShadow:
          "0 28px 65px rgba(8, 4, 1, 0.72), 0 8px 18px rgba(8, 4, 1, 0.48), 0 2px 0 #b89763",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.78}
      dragTransition={{ bounceStiffness: 195, bounceDamping: 26 }}
      onDrag={(_, info) => {
        if (info.offset.x > 42) onDragDirectionChange("smash");
        else if (info.offset.x < -42) onDragDirectionChange("pass");
        else onDragDirectionChange("idle");
      }}
      onDragEnd={(_, info) => {
        onDragDirectionChange("idle");
        if (info.offset.x > 105 || info.velocity.x > 520) {
          onSwipe("smash");
        } else if (info.offset.x < -105 || info.velocity.x < -520) {
          onSwipe("pass");
        }
      }}
      whileDrag={{ scale: 1.014, cursor: "grabbing" }}
      className="relative z-20 cursor-grab select-none rounded-[6px] border border-[#6a4c28]/85 px-5 py-2 sm:px-7"
    >
      {/* Realistic Calfskin Vellum Texture, Foxing, Tea Patina & Ink Ruling */}
      <RealisticPergamentTexture />

      {/* Slim Turned Walnut/Brass Scroll Rod */}
      <PergamentScrollRod position="top" />

      {/* Dynamic SMASH 3D Molten Wax Seal Overlay */}
      <motion.div
        style={{ opacity: smashOpacity, scale: smashScale }}
        className="pointer-events-none absolute top-8 right-6 z-30 -rotate-12"
      >
        <WaxSealStamp label="AMOR FATI" sublabel="Claimed" tone="smash" />
      </motion.div>

      {/* Dynamic PASS 3D Molten Wax Seal Overlay */}
      <motion.div
        style={{ opacity: passOpacity, scale: passScale }}
        className="pointer-events-none absolute top-8 left-6 z-30 rotate-12"
      >
        <WaxSealStamp label="ATARAXIA" sublabel="Released" tone="pass" />
      </motion.div>

      {/* Manuscript Content */}
      <div className="relative z-10 px-0.5 text-[#24190d]">
        {/* Folio Strip + Compatibility Seal */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#6e522d]/45 pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-sm border border-[#6a4c28]/55 bg-[#e2cea4]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#3a2813]">
              FOLIO {toRoman(folioIndex)} / {toRoman(totalFolios)}
            </span>
            <StatusPill label={job.telosTag} tone="navy" dot={false} />
            <FitBandBadge band={job.fitBand} />
            {isSaved && (
              <StatusPill label="Already Claimed" tone="success" dot={false} />
            )}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#6a4c28]/55 bg-[#f7ead0]/85 px-3 py-0.5 shadow-[inset_0_1px_0_rgba(255,250,235,0.85)]">
            <span className="font-serif-display text-[24px] leading-none text-[#24190d]">
              {job.compatibilityScore}%
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#5c4529]">
              Telos
            </span>
          </div>
        </div>

        {/* Role Heading + Parchment Metadata Chips */}
        <div className="mt-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[#5c4529]">
              {job.company} · {job.source} · {job.checkedLabel}
            </p>
            <span className="font-mono text-[9.5px] text-[#6d512f]">
              CODEX://{job.id.toUpperCase()}
            </span>
          </div>
          <h2 className="mt-0.5 font-serif-display text-[clamp(1.42rem,2.3vw,1.9rem)] leading-[1.08] text-[#24190d]">
            {job.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11.5px] text-[#302112]">
            <span className="rounded border border-[#8c6e44]/70 bg-[#f6e8ca]/75 px-2.5 py-0.5 font-medium">
              {job.salary || "Salary unstated"}
            </span>
            <span className="rounded border border-[#8c6e44]/70 bg-[#f6e8ca]/75 px-2.5 py-0.5">
              {job.location}
            </span>
            <span className="rounded border border-[#8c6e44]/70 bg-[#f6e8ca]/75 px-2.5 py-0.5">
              {job.employmentType} · {job.experienceLevel}
            </span>
          </div>
        </div>

        {/* Philosopher Sealed Marginalia Quote */}
        <div className="mt-2.5 rounded-[8px] border border-[#6e522d]/50 bg-[#e6d2aa]/55 px-3 py-2 shadow-[inset_0_1px_4px_rgba(88,58,24,0.12)]">
          <div className="flex items-center gap-3">
            <img
              src="/images/vex-philosopher.jpg"
              alt="Philosopher advisor emblem"
              className="h-9 w-9 shrink-0 rounded-full border border-[#6a4c28]/70 object-cover object-top mix-blend-multiply sepia-[0.4] contrast-[1.1]"
            />
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5c4529]">
                {job.philosopherLens}
              </p>
              <p className="line-clamp-2 font-serif-display text-[15.5px] leading-snug italic text-[#24190d]">
                “{job.philosopherMaxim}”
              </p>
            </div>
          </div>
        </div>

        {/* Proven Pillars vs Gaps on Vellum Panes */}
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="rounded-[7px] border border-[#6e522d]/45 bg-[#f7ebd1]/65 p-2.5">
            <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#0b5e3c]">
              Proven Pillars ({job.matchingSkills.length})
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {job.matchingSkills.slice(0, 5).map((sk) => (
                <span
                  key={sk}
                  className="rounded border border-[#0b5e3c]/30 bg-[#e3efe7]/90 px-2 py-0.5 text-[11px] font-medium text-[#0b5e3c]"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[7px] border border-[#6e522d]/45 bg-[#f7ebd1]/65 p-2.5">
            <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8b2c1d]">
              Gaps to Sharpen ({job.skillsToImprove.length})
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {job.skillsToImprove.slice(0, 4).map((sk) => (
                <span
                  key={sk}
                  className="rounded border border-[#8b2c1d]/30 bg-[#f6e4de]/90 px-2 py-0.5 text-[11px] font-medium text-[#8b2c1d]"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {job.redFlags.length > 0 && (
          <div className="mt-2 truncate rounded-[7px] border border-[#8b2c1d]/40 bg-[#f3dfd8]/75 px-3 py-1.5 text-[11.5px] text-[#7a2015]">
            <strong>Caveat:</strong> {job.redFlags.join(" · ")}
          </div>
        )}

        {/* Quick Manuscript Verdict Line */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#6e522d]/40 pt-2 text-[11px] text-[#5c4529]">
          <span className="font-mono text-[9.5px]">
            DRAG LEFT = ATARAXIA · DRAG RIGHT = AMOR FATI
          </span>
          <button
            type="button"
            onClick={onSuperSmash}
            className="cursor-pointer font-medium text-[#24190d] underline underline-offset-4 hover:text-[#0b5e3c]"
          >
            Claim &amp; Prepare Dossier -&gt;
          </button>
        </div>
      </div>

      {/* Slim Bottom Rolled Parchment Cylinder */}
      <PergamentScrollRod position="bottom" />
    </motion.div>
  );
});

export default function JobsDiscoveryView({
  jobs,
  savedJobIds,
  hiddenJobIds,
  onToggleSave,
  onHideJob,
  onUnhideJob,
  onPrepareApplication,
  onNavigate,
}: JobsDiscoveryViewProps) {
  const [discoveryMode, setDiscoveryMode] = useState<"swipe" | "matrix">("swipe");
  const [query, setQuery] = useState("");
  const [arrangementFilter, setArrangementFilter] = useState<string>("All");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [employmentFilter, setEmploymentFilter] = useState<string>("All");
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [minSalaryK, setMinSalaryK] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"compatibility" | "company" | "deadline">("compatibility");
  const [hideStale, setHideStale] = useState(false);
  const [onlySalaryDisclosed, setOnlySalaryDisclosed] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    jobs[0]?.id || "",
  ]);
  const [showMergedSources, setShowMergedSources] = useState(false);
  const [alertSavedMsg, setAlertSavedMsg] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  function toggleCompareJob(id: string) {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length >= 3
        ? [...prev.slice(1), id]
        : [...prev, id]
    );
  }
  const comparedJobs = jobs.filter((j) => compareIds.includes(j.id));
  const {
    savedSearches,
    addSavedSearch,
    deleteSavedSearch,
    toggleSavedSearchAlert,
    markJobViewed,
  } = useVexWorkspace();

  // Pergament Swipe Deck State
  const [reviewedInSessionIds, setReviewedInSessionIds] = useState<string[]>(
    []
  );
  const [passedHistoryIds, setPassedHistoryIds] = useState<string[]>([]);
  const [deckFitPreset, setDeckFitPreset] = useState<
    "all" | "strong" | "remote" | "hybrid"
  >("all");
  const [lastExitDir, setLastExitDir] = useState<"smash" | "pass">("smash");
  const [finishTab, setFinishTab] = useState<"chosen" | "passed">("chosen");
  const [inspectedModalJobId, setInspectedModalJobId] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);
  const [dragIntent, setDragIntent] = useState<"smash" | "pass" | "idle">(
    "idle"
  );
  const [oracleSpeech, setOracleSpeech] = useState<string>(
    "Examine each pergament calmly. Drag right (Amor Fati) to claim it, or left (Ataraxia) to pass."
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"all" | "saved" | "passed">("all");

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setDiscoveryMode("matrix");
    }
  }, []);

  function selectJob(jobId: string) {
    setSelectedJobId(jobId);
    markJobViewed(jobId);
    setRecentlyViewedIds((prev) => [
      jobId,
      ...prev.filter((id) => id !== jobId).slice(0, 3),
    ]);
  }

  function resetAllFilters() {
    setQuery("");
    setArrangementFilter("All");
    setSourceFilter("All");
    setEmploymentFilter("All");
    setLevelFilter("All");
    setIndustryFilter("All");
    setMinSalaryK(0);
    setHideStale(false);
    setOnlySalaryDisclosed(false);
  }

  const industries = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.industry))),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const base = jobs.filter((job) => {
      if (hiddenJobIds.includes(job.id)) return false;
      if (hideStale && job.isStale) return false;
      if (onlySalaryDisclosed && !job.salary) return false;
      if (minSalaryK > 0) {
        const nums = (job.salary || "").match(/\d+/g)?.map(Number) || [];
        const maxNum = nums.length ? Math.max(...nums) : 0;
        const normalizedK = maxNum > 999 ? Math.round(maxNum / 1000) : maxNum;
        if (normalizedK < minSalaryK) return false;
      }
      if (arrangementFilter !== "All" && job.arrangement !== arrangementFilter) {
        return false;
      }
      if (sourceFilter !== "All" && job.source !== sourceFilter) {
        return false;
      }
      if (industryFilter !== "All" && job.industry !== industryFilter) {
        return false;
      }
      if (
        employmentFilter !== "All" &&
        job.employmentType !== employmentFilter
      ) {
        return false;
      }
      if (levelFilter !== "All" && job.experienceLevel !== levelFilter) {
        return false;
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay =
          `${job.title} ${job.company} ${job.location} ${job.source} ${job.industry} ${job.matchingSkills.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "company") {
      return [...base].sort((a, b) => a.company.localeCompare(b.company));
    }
    if (sortBy === "deadline") {
      return [...base].sort((a, b) =>
        (a.deadline || "zzz").localeCompare(b.deadline || "zzz")
      );
    }
    return [...base].sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }, [
    jobs,
    hiddenJobIds,
    hideStale,
    onlySalaryDisclosed,
    minSalaryK,
    arrangementFilter,
    sourceFilter,
    industryFilter,
    employmentFilter,
    levelFilter,
    query,
    sortBy,
  ]);

  const deckPoolJobs = useMemo(() => {
    return filteredJobs.filter((job) => {
      if (deckFitPreset === "strong") return job.compatibilityScore >= 85;
      if (deckFitPreset === "remote")
        return job.arrangement.toLowerCase().includes("remote");
      if (deckFitPreset === "hybrid")
        return job.arrangement.toLowerCase().includes("hybrid");
      return true;
    });
  }, [filteredJobs, deckFitPreset]);

  const swipeDeck = useMemo(
    () => deckPoolJobs.filter((j) => !reviewedInSessionIds.includes(j.id)),
    [deckPoolJobs, reviewedInSessionIds]
  );

  const topSwipeJob = swipeDeck[0] || null;
  const nextSwipeJob = swipeDeck[1] || null;
  const thirdSwipeJob = swipeDeck[2] || null;
  const totalDeckFolios = Math.max(1, deckPoolJobs.length);
  const currentFolioIndex =
    Math.min(
      totalDeckFolios,
      deckPoolJobs.length - swipeDeck.length + (topSwipeJob ? 1 : 0)
    ) || 1;

  function handleSwipeDecision(dir: "smash" | "pass", targetJob: DashboardJob) {
    setLastExitDir(dir);
    setDragIntent("idle");
    setReviewedInSessionIds((prev) => [...prev, targetJob.id]);
    if (dir === "smash") {
      if (!savedJobIds.includes(targetJob.id)) {
        onToggleSave(targetJob.id);
      }
      setOracleSpeech(
        `Amor Fati — sealed "${targetJob.title}" at ${targetJob.company} into Chosen.`
      );
    } else {
      onHideJob(targetJob.id);
      setPassedHistoryIds((prev) => [targetJob.id, ...prev]);
      setOracleSpeech(
        `Ataraxia — calmly passed on "${targetJob.title}".`
      );
    }
  }

  function handleSuperSmash(targetJob: DashboardJob) {
    setLastExitDir("smash");
    setDragIntent("idle");
    if (!savedJobIds.includes(targetJob.id)) {
      onToggleSave(targetJob.id);
    }
    setReviewedInSessionIds((prev) => [...prev, targetJob.id]);
    setOracleSpeech(
      `Summum Bonum — preparing dossier for "${targetJob.title}".`
    );
    onPrepareApplication(targetJob);
  }

  function handleAnamnesisUndo() {
    const lastId = passedHistoryIds[0];
    if (!lastId) return;
    onUnhideJob?.(lastId);
    setPassedHistoryIds((prev) => prev.slice(1));
    setReviewedInSessionIds((prev) => prev.filter((id) => id !== lastId));
    setOracleSpeech(
      "Anamnesis — recalled the last passed pergament to the deck."
    );
  }

  function handleReclaimPassedJob(jobId: string, saveDirectly = false) {
    onUnhideJob?.(jobId);
    setPassedHistoryIds((prev) => prev.filter((id) => id !== jobId));
    if (saveDirectly) {
      if (!savedJobIds.includes(jobId)) {
        onToggleSave(jobId);
      }
      setFinishTab("chosen");
    } else {
      setReviewedInSessionIds((prev) => prev.filter((id) => id !== jobId));
    }
  }

  function resetSwipeDeck() {
    passedHistoryIds.forEach((id) => onUnhideJob?.(id));
    setPassedHistoryIds([]);
    setReviewedInSessionIds([]);
    setFinishTab("chosen");
    setInspectedModalJobId(null);
    setOracleSpeech(
      "Tabula Rasa — freshly unrolled the entire Pergament Agora deck."
    );
  }

  // Lock outer viewport scroll cleanly while centered Pergament Focus Mode is open
  useEffect(() => {
    if (discoveryMode !== "swipe") return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [discoveryMode]);

  // Keyboard support in Swipe Mode (Left/A = Pass, Right/D = Smash, Z = Anamnesis Undo, Escape = Back/Matrix)
  useEffect(() => {
    if (discoveryMode !== "swipe") return;
    function onKeyDown(e: KeyboardEvent) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (inspectedModalJobId) {
          setInspectedModalJobId(null);
        } else {
          setDiscoveryMode("matrix");
        }
      } else if (
        (e.key === "ArrowRight" || e.key.toLowerCase() === "d") &&
        topSwipeJob
      ) {
        e.preventDefault();
        handleSwipeDecision("smash", topSwipeJob);
      } else if (
        (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") &&
        topSwipeJob
      ) {
        e.preventDefault();
        handleSwipeDecision("pass", topSwipeJob);
      } else if (e.key.toLowerCase() === "z" && passedHistoryIds.length > 0) {
        e.preventDefault();
        handleAnamnesisUndo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const activeJob =
    filteredJobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || null;

  const activeCompanyIntel = activeJob
    ? INITIAL_COMPANY_INTEL.find((c) => c.name === activeJob.company) || null
    : null;

  const inspectedModalJob = inspectedModalJobId
    ? jobs.find((j) => j.id === inspectedModalJobId) || null
    : null;

  const inspectedCompanyIntel = inspectedModalJob
    ? INITIAL_COMPANY_INTEL.find(
        (c) => c.name === inspectedModalJob.company
      ) || null
    : null;

  const recentJobs = recentlyViewedIds
    .map((id) => jobs.find((j) => j.id === id))
    .filter((j): j is DashboardJob => Boolean(j));

  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));
  const passedJobsList = passedHistoryIds
    .map((id) => jobs.find((j) => j.id === id))
    .filter((j): j is DashboardJob => Boolean(j));

  const mobileFeedJobs = useMemo(() => {
    if (mobileTab === "saved") {
      return jobs.filter(
        (j) => savedJobIds.includes(j.id) && !hiddenJobIds.includes(j.id)
      );
    }
    if (mobileTab === "passed") {
      return jobs.filter((j) => hiddenJobIds.includes(j.id));
    }
    return filteredJobs;
  }, [jobs, filteredJobs, savedJobIds, hiddenJobIds, mobileTab]);

  return (
    <div>
      {/* MOBILE APPLE-HIG JOBS FEED (< lg) */}
      <div className="space-y-4 lg:hidden">
        {/* Search + Filter Sheet + Swipe Trigger */}
        <div className="ios-card p-3.5 space-y-3">
          <div className="flex items-center gap-2">
            <input
              id="mobile-jobs-search"
              name="mobileJobsSearch"
              type="search"
              aria-label="Search mobile job feed"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search role, company, or location..."
              className="min-h-[42px] flex-1 rounded-full border border-[#d8cbb0] bg-[#faf6ed] px-4 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="min-h-[42px] shrink-0 cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3.5 text-[12px] font-medium text-[#212d3d]"
            >
              Filters
            </button>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {(
              [
                { id: "all", label: `Feed (${filteredJobs.length})` },
                { id: "saved", label: `Saved (${savedJobIds.length})` },
                { id: "passed", label: `Passed (${hiddenJobIds.length})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMobileTab(t.id)}
                className={`min-h-[36px] shrink-0 cursor-pointer rounded-full px-3.5 py-1 text-[12px] font-medium ${
                  mobileTab === t.id
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "bg-[#f2eee2] text-[#5a6675]"
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDiscoveryMode("swipe")}
              className="min-h-[36px] shrink-0 cursor-pointer rounded-full border border-[#b88b32]/40 bg-[#faf6ed] px-3.5 py-1 text-[12px] font-medium text-[#7a6b4e]"
            >
              Swipe Mode ({swipeDeck.length})
            </button>
          </div>
        </div>

        {/* Hermes Compact Mentor Insight */}
        <MobilePhilosopherPill
          name="Hermes"
          role="Opportunity Scout"
          image="/images/hermes-messenger-alerts.jpg"
          quote="Prioritise 85%+ fit roles cleanly merged from verified public boards."
          guidance="Save high-alignment roles to unlock Athena's skill-gap breakdown and prepare tailored CV packets without guesswork."
        />

        {/* Mobile Stacked Opportunity Cards */}
        {mobileFeedJobs.length === 0 ? (
          <div className="ios-card p-6 text-center space-y-2.5">
            <p className="font-serif-display text-[20px] text-[#212d3d]">
              No roles in this view
            </p>
            <p className="text-[12.5px] text-[#5a6675]">
              Adjust your search filters or switch tabs to browse active openings.
            </p>
            <button
              type="button"
              onClick={() => {
                resetAllFilters();
                setMobileTab("all");
              }}
              className="min-h-[40px] cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {mobileFeedJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              const isHidden = hiddenJobIds.includes(job.id);
              return (
                <article key={job.id} className="ios-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                        {job.company} · {job.arrangement}
                      </p>
                      <h2 className="mt-0.5 font-serif-display text-[21px] leading-snug text-[#212d3d]">
                        {job.title}
                      </h2>
                      <p className="mt-0.5 text-[12px] text-[#5a6675]">
                        {job.location} · {job.salary || "Salary unlisted"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-serif-display text-[24px] leading-none text-[#212d3d]">
                        {job.compatibilityScore}%
                      </span>
                      <div className="mt-1">
                        <FitBandBadge band={job.fitBand} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.matchingSkills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="rounded-full bg-[#f2eee2] px-2.5 py-0.5 text-[11px] text-[#212d3d]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-[#ece5d5] pt-3">
                    {isHidden ? (
                      <button
                        type="button"
                        onClick={() => onUnhideJob?.(job.id)}
                        className="min-h-[40px] cursor-pointer rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-4 text-[12px] font-medium text-[#212d3d]"
                      >
                        Restore Role
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleSave(job.id)}
                        className={`min-h-[40px] cursor-pointer rounded-full px-4 text-[12px] font-medium ${
                          isSaved
                            ? "bg-[#067647] text-white"
                            : "border border-[#cfc2a5] bg-[#faf6ed] text-[#212d3d]"
                        }`}
                      >
                        {isSaved ? "Saved ✓" : "Save"}
                      </button>
                    )}

                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full bg-[#212d3d] px-4 text-[12px] font-medium text-[#faf6ed]"
                    >
                      Open Athena Brief -&gt;
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Mobile Bottom Sheet Filters */}
        <MobileSheet
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          title="Filter Opportunities"
          subtitle="Hermes Job Lenses"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                Work Arrangement
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Remote UK", "Hybrid", "London On-site"].map((arr) => (
                  <button
                    key={arr}
                    type="button"
                    onClick={() => setArrangementFilter(arr)}
                    className={`min-h-[38px] cursor-pointer rounded-full px-3.5 text-[12px] font-medium ${
                      arrangementFilter === arr
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#dad6ca] bg-white text-[#212d3d]"
                    }`}
                  >
                    {arr}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                Experience Level
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Entry", "Mid", "Senior"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevelFilter(lvl)}
                    className={`min-h-[38px] cursor-pointer rounded-full px-3.5 text-[12px] font-medium ${
                      levelFilter === lvl
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#dad6ca] bg-white text-[#212d3d]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="min-h-[44px] flex-1 cursor-pointer rounded-full border border-[#cfc2a5] bg-white text-[12.5px] font-medium text-[#212d3d]"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="min-h-[44px] flex-1 cursor-pointer rounded-full bg-[#212d3d] text-[12.5px] font-medium text-[#faf6ed]"
              >
                Apply Filters ({filteredJobs.length})
              </button>
            </div>
          </div>
        </MobileSheet>
      </div>

      {/* DESKTOP AGORA JOBS BOARD & PERGAMENT CODEX (lg+ Untouched) */}
      <div className="hidden lg:block space-y-6">
      {/* Header + Mode Switcher + Adaptive Pergament Lens Strip */}
      <div className="rounded-[24px] border border-[#cfc4a7] bg-gradient-to-br from-[#faf6ed]/94 via-[#f6efdf]/90 to-[#efe6d1]/92 p-6 shadow-[0_14px_34px_rgba(33,45,61,0.08)] backdrop-blur-md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow label="The Agora · Pergament Smash & Pass Codex" />
            <h1 className="mt-1.5 font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
              Examine Each Pergament:{" "}
              <span className="italic text-[#6a5c44]">
                Amor Fati or Ataraxia.
              </span>
            </h1>
            <p className="mt-1 max-w-[66ch] text-[13.5px] text-[#5c503b]">
              Swipe right (<strong>Amor Fati · Smash</strong>) to seal a role
              into your chosen archive, or swipe left (<strong>Ataraxia · Pass</strong>)
              to release it calmly. Your chosen scrolls gather automatically when finished.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <div className="inline-flex rounded-full border border-[#cfc4a7] bg-[#faf6ed] p-1">
              <button
                type="button"
                onClick={() => setDiscoveryMode("swipe")}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors ${
                  discoveryMode === "swipe"
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "text-[#5c503b] hover:text-[#212d3d]"
                }`}
              >
                Pergament Swipe ({swipeDeck.length})
              </button>
              <button
                type="button"
                onClick={() => setDiscoveryMode("matrix")}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors ${
                  discoveryMode === "matrix"
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "text-[#5c503b] hover:text-[#212d3d]"
                }`}
              >
                Matrix List ({filteredJobs.length})
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MATRIX LIST (renders underneath and blurs behind centered Pergament modal) */}
          {alertSavedMsg && (
            <p className="rounded-[14px] bg-[#067647]/10 px-4 py-2.5 text-[13px] text-[#067647]">
              {alertSavedMsg}
            </p>
          )}

          <div className="rounded-[20px] border border-[#dad6ca] bg-white p-4 space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input id="jobsdiscoveryview-input-1" name="jobsdiscoveryview-input-1" aria-label="jobsdiscoveryview input 1"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title, company, industry, or board…"
                className="flex-1 rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-2 text-[13.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  addSavedSearch({
                    label: query.trim() || `${arrangementFilter} ${levelFilter} Roles`,
                    query: query.trim(),
                    arrangement:
                      arrangementFilter === "Remote UK"
                        ? "Remote"
                        : arrangementFilter === "Hybrid"
                        ? "Hybrid"
                        : arrangementFilter === "London On-site"
                        ? "On-site"
                        : "All",
                    experience:
                      levelFilter === "Entry" ||
                      levelFilter === "Mid" ||
                      levelFilter === "Senior"
                        ? levelFilter
                        : "All",
                    minSalaryK,
                    alertEnabled: true,
                  });
                  setAlertSavedMsg(
                    "Saved current search & filters under Saved Searches below."
                  );
                  setTimeout(() => setAlertSavedMsg(""), 3500);
                }}
                className="cursor-pointer rounded-full border border-[#212d3d]/25 bg-[#faf6ed] px-4 py-2 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Save search
              </button>
              <button
                type="button"
                onClick={resetAllFilters}
                className="cursor-pointer rounded-full border border-[#dad6ca] bg-white px-3.5 py-2 text-[12px] text-[#5a6675] hover:border-[#212d3d] hover:text-[#212d3d]"
              >
                Clear filters
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              <select id="jobsdiscoveryview-select-2" name="jobsdiscoveryview-select-2" aria-label="jobsdiscoveryview select 2"
                value={arrangementFilter}
                onChange={(e) => setArrangementFilter(e.target.value)}
                className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="All">All locations</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote UK">Remote UK</option>
                <option value="London On-site">London On-site</option>
              </select>
              <select id="jobsdiscoveryview-select-3" name="jobsdiscoveryview-select-3" aria-label="jobsdiscoveryview select 3"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="All">All industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <select id="jobsdiscoveryview-select-4" name="jobsdiscoveryview-select-4" aria-label="jobsdiscoveryview select 4"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="All">All sources</option>
                <option value="RemoteOK">RemoteOK</option>
                <option value="Hacker News">Hacker News</option>
                <option value="GitHub">GitHub</option>
                <option value="Employer Career Board">Employer Career Board</option>
              </select>
              <select id="jobsdiscoveryview-select-5" name="jobsdiscoveryview-select-5" aria-label="jobsdiscoveryview select 5"
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value)}
                className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="All">All employment types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
              <select id="jobsdiscoveryview-select-6" name="jobsdiscoveryview-select-6" aria-label="jobsdiscoveryview select 6"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="All">All experience levels</option>
                <option value="Entry">Entry level</option>
                <option value="Mid">Mid level</option>
                <option value="Senior">Senior level</option>
              </select>
              <select id="jobsdiscoveryview-select-7" name="jobsdiscoveryview-select-7" aria-label="jobsdiscoveryview select 7"
                value={String(minSalaryK)}
                onChange={(e) => setMinSalaryK(Number(e.target.value))}
                className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
              >
                <option value="0">Any salary band</option>
                <option value="55">Min £55k+</option>
                <option value="65">Min £65k+</option>
                <option value="75">Min £75k+</option>
              </select>
            </div>

            {/* Saved Searches + Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ece9df] pt-2.5 text-[11.5px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-medium text-[#5a6675]">Saved searches:</span>
                {savedSearches.map((ss) => (
                  <span
                    key={ss.id}
                    className="inline-flex items-center gap-1 rounded-full border border-[#dfd4be] bg-[#faf6ed] px-2.5 py-0.5 text-[#212d3d]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(ss.query);
                        setMinSalaryK(ss.minSalaryK);
                        setDiscoveryMode("matrix");
                      }}
                      className="cursor-pointer font-medium hover:underline"
                    >
                      {ss.label}
                    </button>
                    <button
                      type="button"
                      title={ss.alertEnabled ? "Mute alert" : "Enable alert"}
                      onClick={() => toggleSavedSearchAlert(ss.id)}
                      className="cursor-pointer font-mono text-[10px] text-[#067647]"
                    >
                      [{ss.alertEnabled ? "Alert On" : "Muted"}]
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove saved search ${ss.label}`}
                      onClick={() => deleteSavedSearch(ss.id)}
                      className="cursor-pointer px-0.5 text-[#7a6b4e] hover:text-[#b42318]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#5a6675]">Sort:</span>
                <select id="jobsdiscoveryview-select-8" name="jobsdiscoveryview-select-8" aria-label="jobsdiscoveryview select 8"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "compatibility" | "company" | "deadline"
                    )
                  }
                  className="cursor-pointer rounded-full border border-[#dad6ca] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
                >
                  <option value="compatibility">Highest Fit %</option>
                  <option value="deadline">Soonest Deadline</option>
                  <option value="company">Company A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[12px]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHideStale((v) => !v)}
                  className={`cursor-pointer rounded-full border px-3 py-1 font-medium ${
                    hideStale
                      ? "border-[#212d3d] bg-[#212d3d]/10 text-[#212d3d]"
                      : "border-[#dad6ca] bg-white text-[#5a6675]"
                  }`}
                >
                  {hideStale ? "× Hide stale (>7d)" : "+ Filter stale (>7d)"}
                </button>
                <button
                  type="button"
                  onClick={() => setOnlySalaryDisclosed((v) => !v)}
                  className={`cursor-pointer rounded-full border px-3 py-1 font-medium ${
                    onlySalaryDisclosed
                      ? "border-[#212d3d] bg-[#212d3d]/10 text-[#212d3d]"
                      : "border-[#dad6ca] bg-white text-[#5a6675]"
                  }`}
                >
                  {onlySalaryDisclosed
                    ? "× Salary disclosed only"
                    : "+ Salary disclosed"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMergedSources((v) => !v)}
                  className="cursor-pointer text-[#5a6675] underline underline-offset-2 hover:text-[#212d3d]"
                >
                  {showMergedSources
                    ? "Hide merged mirrors"
                    : "Show merged duplicates"}
                </button>
              </div>
              <span className="text-[#5a6675]">
                Showing {filteredJobs.length} roles · {savedJobIds.length} saved
              </span>
            </div>

            {recentJobs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-[#ece9df] pt-2.5 text-[11.5px]">
                <span className="font-medium text-[#5a6675]">
                  Recently viewed:
                </span>
                {recentJobs.map((rj) => (
                  <button
                    key={rj.id}
                    type="button"
                    onClick={() => selectJob(rj.id)}
                    className="cursor-pointer rounded-full bg-[#faf6ed] px-2.5 py-0.5 text-[#212d3d] hover:bg-[#ece9df]"
                  >
                    {rj.title} ({rj.compatibilityScore}%)
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Two-Column Matrix */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-3">
              {filteredJobs.length === 0 && (
                <div className="rounded-[20px] border border-dashed border-[#cfc2a5] bg-[#faf6ed] p-6 text-center space-y-3">
                  <p className="font-serif-display text-[20px] text-[#212d3d]">
                    No matching opportunities in this filter set.
                  </p>
                  <p className="text-[12.5px] text-[#5a6675]">
                    Try lowering your minimum salary band, showing stale roles, or resetting search criteria.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
              {filteredJobs.map((job) => {
                const isActive = activeJob?.id === job.id;
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => selectJob(job.id)}
                    className={`cursor-pointer rounded-[20px] border p-4 transition-all ${
                      isActive
                        ? "border-[#212d3d] bg-white shadow-sm"
                        : "border-[#dad6ca] bg-[#faf6ed] hover:border-[#212d3d]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-[15.5px] font-medium text-[#212d3d]">
                          {job.title}
                        </h2>
                        <p className="text-[12.5px] text-[#5a6675]">
                          {job.company} · {job.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-serif-display text-[22px] leading-none text-[#212d3d]">
                          {job.compatibilityScore}%
                        </span>
                        <FitBandBadge band={job.fitBand} />
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-[#5a6675]">
                      <span className="rounded-md bg-[#ece9df] px-2 py-0.5 font-medium text-[#212d3d]">
                        {job.salary || "Salary not stated"}
                      </span>
                      <span className="rounded-md bg-[#ece9df] px-2 py-0.5">
                        {job.source}
                      </span>
                      {showMergedSources && job.alsoFoundOn.length > 0 && (
                        <span className="rounded-md bg-[#ece9df] px-2 py-0.5">
                          Also: {job.alsoFoundOn.join(", ")}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#ece9df] pt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(job.id);
                        }}
                        className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                          isSaved
                            ? "bg-[#212d3d] text-[#faf6ed]"
                            : "border border-[#dad6ca] bg-white text-[#212d3d]"
                        }`}
                      >
                        {isSaved ? "Amor Fati [Saved]" : "Smash / Save"}
                      </button>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompareJob(job.id);
                          }}
                          className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            compareIds.includes(job.id)
                              ? "border border-[#175cd3] bg-[#175cd3]/10 text-[#175cd3]"
                              : "border border-[#dad6ca] bg-white text-[#5a6675] hover:text-[#212d3d]"
                          }`}
                        >
                          {compareIds.includes(job.id) ? "Comparing [x]" : "+ Compare"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onHideJob(job.id);
                          }}
                          className="cursor-pointer text-[11.5px] text-[#5a6675] hover:text-[#b42318]"
                        >
                          Ataraxia (Pass)
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              {activeJob && (
                <motion.div
                  key={activeJob.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[22px] border border-[#dad6ca] bg-white p-6 space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#dad6ca] pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Eyebrow
                          label={`${activeJob.source} · ${activeJob.industry} · ${activeJob.checkedLabel}`}
                        />
                        <FitBandBadge band={activeJob.fitBand} />
                      </div>
                      <h2 className="mt-1.5 font-serif-display text-[28px] leading-tight text-[#212d3d]">
                        {activeJob.title}
                      </h2>
                      <p className="text-[13.5px] text-[#5a6675]">
                        {activeJob.company} · {activeJob.location} ·{" "}
                        {activeJob.salary || "Salary undisclosed"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/jobs/${activeJob.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#cfc4a7] bg-[#faf6ed] px-3.5 py-2 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                      >
                        Athena Full Job Page
                      </Link>
                      <button
                        type="button"
                        onClick={() => onPrepareApplication(activeJob)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#212d3d] px-4 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                      >
                        <span>Prepare tailored application</span>
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Probability of Getting This Job Percentage + Graph */}
                  <HireOddsGraph job={activeJob} variant="card" />

                  <div className="space-y-3">
                    {activeJob.requirements.map((req) => (
                      <div
                        key={req.text}
                        className="rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[14px] font-medium text-[#212d3d]">
                            {req.text}
                          </p>
                          <StatusPill
                            label={
                              req.status === "has"
                                ? "Has on profile"
                                : req.status === "improve"
                                ? "Needs upgrade"
                                : req.status === "transferable"
                                ? "Transferable"
                                : "Missing evidence"
                            }
                            tone={
                              req.status === "has"
                                ? "success"
                                : req.status === "transferable"
                                ? "info"
                                : "warning"
                            }
                          />
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[#212d3d]">
                          <CheckIcon className="h-3.5 w-3.5 text-[#067647]" />
                          {req.profileEvidence}
                        </p>
                      </div>
                    ))}
                  </div>

                  {activeCompanyIntel && (
                    <div className="rounded-[16px] border border-[#dad6ca] bg-[#f2eee2] p-4 space-y-1.5">
                      <Eyebrow label="Company Intelligence" />
                      <p className="text-[12.5px] text-[#212d3d]">
                        <strong>Hiring velocity:</strong>{" "}
                        {activeCompanyIntel.hiringVelocity}
                      </p>
                      <p className="text-[12.5px] text-[#5a6675]">
                        {activeCompanyIntel.cultureSignals} Typical band:{" "}
                        {activeCompanyIntel.salaryRange}.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

      {comparedJobs.length > 0 && (
        <section className="mt-6 rounded-[22px] border border-[#cfc4a7] bg-[#faf6ed] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfd4be] pb-3">
            <div>
              <Eyebrow label="Athena Side-by-Side Comparison Matrix" />
              <h3 className="mt-0.5 font-serif-display text-[22px] text-[#212d3d]">
                Comparing {comparedJobs.length} Opportunities
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#212d3d]"
            >
              Clear Comparison
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {comparedJobs.map((cj) => (
              <div
                key={cj.id}
                className="flex flex-col justify-between rounded-[16px] border border-[#dad6ca] bg-white p-4 space-y-2.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <FitBandBadge band={cj.fitBand} />
                    <span className="font-serif-display text-[22px] text-[#212d3d]">
                      {cj.compatibilityScore}%
                    </span>
                  </div>
                  <p className="text-[14.5px] font-medium text-[#212d3d]">{cj.title}</p>
                  <p className="text-[12px] text-[#5a6675]">
                    {cj.company} · {cj.arrangement} · {cj.salary || "Undisclosed"}
                  </p>
                  <p className="text-[11.5px] text-[#067647]">
                    <strong>Matches:</strong> {cj.matchingSkills.slice(0, 3).join(", ")}
                  </p>
                  <p className="text-[11.5px] text-[#b54708]">
                    <strong>Gaps:</strong> {cj.skillsToImprove.join(", ") || "None"}
                  </p>
                  <p className="font-mono text-[10.5px] text-[#7a6b4e]">
                    Deadline: {cj.deadline || "Rolling"} · {cj.source}
                  </p>
                </div>
                <Link
                  href={`/dashboard/jobs/${cj.id}`}
                  className="inline-flex justify-center rounded-full bg-[#212d3d] px-3 py-1.5 text-[11.5px] font-medium text-[#faf6ed]"
                >
                  Athena Deep Analysis -&gt;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>

      {/* CENTERED NO-SCROLL BLURRED SPOTLIGHT MODAL OVER ENTIRE WORKSPACE */}
      {isMounted &&
        discoveryMode === "swipe" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pergament Smash and Pass Job Matching"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDiscoveryMode("matrix");
              }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#120c06]/68 px-4 py-3 backdrop-blur-2xl"
          >
            {/* Subtle Ambient Radial Glow Behind Centered Card */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 flex items-center justify-center"
            >
              <div
                className="h-[480px] w-[480px] rounded-full blur-3xl transition-colors duration-700 ease-out"
                style={{
                  backgroundColor:
                    dragIntent === "smash"
                      ? "rgba(18, 128, 82, 0.28)"
                      : dragIntent === "pass"
                      ? "rgba(168, 48, 34, 0.28)"
                      : "rgba(196, 158, 96, 0.14)",
                }}
              />
            </div>

            <div className="relative z-10 flex w-full max-w-[590px] flex-col items-center">
              {/* Minimal Floating Top Controls (Lens + Exit) */}
              <div className="mb-2.5 flex w-full flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setDiscoveryMode("matrix")}
                  className="cursor-pointer rounded-full border border-[#cbb78e]/40 bg-[#20160c]/80 px-3 py-1 font-mono text-[10px] text-[#f2e2c2] backdrop-blur-md transition-colors hover:border-[#f2e2c2]/65 hover:bg-[#332313]"
                >
                  &lt;- Matrix (Esc)
                </button>

                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { id: "all", label: "All" },
                    { id: "strong", label: "85%+" },
                    { id: "remote", label: "Remote" },
                    { id: "hybrid", label: "Hybrid" },
                  ].map((lens) => (
                    <button
                      key={lens.id}
                      type="button"
                      onClick={() =>
                        setDeckFitPreset(
                          lens.id as "all" | "strong" | "remote" | "hybrid"
                        )
                      }
                      className={`cursor-pointer rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition-colors ${
                        deckFitPreset === lens.id
                          ? "border-[#f3dec0] bg-[#f5e7c8] text-[#24190d]"
                          : "border-[#cbb78e]/30 bg-[#20160c]/65 text-[#e4d1ae] hover:border-[#e6d5b3]/65"
                      }`}
                    >
                      {lens.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="rounded-full border border-[#41a67a]/40 bg-[#09321f]/80 px-2 py-0.5 text-[#bcebd3]">
                    {savedJobsList.length} Chosen
                  </span>
                  <span className="rounded-full border border-[#d96457]/40 bg-[#40110c]/80 px-2 py-0.5 text-[#f6c4be]">
                    {passedJobsList.length} Passed
                  </span>
                </div>
              </div>

              {topSwipeJob ? (
                <div className="flex w-full flex-col items-center">
                  {/* Centered Stacked Realistic Aged Pergament Cards */}
                  <div className="relative w-full pt-1.5 pb-2">
                    {thirdSwipeJob && (
                      <motion.div
                        key={`stack-3-${thirdSwipeJob.id}`}
                        aria-hidden="true"
                        animate={{
                          rotate: dragIntent !== "idle" ? -0.9 : -1.3,
                          y: dragIntent !== "idle" ? 4 : 6,
                          scale: dragIntent !== "idle" ? 0.99 : 0.98,
                        }}
                        transition={{
                          duration: 0.58,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pointer-events-none absolute inset-x-7 top-5 bottom-0 z-0 rounded-[6px] border border-[#6a4c28]/80 opacity-75"
                        style={{
                          background:
                            "linear-gradient(180deg, #ddc79a 0%, #c8ad76 100%)",
                          boxShadow: "0 16px 32px rgba(8, 4, 1, 0.5)",
                        }}
                      />
                    )}

                    {nextSwipeJob && (
                      <motion.div
                        key={`stack-2-${nextSwipeJob.id}`}
                        aria-hidden="true"
                        animate={{
                          rotate: dragIntent !== "idle" ? 0.45 : 0.95,
                          y: dragIntent !== "idle" ? 1 : 3,
                          scale: dragIntent !== "idle" ? 1.005 : 0.992,
                        }}
                        transition={{
                          duration: 0.58,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pointer-events-none absolute inset-x-3.5 top-3 bottom-0.5 z-10 flex flex-col justify-end rounded-[6px] border border-[#6a4c28]/85 px-5 pb-2.5 opacity-92"
                        style={{
                          background:
                            "linear-gradient(180deg, #ead7b0 0%, #d9bf8e 100%)",
                          boxShadow: "0 20px 40px rgba(8, 4, 1, 0.48)",
                        }}
                      >
                        <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#4b361c]">
                          Next Scroll · {nextSwipeJob.compatibilityScore}% Fit —{" "}
                          {nextSwipeJob.title}
                        </p>
                      </motion.div>
                    )}

                    <AnimatePresence custom={lastExitDir} mode="popLayout">
                      <PhilosopherSwipeCard
                        key={topSwipeJob.id}
                        job={topSwipeJob}
                        folioIndex={currentFolioIndex}
                        totalFolios={totalDeckFolios}
                        isSaved={savedJobIds.includes(topSwipeJob.id)}
                        onSwipe={(dir) => handleSwipeDecision(dir, topSwipeJob)}
                        onSuperSmash={() => handleSuperSmash(topSwipeJob)}
                        onDragDirectionChange={setDragIntent}
                      />
                    </AnimatePresence>
                  </div>

                  {/* Compact Beveled Wax & Brass Seal Action Bar */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSwipeDecision("pass", topSwipeJob)}
                      title="Ataraxia · Pass (A / Left Arrow)"
                      className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[#d66659]/55 bg-gradient-to-b from-[#6f1d15] to-[#430f0a] px-4 text-[12px] font-medium text-[#fde6e2] shadow-[inset_0_1px_0_rgba(255,195,185,0.24),0_6px_16px_rgba(10,4,1,0.55)] transition-all hover:-translate-y-0.5 hover:from-[#8d261c] hover:to-[#5a160f]"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5 text-[#f7b2aa]"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 4l8 8M12 4l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-serif-display text-[15px] leading-none">
                        Ataraxia · Pass
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={passedHistoryIds.length === 0}
                      onClick={handleAnamnesisUndo}
                      title="Anamnesis · Recall Last Pass (Z)"
                      aria-label="Recall last passed pergament"
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#c8ab75]/55 bg-gradient-to-b from-[#46331b] to-[#261a0c] text-[#f3dfb8] shadow-[inset_0_1px_0_rgba(255,236,195,0.28),0_6px_14px_rgba(10,4,1,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#f0d096] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 6.5H10a3.5 3.5 0 1 1 0 7H6.5M3.5 6.5L6 4M3.5 6.5L6 9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSuperSmash(topSwipeJob)}
                      title="Summum Bonum · Claim & Build Dossier"
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[#d6be8e]/80 bg-gradient-to-b from-[#fcf0d6] to-[#e4ca98] px-4 text-[12px] font-medium text-[#24190d] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_16px_rgba(10,4,1,0.45)] transition-all hover:-translate-y-0.5 hover:from-[#fff6e3] hover:to-[#eed8ab]"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5 text-[#6a4c28]"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 1.8l1.6 4.1 4.1 1.6-4.1 1.6L8 13.2l-1.6-4.1-4.1-1.6 4.1-1.6L8 1.8z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="font-serif-display text-[15px] leading-none">
                        Claim &amp; Tailor
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSwipeDecision("smash", topSwipeJob)}
                      title="Amor Fati · Smash (D / Right Arrow)"
                      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[#3aa677]/65 bg-gradient-to-b from-[#178255] to-[#0b4b30] px-4.5 text-[12px] font-medium text-[#f2fcf7] shadow-[inset_0_1px_0_rgba(170,255,220,0.28),0_6px_18px_rgba(6,24,15,0.6)] transition-all hover:-translate-y-0.5 hover:from-[#1b9964] hover:to-[#0f613f]"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5 text-[#a2f0cb]"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.2 8.4l3.1 3.1 6.5-6.8"
                          stroke="currentColor"
                          strokeWidth="1.85"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-serif-display text-[15px] leading-none">
                        Amor Fati · Smash
                      </span>
                    </button>
                  </div>

                  {/* Single Slim Whisper Line */}
                  <p className="mt-2 max-w-[540px] truncate text-center font-serif-display text-[13.5px] italic text-[#ead8b8]/82">
                    “
                    {dragIntent === "smash"
                      ? "Amor Fati — claim this scroll into your Chosen archive."
                      : dragIntent === "pass"
                      ? "Ataraxia — release calmly and keep focus pure."
                      : oracleSpeech}
                    ”
                  </p>
                </div>
              ) : (
                /* FINISHED: CENTERED NO-SCROLL PERGAMENT SHOWING ONLY CHOSEN & PASSED JOBS */
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{
                    background:
                      "radial-gradient(ellipse at 25% 15%, #faf0d8 0%, #efdcba 50%, #dfbe89 100%)",
                    boxShadow:
                      "0 28px 65px rgba(8, 4, 1, 0.72), 0 8px 18px rgba(8, 4, 1, 0.48), 0 2px 0 #b89763",
                  }}
                  className="relative w-full rounded-[6px] border border-[#6a4c28]/85 px-5 py-2.5 text-[#24190d] sm:px-7"
                >
                  <RealisticPergamentTexture />
                  <PergamentScrollRod position="top" />

                  <div className="relative z-10">
                    {inspectedModalJob ? (
                      /* PERGAMENT JOB DETAIL + HIRE ODDS PROBABILITY GRAPH */
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#6e522d]/45 pb-2.5">
                          <button
                            type="button"
                            onClick={() => setInspectedModalJobId(null)}
                            className="cursor-pointer rounded-full border border-[#6a4c28]/70 bg-[#f6e8ca] px-3 py-1 font-mono text-[10.5px] font-medium text-[#24190d] transition-colors hover:bg-[#e8d5ae]"
                          >
                            &lt;- Back to Chosen &amp; Passed
                          </button>
                          <div className="flex items-center gap-1.5">
                            <FitBandBadge band={inspectedModalJob.fitBand} />
                            <StatusPill
                              label={inspectedModalJob.telosTag}
                              tone="navy"
                              dot={false}
                            />
                          </div>
                        </div>

                        <div className="mt-2.5">
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5c4529]">
                            {inspectedModalJob.company} · {inspectedModalJob.source} ·{" "}
                            {inspectedModalJob.arrangement}
                          </p>
                          <h2 className="mt-0.5 font-serif-display text-[24px] leading-tight text-[#24190d]">
                            {inspectedModalJob.title}
                          </h2>
                          <p className="text-[11.5px] text-[#5c4529]">
                            {inspectedModalJob.salary || "Salary unstated"} ·{" "}
                            {inspectedModalJob.location} ·{" "}
                            {inspectedModalJob.employmentType}
                          </p>
                        </div>

                        {/* Hire Odds Percentage Radial Gauge + 4-Bar Graph */}
                        <div className="mt-2.5">
                          <HireOddsGraph job={inspectedModalJob} variant="vellum" />
                        </div>

                        {/* Scroll-free Inner Requirements & Company Proof */}
                        <div className="mt-2.5 max-h-[26vh] space-y-2 overflow-y-auto pr-1 temple-inner-scroll">
                          <p className="rounded-[7px] border border-[#6e522d]/35 bg-[#f7ead0]/75 px-3 py-2 text-[11.5px] text-[#3a2813]">
                            <strong>Why you fit:</strong>{" "}
                            {inspectedModalJob.whyFitSummary}
                          </p>

                          {inspectedModalJob.requirements.map((req) => (
                            <div
                              key={req.text}
                              className="rounded-[7px] border border-[#6e522d]/45 bg-[#f7ead0]/85 px-3 py-2"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <p className="text-[12px] font-medium text-[#24190d]">
                                  {req.text}
                                </p>
                                <span
                                  className={`rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold ${
                                    req.status === "has"
                                      ? "bg-[#e3efe7] text-[#0b5e3c]"
                                      : req.status === "transferable"
                                      ? "bg-[#e6ecf4] text-[#213d63]"
                                      : "bg-[#f6e4de] text-[#8b2c1d]"
                                  }`}
                                >
                                  {req.status === "has"
                                    ? "Has on profile"
                                    : req.status === "transferable"
                                    ? "Transferable"
                                    : req.status === "improve"
                                    ? "Needs upgrade"
                                    : "Missing"}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[11px] text-[#5c4529]">
                                {req.profileEvidence}
                              </p>
                            </div>
                          ))}

                          {inspectedCompanyIntel && (
                            <div className="rounded-[7px] border border-[#6e522d]/40 bg-[#e6d2aa]/70 px-3 py-2 text-[11px] text-[#3a2813]">
                              <strong>Hiring velocity:</strong>{" "}
                              {inspectedCompanyIntel.hiringVelocity} ·{" "}
                              {inspectedCompanyIntel.cultureSignals}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#6e522d]/45 pt-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              selectJob(inspectedModalJob.id);
                              setDiscoveryMode("matrix");
                            }}
                            className="cursor-pointer rounded-full border border-[#6a4c28]/75 bg-[#f6e8ca] px-3.5 py-1 text-[11.5px] font-medium text-[#24190d] hover:bg-[#e8d5ae]"
                          >
                            Open in Matrix
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrepareApplication(inspectedModalJob)}
                            className="cursor-pointer rounded-full border border-[#3aa677]/65 bg-gradient-to-b from-[#178255] to-[#0b4b30] px-4 py-1 text-[11.5px] font-medium text-[#f2fcf7] shadow-xs hover:from-[#1b9964] hover:to-[#0f613f]"
                          >
                            Prepare Tailored Application -&gt;
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* CHOSEN & PASSED JOBS LIST */
                      <div>
                        <div className="flex flex-col justify-between gap-2 border-b border-[#6e522d]/45 pb-3 sm:flex-row sm:items-end">
                          <div>
                            <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#5c4529]">
                              Codex Verdict · Click Any Job For Odds &amp; Graph
                            </p>
                            <h2 className="mt-0.5 font-serif-display text-[25px] leading-tight text-[#24190d]">
                              {finishTab === "chosen"
                                ? `Chosen Jobs (${savedJobsList.length})`
                                : `Passed Jobs (${passedJobsList.length})`}
                            </h2>
                          </div>

                          <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#6e522d]/55 bg-[#e2cea4]/80 p-0.5">
                            <button
                              type="button"
                              onClick={() => setFinishTab("chosen")}
                              className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                                finishTab === "chosen"
                                  ? "bg-[#0d5939] text-[#faf6ed]"
                                  : "text-[#3a2813] hover:bg-[#efe0bf]"
                              }`}
                            >
                              Chosen ({savedJobsList.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setFinishTab("passed")}
                              className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                                finishTab === "passed"
                                  ? "bg-[#7e2017] text-[#faf6ed]"
                                  : "text-[#3a2813] hover:bg-[#efe0bf]"
                              }`}
                            >
                              Passed ({passedJobsList.length})
                            </button>
                          </div>
                        </div>

                        {/* ONLY Chosen Jobs or ONLY Passed Jobs List (bounded inner height, zero viewport scroll) */}
                        <div className="mt-3 max-h-[44vh] space-y-2.5 overflow-y-auto pr-1 temple-inner-scroll">
                          {finishTab === "chosen" ? (
                            savedJobsList.length === 0 ? (
                              <p className="rounded-[8px] border border-[#6e522d]/40 bg-[#f6e8ca]/70 px-4 py-6 text-center font-serif-display text-[17px] text-[#5c4529]">
                                No jobs chosen yet. Check the Passed tab to reclaim any role or unroll the stack again.
                              </p>
                            ) : (
                              savedJobsList.map((chosenJob, idx) => {
                                const odds = computeHireOddsMetrics(chosenJob);
                                return (
                                  <div
                                    key={chosenJob.id}
                                    onClick={() =>
                                      setInspectedModalJobId(chosenJob.id)
                                    }
                                    className="cursor-pointer rounded-[8px] border border-[#6e522d]/55 bg-[#f7ead0]/85 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,250,235,0.75)] transition-colors hover:border-[#3a2813] hover:bg-[#f2dfba]"
                                  >
                                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                      <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="rounded-sm border border-[#0b5e3c]/40 bg-[#e3efe7] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0b5e3c]">
                                            CHOSEN #{toRoman(idx + 1)}
                                          </span>
                                          <span
                                            className="rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold"
                                            style={{
                                              backgroundColor:
                                                "rgba(11, 94, 60, 0.13)",
                                              color: odds.toneColor,
                                            }}
                                          >
                                            {odds.overallOddsPct}% Hire Odds
                                          </span>
                                          <span className="font-mono text-[10px] text-[#5c4529]">
                                            {chosenJob.company}
                                          </span>
                                        </div>
                                        <h3 className="mt-0.5 truncate font-serif-display text-[19px] leading-tight text-[#24190d]">
                                          {chosenJob.title}
                                        </h3>
                                        <p className="text-[11.5px] text-[#5c4529]">
                                          {chosenJob.salary || "Salary unstated"} ·{" "}
                                          {chosenJob.location}
                                        </p>
                                      </div>

                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex shrink-0 flex-wrap items-center gap-1.5"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onToggleSave(chosenJob.id)
                                          }
                                          className="cursor-pointer rounded-full border border-[#6e522d]/55 bg-[#f6e8ca] px-2.5 py-1 text-[11px] font-medium text-[#5c4529] hover:border-[#8b2c1d] hover:text-[#8b2c1d]"
                                        >
                                          Remove
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setInspectedModalJobId(chosenJob.id)
                                          }
                                          className="cursor-pointer rounded-full border border-[#6a4c28]/70 bg-[#f6e8ca] px-2.5 py-1 text-[11px] font-medium text-[#24190d] hover:bg-[#e8d5ae]"
                                        >
                                          Detail &amp; Graph
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onPrepareApplication(chosenJob)
                                          }
                                          className="cursor-pointer rounded-full bg-[#24190d] px-3 py-1 text-[11px] font-medium text-[#faf0d7] hover:bg-[#3a2813]"
                                        >
                                          Prepare -&gt;
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )
                          ) : passedJobsList.length === 0 ? (
                            <p className="rounded-[8px] border border-[#6e522d]/40 bg-[#f6e8ca]/70 px-4 py-6 text-center font-serif-display text-[17px] text-[#5c4529]">
                              No passed jobs in this session.
                            </p>
                          ) : (
                            passedJobsList.map((passedJob, idx) => {
                              const odds = computeHireOddsMetrics(passedJob);
                              return (
                                <div
                                  key={passedJob.id}
                                  onClick={() =>
                                    setInspectedModalJobId(passedJob.id)
                                  }
                                  className="cursor-pointer rounded-[8px] border border-[#6e522d]/45 bg-[#e6d2aa]/70 px-3.5 py-2.5 transition-colors hover:border-[#3a2813] hover:bg-[#dfd0ab]"
                                >
                                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="rounded-sm border border-[#8b2c1d]/35 bg-[#f6e4de] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8b2c1d]">
                                          PASSED #{toRoman(idx + 1)}
                                        </span>
                                        <span
                                          className="rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold"
                                          style={{
                                            backgroundColor:
                                              "rgba(139, 44, 29, 0.1)",
                                            color: odds.toneColor,
                                          }}
                                        >
                                          {odds.overallOddsPct}% Hire Odds
                                        </span>
                                        <span className="font-mono text-[10px] text-[#5c4529]">
                                          {passedJob.company}
                                        </span>
                                      </div>
                                      <h3 className="mt-0.5 truncate font-serif-display text-[19px] leading-tight text-[#24190d]">
                                        {passedJob.title}
                                      </h3>
                                      <p className="text-[11.5px] text-[#5c4529]">
                                        {passedJob.salary || "Salary unstated"} ·{" "}
                                        {passedJob.location}
                                      </p>
                                    </div>

                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex shrink-0 flex-wrap items-center gap-1.5"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setInspectedModalJobId(passedJob.id)
                                        }
                                        className="cursor-pointer rounded-full border border-[#6a4c28]/70 bg-[#f6e8ca] px-2.5 py-1 text-[11px] font-medium text-[#24190d] hover:bg-[#e8d5ae]"
                                      >
                                        Detail &amp; Graph
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleReclaimPassedJob(
                                            passedJob.id,
                                            true
                                          )
                                        }
                                        className="cursor-pointer rounded-full bg-[#0d5939] px-3 py-1 text-[11px] font-medium text-[#faf6ed] hover:bg-[#14754d]"
                                      >
                                        Move to Chosen
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Compact Footer Controls */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#6e522d]/45 pt-2.5">
                          <button
                            type="button"
                            onClick={resetSwipeDeck}
                            className="cursor-pointer rounded-full border border-[#6a4c28]/75 bg-[#f6e8ca] px-3.5 py-1 text-[11.5px] font-medium text-[#24190d] hover:bg-[#e8d5ae]"
                          >
                            Unroll Stack Again
                          </button>
                          <button
                            type="button"
                            onClick={() => setDiscoveryMode("matrix")}
                            className="cursor-pointer rounded-full bg-[#24190d] px-4 py-1 text-[11.5px] font-medium text-[#faf0d7] hover:bg-[#3a2813]"
                          >
                            Return to Matrix -&gt;
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <PergamentScrollRod position="bottom" />
                </motion.div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
