"use client";

import React, { useEffect, useRef, useState } from "react";

function setupHiDpiCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null {
  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
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
 * 1. WEEKLY STUDY PROGRESS & MASTERY TRACKER CANVAS
 * ========================================================================== */
export function LearningTrackerChartCanvas({
  hoursByDay,
  hwDone,
  hwTotal,
  watchedCount,
}: {
  hoursByDay: { day: string; mins: number }[];
  hwDone: number;
  hwTotal: number;
  watchedCount: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(420);
  const height = 148;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    const padLeft = 28;
    const padRight = 14;
    const padTop = 18;
    const padBottom = 26;
    const plotW = Math.max(40, width - padLeft - padRight);
    const plotH = height - padTop - padBottom;
    const maxMins = Math.max(
      90,
      ...hoursByDay.map((d) => d.mins)
    );

    // Horizontal stone reference rules
    [0.25, 0.5, 0.75, 1].forEach((ratio) => {
      const y = padTop + plotH * (1 - ratio);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.strokeStyle = "rgba(182, 169, 142, 0.35)";
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Left Y labels
    ctx.fillStyle = "#7a6b4e";
    ctx.font = "500 9px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${maxMins}m`, padLeft - 5, padTop + 5);
    ctx.fillText("0", padLeft - 5, padTop + plotH);

    // Carved stone columns for study minutes
    const stepW = plotW / Math.max(1, hoursByDay.length);
    const barW = Math.min(28, stepW * 0.56);

    hoursByDay.forEach((d, idx) => {
      const x = padLeft + stepW * idx + (stepW - barW) / 2;
      const barH = Math.max(6, (d.mins / maxMins) * plotH);
      const y = padTop + plotH - barH;

      // Pedestal shadow
      ctx.beginPath();
      ctx.roundRect(x + 1.5, y + 1.5, barW, barH, [6, 6, 2, 2]);
      ctx.fillStyle = "rgba(33, 45, 61, 0.08)";
      ctx.fill();

      // Column gradient (Prussian slate when strong day, olive/travertine otherwise)
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      if (d.mins >= 60) {
        grad.addColorStop(0, "#33475e");
        grad.addColorStop(1, "#1e2938");
      } else {
        grad.addColorStop(0, "#859f6e");
        grad.addColorStop(1, "#5c7547");
      }
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [6, 6, 2, 2]);
      ctx.fillStyle = grad;
      ctx.fill();

      // Top highlight chisel line
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 2);
      ctx.lineTo(x + barW - 4, y + 2);
      ctx.strokeStyle = "rgba(255, 254, 249, 0.45)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Day label
      ctx.fillStyle = "#5c5344";
      ctx.font = "500 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(d.day, x + barW / 2, height - 8);
    });

    // Top-right live telemetry chip drawn cleanly
    ctx.fillStyle = "#212d3d";
    ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "right";
    ctx.fillText(
      `HW ${hwDone}/${hwTotal} · LECTURES ${watchedCount}`,
      width - padRight,
      11
    );
  }, [width, hoursByDay, hwDone, hwTotal, watchedCount]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height }}
        className="block"
        aria-label="Weekly study minutes and homework completion tracker chart"
      />
    </div>
  );
}

/* ============================================================================
 * 2. INTERACTIVE LECTURE DIAGRAM STAGE CANVAS (Playable Architecture Theater)
 * ========================================================================== */
