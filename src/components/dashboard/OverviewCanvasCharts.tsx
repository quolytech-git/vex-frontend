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
 * 1. PREP ACTIVITY BAR CHART (Interactive Hover Canvas)
 * ========================================================================== */
export function OverviewPrepBarCanvas({
  days,
}: {
  days: { day: string; mins: number; active?: boolean }[];
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(320);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const height = 186;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 80) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    const padTop = 26;
    const padBottom = 26;
    const padX = 8;
    const plotW = Math.max(40, width - padX * 2);
    const plotH = height - padTop - padBottom;
    const maxVal = Math.max(60, ...days.map((d) => d.mins));
    const colStep = plotW / Math.max(1, days.length);
    const barW = Math.min(36, colStep * 0.64);

    // Subtle baseline
    ctx.beginPath();
    ctx.moveTo(padX, padTop + plotH);
    ctx.lineTo(width - padX, padTop + plotH);
    ctx.strokeStyle = "rgba(33, 45, 61, 0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    days.forEach((d, idx) => {
      const x = padX + colStep * idx + (colStep - barW) / 2;
      const barH = Math.max(14, (d.mins / maxVal) * plotH);
      const y = padTop + plotH - barH;
      const isHovered = hoverIdx === idx;
      const isHighlighted = isHovered || d.active;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 11);

      if (isHighlighted) {
        const g = ctx.createLinearGradient(x, y, x, y + barH);
        g.addColorStop(0, d.active ? "#e4decb" : "#33445c");
        g.addColorStop(1, d.active ? "#f3efe2" : "#212d3d");
        ctx.fillStyle = g;
        ctx.fill();

        if (d.active) {
          ctx.clip();
          ctx.strokeStyle = "rgba(33, 45, 61, 0.24)";
          ctx.lineWidth = 1.4;
          for (let sx = -barH; sx < barW + barH; sx += 7) {
            ctx.beginPath();
            ctx.moveTo(x + sx, y + barH);
            ctx.lineTo(x + sx + barH * 0.7, y);
            ctx.stroke();
          }
        }
      } else {
        ctx.fillStyle = "#efe9da";
        ctx.fill();
      }
      ctx.restore();

      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 11);
      ctx.strokeStyle = isHovered
        ? "#212d3d"
        : d.active
        ? "rgba(33, 45, 61, 0.65)"
        : "rgba(33, 45, 61, 0.1)";
      ctx.lineWidth = isHovered ? 1.6 : 1;
      ctx.stroke();

      // Hover or active pill above bar
      if (isHovered || (hoverIdx === null && d.active)) {
        const label = `${d.mins}m`;
        ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
        const pillW = ctx.measureText(label).width + 12;
        const px = Math.max(4, Math.min(width - pillW - 4, x + barW / 2 - pillW / 2));
        ctx.beginPath();
        ctx.roundRect(px, Math.max(2, y - 21), pillW, 17, 8.5);
        ctx.fillStyle = "#212d3d";
        ctx.fill();
        ctx.fillStyle = "#faf6ed";
        ctx.textAlign = "center";
        ctx.fillText(label, px + pillW / 2, Math.max(13, y - 9));
      }

      // Day label
      ctx.fillStyle = isHighlighted ? "#212d3d" : "#5a6675";
      ctx.font = `${isHighlighted ? "600" : "500"} 10.5px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(d.day, x + barW / 2, height - 7);
    });
  }, [width, days, hoverIdx]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const idx = Math.floor((relX / Math.max(1, width)) * days.length);
    if (idx >= 0 && idx < days.length) setHoverIdx(idx);
    else setHoverIdx(null);
  };

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        style={{ width: "100%", height }}
        className="block cursor-pointer"
        aria-label="Weekly interview and study preparation bar chart"
      />
    </div>
  );
}

/* ============================================================================
 * 2. COMPARISON OF FIT & READINESS TRAJECTORY CANVAS (Dual Curve + Hover Tooltip)
 * ========================================================================== */
export function OverviewReadinessLineCanvas({
  vexSeries,
  baseSeries,
  labels,
}: {
  vexSeries: number[];
  baseSeries: number[];
  labels: string[];
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(440);
  const [hoverIdx, setHoverIdx] = useState<number | null>(4);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    const padL = 16;
    const padR = 16;
    const padT = 24;
    const padB = 26;
    const plotW = Math.max(60, width - padL - padR);
    const plotH = height - padT - padB;
    const minVal = 45;
    const maxVal = 100;

    const toPt = (val: number, i: number) => ({
      x: padL + (plotW * i) / Math.max(1, labels.length - 1),
      y: padT + plotH * (1 - (val - minVal) / (maxVal - minVal)),
    });

    const vexPts = vexSeries.map((v, i) => toPt(v, i));
    const basePts = baseSeries.map((v, i) => toPt(v, i));

    // Hairline horizontal reference lines
    [0.25, 0.55, 0.85].forEach((r) => {
      const y = padT + plotH * r;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(width - padR, y);
      ctx.strokeStyle = "rgba(33, 45, 61, 0.08)";
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Diagonal hatch delta region between VEX curve and BASE CV curve
    ctx.save();
    ctx.beginPath();
    vexPts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    for (let i = basePts.length - 1; i >= 0; i -= 1) {
      ctx.lineTo(basePts[i].x, basePts[i].y);
    }
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    fillGrad.addColorStop(0, "rgba(132, 169, 220, 0.25)");
    fillGrad.addColorStop(1, "rgba(132, 169, 220, 0.04)");
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.clip();
    ctx.strokeStyle = "rgba(33, 45, 61, 0.14)";
    ctx.lineWidth = 1.1;
    for (let hx = -plotH; hx < width + plotH; hx += 8) {
      ctx.beginPath();
      ctx.moveTo(hx, padT + plotH);
      ctx.lineTo(hx + plotH * 0.7, padT);
      ctx.stroke();
    }
    ctx.restore();

    // Base CV dashed curve
    ctx.beginPath();
    basePts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = "rgba(90, 102, 117, 0.72)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Primary Vex Trajectory curve
    ctx.beginPath();
    vexPts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = "#212d3d";
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Active hovered point & lift badge
    const activeI = hoverIdx ?? 4;
    const ap = vexPts[activeI];
    const bp = basePts[activeI];
    if (ap && bp) {
      ctx.beginPath();
      ctx.moveTo(ap.x, padT);
      ctx.lineTo(ap.x, padT + plotH);
      ctx.strokeStyle = "rgba(6, 118, 71, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ap.x, ap.y, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6, 118, 71, 0.18)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ap.x, ap.y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = "#067647";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const delta = vexSeries[activeI] - baseSeries[activeI];
      const badge = `+${delta}% (${vexSeries[activeI]}%)`;
      ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      const bw = ctx.measureText(badge).width + 14;
      const bx = Math.max(4, Math.min(width - bw - 4, ap.x - bw / 2));
      ctx.beginPath();
      ctx.roundRect(bx, Math.max(2, ap.y - 24), bw, 17, 8.5);
      ctx.fillStyle = "#067647";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(badge, bx + bw / 2, Math.max(13, ap.y - 12));
    }

    // X-axis weekday labels
    labels.forEach((lbl, i) => {
      const p = vexPts[i];
      ctx.fillStyle = i === activeI ? "#212d3d" : "#5a6675";
      ctx.font = `${i === activeI ? "600" : "500"} 10.5px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(lbl, p.x, height - 7);
    });
  }, [width, vexSeries, baseSeries, labels, hoverIdx]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - 16;
    const span = Math.max(1, width - 32);
    const idx = Math.round((relX / span) * (labels.length - 1));
    if (idx >= 0 && idx < labels.length) setHoverIdx(idx);
  };

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        style={{ width: "100%", height }}
        className="block cursor-pointer"
        aria-label="Comparison of Vex path fit score versus baseline CV over the week"
      />
    </div>
  );
}

