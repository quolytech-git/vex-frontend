"use client";

import React, { useEffect, useRef, useState } from "react";

/** Configure crisp Retina/HiDPI scaling on an HTML5 <canvas>. */
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

/** Paint a subtle procedural travertine/limestone or dark basalt carved tablet backdrop. */
function paintCarvedStoneTablet(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  variant: "limestone" | "basalt" = "limestone",
  radius = 10
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, width - 1, height - 1, radius);

  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (variant === "basalt") {
    grad.addColorStop(0, "#25303f");
    grad.addColorStop(0.55, "#1d2633");
    grad.addColorStop(1, "#161d27");
  } else {
    grad.addColorStop(0, "#f5efe1");
    grad.addColorStop(0.5, "#ece3cf");
    grad.addColorStop(1, "#e2d6bc");
  }
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.clip();

  // Delicate diagonal mineral marble veins (deterministic math, zero flicker)
  ctx.strokeStyle =
    variant === "basalt" ? "rgba(218, 198, 152, 0.06)" : "rgba(130, 112, 82, 0.08)";
  ctx.lineWidth = 0.85;
  for (let v = 0; v < 5; v += 1) {
    ctx.beginPath();
    const startY = (v * 0.24 + 0.08) * height;
    ctx.moveTo(-8, startY);
    ctx.bezierCurveTo(
      width * 0.32,
      startY + (v % 2 === 0 ? -12 : 11),
      width * 0.68,
      startY + (v % 2 === 0 ? 10 : -11),
      width + 8,
      startY - 6
    );
    ctx.stroke();
  }

  // Fine mineral grain speckles
  ctx.fillStyle =
    variant === "basalt" ? "rgba(255, 250, 235, 0.035)" : "rgba(92, 78, 56, 0.045)";
  for (let i = 0; i < 42; i += 1) {
    const px = ((i * 73 + 19) % 100) * 0.01 * width;
    const py = ((i * 41 + 31) % 100) * 0.01 * height;
    ctx.fillRect(px, py, 1.3, 1.3);
  }

  // Upper-left sunlit stone bevel + lower-right recessed chisel border
  ctx.beginPath();
  ctx.roundRect(1.5, 1.5, width - 3, height - 3, Math.max(2, radius - 1));
  ctx.strokeStyle =
    variant === "basalt" ? "rgba(255, 245, 220, 0.1)" : "rgba(255, 254, 249, 0.72)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, width - 1, height - 1, radius);
  ctx.strokeStyle = variant === "basalt" ? "#111720" : "#c7b89a";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