export function LectureTheaterCanvas({
  courseId,
  chapterIndex,
  progressPct,
  isPlaying,
}: {
  courseId: string;
  chapterIndex: number;
  progressPct: number;
  isPlaying: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(560);
  const height = 236;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 180) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    // Classical slate blueprint theatre backdrop
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#1c2635");
    bgGrad.addColorStop(1, "#2a394e");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Architectural drafting grid lines
    ctx.strokeStyle = "rgba(250, 246, 237, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 24; x < width; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 24; y < height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Chapter Nodes Pipeline (4 interactive architectural stages across the canvas)
    const nodes =
      courseId === "crs-1"
        ? [
            { title: "Raw Signups", sub: "events.ts" },
            { title: "Cohort CTE", sub: "DATE_TRUNC" },
            { title: "Funnel Join", sub: "LEFT JOIN" },
            { title: "Drop-Off Audit", sub: "Conversion %" },
          ]
        : courseId === "crs-2"
        ? [
            { title: "HTTP 503", sub: "Detect fault" },
            { title: "Local Cache", sub: "Keep draft" },
            { title: "Backoff Retry", sub: "1.5s jitter" },
            { title: "Manual Fallback", sub: "Safe route" },
          ]
        : [
            { title: "Context Brief", sub: "1-line thesis" },
            { title: "Trade-Off Matrix", sub: "Cost vs Risk" },
            { title: "Rollout Gate", sub: "KPI owner" },
            { title: "Exec Sign-Off", sub: "Clean memo" },
          ];

    const startX = 48;
    const endX = width - 48;
    const cy = height * 0.5;
    const span = Math.max(80, endX - startX);
    const activeFloat = (progressPct / 100) * (nodes.length - 1);

    // Connecting baseline conduit
    ctx.beginPath();
    ctx.moveTo(startX, cy);
    ctx.lineTo(endX, cy);
    ctx.strokeStyle = "rgba(232, 222, 200, 0.24)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Illuminated active progression line
    const pulseX = startX + (span * Math.min(100, Math.max(0, progressPct))) / 100;
    ctx.beginPath();
    ctx.moveTo(startX, cy);
    ctx.lineTo(pulseX, cy);
    ctx.strokeStyle = "#d9be83";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Travelling golden packet node
    ctx.beginPath();
    ctx.arc(pulseX, cy, isPlaying ? 7 : 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fffef9";
    ctx.fill();
    ctx.strokeStyle = "#d9be83";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw each stage pedestal pill
    nodes.forEach((n, idx) => {
      const nx = startX + (span * idx) / (nodes.length - 1);
      const isActive = idx === chapterIndex || idx <= Math.floor(activeFloat);
      const boxW = Math.min(106, Math.max(74, width / 5.4));
      const boxH = 54;
      const bx = Math.max(10, Math.min(width - boxW - 10, nx - boxW / 2));
      const by = idx % 2 === 0 ? cy - 78 : cy + 26;

      // Vertical stem to main conduit
      ctx.beginPath();
      ctx.moveTo(nx, cy);
      ctx.lineTo(nx, idx % 2 === 0 ? by + boxH : by);
      ctx.strokeStyle = isActive
        ? "rgba(217, 190, 131, 0.75)"
        : "rgba(250, 246, 237, 0.2)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Box pill
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 12);
      ctx.fillStyle = isActive ? "#faf6ed" : "rgba(250, 246, 237, 0.1)";
      ctx.fill();
      ctx.strokeStyle =
        idx === chapterIndex
          ? "#d9be83"
          : isActive
          ? "#d6cbb2"
          : "rgba(250, 246, 237, 0.2)";
      ctx.lineWidth = idx === chapterIndex ? 2 : 1;
      ctx.stroke();

      // Node text
      ctx.fillStyle = isActive ? "#212d3d" : "#ebe4d4";
      ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(n.title, bx + boxW / 2, by + 23);

      ctx.fillStyle = isActive ? "#6e624d" : "#b8b09c";
      ctx.font = "500 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(n.sub, bx + boxW / 2, by + 40);
    });

    // Top-left theatre header overlay inside canvas
    ctx.fillStyle = "rgba(250, 246, 237, 0.72)";
    ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      isPlaying
        ? `LECTURE PLAYBACK ACTIVE // CH ${chapterIndex + 1} (${Math.round(progressPct)}%)`
        : `LECTURE PAUSED // CHAPTER ${chapterIndex + 1} OF 4`,
      16,
      20
    );
  }, [width, courseId, chapterIndex, progressPct, isPlaying]);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden rounded-[16px] border border-[#2d3b4e]">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height }}
        className="block"
        aria-label="Interactive architecture lecture walkthrough stage"
      />
    </div>
  );
}