/* ============================================================================
 * 3. PIPELINE VELOCITY CANVAS CURVE (Real Interactive Stage Milestones)
 * ========================================================================== */
export function OverviewVelocityCanvas({
  points,
  labels,
  interviewsCount,
}: {
  points: number[];
  labels: string[];
  interviewsCount: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(260);
  const [hoverIdx, setHoverIdx] = useState<number | null>(3);
  const height = 148;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 100) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    const padL = 12;
    const padR = 14;
    const padT = 24;
    const padB = 22;
    const plotW = Math.max(40, width - padL - padR);
    const plotH = height - padT - padB;
    const maxV = Math.max(10, ...points);

    const coords = points.map((v, i) => ({
      x: padL + (plotW * i) / Math.max(1, points.length - 1),
      y: padT + plotH * (1 - v / maxV),
    }));

    // Emerald soft gradient wash under line
    ctx.beginPath();
    coords.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.lineTo(coords[coords.length - 1].x, padT + plotH);
    ctx.lineTo(coords[0].x, padT + plotH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    grad.addColorStop(0, "rgba(6, 118, 71, 0.2)");
    grad.addColorStop(1, "rgba(6, 118, 71, 0.01)");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    coords.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = "rgba(33, 45, 61, 0.72)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const activeIdx = hoverIdx ?? 3;
    coords.forEach((p, i) => {
      const isActive = i === activeIdx;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isActive ? 5.5 : 3.6, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "#067647" : "#212d3d";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (labels[i]) {
        ctx.fillStyle = isActive ? "#212d3d" : "#5a6675";
        ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], p.x, height - 5);
      }
    });

    const ap = coords[activeIdx];
    if (ap) {
      const txt =
        activeIdx === 3
          ? `${interviewsCount} INTERVIEWS`
          : `${points[activeIdx]} ROLES`;
      ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      const bw = ctx.measureText(txt).width + 12;
      const bx = Math.max(4, Math.min(width - bw - 4, ap.x - bw / 2));
      ctx.beginPath();
      ctx.roundRect(bx, Math.max(2, ap.y - 23), bw, 17, 8.5);
      ctx.fillStyle = "#212d3d";
      ctx.fill();
      ctx.fillStyle = "#faf6ed";
      ctx.textAlign = "center";
      ctx.fillText(txt, bx + bw / 2, Math.max(13, ap.y - 11));
    }
  }, [width, points, labels, interviewsCount, hoverIdx]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const idx = Math.round(
            ((e.clientX - rect.left) / Math.max(1, width)) * (points.length - 1)
          );
          if (idx >= 0 && idx < points.length) setHoverIdx(idx);
        }}
        style={{ width: "100%", height }}
        className="block cursor-pointer"
        aria-label="Pipeline conversion velocity chart"
      />
    </div>
  );
}