/** Draw an incised/chiseled 3D relief stroke (dark cut + lower-right sunlit lip). */
function strokeChiseledCurve(
  ctx: CanvasRenderingContext2D,
  coords: { x: number; y: number }[],
  grooveColor: string,
  highlightColor: string,
  lineWidth = 2.2
) {
  if (coords.length < 2) return;
  // Bright edge highlight directly below the chisel cut for tactile stone depth
  ctx.save();
  ctx.beginPath();
  coords.forEach((c, idx) => {
    if (idx === 0) ctx.moveTo(c.x + 0.6, c.y + 1.1);
    else ctx.lineTo(c.x + 0.6, c.y + 1.1);
  });
  ctx.strokeStyle = highlightColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  // Main chiseled pigment stroke
  ctx.beginPath();
  coords.forEach((c, idx) => {
    if (idx === 0) ctx.moveTo(c.x, c.y);
    else ctx.lineTo(c.x, c.y);
  });
  ctx.strokeStyle = grooveColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

/** Paint a sculpted miniature fluted stone pillar bar with base plinth and capital. */
function drawFlutedStoneColumn(
  ctx: CanvasRenderingContext2D,
  x: number,
  bottomY: number,
  barW: number,
  barH: number,
  tone: "travertine" | "serpentine" | "lapis" | "ochre",
  active: boolean
) {
  const topY = bottomY - barH;
  const plinthH = 3.5;
  const capH = 3.5;
  const shaftTop = topY + capH;
  const shaftH = Math.max(4, barH - plinthH - capH);

  const palettes = {
    travertine: ["#f3ecda", "#d8cbb0", "#b5a483"],
    serpentine: ["#cbe0cf", "#82ad8e", "#4b7558"],
    lapis: ["#d0dfef", "#7f9ec0", "#456388"],
    ochre: ["#efe1c8", "#cda976", "#8c693a"],
  };
  const [light, mid, dark] = active
    ? ["#e6c985", "#b78e3b", "#6e511b"]
    : palettes[tone];

  // Marble cylindrical gradient across column shaft
  const shaftGrad = ctx.createLinearGradient(x, 0, x + barW, 0);
  shaftGrad.addColorStop(0, light);
  shaftGrad.addColorStop(0.45, mid);
  shaftGrad.addColorStop(1, dark);

  // Subtle cast shadow right of column
  ctx.fillStyle = "rgba(33, 45, 61, 0.14)";
  ctx.fillRect(x + barW - 1, topY + 2, 3, barH - 2);

  // Shaft body
  ctx.fillStyle = shaftGrad;
  ctx.fillRect(x + 1, shaftTop, barW - 2, shaftH);

  // Carved vertical Doric flutes inside shaft
  if (shaftH > 7) {
    const fluteCount = 3;
    for (let f = 1; f <= fluteCount; f += 1) {
      const fx = x + 1 + ((barW - 2) * f) / (fluteCount + 1);
      ctx.beginPath();
      ctx.moveTo(fx, shaftTop + 2);
      ctx.lineTo(fx, shaftTop + shaftH - 2);
      ctx.strokeStyle = "rgba(33, 45, 61, 0.24)";
      ctx.lineWidth = 0.85;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(fx + 0.7, shaftTop + 2);
      ctx.lineTo(fx + 0.7, shaftTop + shaftH - 2);
      ctx.strokeStyle = "rgba(255, 254, 249, 0.45)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  }

  // Carved Stone Capital (top echinus & abacus)
  ctx.fillStyle = light;
  ctx.fillRect(x - 1.2, topY, barW + 2.4, capH);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 0.7;
  ctx.strokeRect(x - 1.2, topY, barW + 2.4, capH);

  // Carved Stepped Base Plinth
  ctx.fillStyle = mid;
  ctx.fillRect(x - 1.5, bottomY - plinthH, barW + 3, plinthH);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 0.7;
  ctx.strokeRect(x - 1.5, bottomY - plinthH, barW + 3, plinthH);
}

/** Paint a tiny chiseled diamond/rosette stone stud node. */
function drawCarvedRosette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill: string,
  rim: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + 0.7, y + 0.9, r + 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(33, 45, 61, 0.25)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = rim;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x - r * 0.22, y - r * 0.22, Math.max(0.8, r * 0.35), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 254, 249, 0.75)";
  ctx.fill();
  ctx.restore();
}

/* ============================================================================
 * 1. STONE SUNDIAL PROFILE READINESS GAUGE (HTML5 <canvas>)
 * ========================================================================== */
export function ReadinessGaugeCanvas({
  percentage,
  syncedDelta = "+12% Sync",
}: {
  percentage: number;
  syncedDelta?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = 122;
    const height = 70;
    let rafId = 0;
    const start = performance.now();
    const clamped = Math.max(0, Math.min(100, percentage));

    const draw = (now: number) => {
      const progress = Math.min(1, (now - start) / 480);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRatio = (clamped / 100) * eased;

      const ctx = setupHiDpiCanvas(canvas, width, height);
      if (!ctx) return;

      paintCarvedStoneTablet(ctx, width, height, "limestone", 12);

      const cx = width / 2;
      const cy = 54;
      const r = 36;

      // Chiseled Roman dial degree notches
      for (let i = 0; i <= 16; i += 1) {
        const a = Math.PI + (Math.PI * i) / 16;
        const inner = i % 4 === 0 ? r - 9 : r - 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a) * (r + 2), cy + Math.sin(a) * (r + 2));
        ctx.strokeStyle = i % 4 === 0 ? "#6f5d42" : "#b9aa8c";
        ctx.lineWidth = i % 4 === 0 ? 1.4 : 0.8;
        ctx.stroke();
      }

      // Recessed carved limestone groove track (inset shadow + bright lip)
      ctx.beginPath();
      ctx.arc(cx, cy + 0.8, r, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 253, 246, 0.85)";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "#cfc2a5";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.stroke();

      // Inlaid lapis & burnished antique bronze fill
      const endAngle = Math.PI + Math.PI * currentRatio;
      const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      grad.addColorStop(0, "#4c729c");
      grad.addColorStop(0.55, "#3d7457");
      grad.addColorStop(1, hovered ? "#a87e2b" : "#212d3d");
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, endAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 8.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Sculpted bronze indicator stud + stone pivot
      const kx = cx + Math.cos(endAngle) * r;
      const ky = cy + Math.sin(endAngle) * r;
      drawCarvedRosette(ctx, kx, ky, hovered ? 5.2 : 4.2, "#c89d45", "#212d3d");

      // Center sundial gnomon shadow line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(endAngle) * (r - 11), cy + Math.sin(endAngle) * (r - 11));
      ctx.strokeStyle = "rgba(33, 45, 61, 0.45)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      drawCarvedRosette(ctx, cx, cy, 3.2, "#8f7d5d", "#fffef9");

      if (progress < 1) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [percentage, hovered]);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{ width: 122, height: 70 }}
        className="block cursor-pointer"
        aria-label={`Stone sundial gauge showing ${percentage}% profile readiness`}
      />
      <span className="mt-1 font-mono text-[9.5px] font-semibold text-emerald-900">
        {hovered ? `${percentage}/100 carved` : syncedDelta}
      </span>
    </div>
  );
}

