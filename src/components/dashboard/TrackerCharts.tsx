"use client";

import React, { useEffect, useRef, useState } from "react";
import type { DashboardApplication } from "@/data/dashboard";

function setupHiDpiCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null {
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const targetW = Math.max(1, Math.round(width * dpr));
  const targetH = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

/* ============================================================================
 * 1. SCULPTED CLASSICAL CHRONOMETER DIAL RING (HTML5 <canvas>)
 * ========================================================================== */
export function TrackerChronometerCanvas({
  elapsedMinutes,
  isRunning,
}: {
  elapsedMinutes: number;
  isRunning: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = 216;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, size, size);
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 88;
    const innerR = 64;

    // Outer recessed circular limestone channel
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 250, 238, 0.22)";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner engraved glass/stone dial ring
    const innerGrad = ctx.createRadialGradient(cx - 18, cy - 22, 8, cx, cy, innerR);
    innerGrad.addColorStop(0, "rgba(255, 252, 244, 0.16)");
    innerGrad.addColorStop(1, "rgba(28, 39, 30, 0.34)");
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 238, 220, 0.28)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // 12 classical sundial / horology dot markers inside ring
    for (let i = 0; i < 12; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 12;
      const mx = cx + Math.cos(a) * (innerR - 9);
      const my = cy + Math.sin(a) * (innerR - 9);
      ctx.beginPath();
      ctx.arc(mx, my, i % 3 === 0 ? 1.8 : 1.1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250, 246, 237, 0.68)";
      ctx.fill();
    }

    // Active progress arc (mapped cleanly against 10h daily focus target = 600 min)
    const ratio = Math.max(0.08, Math.min(0.96, (elapsedMinutes % 600) / 600));
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + Math.PI * 2 * ratio;

    // Subtle chisel shadow under ivory progress ring
    ctx.beginPath();
    ctx.arc(cx, cy + 1, outerR, startAngle, endAngle);
    ctx.strokeStyle = "rgba(18, 28, 20, 0.35)";
    ctx.lineWidth = 6.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Illuminated marble-ivory progress ring
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.strokeStyle = isRunning ? "#fffef9" : "#ede5d2";
    ctx.lineWidth = 5.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Sculpted pearl finial knob at end of progress arc
    const kx = cx + Math.cos(endAngle) * outerR;
    const ky = cy + Math.sin(endAngle) * outerR;
    ctx.beginPath();
    ctx.arc(kx, ky, 5.2, 0, Math.PI * 2);
    ctx.fillStyle = "#fffef9";
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(33, 45, 61, 0.35)";
    ctx.stroke();
  }, [elapsedMinutes, isRunning]);

  const hours = String(Math.floor(elapsedMinutes / 60)).padStart(2, "0");
  const mins = String(elapsedMinutes % 60).padStart(2, "0");

  return (
    <div className="relative mx-auto flex h-[216px] w-[216px] items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
        aria-label={`Chronometer ring showing ${hours}:${mins} hours`}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[29px] font-semibold tracking-tight text-[#fffef9]">
          {hours}:{mins}
        </span>
        <span className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#e7dfcc]">
          {isRunning ? "Hours · Active" : "Hours · Paused"}
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. CARVED APPLICATIONS CADENCE TIMELINE CHART (HTML5 <canvas>)
 * ========================================================================== */
const CADENCE_TIME_LABELS = ["09:00", "10:00", "11:00", "12:00", "01 pm", "02 pm", "03 pm"];

interface PillSegment {
  app: DashboardApplication;
  row: number;
  x1Ratio: number;
  x2Ratio: number;
  palette: [string, string, string];
}

export function ApplicationsCadenceCanvas({
  applications,
  selectedDayLabel = "Today",
  onSelectApp,
}: {
  applications: DashboardApplication[];
  selectedDayLabel?: string;
  onSelectApp: (appId: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(440);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const height = 186;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 120) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visibleApps = applications.slice(0, 3);
  const rowDates = [selectedDayLabel, "Day -1", "Day -2"];

  const segments: PillSegment[] = visibleApps.map((app, idx) => {
    const stageBias =
      app.stage === "Interview"
        ? 0.16
        : app.stage === "Applied"
        ? 0.08
        : app.stage === "Offer"
        ? 0.22
        : 0;
    const presets: [number, number, [string, string, string]][] = [
      [0.2 + stageBias * 0.3, Math.min(0.95, 0.78 + stageBias * 0.4), ["#96b36b", "#648349", "#486135"]],
      [0.12 + stageBias * 0.2, Math.min(0.92, 0.68 + stageBias * 0.4), ["#d3aee0", "#a67bb8", "#79528b"]],
      [0.32 + stageBias * 0.2, Math.min(0.96, 0.86 + stageBias * 0.3), ["#b8c98e", "#7f9458", "#58683a"]],
    ];
    const [x1Ratio, x2Ratio, palette] = presets[idx % presets.length];
    return { app, row: idx, x1Ratio, x2Ratio, palette };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    const padLeft = 44;
    const padRight = 14;
    const padTop = 14;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Stone slate Y/X baseline
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(width - padRight, padTop + plotH);
    ctx.strokeStyle = "#d9ceb8";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vertical dashed time columns
    CADENCE_TIME_LABELS.forEach((lbl, idx) => {
      const x = padLeft + (idx / (CADENCE_TIME_LABELS.length - 1)) * plotW;
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + plotH);
      ctx.strokeStyle = "#e6dcc7";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#6d6250";
      ctx.font = "500 9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(lbl, x, height - 8);
    });

    const rowHeight = plotH / Math.max(1, visibleApps.length || 3);

    segments.forEach((seg, idx) => {
      const cy = padTop + rowHeight * (idx + 0.5);
      const pillH = 22;
      const y = cy - pillH / 2;
      const startX = padLeft + seg.x1Ratio * plotW;
      const endX = padLeft + seg.x2Ratio * plotW;
      const splitGap = 6;
      const splitX = startX + (endX - startX) * 0.44;
      const isHovered = hoverRow === idx;

      // Date label on Y-axis
      ctx.fillStyle = isHovered ? "#212d3d" : "#6d6250";
      ctx.font = `${isHovered ? "700" : "500"} 9.5px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "right";
      ctx.fillText(rowDates[idx] || `D-${idx + 1}`, padLeft - 8, cy + 3);

      // Draw two sculpted stone/mineral capsules per role row matching reference layout
      const parts = [
        { x: startX, w: Math.max(24, splitX - startX - splitGap / 2), opacity: 1 },
        { x: splitX + splitGap / 2, w: Math.max(24, endX - splitX - splitGap / 2), opacity: 0.72 },
      ];

      parts.forEach((part, pIdx) => {
        ctx.save();
        ctx.globalAlpha = part.opacity;
        const grad = ctx.createLinearGradient(part.x, y, part.x + part.w, y + pillH);
        grad.addColorStop(0, seg.palette[0]);
        grad.addColorStop(0.55, seg.palette[1]);
        grad.addColorStop(1, seg.palette[2]);

        ctx.beginPath();
        ctx.roundRect(part.x, y, part.w, pillH, pillH / 2);
        ctx.fillStyle = grad;
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = "#212d3d";
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // Top sunlit chisel bevel highlight
        ctx.beginPath();
        ctx.moveTo(part.x + 10, y + 2);
        ctx.lineTo(part.x + part.w - 10, y + 2);
        ctx.strokeStyle = "rgba(255, 254, 249, 0.45)";
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Carved ivory start dot inside capsule
        ctx.beginPath();
        ctx.arc(part.x + 11, cy, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = pIdx === 0 ? "#fffef9" : "rgba(255, 254, 249, 0.8)";
        ctx.fill();
        ctx.restore();
      });
    });
  }, [width, segments, hoverRow, visibleApps.length]);

  const handlePointer = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const padTop = 14;
    const padBottom = 26;
    const plotH = height - padTop - padBottom;
    const relY = e.clientY - rect.top - padTop;
    const row = Math.floor((relY / plotH) * Math.max(1, visibleApps.length));
    if (row >= 0 && row < visibleApps.length) setHoverRow(row);
    else setHoverRow(null);
  };

  const hovered = hoverRow !== null ? visibleApps[hoverRow] : null;

  return (
    <div ref={wrapRef} className="relative w-full">
      {hovered && (
        <div className="mb-1 flex items-center justify-between rounded-[10px] border border-[#dcd2bd] bg-[#faf6ed] px-2.5 py-1 text-[10.5px]">
          <span className="font-semibold text-[#212d3d]">
            {hovered.company} · {hovered.title}
          </span>
          <span className="font-mono text-[#5a6675]">
            Stage: {hovered.stage} · {hovered.deadline}
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handlePointer}
        onMouseLeave={() => setHoverRow(null)}
        onClick={() => {
          if (hoverRow !== null && visibleApps[hoverRow]) {
            onSelectApp(visibleApps[hoverRow].id);
          }
        }}
        style={{ width: "100%", height }}
        className="block cursor-pointer"
        aria-label="Applications timeline cadence horizontal pill chart"
      />
    </div>
  );
}

/* ============================================================================
 * 3. INTERACTIVE 3-STATE SUBMISSION SHARE STONE BAR (HTML5 <canvas>)
 * ========================================================================== */
export type SubmissionFilterMode =
  | "all"
  | "prepared"
  | "user-reported-submitted"
  | "verified-submitted";

export function SubmissionShareCanvas({
  prepared,
  reported,
  verified,
  activeFilter,
  onSelectFilter,
}: {
  prepared: number;
  reported: number;
  verified: number;
  activeFilter: SubmissionFilterMode;
  onSelectFilter: (mode: SubmissionFilterMode) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(260);
  const height = 24;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 60) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const total = Math.max(1, prepared + reported + verified);
  const segments: {
    mode: SubmissionFilterMode;
    label: string;
    count: number;
    pct: number;
    top: string;
    bottom: string;
  }[] = [
    {
      mode: "prepared",
      label: "Prep",
      count: prepared,
      pct: Math.round((prepared / total) * 100),
      top: "#88b272",
      bottom: "#587d45",
    },
    {
      mode: "user-reported-submitted",
      label: "Self",
      count: reported,
      pct: Math.round((reported / total) * 100),
      top: "#33445a",
      bottom: "#1d2735",
    },
    {
      mode: "verified-submitted",
      label: "Proof",
      count: verified,
      pct: Math.round((verified / total) * 100),
      top: "#dec078",
      bottom: "#ab8333",
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    // Carved channel background
    ctx.beginPath();
    ctx.roundRect(0.5, 0.5, width - 1, height - 1, height / 2);
    ctx.fillStyle = "#efe7d6";
    ctx.fill();
    ctx.strokeStyle = "#cfc2a5";
    ctx.lineWidth = 1;
    ctx.stroke();

    const gap = 3;
    const pad = 3;
    const usableW = width - pad * 2 - gap * 2;
    let cursorX = pad;

    segments.forEach((seg) => {
      const share = Math.max(0.12, seg.count / total);
      const segW = Math.max(18, usableW * share);
      const isSelected = activeFilter === seg.mode;

      const grad = ctx.createLinearGradient(cursorX, pad, cursorX, height - pad);
      grad.addColorStop(0, seg.top);
      grad.addColorStop(1, seg.bottom);

      ctx.beginPath();
      ctx.roundRect(cursorX, pad, segW, height - pad * 2, (height - pad * 2) / 2);
      ctx.fillStyle = grad;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = "#212d3d";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cursorX + 6, pad + 1.5);
      ctx.lineTo(cursorX + Math.max(cursorX + 6, cursorX + segW - 6), pad + 1.5);
      ctx.strokeStyle = "rgba(255, 254, 249, 0.48)";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      cursorX += segW + gap;
    });
  }, [width, prepared, reported, verified, activeFilter, total]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pad = 3;
    const gap = 3;
    const usableW = Math.max(1, width - pad * 2 - gap * 2);
    let cursorX = pad;
    for (const seg of segments) {
      const share = Math.max(0.12, seg.count / total);
      const segW = Math.max(18, usableW * share);
      if (clickX <= cursorX + segW + gap / 2) {
        onSelectFilter(activeFilter === seg.mode ? "all" : seg.mode);
        return;
      }
      cursorX += segW + gap;
    }
  };

  return (
    <div ref={wrapRef} className="w-full space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#5c5344]">
        {segments.map((seg) => (
          <button
            key={seg.mode}
            type="button"
            onClick={() => onSelectFilter(activeFilter === seg.mode ? "all" : seg.mode)}
            className={`cursor-pointer rounded-full px-2 py-0.5 transition-colors ${
              activeFilter === seg.mode
                ? "bg-[#212d3d] text-[#faf6ed]"
                : "hover:bg-[#efe6d2] hover:text-[#212d3d]"
            }`}
          >
            {seg.pct}% {seg.label} ({seg.count})
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: "100%", height }}
        className="block cursor-pointer"
        aria-label="Interactive 3-state pipeline proof bar chart"
      />
    </div>
  );
}