/* ============================================================================
 * 2. FLUTED MARBLE PILLARS BAR CHART (HTML5 <canvas>)
 * ========================================================================== */
export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

export function CaseArtifactsBarCanvas({ data }: { data: BarDatum[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 140;
  const height = 68;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    paintCarvedStoneTablet(ctx, width, height, "limestone", 10);

    const maxVal = Math.max(1, ...data.map((d) => d.value));
    const padBottom = 15;
    const padTop = 8;
    const chartH = height - padBottom - padTop;

    // Carved stylobate stone slab at the base of the columns
    ctx.fillStyle = "#c9ba99";
    ctx.fillRect(6, height - padBottom, width - 12, 2.5);

    const tones: ("serpentine" | "lapis" | "travertine" | "ochre")[] = [
      "serpentine",
      "lapis",
      "ochre",
      "travertine",
    ];
    const step = (width - 12) / data.length;
    const barW = 17;

    data.forEach((d, idx) => {
      const x = 6 + step * idx + (step - barW) / 2;
      const barH = Math.max(11, (d.value / maxVal) * chartH);
      const isActive = hoverIdx === idx;

      drawFlutedStoneColumn(
        ctx,
        x,
        height - padBottom,
        barW,
        barH,
        tones[idx % tones.length],
        isActive
      );

      ctx.fillStyle = isActive ? "#212d3d" : "#5e513e";
      ctx.font = "700 8px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(d.label.toUpperCase(), x + barW / 2, height - 4);
    });
  }, [data, hoverIdx]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - 6);
    const idx = Math.min(data.length - 1, Math.max(0, Math.floor((x / (width - 12)) * data.length)));
    setHoverIdx(idx);
  };

  return (
    <div className="relative">
      {hoverIdx !== null && data[hoverIdx] && (
        <div className="pointer-events-none absolute -top-6 right-0 whitespace-nowrap rounded-full border border-[#d4af63]/60 bg-[#212d3d] px-2 py-0.5 font-mono text-[9px] font-semibold text-[#faf6ed] shadow-sm">
          {data[hoverIdx].label} Pillar: {data[hoverIdx].value}
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        style={{ width, height }}
        className="block cursor-crosshair"
        aria-label="Fluted marble columns artifact bar chart"
      />
    </div>
  );
}

/* ============================================================================
 * 3. CHISELED BAS-RELIEF SKILLS AREA CURVE (HTML5 <canvas>)
 * ========================================================================== */
export interface SparkPoint {
  stage: string;
  count: number;
}

export function SkillsAreaSparkCanvas({ points }: { points: SparkPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 132;
  const height = 58;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    paintCarvedStoneTablet(ctx, width, height, "limestone", 10);

    const minV = Math.min(...points.map((p) => p.count)) - 1;
    const maxV = Math.max(...points.map((p) => p.count)) + 1;
    const padX = 10;
    const padY = 10;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2;

    const coords = points.map((p, idx) => ({
      x: padX + (idx / (points.length - 1)) * innerW,
      y: padY + (1 - (p.count - minV) / Math.max(1, maxV - minV)) * innerH,
    }));

    // Layered carved relief stratum beneath curve
    const grad = ctx.createLinearGradient(0, padY, 0, height - 5);
    grad.addColorStop(0, "rgba(154, 88, 78, 0.36)");
    grad.addColorStop(0.65, "rgba(143, 125, 93, 0.18)");
    grad.addColorStop(1, "rgba(143, 125, 93, 0.04)");

    ctx.beginPath();
    ctx.moveTo(coords[0].x, height - 5);
    coords.forEach((c) => ctx.lineTo(c.x, c.y));
    ctx.lineTo(coords[coords.length - 1].x, height - 5);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle stone mason vertical hatch cuts under the relief curve
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = "rgba(118, 96, 68, 0.14)";
    ctx.lineWidth = 0.8;
    for (let sx = 6; sx < width; sx += 7) {
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx - 6, height);
      ctx.stroke();
    }
    ctx.restore();

    strokeChiseledCurve(ctx, coords, "#8c423b", "rgba(255, 253, 245, 0.82)", 2);

    const active = hoverIdx ?? coords.length - 1;
    coords.forEach((c, idx) => {
      const isFocused = idx === active;
      drawCarvedRosette(
        ctx,
        c.x,
        c.y,
        isFocused ? 3.8 : 2.2,
        isFocused ? "#c89d45" : "#8c423b",
        isFocused ? "#212d3d" : "#fffef9"
      );
    });
  }, [points, hoverIdx]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / width));
    setHoverIdx(Math.round(ratio * (points.length - 1)));
  };

  const activePoint = points[hoverIdx ?? points.length - 1];

  return (
    <div className="relative">
      <div className="mb-1 flex justify-end">
        <span className="rounded-full border border-[#d4af63]/50 bg-[#212d3d] px-2 py-0.5 font-mono text-[8.5px] font-semibold text-[#faf6ed]">
          {activePoint ? `${activePoint.stage}: ${activePoint.count}` : ""}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        style={{ width, height }}
        className="block cursor-crosshair"
        aria-label="Chiseled bas-relief skills area chart"
      />
    </div>
  );
}

/* ============================================================================
 * 4. CARVED STONE TABLET 3-SERIES TRAJECTORY GRAPH (HTML5 <canvas>)
 * ========================================================================== */
export interface TrajectoryDatum {
  label: string;
  fit: number;
  evidence: number;
  growth: number;
}

export function CareerTrajectoryCanvas({
  points,
  showFit,
  showEvidence,
  showGrowth,
}: {
  points: TrajectoryDatum[];
  showFit: boolean;
  showEvidence: boolean;
  showGrowth: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 420, height: 152 });
  const [hoverIdx, setHoverIdx] = useState<number>(4);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 80) setSize({ width: Math.round(w), height: 152 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;
    const { width, height } = size;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    paintCarvedStoneTablet(ctx, width, height, "limestone", 12);

    const padLeft = 36;
    const padRight = 16;
    const padTop = 16;
    const padBottom = 24;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const toX = (i: number) =>
      padLeft + (i / Math.max(1, points.length - 1)) * plotW;
    const toY = (val: number) =>
      padTop + (1 - Math.max(0, Math.min(1, (val - 40) / 60))) * plotH;

    // Engraved horizontal stone mortar joints (Y ticks)
    [100, 75, 50].forEach((tick) => {
      const y = toY(tick);
      ctx.beginPath();
      ctx.moveTo(padLeft, y + 0.8);
      ctx.lineTo(width - padRight, y + 0.8);
      ctx.strokeStyle = "rgba(255, 254, 248, 0.72)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.strokeStyle = "#cfc2a5";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      ctx.fillStyle = "#62543e";
      ctx.font = "600 8.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${tick}%`, padLeft - 6, y + 3);
    });

    // Chiseled mineral-vein corridor fill between Fit and Growth
    if (showFit && showGrowth) {
      ctx.save();
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const x = toX(idx);
        const y = toY(pt.fit);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      for (let i = points.length - 1; i >= 0; i -= 1) {
        ctx.lineTo(toX(i), toY(points[i].growth));
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(116, 98, 70, 0.14)";
      ctx.fill();

      ctx.clip();
      ctx.strokeStyle = "rgba(116, 98, 70, 0.16)";
      ctx.lineWidth = 0.8;
      for (let hx = padLeft - 40; hx < width + 20; hx += 8) {
        ctx.beginPath();
        ctx.moveTo(hx, height);
        ctx.lineTo(hx + 60, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    const drawCarvedSeries = (
      enabled: boolean,
      accessor: (p: TrajectoryDatum) => number,
      pigment: string,
      medallion: string
    ) => {
      if (!enabled) return;
      const coords = points.map((pt, idx) => ({
        x: toX(idx),
        y: toY(accessor(pt)),
      }));
      strokeChiseledCurve(ctx, coords, pigment, "rgba(255, 253, 245, 0.82)", 2.1);

      coords.forEach((c, idx) => {
        const active = idx === hoverIdx;
        drawCarvedRosette(
          ctx,
          c.x,
          c.y,
          active ? 4.4 : 2.7,
          active ? "#d4af63" : medallion,
          active ? "#212d3d" : "#fffef9"
        );
      });
    };

    drawCarvedSeries(showGrowth, (p) => p.growth, "#964a42", "#964a42");
    drawCarvedSeries(showEvidence, (p) => p.evidence, "#396e52", "#396e52");
    drawCarvedSeries(showFit, (p) => p.fit, "#385e8a", "#385e8a");

    // Sculpted vertical plumb-line obelisk at active column
    const safeIdx = Math.max(0, Math.min(points.length - 1, hoverIdx));
    const cx = toX(safeIdx);
    ctx.beginPath();
    ctx.moveTo(cx, padTop - 2);
    ctx.lineTo(cx, height - padBottom);
    ctx.strokeStyle = "#212d3d";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Engraved Roman X-axis pedestals
    points.forEach((pt, idx) => {
      const x = toX(idx);
      const active = idx === safeIdx;
      ctx.fillStyle = active ? "#212d3d" : "#62543e";
      ctx.font = `${active ? "700" : "600"} 9px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(pt.label.toUpperCase(), x, height - 7);
    });
  }, [points, size, hoverIdx, showFit, showEvidence, showGrowth]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const padLeft = 36;
    const padRight = 16;
    const plotW = Math.max(1, size.width - padLeft - padRight);
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left - padLeft) / plotW));
    setHoverIdx(Math.round(ratio * (points.length - 1)));
  };

  const focused = points[Math.max(0, Math.min(points.length - 1, hoverIdx))];

  return (
    <div ref={wrapRef} className="relative mt-2 w-full">
      {focused && (
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-[#d6c8ab] bg-[#f4ede0] px-2.5 py-1 text-[10.5px]">
          <span className="font-mono font-semibold text-[#212d3d]">
            {focused.label} Tablet
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono">
            {showFit && <span className="text-[#385e8a]">Fit {focused.fit}%</span>}
            {showEvidence && <span className="text-[#396e52]">Evidence {focused.evidence}%</span>}
            {showGrowth && <span className="text-[#964a42]">Growth {focused.growth}%</span>}
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        style={{ width: "100%", height: size.height }}
        className="block cursor-crosshair"
        aria-label="Carved stone tablet Career Codex Trajectory chart"
      />
    </div>
  );
}

/* ============================================================================
 * 5. ASHLAR STONE MASONRY LINKEDIN ALIGNMENT BAR (HTML5 <canvas>)
 * ========================================================================== */
export function LinkedinProgressBarCanvas({
  alignedCount,
  pendingCount,
}: {
  alignedCount: number;
  pendingCount: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(280);
  const height = 28;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    paintCarvedStoneTablet(ctx, width, height, "limestone", 8);

    const total = Math.max(1, alignedCount + pendingCount);
    const pad = 4;
    const gap = 3;
    const innerW = width - pad * 2;
    const blockW = (innerW - gap * (total - 1)) / total;
    const blockH = height - pad * 2;

    for (let i = 0; i < total; i += 1) {
      const bx = pad + i * (blockW + gap);
      const isAligned = i < alignedCount;
      const g = ctx.createLinearGradient(bx, pad, bx, pad + blockH);
      if (isAligned) {
        g.addColorStop(0, "#7ab08d");
        g.addColorStop(0.5, "#477c5b");
        g.addColorStop(1, "#2c543b");
      } else {
        g.addColorStop(0, "#ebe3d0");
        g.addColorStop(1, "#cec0a2");
      }

      ctx.beginPath();
      ctx.roundRect(bx, pad, blockW, blockH, 4);
      ctx.fillStyle = g;
      ctx.fill();

      // Sunlit chisel bevel + dark stone outline
      ctx.strokeStyle = isAligned ? "#1e3a28" : "#a89878";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bx + 2, pad + 1.2);
      ctx.lineTo(bx + blockW - 2, pad + 1.2);
      ctx.strokeStyle = "rgba(255, 254, 248, 0.55)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
  }, [alignedCount, pendingCount, width]);

  return (
    <div ref={wrapRef} className="mt-2 w-full">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height }}
        className="block"
        aria-label={`Ashlar stone blocks alignment bar: ${alignedCount} carved aligned, ${pendingCount} rough pending`}
      />
    </div>
  );
}

/* ============================================================================
 * 6. MARBLE VITRUVIAN ASTROLABE RADAR COMPASS (HTML5 <canvas>)
 * ========================================================================== */
export interface RadarAxis {
  label: string;
  score: number;
}

export function VitruvianRadarCanvas({ axes }: { axes: RadarAxis[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeAxis, setActiveAxis] = useState<number | null>(null);
  const size = 128;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || axes.length < 3) return;
    const ctx = setupHiDpiCanvas(canvas, size, size);
    if (!ctx) return;

    paintCarvedStoneTablet(ctx, size, size, "limestone", 16);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = 45;

    // Carved outer Vitruvian circle & concentric marble polygons
    ctx.beginPath();
    ctx.arc(cx, cy, maxR + 5, 0, Math.PI * 2);
    ctx.strokeStyle = "#bcae8f";
    ctx.lineWidth = 1;
    ctx.stroke();

    [0.25, 0.5, 0.75, 1].forEach((scale) => {
      ctx.beginPath();
      axes.forEach((_, idx) => {
        const a = -Math.PI / 2 + (idx * Math.PI * 2) / axes.length;
        const x = cx + Math.cos(a) * maxR * scale;
        const y = cy + Math.sin(a) * maxR * scale;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = scale === 1 ? "#a79575" : "#d4c7ac";
      ctx.lineWidth = scale === 1 ? 1.2 : 0.85;
      ctx.stroke();
    });

    // Incised compass spoke axes
    axes.forEach((_, idx) => {
      const a = -Math.PI / 2 + (idx * Math.PI * 2) / axes.length;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
      ctx.strokeStyle = "#c9ba9b";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    });

    // Lapis mineral inlaid polygon driven by real axis scores
    const pts = axes.map((ax, idx) => {
      const a = -Math.PI / 2 + (idx * Math.PI * 2) / axes.length;
      const r = (Math.max(0, Math.min(100, ax.score)) / 100) * maxR;
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    });

    ctx.beginPath();
    pts.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(56, 94, 138, 0.28)";
    ctx.fill();
    ctx.strokeStyle = "#212d3d";
    ctx.lineWidth = 1.7;
    ctx.stroke();

    pts.forEach((p, idx) => {
      const isFocused = activeAxis === idx;
      drawCarvedRosette(
        ctx,
        p.x,
        p.y,
        isFocused ? 4.3 : 2.9,
        isFocused ? "#d4af63" : "#212d3d",
        "#fffef9"
      );
    });
  }, [axes, activeAxis]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - size / 2;
    const dy = e.clientY - rect.top - size / 2;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    const sector = Math.round((angle / (Math.PI * 2)) * axes.length) % axes.length;
    setActiveAxis(sector);
  };

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActiveAxis(null)}
        style={{ width: size, height: size }}
        className="block cursor-pointer"
        aria-label="Carved marble Vitruvian domain balance radar compass"
      />
      <span className="mt-1 font-mono text-[9.5px] font-medium text-[#212d3d]">
        {activeAxis !== null && axes[activeAxis]
          ? `${axes[activeAxis].label}: ${axes[activeAxis].score}%`
          : "Hover stone compass"}
      </span>
    </div>
  );
}

/* ============================================================================
 * 7. VOLCANIC BASALT & LIMESTONE ROADMAP HORIZON CHART (HTML5 <canvas>)
 * ========================================================================== */
export interface RoadmapPhaseMetric {
  phase: string;
  readiness: number;
  completion: number;
}

export function RoadmapHorizonCanvas({
  phases,
  activeIndex,
  onSelectPhase,
}: {
  phases: RoadmapPhaseMetric[];
  activeIndex: number;
  onSelectPhase: (idx: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(520);
  const height = 154;

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
    if (!canvas || phases.length === 0) return;
    const ctx = setupHiDpiCanvas(canvas, width, height);
    if (!ctx) return;

    paintCarvedStoneTablet(ctx, width, height, "basalt", 12);

    const padLeft = 36;
    const padRight = 22;
    const padTop = 18;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const toX = (i: number) => padLeft + (i / Math.max(1, phases.length - 1)) * plotW;
    const toY = (v: number) => padTop + (1 - Math.max(0, Math.min(1, v / 100))) * plotH;

    // Chiseled gold-slate baseline & reference strata
    [100, 50, 0].forEach((tick) => {
      const y = toY(tick);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.strokeStyle = "rgba(212, 175, 99, 0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#b5a688";
      ctx.font = "600 8.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${tick}%`, padLeft - 6, y + 3);
    });

    // Fluted Classical Stone Temple Pillars rising for milestone completion
    const stylobateY = padTop + plotH;
    ctx.fillStyle = "#48586e";
    ctx.fillRect(padLeft - 6, stylobateY, plotW + 12, 3);

    phases.forEach((p, idx) => {
      const cx = toX(idx);
      const barW = 24;
      const barH = Math.max(12, (p.completion / 100) * plotH);
      const isSelected = idx === activeIndex;
      drawFlutedStoneColumn(
        ctx,
        cx - barW / 2,
        stylobateY,
        barW,
        barH,
        isSelected ? "ochre" : "travertine",
        isSelected
      );
    });

    // Burnished bronze incised trajectory ridge
    const coords = phases.map((p, idx) => ({
      x: toX(idx),
      y: toY(p.readiness),
    }));
    strokeChiseledCurve(ctx, coords, "#d4af63", "rgba(24, 34, 46, 0.8)", 2.4);

    phases.forEach((p, idx) => {
      const x = coords[idx].x;
      const y = coords[idx].y;
      const isSelected = idx === activeIndex;

      drawCarvedRosette(
        ctx,
        x,
        y,
        isSelected ? 5.5 : 3.6,
        isSelected ? "#a6f4c5" : "#d4af63",
        "#18222e"
      );

      ctx.fillStyle = isSelected ? "#f5ecd9" : "#a8b8c9";
      ctx.font = `${isSelected ? "700" : "600"} 9px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(p.phase.toUpperCase(), x, height - 7);
    });
  }, [phases, width, activeIndex]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const padLeft = 36;
    const padRight = 22;
    const plotW = Math.max(1, width - padLeft - padRight);
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left - padLeft) / plotW));
    onSelectPhase(Math.round(ratio * (phases.length - 1)));
  };

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: "100%", height }}
        className="block cursor-pointer"
        aria-label="Carved basalt and stone tablet Roadmap Horizon Chart"
      />
    </div>
  );
}
