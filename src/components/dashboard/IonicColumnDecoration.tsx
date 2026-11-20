"use client";

import React, { useId } from "react";

interface IonicTemplePorticoProps {
  compact?: boolean;
  children: React.ReactNode;
}

/**
 * Deterministic Archimedean spiral path for classical Ionic volute scrolls.
 */
function buildVoluteSpiral(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  turns: number,
  direction: 1 | -1,
  startDeg = -90
): string {
  const steps = Math.round(turns * 28);
  const startRad = (startDeg * Math.PI) / 180;
  const pts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startRad + direction * t * turns * Math.PI * 2;
    const r = rOuter + (rInner - rOuter) * t;
    const x = (cx + Math.cos(angle) * r).toFixed(2);
    const y = (cy + Math.sin(angle) * r).toFixed(2);
    pts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  return pts.join(" ");
}

/**
 * Freestanding Classical Greco-Roman Acroterion Statue on molded stone pedestal.
 */
export function AcroterionStatue({
  cx,
  plinthBottomY,
  scale = 1,
  variant,
  ink,
  stoneFill,
  shadowFill,
}: {
  cx: number;
  plinthBottomY: number;
  scale?: number;
  variant: "apollo" | "athena" | "muse" | "zeus";
  ink: string;
  stoneFill: string;
  shadowFill: string;
}) {
  const s = scale;
  const plinthH = 4.6 * s;
  const plinthW = 18 * s;
  const feetY = plinthBottomY - plinthH;

  return (
    <g>
      {/* Cast ground shadow behind statue feet */}
      <ellipse
        cx={cx.toFixed(2)}
        cy={feetY.toFixed(2)}
        rx={(5.5 * s).toFixed(2)}
        ry={(1.4 * s).toFixed(2)}
        fill="#473a27"
        fillOpacity={0.28}
      />

      {/* Molded Stone Plinth */}
      <rect
        x={(cx - plinthW / 2).toFixed(2)}
        y={(plinthBottomY - plinthH).toFixed(2)}
        width={plinthW.toFixed(2)}
        height={plinthH.toFixed(2)}
        fill={stoneFill}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      <rect
        x={(cx - (plinthW - 3.6 * s) / 2).toFixed(2)}
        y={(plinthBottomY - plinthH - 2.4 * s).toFixed(2)}
        width={(plinthW - 3.6 * s).toFixed(2)}
        height={(2.4 * s).toFixed(2)}
        fill={shadowFill}
        stroke={ink}
        strokeWidth={0.75 * s}
      />

      {/* Sculpted Draped Classical Figure */}
      <g
        transform={`translate(${cx}, ${feetY - 2.4 * s}) scale(${s})`}
        stroke={ink}
        strokeWidth="0.72"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {variant === "apollo" && (
          <>
            {/* Raised gesture arm & staff/scroll */}
            <path d="M2.8,-22.5 L6.5,-27 L7.8,-25.8 L4.2,-20" fill="#efe6d1" />
            <line x1="-5.2" y1="-21" x2="-6.4" y2="-1" strokeWidth="0.9" />
            {/* Flowing Himation Mantle */}
            <path
              d="M-3.8,-24.5 Q0,-26.5 4,-24.2 L5.4,-11.5 L3.8,0 L-4.2,0 L-5.2,-12 Z"
              fill={stoneFill}
            />
            {/* Engraved Contrapposto Drapery Folds */}
            <path
              d="M-3,-22 Q1,-16 4.2,-14 M-3.6,-15 Q0.5,-10 3.4,-2 M-1.5,-11 L-1.8,-0.5 M1.5,-10 L2.2,-0.5"
              fill="none"
              strokeOpacity="0.62"
              strokeWidth="0.55"
            />
            {/* Bearded Head + Laurel Crown */}
            <circle cx="0.2" cy="-28.8" r="2.9" fill="#faf5ea" />
            <path d="M-2.2,-30.5 Q0.2,-32.5 2.8,-30" fill="none" strokeWidth="0.6" />
          </>
        )}

        {variant === "athena" && (
          <>
            {/* Upright Wisdom Staff */}
            <line x1="-5.8" y1="-29" x2="-5.8" y2="0" strokeWidth="0.85" />
            <path d="M-3.5,-21 L-5.8,-17.5" fill="none" strokeWidth="1.2" />
            {/* Standing Peplos Silhouette */}
            <path
              d="M-3.4,-22.5 Q0,-24.5 3.6,-22 L4.5,-10.5 L4,0 L-3.8,0 L-4.2,-11 Z"
              fill={stoneFill}
            />
            <path
              d="M-2,-19 Q1,-13 3.8,-10 M-2,-10 L-2.2,0 M1,-10 L1.4,0"
              fill="none"
              strokeOpacity="0.6"
              strokeWidth="0.55"
            />
            {/* Helmeted Head */}
            <circle cx="0" cy="-26.5" r="2.6" fill="#faf5ea" />
            <path d="M-2.2,-28 Q0.2,-31.5 2.5,-27.8" fill={shadowFill} strokeWidth="0.6" />
          </>
        )}

        {variant === "muse" && (
          <>
            {/* Outstretched Scroll Hand */}
            <path d="M3.2,-21 L6.4,-17.5 L5.6,-16.2 L2.5,-18.5" fill="#efe6d1" />
            <path d="M-3.5,-22 Q0,-24 3.5,-22 L4.6,-9 L3.8,0 L-4,0 L-4.5,-10 Z" fill={stoneFill} />
            <path
              d="M-2.6,-19 Q0.8,-13.5 3.6,-11 M-1.4,-10 L-1.8,0 M1.2,-10 L1.8,0"
              fill="none"
              strokeOpacity="0.6"
              strokeWidth="0.55"
            />
            <circle cx="0" cy="-26.2" r="2.6" fill="#faf5ea" />
            <circle cx="-1.8" cy="-27.2" r="1.1" fill={shadowFill} />
          </>
        )}

        {variant === "zeus" && (
          <>
            {/* Tall Olympian Eagle Scepter in Left Hand */}
            <line x1="-6.8" y1="-34" x2="-6.8" y2="0" strokeWidth="1.05" />
            <path d="M-8.8,-34.5 Q-6.8,-37.5 -4.8,-34.5 L-6.8,-32.5 Z" fill="#d4af63" />
            {/* Raised Right Arm Bearing Carved Lightning Bolt */}
            <path d="M3.6,-22.5 L8.2,-27 L7.2,-29.2 L3,-24.5" fill="#efe6d1" />
            <path
              d="M7.6,-35 L10.2,-30.5 L8.1,-30.2 L10.6,-25.5"
              fill="none"
              stroke="#b88b32"
              strokeWidth="1.15"
            />
            {/* Royal Olympian Himatia & Broad Shoulders */}
            <path
              d="M-5.2,-25 Q0,-27.5 5.2,-24.8 L6.2,-11.5 L4.6,0 L-4.8,0 L-6,-12 Z"
              fill={stoneFill}
            />
            <path
              d="M-4,-22 Q0.5,-15.5 4.8,-13.5 M-4.2,-14 Q1,-8.5 4,-1.5 M-1.8,-10 L-2.1,0 M1.8,-9.5 L2.4,0"
              fill="none"
              strokeOpacity="0.65"
              strokeWidth="0.6"
            />
            {/* Carved Perched Eagle Silhouette at Zeus's Right Base */}
            <path
              d="M4.8,-7.5 Q7.2,-9.8 8.4,-6.2 L7.2,0 L4.6,0 Z"
              fill={shadowFill}
            />
            {/* Bearded Sovereign Head & Gold Diadem Crown */}
            <circle cx="0" cy="-29.5" r="3.3" fill="#faf5ea" />
            <path d="M-2.2,-27 Q0,-25 2.2,-27 L1.4,-25.2 Q0,-24.5 -1.4,-25.2 Z" fill={shadowFill} />
            <path d="M-3.1,-31.4 L-1.6,-33.8 L0,-31.8 L1.6,-33.8 L3.1,-31.4 Z" fill="#d4af63" strokeWidth="0.6" />
          </>
        )}
      </g>
    </g>
  );
}

/**
 * Full-height Continuous Classical Ionic Column drawn INSIDE the single SVG:
 *   Abacus + Bolster Cushion + Dual Modeled Spiral Volutes + Egg-and-Dart Echinus
 *   + Anthemion Palmette Necking Collar + Entasis Fluted Shaft (7 concave flutes)
 *   + Attic Double-Torus Base + Square Marble Plinth
 */
export function FullIonicColumn({
  cx,
  capitalTopY,
  shaftBottomY,
  plinthBottomY,
  scale = 1,
  side,
  ink,
  colGrad,
  shadowGrad,
  recessColor,
}: {
  cx: number;
  capitalTopY: number;
  shaftBottomY: number;
  plinthBottomY: number;
  scale?: number;
  side: "left" | "right";
  ink: string;
  colGrad: string;
  shadowGrad: string;
  recessColor: string;
}) {
  const s = scale;
  const voluteSpan = 21 * s; // outer half-width of volutes
  const voluteR = 8.4 * s;
  const voluteY = capitalTopY + 13.6 * s;
  const neckTopY = capitalTopY + 23 * s;
  const shaftStartY = capitalTopY + 38 * s;

  const neckHalf = 14.5 * s;
  const swellHalf = 15.6 * s; // slight classical entasis mid-shaft swell
  const baseHalf = 15.8 * s;

  const midY = shaftStartY + (shaftBottomY - shaftStartY) * 0.42;
  const fluteCount = 6;

  // Dual double-line spiral volute geometry (sculpted raised ridge + inner spiral)
  const leftOuterSpiral = buildVoluteSpiral(
    cx - voluteSpan + voluteR,
    voluteY,
    voluteR - 0.8 * s,
    1.6 * s,
    2.5,
    1,
    -90
  );
  const leftInnerSpiral = buildVoluteSpiral(
    cx - voluteSpan + voluteR,
    voluteY,
    voluteR - 2.3 * s,
    1.4 * s,
    2.25,
    1,
    -90
  );
  const rightOuterSpiral = buildVoluteSpiral(
    cx + voluteSpan - voluteR,
    voluteY,
    voluteR - 0.8 * s,
    1.6 * s,
    2.5,
    -1,
    -90
  );
  const rightInnerSpiral = buildVoluteSpiral(
    cx + voluteSpan - voluteR,
    voluteY,
    voluteR - 2.3 * s,
    1.4 * s,
    2.25,
    -1,
    -90
  );

  // Subtle column cast shadow onto recessed sanctuary cella wall
  const shadowDir = side === "left" ? 1 : -1;

  return (
    <g>
      {/* Cast architectural column shadow falling subtly onto cella wall behind */}
      <rect
        x={(side === "left" ? cx + neckHalf - 1 : cx - neckHalf - 7 * s).toFixed(2)}
        y={capitalTopY.toFixed(2)}
        width={(8 * s).toFixed(2)}
        height={(plinthBottomY - capitalTopY).toFixed(2)}
        fill="#392e1f"
        fillOpacity={0.14}
      />

      {/* ── FULL ENTASIS FLUTED MARBLE SHAFT (ONE CONTINUOUS PIECE) ── */}
      <path
        d={`M${(cx - neckHalf).toFixed(2)},${shaftStartY.toFixed(2)}
            Q${(cx - swellHalf).toFixed(2)},${midY.toFixed(2)} ${(cx - baseHalf).toFixed(2)},${shaftBottomY.toFixed(2)}
            L${(cx + baseHalf).toFixed(2)},${shaftBottomY.toFixed(2)}
            Q${(cx + swellHalf).toFixed(2)},${midY.toFixed(2)} ${(cx + neckHalf).toFixed(2)},${shaftStartY.toFixed(2)} Z`}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.95 * s}
      />

      {/* 6 Deep Modeled Semicircular Flutes Following Column Entasis */}
      {Array.from({ length: fluteCount }).map((_, idx) => {
        const marginFrac = 0.09;
        const spanFrac = 1 - marginFrac * 2;
        const u0 = -1 + 2 * (marginFrac + (idx / fluteCount) * spanFrac);
        const u1 = -1 + 2 * (marginFrac + ((idx + 1) / fluteCount) * spanFrac);
        const uMid = (u0 + u1) / 2;

        const x0Top = cx + u0 * neckHalf;
        const x1Top = cx + u1 * neckHalf;
        const xmTop = cx + uMid * neckHalf;

        const x0Mid = cx + u0 * swellHalf;
        const x1Mid = cx + u1 * swellHalf;

        const x0Bot = cx + u0 * baseHalf;
        const x1Bot = cx + u1 * baseHalf;
        const xmBot = cx + uMid * baseHalf;

        const archTopY = shaftStartY + 5.5 * s;
        const archBotY = shaftBottomY - 5 * s;

        // Alternate subtle directional shading inside flutes from sunlit upper-left
        const fluteShade = idx < 2 ? 0.34 : idx < 4 ? 0.24 : 0.42;

        return (
          <g key={idx}>
            <path
              d={`M${x0Top.toFixed(2)},${archTopY.toFixed(2)}
                  Q${xmTop.toFixed(2)},${(shaftStartY + 1.8 * s).toFixed(2)} ${x1Top.toFixed(2)},${archTopY.toFixed(2)}
                  Q${x1Mid.toFixed(2)},${midY.toFixed(2)} ${x1Bot.toFixed(2)},${archBotY.toFixed(2)}
                  Q${xmBot.toFixed(2)},${(shaftBottomY - 1.5 * s).toFixed(2)} ${x0Bot.toFixed(2)},${archBotY.toFixed(2)}
                  Q${x0Mid.toFixed(2)},${midY.toFixed(2)} ${x0Top.toFixed(2)},${archTopY.toFixed(2)} Z`}
              fill={recessColor}
              fillOpacity={fluteShade}
              stroke={ink}
              strokeOpacity={0.44}
              strokeWidth={0.58 * s}
            />
            {/* Crisp right fillet specular ridge inside each flute */}
            <path
              d={`M${(x1Top - 0.7 * s).toFixed(2)},${(archTopY + 2).toFixed(2)}
                  Q${(x1Mid - 0.7 * s).toFixed(2)},${midY.toFixed(2)} ${(x1Bot - 0.7 * s).toFixed(2)},${(archBotY - 2).toFixed(2)}`}
              fill="none"
              stroke="#fffdf7"
              strokeOpacity={0.62}
              strokeWidth={0.75 * s}
            />
          </g>
        );
      })}

      {/* Under-necking collar cast shadow onto top of flutes */}
      <rect
        x={(cx - neckHalf + 0.6).toFixed(2)}
        y={shaftStartY.toFixed(2)}
        width={(neckHalf * 2 - 1.2).toFixed(2)}
        height={(4.5 * s).toFixed(2)}
        fill="#3e3120"
        fillOpacity={0.18}
      />
      {/* Above-apophyge base shadow */}
      <rect
        x={(cx - baseHalf + 0.6).toFixed(2)}
        y={(shaftBottomY - 4 * s).toFixed(2)}
        width={(baseHalf * 2 - 1.2).toFixed(2)}
        height={(4 * s).toFixed(2)}
        fill="#3e3120"
        fillOpacity={0.14}
      />

      {/* ── ANTHEMION / PALMETTE NECKING COLLAR (ERECHTHEION / CLASSICAL STYLE) ── */}
      {/* Upper Astragal Bead Ring */}
      <rect
        x={(cx - neckHalf - 1.6 * s).toFixed(2)}
        y={neckTopY.toFixed(2)}
        width={(neckHalf * 2 + 3.2 * s).toFixed(2)}
        height={(3.2 * s).toFixed(2)}
        rx={(1.5 * s).toFixed(2)}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      {/* Decorated Palmette Collar Drum */}
      <rect
        x={(cx - neckHalf - 0.5 * s).toFixed(2)}
        y={(neckTopY + 3.2 * s).toFixed(2)}
        width={(neckHalf * 2 + 1 * s).toFixed(2)}
        height={(9.4 * s).toFixed(2)}
        fill={shadowGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      {/* Engraved Palmette Rosettes around Collar */}
      {[-1.5, -0.5, 0.5, 1.5].map((pos, i) => {
        const px = cx + pos * 6.4 * s;
        const py = neckTopY + 11.4 * s;
        return (
          <g key={i} stroke={ink} strokeOpacity={0.62} strokeWidth={0.6 * s} fill="#faf5ea">
            <path
              d={`M${px.toFixed(2)},${(py - 6.6 * s).toFixed(2)}
                  Q${(px + 2.1 * s).toFixed(2)},${(py - 3 * s).toFixed(2)} ${(px + 1.2 * s).toFixed(2)},${py.toFixed(2)}
                  L${(px - 1.2 * s).toFixed(2)},${py.toFixed(2)}
                  Q${(px - 2.1 * s).toFixed(2)},${(py - 3 * s).toFixed(2)} ${px.toFixed(2)},${(py - 6.6 * s).toFixed(2)} Z`}
            />
            <path
              d={`M${(px - 1.6 * s).toFixed(2)},${(py - 2.5 * s).toFixed(2)} Q${(px - 3 * s).toFixed(2)},${(py - 4.8 * s).toFixed(2)} ${(px - 1.5 * s).toFixed(2)},${(py - 5.2 * s).toFixed(2)}
                  M${(px + 1.6 * s).toFixed(2)},${(py - 2.5 * s).toFixed(2)} Q${(px + 3 * s).toFixed(2)},${(py - 4.8 * s).toFixed(2)} ${(px + 1.5 * s).toFixed(2)},${(py - 5.2 * s).toFixed(2)}`}
              fill="none"
            />
          </g>
        );
      })}
      {/* Lower Astragal Ring above Fluted Shaft */}
      <rect
        x={(cx - neckHalf - 1.4 * s).toFixed(2)}
        y={(neckTopY + 12.6 * s).toFixed(2)}
        width={(neckHalf * 2 + 2.8 * s).toFixed(2)}
        height={(2.6 * s).toFixed(2)}
        rx={(1.2 * s).toFixed(2)}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />

      {/* ── IONIC VOLUTE CAPITAL CROWNED DIRECTLY BY ARCHITRAVE ── */}
      {/* Molded Abacus Bearing Architrave */}
      <rect
        x={(cx - voluteSpan + 2 * s).toFixed(2)}
        y={capitalTopY.toFixed(2)}
        width={(voluteSpan * 2 - 4 * s).toFixed(2)}
        height={(4.6 * s).toFixed(2)}
        rx={(0.7 * s).toFixed(2)}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.9 * s}
      />
      <line
        x1={(cx - voluteSpan + 2.5 * s).toFixed(2)}
        y1={(capitalTopY + 2.3 * s).toFixed(2)}
        x2={(cx + voluteSpan - 2.5 * s).toFixed(2)}
        y2={(capitalTopY + 2.3 * s).toFixed(2)}
        stroke={ink}
        strokeOpacity={0.35}
        strokeWidth={0.6 * s}
      />

      {/* Sweeping Canalis Cushion Between Volutes */}
      <path
        d={`M${(cx - voluteSpan + voluteR).toFixed(2)},${(capitalTopY + 4.6 * s).toFixed(2)}
            L${(cx + voluteSpan - voluteR).toFixed(2)},${(capitalTopY + 4.6 * s).toFixed(2)}
            L${(cx + voluteSpan - voluteR).toFixed(2)},${(capitalTopY + 14.2 * s).toFixed(2)}
            Q${cx.toFixed(2)},${(capitalTopY + 10.6 * s).toFixed(2)} ${(cx - voluteSpan + voluteR).toFixed(2)},${(capitalTopY + 14.2 * s).toFixed(2)} Z`}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      <path
        d={`M${(cx - voluteSpan + voluteR + 2 * s).toFixed(2)},${(capitalTopY + 7.2 * s).toFixed(2)}
            Q${cx.toFixed(2)},${(capitalTopY + 9.4 * s).toFixed(2)} ${(cx + voluteSpan - voluteR - 2 * s).toFixed(2)},${(capitalTopY + 7.2 * s).toFixed(2)}`}
        fill="none"
        stroke={ink}
        strokeOpacity={0.48}
        strokeWidth={0.65 * s}
      />

      {/* Recessed Egg-and-Dart Echinus */}
      <path
        d={`M${(cx - neckHalf - 2.2 * s).toFixed(2)},${(capitalTopY + 13 * s).toFixed(2)}
            Q${cx.toFixed(2)},${(capitalTopY + 11 * s).toFixed(2)} ${(cx + neckHalf + 2.2 * s).toFixed(2)},${(capitalTopY + 13 * s).toFixed(2)}
            L${(cx + neckHalf + 0.6 * s).toFixed(2)},${neckTopY.toFixed(2)}
            L${(cx - neckHalf - 0.6 * s).toFixed(2)},${neckTopY.toFixed(2)} Z`}
        fill={shadowGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      {[-2, -1, 0, 1, 2].map((eIdx) => {
        const ex = cx + eIdx * 4.8 * s;
        const ey = capitalTopY + 17.6 * s;
        return (
          <g key={eIdx}>
            <ellipse
              cx={ex.toFixed(2)}
              cy={ey.toFixed(2)}
              rx={(1.9 * s).toFixed(2)}
              ry={(3 * s).toFixed(2)}
              fill="#fcf8ef"
              stroke={ink}
              strokeWidth={0.68 * s}
            />
            <ellipse
              cx={(ex - 0.35 * s).toFixed(2)}
              cy={(ey - 0.35 * s).toFixed(2)}
              rx={(0.9 * s).toFixed(2)}
              ry={(1.8 * s).toFixed(2)}
              fill="#fffef9"
            />
            {eIdx < 2 && (
              <path
                d={`M${(ex + 2.4 * s).toFixed(2)},${(capitalTopY + 14.2 * s).toFixed(2)} L${(ex + 2.4 * s).toFixed(2)},${(neckTopY - 1.2 * s).toFixed(2)}`}
                stroke={ink}
                strokeWidth={0.7 * s}
              />
            )}
          </g>
        );
      })}

      {/* Sculpted Dual Volutes with Relief Groove & Central Boss Eye */}
      {[
        { vcx: cx - voluteSpan + voluteR, outer: leftOuterSpiral, inner: leftInnerSpiral },
        { vcx: cx + voluteSpan - voluteR, outer: rightOuterSpiral, inner: rightInnerSpiral },
      ].map((v, vi) => (
        <g key={vi}>
          <circle
            cx={v.vcx.toFixed(2)}
            cy={voluteY.toFixed(2)}
            r={(voluteR + 0.8 * s).toFixed(2)}
            fill={colGrad}
            stroke={ink}
            strokeWidth={0.95 * s}
          />
          <circle
            cx={v.vcx.toFixed(2)}
            cy={voluteY.toFixed(2)}
            r={(voluteR - 1 * s).toFixed(2)}
            fill={recessColor}
            fillOpacity={0.28}
          />
          <path
            d={v.outer}
            fill="none"
            stroke="#fcf8ee"
            strokeWidth={1.65 * s}
            strokeLinecap="round"
          />
          <path
            d={v.outer}
            fill="none"
            stroke={ink}
            strokeWidth={0.8 * s}
            strokeLinecap="round"
          />
          <path
            d={v.inner}
            fill="none"
            stroke={ink}
            strokeOpacity={0.55}
            strokeWidth={0.55 * s}
            strokeLinecap="round"
          />
          <circle
            cx={v.vcx.toFixed(2)}
            cy={voluteY.toFixed(2)}
            r={(1.65 * s).toFixed(2)}
            fill={shadowGrad}
            stroke={ink}
            strokeWidth={0.7 * s}
          />
          <circle
            cx={(v.vcx - 0.35 * s).toFixed(2)}
            cy={(voluteY - 0.35 * s).toFixed(2)}
            r={(0.65 * s).toFixed(2)}
            fill="#fffdf8"
          />
        </g>
      ))}

      {/* ── ATTIC DOUBLE-TORUS COLUMN BASE & SQUARE MARBLE PLINTH ── */}
      {/* Apophyge shoulder fillet */}
      <rect
        x={(cx - baseHalf - 1.6 * s).toFixed(2)}
        y={shaftBottomY.toFixed(2)}
        width={(baseHalf * 2 + 3.2 * s).toFixed(2)}
        height={(3.2 * s).toFixed(2)}
        rx={(1.4 * s).toFixed(2)}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      {/* Upper Convex Torus */}
      <rect
        x={(cx - baseHalf - 3.6 * s).toFixed(2)}
        y={(shaftBottomY + 3.2 * s).toFixed(2)}
        width={(baseHalf * 2 + 7.2 * s).toFixed(2)}
        height={(5.2 * s).toFixed(2)}
        rx={(2.5 * s).toFixed(2)}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.9 * s}
      />
      {/* Deep Scotia Cavity Molding */}
      <rect
        x={(cx - baseHalf - 2.6 * s).toFixed(2)}
        y={(shaftBottomY + 8.4 * s).toFixed(2)}
        width={(baseHalf * 2 + 5.2 * s).toFixed(2)}
        height={(4.4 * s).toFixed(2)}
        fill={shadowGrad}
        stroke={ink}
        strokeWidth={0.85 * s}
      />
      <line
        x1={(cx - baseHalf - 2.2 * s).toFixed(2)}
        y1={(shaftBottomY + 10.6 * s).toFixed(2)}
        x2={(cx + baseHalf + 2.2 * s).toFixed(2)}
        y2={(shaftBottomY + 10.6 * s).toFixed(2)}
        stroke={ink}
        strokeOpacity={0.35}
        strokeWidth={0.6 * s}
      />
      {/* Lower Broad Torus */}
      <rect
        x={(cx - voluteSpan + 1.2 * s).toFixed(2)}
        y={(shaftBottomY + 12.8 * s).toFixed(2)}
        width={(voluteSpan * 2 - 2.4 * s).toFixed(2)}
        height={(6.2 * s).toFixed(2)}
        rx={(3 * s).toFixed(2)}
        fill={colGrad}
        stroke={ink}
        strokeWidth={0.9 * s}
      />
      {/* Square Marble Base Plinth Resting Flush on Stylobate */}
      <rect
        x={(cx - voluteSpan).toFixed(2)}
        y={(plinthBottomY - 10 * s).toFixed(2)}
        width={(voluteSpan * 2).toFixed(2)}
        height={(10 * s).toFixed(2)}
        rx={(0.6 * s).toFixed(2)}
        fill={shadowGrad}
        stroke={ink}
        strokeWidth={0.95 * s}
      />
      {/* Diagonal plinth top shadow & bevel accent */}
      <line
        x1={(cx - voluteSpan + 0.8 * s * shadowDir).toFixed(2)}
        y1={(plinthBottomY - 5 * s).toFixed(2)}
        x2={(cx + voluteSpan).toFixed(2)}
        y2={(plinthBottomY - 5 * s).toFixed(2)}
        stroke={ink}
        strokeOpacity={0.25}
        strokeWidth={0.55 * s}
      />
    </g>
  );
}

/**
 * Miniature Sculpted Metope Narrative Relief Box (paired classical scholars)
 * set between triglyph tablets across the Ionic frieze.
 */
export function MetopeReliefPanel({
  x,
  y,
  w,
  h,
  variant,
  ink,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  variant: number;
  ink: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#cab997" stroke={ink} strokeWidth="0.7" />
      <rect x={x + 1.2} y={y + 1.2} width={w - 2.4} height={h - 2.4} fill="#b7a480" fillOpacity="0.65" />
      {/* Mini sculpted bas-relief figures */}
      <g fill="#f7f0df" stroke={ink} strokeWidth="0.55" strokeLinejoin="round">
        {variant % 2 === 0 ? (
          <>
            <circle cx={cx - 3.6} cy={y + 6.2} r="1.7" />
            <path d={`M${cx - 5.6},${y + 9} Q${cx - 3.6},${y + 7.8} ${cx - 1.8},${y + 9.4} L${cx - 1.5},${y + h - 1.2} L${cx - 6},${y + h - 1.2} Z`} />
            <circle cx={cx + 3.6} cy={y + 6.5} r="1.7" />
            <path d={`M${cx + 1.8},${y + 9.4} Q${cx + 3.6},${y + 7.8} ${cx + 5.6},${y + 9} L${cx + 6},${y + h - 1.2} L${cx + 1.5},${y + h - 1.2} Z`} />
          </>
        ) : (
          <>
            <circle cx={cx - 4} cy={y + 7.2} r="1.6" />
            <path d={`M${cx - 6.2},${y + 9.8} L${cx - 1.6},${y + 9.8} L${cx - 1.4},${y + h - 1.2} L${cx - 6.2},${y + h - 1.2} Z`} />
            <circle cx={cx + 3.8} cy={y + 5.8} r="1.7" />
            <path d={`M${cx + 1.4},${y + 8.6} L${cx + 6},${y + 8.6} L${cx + 6.2},${y + h - 1.2} L${cx + 1.4},${y + h - 1.2} Z`} />
          </>
        )}
      </g>
    </g>
  );
}

/**
 * Classical Three-Fluted Triglyph Tablet with top cap and bottom guttae pegs.
 */
export function TriglyphBlock({
  x,
  y,
  w,
  h,
  ink,
  stoneFill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  ink: string;
  stoneFill: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={stoneFill} stroke={ink} strokeWidth="0.7" />
      {[0.25, 0.5, 0.75].map((f, idx) => (
        <line
          key={idx}
          x1={(x + w * f).toFixed(2)}
          y1={y + 2}
          x2={(x + w * f).toFixed(2)}
          y2={y + h - 1}
          stroke={ink}
          strokeOpacity={0.58}
          strokeWidth="0.7"
        />
      ))}
    </g>
  );
}

/**
 * SINGLE UNIFIED ONE-PIECE GRECO-ROMAN IONIC TEMPLE PORTICO
 * Everything — statues, pediment, tympanum reliefs, dentils, triglyph-metope frieze,
 * architrave, spiral volutes, egg-and-dart, palmette collars, full-height fluted entasis
 * marble columns, Attic double-torus bases, stylobate steps, and inner cella backdrop —
 * renders inside ONE cohesive vector frame, while `{children}` scrolls smoothly inside
 * the columned temple opening.
 */
export function IonicTemplePortico({ compact = false, children }: IonicTemplePorticoProps) {
  const uid = useId().replace(/:/g, "");
  const ink = "#433626";

  const vw = compact ? 138 : 340;
  const vh = 780;

  return (
    <div
      className="relative mx-auto select-none"
      style={{
        width: compact
          ? "min(136px, calc((100vh - 88px) * 138 / 780))"
          : "min(338px, calc((100vh - 88px) * 340 / 780))",
        aspectRatio: `${vw} / ${vh}`,
        filter: "drop-shadow(0 18px 34px rgba(33, 45, 61, 0.22))",
      }}
    >
      {/* ONE-PIECE CLASSICAL ARCHITECTURAL TEMPLE PORTICO SVG */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${vw} ${vh}`}
        className="pointer-events-none block h-full w-full"
      >
        <defs>
          <linearGradient id={`${uid}-stone`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#efe6d1" />
            <stop offset="28%" stopColor="#fcf8ef" />
            <stop offset="72%" stopColor="#f0e7d0" />
            <stop offset="100%" stopColor="#d6c5a4" />
          </linearGradient>
          <linearGradient id={`${uid}-col-l`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e6dcc3" />
            <stop offset="34%" stopColor="#fdfaf1" />
            <stop offset="72%" stopColor="#efe6d0" />
            <stop offset="100%" stopColor="#cbb994" />
          </linearGradient>
          <linearGradient id={`${uid}-col-r`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbb994" />
            <stop offset="28%" stopColor="#efe6d0" />
            <stop offset="66%" stopColor="#fdfaf1" />
            <stop offset="100%" stopColor="#e6dcc3" />
          </linearGradient>
          <linearGradient id={`${uid}-shadow`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1c09e" />
            <stop offset="100%" stopColor="#ebe1c8" />
          </linearGradient>
          <linearGradient id={`${uid}-tympanum`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9d8b6c" />
            <stop offset="32%" stopColor="#cab997" />
            <stop offset="100%" stopColor="#e9dec4" />
          </linearGradient>
          <linearGradient id={`${uid}-cella`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ede4cf" stopOpacity="0.96" />
            <stop offset="14%" stopColor="#faf6ec" stopOpacity="0.95" />
            <stop offset="86%" stopColor="#f5efe0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#e7dcc4" stopOpacity="0.97" />
          </linearGradient>
          <radialGradient id={`${uid}-tymp-glow`} cx="50%" cy="68%" r="54%">
            <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#fffdf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {compact ? (
          <>
            {/* Compact Temple Interior Wall Behind Columns */}
            <rect x="20" y="138" width="98" height="600" fill={`url(#${uid}-cella)`} />
            <rect x="20" y="138" width="98" height="8" fill="#3a2d1e" fillOpacity="0.18" />

            {/* Compact Apex Acroterion Statue */}
            <AcroterionStatue
              cx={69}
              plinthBottomY={46}
              scale={0.88}
              variant="apollo"
              ink={ink}
              stoneFill={`url(#${uid}-stone)`}
              shadowFill={`url(#${uid}-shadow)`}
            />

            {/* Compact Pediment + Recessed Relief */}
            <polygon
              points="2,94 69,46 136,94 132,98 69,52 6,98"
              fill={`url(#${uid}-stone)`}
              stroke={ink}
              strokeWidth="0.95"
              strokeLinejoin="round"
            />
            <polygon
              points="5,98 69,52 133,98"
              fill={`url(#${uid}-stone)`}
              stroke={ink}
              strokeWidth="0.9"
            />
            <polygon
              points="16,95 69,58 122,95"
              fill={`url(#${uid}-tympanum)`}
              stroke={ink}
              strokeWidth="0.8"
            />
            <circle cx="69" cy="80" r="6.5" fill="#faf5ea" stroke={ink} strokeWidth="0.75" />
            <circle cx="69" cy="80" r="2.2" fill="#d3c29e" stroke={ink} strokeWidth="0.6" />

            {/* Compact Cornice + Dentils + Frieze + Architrave */}
            <rect x="4" y="98" width="130" height="4.5" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.85" />
            {Array.from({ length: 13 }).map((_, i) => (
              <rect
                key={i}
                x={9 + i * 9.5}
                y="102.5"
                width="5.2"
                height="4"
                fill={`url(#${uid}-stone)`}
                stroke={ink}
                strokeWidth="0.6"
              />
            ))}
            <rect x="7" y="106.5" width="124" height="19.5" fill={`url(#${uid}-shadow)`} stroke={ink} strokeWidth="0.85" />
            <TriglyphBlock x={11} y={108.5} w={11} h={15.5} ink={ink} stoneFill={`url(#${uid}-stone)`} />
            <TriglyphBlock x={116} y={108.5} w={11} h={15.5} ink={ink} stoneFill={`url(#${uid}-stone)`} />
            <rect x="33" y="109" width="72" height="14.5" fill="#f7f1e2" stroke={ink} strokeWidth="0.65" />
            <text
              x="69"
              y="118.8"
              textAnchor="middle"
              fill="#35291c"
              fontSize="7.4"
              fontFamily="Georgia, serif"
              letterSpacing="2.4"
            >
              VEX
            </text>
            <rect x="5" y="126" width="128" height="12" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.9" />
            <line x1="5" y1="132" x2="133" y2="132" stroke={ink} strokeOpacity="0.45" strokeWidth="0.65" />

            {/* Twin Full-Height Compact Ionic Columns */}
            <FullIonicColumn
              cx={21}
              capitalTopY={138}
              shaftBottomY={718.28}
              plinthBottomY={738}
              scale={0.68}
              side="left"
              ink={ink}
              colGrad={`url(#${uid}-col-l)`}
              shadowGrad={`url(#${uid}-shadow)`}
              recessColor="#9f8d6c"
            />
            <FullIonicColumn
              cx={117}
              capitalTopY={138}
              shaftBottomY={718.28}
              plinthBottomY={738}
              scale={0.68}
              side="right"
              ink={ink}
              colGrad={`url(#${uid}-col-r)`}
              shadowGrad={`url(#${uid}-shadow)`}
              recessColor="#9f8d6c"
            />

            {/* Compact Two-Tier Travertine Stylobate */}
            <rect x="35.3" y="731.2" width="67.4" height="6.8" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.8" />
            <rect x="4" y="738" width="130" height="13" rx="1" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.9" />
            <rect x="1" y="751" width="136" height="19" rx="1.5" fill={`url(#${uid}-shadow)`} stroke={ink} strokeWidth="0.95" />
            <line x1="46" y1="751" x2="46" y2="770" stroke={ink} strokeOpacity="0.32" strokeWidth="0.7" />
            <line x1="92" y1="751" x2="92" y2="770" stroke={ink} strokeOpacity="0.32" strokeWidth="0.7" />
          </>
        ) : (
          <>
            {/* ── 0. RECESSED SANCTUARY CELLA WALL (DRAWN BEHIND FREESTANDING COLUMNS) ── */}
            <rect x="36" y="166" width="268" height="572" fill={`url(#${uid}-cella)`} />
            {/* Deep Lintel Shadow Under Architrave */}
            <rect x="36" y="166" width="268" height="9" fill="#3a2d1e" fillOpacity="0.18" />

            {/* ── 1. THREE FREESTANDING MARBLE ACROTERIA STATUES ── */}
            <AcroterionStatue
              cx={170}
              plinthBottomY={46}
              scale={1.06}
              variant="apollo"
              ink={ink}
              stoneFill={`url(#${uid}-stone)`}
              shadowFill={`url(#${uid}-shadow)`}
            />
            <AcroterionStatue
              cx={26}
              plinthBottomY={98.5}
              scale={0.92}
              variant="athena"
              ink={ink}
              stoneFill={`url(#${uid}-stone)`}
              shadowFill={`url(#${uid}-shadow)`}
            />
            <AcroterionStatue
              cx={314}
              plinthBottomY={98.5}
              scale={0.92}
              variant="muse"
              ink={ink}
              stoneFill={`url(#${uid}-stone)`}
              shadowFill={`url(#${uid}-shadow)`}
            />

            {/* ── 2. RAKING PEDIMENT CORNICE & DEEP TYMPANUM RELIEF ── */}
            {/* Upper Sima Crown */}
            <polygon
              points="1,106.5 170,46 339,106.5 334,111.5 170,52 6,111.5"
              fill={`url(#${uid}-stone)`}
              stroke={ink}
              strokeWidth="0.95"
              strokeLinejoin="round"
            />
            {/* Raking Geison Frame */}
            <polygon
              points="6,111.5 170,52 334,111.5 330,115.5 10,115.5"
              fill={`url(#${uid}-stone)`}
              stroke={ink}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            {/* Deep Recessed Triangular Tympanum Cavity */}
            <polygon
              points="31,112 170,60.5 309,112"
              fill={`url(#${uid}-tympanum)`}
              stroke={ink}
              strokeWidth="0.9"
            />
            <polygon points="88,112 170,62 252,112" fill={`url(#${uid}-tymp-glow)`} />
            {/* Raking Under-Cornice Shadow inside Tympanum */}
            <polygon
              points="31,112 170,60.5 309,112 299,112 170,64.2 41,112"
              fill="#332617"
              fillOpacity="0.26"
            />

            {/* ── SCULPTED TYMPANUM BAS-RELIEF: PHILOSOPHICAL ASSEMBLY ── */}
            {/* Subtle Engraved Classical Proportion Arcs behind Center Sage */}
            <g stroke={ink} strokeOpacity="0.24" strokeWidth="0.6" fill="none">
              <circle cx="170" cy="91" r="14" strokeDasharray="2 2" />
              <line x1="170" y1="110" x2="170" y2="66" />
              <line x1="170" y1="110" x2="144" y2="75" />
              <line x1="170" y1="110" x2="196" y2="75" />
            </g>
            {/* 7 Draped Stone Relief Figures Across the Triangle */}
            <g fill="#faf4e7" stroke={ink} strokeWidth="0.72" strokeLinejoin="round">
              {/* Central Towering Sage (Plato/Athena) */}
              <circle cx="170" cy="76.5" r="3.4" />
              <path d="M163.5,83.5 Q170,80.2 176.5,83.5 L178.5,111.5 L161.5,111.5 Z" />
              <path d="M165,88 Q170,91.5 175,88" fill="none" strokeWidth="0.6" />
              {/* Left & Right Disputing Philosophers */}
              <circle cx="151" cy="83.5" r="2.8" />
              <path d="M145.5,89.5 Q151,86.8 156.5,89.5 L158.8,111.5 L144,111.5 Z" />
              <circle cx="189" cy="83.5" r="2.8" />
              <path d="M183.5,89.5 Q189,86.8 194.5,89.5 L196,111.5 L181.2,111.5 Z" />
              {/* Seated Scribes with Tablets */}
              <circle cx="131" cy="90.5" r="2.5" />
              <path d="M126.5,95.5 Q132,92.8 137.5,96 L140.5,111.5 L121.5,111.5 Z" />
              <circle cx="209" cy="90.5" r="2.5" />
              <path d="M202.5,96 Q208,92.8 213.5,95.5 L218.5,111.5 L199.5,111.5 Z" />
              {/* Reclining River & Celestial Thinkers into Acute Corners */}
              <circle cx="101" cy="97.5" r="2.1" />
              <path d="M72,111.5 Q87,100.5 104,102.5 L116,111.5 Z" />
              <circle cx="239" cy="97.5" r="2.1" />
              <path d="M268,111.5 Q253,100.5 236,102.5 L224,111.5 Z" />
            </g>

            {/* ── 3. DENTIL CORNICE + TRIGLYPH & METOPE RELIEF FRIEZE + ARCHITRAVE ── */}
            {/* Projecting Corona Cornice */}
            <rect x="6" y="115.5" width="328" height="5" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.95" />
            {/* Continuous Sculpted Dentil Band */}
            <rect x="10" y="120.5" width="320" height="5.5" fill="#7c6c51" fillOpacity="0.42" stroke={ink} strokeWidth="0.7" />
            {Array.from({ length: 35 }).map((_, i) => (
              <rect
                key={i}
                x={13 + i * 9}
                y="121"
                width="5.2"
                height="4.6"
                fill={`url(#${uid}-stone)`}
                stroke={ink}
                strokeWidth="0.65"
              />
            ))}

            {/* Entablature Relief Frieze */}
            <rect x="10" y="126" width="320" height="25" fill={`url(#${uid}-shadow)`} stroke={ink} strokeWidth="0.9" />
            {/* Alternating Triglyphs & Narrative Metopes Matching Classical Reference */}
            <TriglyphBlock x={13} y={128.5} w={13} h={20} ink={ink} stoneFill={`url(#${uid}-stone)`} />
            <MetopeReliefPanel x={28.5} y={128.5} w={21.5} h={20} variant={0} ink={ink} />
            <TriglyphBlock x={52.5} y={128.5} w={13} h={20} ink={ink} stoneFill={`url(#${uid}-stone)`} />
            <MetopeReliefPanel x={68} y={128.5} w={21.5} h={20} variant={1} ink={ink} />
            <TriglyphBlock x={92} y={128.5} w={13} h={20} ink={ink} stoneFill={`url(#${uid}-stone)`} />

            {/* Central Classical Inscribed Cartouche Plaque */}
            <rect x={110} y={128.8} width={120} height={19.4} rx="1" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.8" />
            <rect x={112.5} y={131} width={115} height={15} fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="0.6" />
            <text
              x="170"
              y="141.3"
              textAnchor="middle"
              fill="#332719"
              fontSize="8.6"
              fontFamily="Georgia, serif"
              letterSpacing="2.8"
            >
              VEX · ACADEMIA
            </text>

            <TriglyphBlock x={235} y={128.5} w={13} h={20} ink={ink} stoneFill={`url(#${uid}-stone)`} />
            <MetopeReliefPanel x={250.5} y={128.5} w={21.5} h={20} variant={1} ink={ink} />
            <TriglyphBlock x={274.5} y={128.5} w={13} h={20} ink={ink} stoneFill={`url(#${uid}-stone)`} />
            <MetopeReliefPanel x={290} y={128.5} w={21.5} h={20} variant={0} ink={ink} />
            <TriglyphBlock x={314} y={128.5} w={13} h={20} ink={ink} stoneFill={`url(#${uid}-stone)`} />

            {/* Tripartite Stepped Architrave Bearing Directly on Columns */}
            <rect x="10" y="151" width="320" height="5" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.85" />
            <rect x="11" y="156" width="318" height="5" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.8" />
            <rect x="12" y="161" width="316" height="5" fill={`url(#${uid}-shadow)`} stroke={ink} strokeWidth="0.9" />

            {/* ── 4. TWIN FULL-HEIGHT ENGRAVED IONIC COLUMNS (ONE CONTINUOUS PIECE) ── */}
            <FullIonicColumn
              cx={36}
              capitalTopY={166}
              shaftBottomY={709}
              plinthBottomY={738}
              scale={1}
              side="left"
              ink={ink}
              colGrad={`url(#${uid}-col-l)`}
              shadowGrad={`url(#${uid}-shadow)`}
              recessColor="#9f8d6c"
            />
            <FullIonicColumn
              cx={304}
              capitalTopY={166}
              shaftBottomY={709}
              plinthBottomY={738}
              scale={1}
              side="right"
              ink={ink}
              colGrad={`url(#${uid}-col-r)`}
              shadowGrad={`url(#${uid}-shadow)`}
              recessColor="#9f8d6c"
            />

            {/* ── 5. THRESHOLD & TWO-TIER CLASSICAL TRAVERTINE STYLOBATE ── */}
            <rect x="57" y="728" width="226" height="10" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.85" />
            <rect x="8" y="738" width="324" height="13" rx="0.8" fill={`url(#${uid}-stone)`} stroke={ink} strokeWidth="0.95" />
            <rect x="2" y="751" width="336" height="22" rx="1.4" fill={`url(#${uid}-shadow)`} stroke={ink} strokeWidth="1" />
            {[86, 170, 254].map((jx) => (
              <line key={jx} x1={jx} y1="751" x2={jx} y2="773" stroke={ink} strokeOpacity="0.32" strokeWidth="0.75" />
            ))}
          </>
        )}
      </svg>

      {/* SCROLLABLE NAVIGATION CHAMBER NESTLED INSIDE THE ONE-PIECE TEMPLE PORTICO */}
      <div
        data-lenis-prevent
        className={`temple-inner-scroll absolute flex flex-col overflow-y-auto overscroll-contain ${
          compact ? "px-1.5 py-2.5" : "px-3 py-3"
        }`}
        style={{
          top: compact ? "18.8%" : "22.2%",
          bottom: compact ? "6.8%" : "6.8%",
          left: compact ? "25.8%" : "17.4%",
          right: compact ? "25.8%" : "17.4%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Seamless photorealistic classical Ionic pillar assembled on a unified 72-unit
 * horizontal geometry grid: top Abacus + Volute Capital + Anthemion Necking +
 * curved Apophyge flute arches flow with zero step into the middle 6-fluted
 * Pentelic marble drum shaft and bottom Attic double-torus base + marble plinth.
 */
function IonicSidePillar({ side }: { side: "left" | "right" }) {
  const uid = useId().replace(/:/g, "");
  const ink = "#3a2d1d";
  const cx = 36;
  const voluteSpan = 31;
  const voluteR = 12.2;
  const voluteY = 20.5;
  const neckTopY = 34;
  const collarBottomY = 53.5;

  // Column shaft occupies exact x = 15..57 (halfWidth = 21) across ALL three SVG bands
  const sL = 15;
  const sR = 57;
  const shaftW = sR - sL; // 42
  const fluteCount = 6;
  const marginX = 2.4;
  const innerSpan = shaftW - marginX * 2;
  const fluteStep = innerSpan / fluteCount;

  const leftOuterSpiral = buildVoluteSpiral(
    cx - voluteSpan + voluteR,
    voluteY,
    voluteR - 1.1,
    2.2,
    2.65,
    1,
    -90
  );
  const leftInnerSpiral = buildVoluteSpiral(
    cx - voluteSpan + voluteR,
    voluteY,
    voluteR - 3.2,
    1.8,
    2.35,
    1,
    -90
  );
  const rightOuterSpiral = buildVoluteSpiral(
    cx + voluteSpan - voluteR,
    voluteY,
    voluteR - 1.1,
    2.2,
    2.65,
    -1,
    -90
  );
  const rightInnerSpiral = buildVoluteSpiral(
    cx + voluteSpan - voluteR,
    voluteY,
    voluteR - 3.2,
    1.8,
    2.35,
    -1,
    -90
  );

  const colGrad = `${uid}-col-${side}`;
  const shadowGrad = `${uid}-sh-${side}`;
  const fluteGrad = `${uid}-flt-${side}`;
  const stoneTex = `${uid}-tex-${side}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-20 hidden w-[64px] shrink-0 select-none flex-col items-stretch sm:flex md:w-[72px] xl:w-[76px] ${
        side === "left" ? "-mr-[20px]" : "-ml-[20px]"
      }`}
    >
      {/* Realistic Deep Ambient Shadow Cast onto Sanctuary Wall Behind Column */}
      <div
        className={`pointer-events-none absolute inset-y-0 z-0 w-7 ${
          side === "left"
            ? "right-0 bg-gradient-to-r from-[#2c2113]/28 via-[#2c2113]/12 to-transparent"
            : "left-0 bg-gradient-to-l from-[#2c2113]/28 via-[#2c2113]/12 to-transparent"
        }`}
      />

      {/* TOP SVG BAND: Capital + Necking + Curved Apophyge Top Shaft Flare (viewBox 0 0 72 78) */}
      <svg viewBox="0 0 72 78" className="relative z-10 block w-full shrink-0">
        <defs>
          <linearGradient id={colGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={side === "left" ? "#cbb892" : "#9c8764"} />
            <stop offset="18%" stopColor={side === "left" ? "#efe6d0" : "#cbb791"} />
            <stop offset="38%" stopColor="#fffdf6" />
            <stop offset="70%" stopColor={side === "left" ? "#e8dcc1" : "#f5eedc"} />
            <stop offset="100%" stopColor={side === "left" ? "#9d8864" : "#d9c8a6"} />
          </linearGradient>
          <linearGradient id={shadowGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ad9873" />
            <stop offset="45%" stopColor="#dfd3b6" />
            <stop offset="100%" stopColor="#f3ebda" />
          </linearGradient>
          <linearGradient id={fluteGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a6648" />
            <stop offset="30%" stopColor="#cbb895" />
            <stop offset="68%" stopColor="#fbf6ea" />
            <stop offset="100%" stopColor="#8d7857" />
          </linearGradient>
          <filter id={stoneTex} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.18 0.09" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.19  0 0 0 0 0.12  0 0 0 0.085 0" />
            <feComposite in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>

        {/* Continuous Upper Marble Shaft + Apophyge Flare into Astragal */}
        <path
          d={`M${sL - 1.5},${collarBottomY + 2.5} Q${sL + 0.2},${collarBottomY + 12} ${sL},78 L${sR},78 Q${sR - 0.2},${collarBottomY + 12} ${sR + 1.5},${collarBottomY + 2.5} Z`}
          fill={`url(#${colGrad})`}
          stroke={ink}
          strokeWidth="1"
        />
        {/* 6 Rounded Top Semicircular Flute Arches Flowing Seamlessly into Shaft */}
        {Array.from({ length: fluteCount }).map((_, idx) => {
          const fx0 = sL + marginX + idx * fluteStep;
          const fw = fluteStep - 1.25;
          const fx1 = fx0 + fw;
          const mid = (fx0 + fx1) / 2;
          return (
            <g key={idx}>
              <path
                d={`M${fx0},78 L${fx0},${collarBottomY + 11.5} Q${mid},${collarBottomY + 6} ${fx1},${collarBottomY + 11.5} L${fx1},78 Z`}
                fill={`url(#${fluteGrad})`}
                stroke={ink}
                strokeOpacity="0.48"
                strokeWidth="0.6"
              />
              <line x1={fx0 + 0.5} y1={collarBottomY + 11.5} x2={fx0 + 0.5} y2={78} stroke="#5a4932" strokeOpacity="0.45" strokeWidth="0.55" />
            </g>
          );
        })}
        {/* Necking Under-Collar Ambient Shadow */}
        <rect x={sL + 0.5} y={collarBottomY + 2.5} width={shaftW - 1} height="5.5" fill="#2e2315" fillOpacity="0.24" />

        {/* Anthemion Palmette Necking Collar */}
        <rect x={sL - 2.6} y={neckTopY} width={shaftW + 5.2} height="3.8" rx="1.8" fill={`url(#${colGrad})`} stroke={ink} strokeWidth="0.9" />
        <rect x={sL - 0.8} y={neckTopY + 3.8} width={shaftW + 1.6} height="12.2" fill={`url(#${shadowGrad})`} stroke={ink} strokeWidth="0.9" />
        {[-1.5, -0.5, 0.5, 1.5].map((pos, i) => {
          const px = cx + pos * 9.2;
          const py = neckTopY + 14.5;
          return (
            <g key={i} stroke={ink} strokeOpacity="0.72" strokeWidth="0.7" fill="#fdfaf1">
              <path d={`M${px},${py - 9} Q${px + 2.8},${py - 4} ${px + 1.6},${py} L${px - 1.6},${py} Q${px - 2.8},${py - 4} ${px},${py - 9} Z`} />
              <path d={`M${px - 2.2},${py - 3.5} Q${px - 4.1},${py - 6.6} ${px - 2.1},${py - 7.1} M${px + 2.2},${py - 3.5} Q${px + 4.1},${py - 6.6} ${px + 2.1},${py - 7.1}`} fill="none" />
            </g>
          );
        })}
        <rect x={sL - 2.4} y={neckTopY + 16} width={shaftW + 4.8} height="3.6" rx="1.6" fill={`url(#${colGrad})`} stroke={ink} strokeWidth="0.9" />

        {/* Molded Abacus Bearing Architrave */}
        <rect x={cx - voluteSpan + 3} y="0.6" width={voluteSpan * 2 - 6} height="6.8" rx="1.1" fill={`url(#${colGrad})`} stroke={ink} strokeWidth="1" />
        <line x1={cx - voluteSpan + 4} y1="3.8" x2={cx + voluteSpan - 4} y2="3.8" stroke={ink} strokeOpacity="0.32" strokeWidth="0.7" />
        <rect x={cx - voluteSpan + 5} y="7.4" width={voluteSpan * 2 - 10} height="2" fill="#2d2215" fillOpacity="0.22" />

        {/* Sweeping Canalis Cushion */}
        <path
          d={`M${cx - voluteSpan + voluteR},7.4 L${cx + voluteSpan - voluteR},7.4 L${cx + voluteSpan - voluteR},21.2 Q${cx},15.8 ${cx - voluteSpan + voluteR},21.2 Z`}
          fill={`url(#${colGrad})`}
          stroke={ink}
          strokeWidth="0.95"
        />
        <path
          d={`M${cx - voluteSpan + voluteR + 2.5},11.2 Q${cx},14.4 ${cx + voluteSpan - voluteR - 2.5},11.2`}
          fill="none"
          stroke={ink}
          strokeOpacity="0.46"
          strokeWidth="0.75"
        />

        {/* Carved Egg-and-Dart Echinus Bowl */}
        <path
          d={`M${sL - 3.5},19.4 Q${cx},16.5 ${sR + 3.5},19.4 L${sR + 1.2},${neckTopY} L${sL - 1.2},${neckTopY} Z`}
          fill={`url(#${shadowGrad})`}
          stroke={ink}
          strokeWidth="0.95"
        />
        {[-2, -1, 0, 1, 2].map((eIdx) => {
          const ex = cx + eIdx * 6.8;
          return (
            <g key={eIdx}>
              <ellipse cx={ex} cy={26.5} rx={2.5} ry={4.2} fill="#fcf7eb" stroke={ink} strokeWidth="0.8" />
              <ellipse cx={ex - 0.5} cy={25.8} rx={1.15} ry={2.4} fill="#fffef9" />
              {eIdx < 2 && (
                <path d={`M${ex + 3.4},21 L${ex + 3.4},${neckTopY - 1.4}`} stroke={ink} strokeWidth="0.85" />
              )}
            </g>
          );
        })}

        {/* Sculpted Multi-Layered Ionic Spiral Volutes */}
        {[
          { vcx: cx - voluteSpan + voluteR, outer: leftOuterSpiral, inner: leftInnerSpiral },
          { vcx: cx + voluteSpan - voluteR, outer: rightOuterSpiral, inner: rightInnerSpiral },
        ].map((v, vi) => (
          <g key={vi}>
            <circle cx={v.vcx} cy={voluteY} r={voluteR + 1.1} fill={`url(#${colGrad})`} stroke={ink} strokeWidth="1.05" />
            <circle cx={v.vcx} cy={voluteY} r={voluteR - 1.2} fill="#8f7b58" fillOpacity="0.28" />
            <path d={v.outer} fill="none" stroke="#fffdf6" strokeWidth="2.4" strokeLinecap="round" />
            <path d={v.outer} fill="none" stroke={ink} strokeWidth="0.95" strokeLinecap="round" />
            <path d={v.inner} fill="none" stroke={ink} strokeOpacity="0.62" strokeWidth="0.7" strokeLinecap="round" />
            <circle cx={v.vcx} cy={voluteY} r={2.35} fill={`url(#${shadowGrad})`} stroke={ink} strokeWidth="0.85" />
            <circle cx={v.vcx - 0.55} cy={voluteY - 0.55} r={0.95} fill="#fffef9" />
          </g>
        ))}
      </svg>

      {/* MIDDLE SVG BAND: Seamless Vertically Repeating 6-Fluted Marble Column Drum Shaft (exact x=15..57) */}
      <svg
        viewBox="0 0 72 240"
        preserveAspectRatio="none"
        className="relative z-10 block w-full flex-1"
      >
        <defs>
          <linearGradient id={`${colGrad}-m`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={side === "left" ? "#cbb892" : "#9c8764"} />
            <stop offset="18%" stopColor={side === "left" ? "#efe6d0" : "#cbb791"} />
            <stop offset="38%" stopColor="#fffdf6" />
            <stop offset="70%" stopColor={side === "left" ? "#e8dcc1" : "#f5eedc"} />
            <stop offset="100%" stopColor={side === "left" ? "#9d8864" : "#d9c8a6"} />
          </linearGradient>
          <linearGradient id={`${fluteGrad}-m`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a6648" />
            <stop offset="30%" stopColor="#cbb895" />
            <stop offset="68%" stopColor="#fbf6ea" />
            <stop offset="100%" stopColor="#8d7857" />
          </linearGradient>
        </defs>

        <rect x={sL} y="0" width={shaftW} height="240" fill={`url(#${colGrad}-m)`} />
        <line x1={sL} y1="0" x2={sL} y2="240" stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1={sR} y1="0" x2={sR} y2="240" stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" />

        {Array.from({ length: fluteCount }).map((_, idx) => {
          const fx0 = sL + marginX + idx * fluteStep;
          const fw = fluteStep - 1.25;
          return (
            <g key={idx}>
              <rect
                x={fx0}
                y="0"
                width={fw}
                height="240"
                fill={`url(#${fluteGrad}-m)`}
              />
              <line x1={fx0} y1="0" x2={fx0} y2="240" stroke="#5a4932" strokeOpacity="0.45" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              <line x1={fx0 + fw} y1="0" x2={fx0 + fw} y2="240" stroke="#fffef9" strokeOpacity="0.6" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}

        {/* Classical Stacked Drum Joints */}
        {[60, 120, 180].map((jy) => (
          <line
            key={jy}
            x1={sL}
            y1={jy}
            x2={sR}
            y2={jy}
            stroke={ink}
            strokeOpacity="0.22"
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* BOTTOM SVG BAND: Concave Flute Terminations + Attic Double-Torus Base + Marble Plinth */}
      <svg viewBox="0 0 72 56" className="relative z-10 block w-full shrink-0">
        <defs>
          <linearGradient id={`${colGrad}-b`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={side === "left" ? "#cbb892" : "#9c8764"} />
            <stop offset="35%" stopColor="#fffdf6" />
            <stop offset="72%" stopColor="#ebe0c7" />
            <stop offset="100%" stopColor={side === "left" ? "#9d8864" : "#d9c8a6"} />
          </linearGradient>
          <linearGradient id={`${shadowGrad}-b`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b39e79" />
            <stop offset="100%" stopColor="#ebe1c8" />
          </linearGradient>
          <linearGradient id={`${fluteGrad}-b`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a6648" />
            <stop offset="30%" stopColor="#cbb895" />
            <stop offset="68%" stopColor="#fbf6ea" />
            <stop offset="100%" stopColor="#8d7857" />
          </linearGradient>
        </defs>

        {/* Fluted Shaft Lower Apophyge Curve */}
        <path
          d={`M${sL},0 L${sR},0 Q${sR - 0.1},9 ${sR + 1.8},12.5 L${sL - 1.8},12.5 Q${sL + 0.1},9 ${sL},0 Z`}
          fill={`url(#${colGrad}-b)`}
          stroke={ink}
          strokeWidth="1"
        />
        {Array.from({ length: fluteCount }).map((_, idx) => {
          const fx0 = sL + marginX + idx * fluteStep;
          const fw = fluteStep - 1.25;
          const fx1 = fx0 + fw;
          const mid = (fx0 + fx1) / 2;
          return (
            <path
              key={idx}
              d={`M${fx0},0 L${fx0},8.5 Q${mid},11.5 ${fx1},8.5 L${fx1},0 Z`}
              fill={`url(#${fluteGrad}-b)`}
              stroke={ink}
              strokeOpacity="0.45"
              strokeWidth="0.6"
            />
          );
        })}

        {/* Upper Convex Torus + Shadow */}
        <rect x={sL - 4.8} y="12.5" width={shaftW + 9.6} height="7.2" rx="3.4" fill={`url(#${colGrad}-b)`} stroke={ink} strokeWidth="0.95" />
        {/* Deep Recessed Scotia Molding */}
        <rect x={sL - 3.4} y="19.7" width={shaftW + 6.8} height="6.2" fill={`url(#${shadowGrad}-b)`} stroke={ink} strokeWidth="0.9" />
        <line x1={sL - 3} y1="22.8" x2={sR + 3} y2="22.8" stroke={ink} strokeOpacity="0.35" strokeWidth="0.65" />
        {/* Broad Lower Torus */}
        <rect x={cx - voluteSpan + 2.5} y="25.9" width={voluteSpan * 2 - 5} height="8.6" rx="4.2" fill={`url(#${colGrad}-b)`} stroke={ink} strokeWidth="0.95" />
        {/* Carved Chiseled Plinth Block */}
        <rect x={cx - voluteSpan + 1} y="34.5" width={voluteSpan * 2 - 2} height="20.5" rx="0.8" fill={`url(#${shadowGrad}-b)`} stroke={ink} strokeWidth="1" />
        <line x1={cx - voluteSpan + 2} y1="44.8" x2={cx + voluteSpan - 1} y2="44.8" stroke={ink} strokeOpacity="0.26" strokeWidth="0.65" />
      </svg>
    </div>
  );
}

/**
 * Unified one-piece classical Greek Temple architecture framing the spacious
 * Microsoft Word sanctuary and grounded marble philosopher gallery.
 * Uses transparent side flanks so the silhouette floats cleanly over the sky.
 */
export function GreekTempleWordFrame({
  inscription = "VEX · SCRIPTORIUM",
  apexVariant = "apollo",
  children,
}: {
  inscription?: string;
  apexVariant?: "apollo" | "athena" | "muse" | "zeus";
  children: React.ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const ink = "#3a2d1d";

  return (
    <div
      className="relative w-full select-none lg:[filter:drop-shadow(0_24px_44px_rgba(33,45,61,0.22))]"
    >
      {/* 1. SCULPTURAL CLASSICAL TRIANGULAR PEDIMENT & ENTABLATURE ROOF (Desktop Only) */}
      <svg aria-hidden="true" viewBox="0 -14 1120 162" className="relative z-30 hidden h-auto w-full overflow-visible lg:block">
        <defs>
          <linearGradient id={`${uid}-w-stone`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e5d9bf" />
            <stop offset="22%" stopColor="#fffdf6" />
            <stop offset="52%" stopColor="#f3ead5" />
            <stop offset="82%" stopColor="#efe4cb" />
            <stop offset="100%" stopColor="#cbb892" />
          </linearGradient>
          <linearGradient id={`${uid}-w-shadow`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b5a07a" />
            <stop offset="45%" stopColor="#ded2b6" />
            <stop offset="100%" stopColor="#efe6d1" />
          </linearGradient>
          <linearGradient id={`${uid}-w-tymp`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#857354" />
            <stop offset="35%" stopColor="#baa783" />
            <stop offset="100%" stopColor="#e6dbc0" />
          </linearGradient>
          <radialGradient id={`${uid}-w-glow`} cx="50%" cy="68%" r="54%">
            <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#fffdf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Acroteria Rooftop Marble Finials */}
        <AcroterionStatue cx={560} plinthBottomY={25} scale={apexVariant === "zeus" ? 0.92 : 0.78} variant={apexVariant} ink={ink} stoneFill={`url(#${uid}-w-stone)`} shadowFill={`url(#${uid}-w-shadow)`} />
        <AcroterionStatue cx={38} plinthBottomY={92} scale={0.62} variant="athena" ink={ink} stoneFill={`url(#${uid}-w-stone)`} shadowFill={`url(#${uid}-w-shadow)`} />
        <AcroterionStatue cx={1082} plinthBottomY={92} scale={0.62} variant="muse" ink={ink} stoneFill={`url(#${uid}-w-stone)`} shadowFill={`url(#${uid}-w-shadow)`} />

        {/* Sima & Raking Geison Cornice */}
        <polygon points="8,92 560,21 1112,92 1102,97 560,27 18,97" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="1.05" strokeLinejoin="round" />
        <polygon points="15,95 560,26 1105,95 1095,99.5 25,99.5" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="1" strokeLinejoin="round" />

        {/* Deep Recessed Tympanum Cavity with Under-Raking Shadow */}
        <polygon points="98,95 560,34.5 1022,95" fill={`url(#${uid}-w-tymp)`} stroke={ink} strokeWidth="1" />
        <polygon points="290,95 560,36.5 830,95" fill={`url(#${uid}-w-glow)`} />
        <polygon points="98,95 560,34.5 1022,95 1004,95 560,39.5 116,95" fill="#2b2013" fillOpacity="0.28" />

        {/* Sculpted Tympanum Assembly with Draped Mantle Shading */}
        <g fill="#fcf7ea" stroke={ink} strokeWidth="0.9" strokeLinejoin="round">
          <circle cx="560" cy="54" r="4.6" />
          <path d="M550.5,62 Q560,57.5 569.5,62 L572.5,94.5 L547.5,94.5 Z" />
          <path d="M552.5,68 Q560,72.5 567.5,68 M551,78 Q560,82 569,78" fill="none" strokeOpacity="0.45" strokeWidth="0.7" />
          <circle cx="524" cy="59.5" r="3.8" />
          <path d="M516,66.5 Q524,62.5 532,66.5 L535,94.5 L514,94.5 Z" />
          <circle cx="596" cy="59.5" r="3.8" />
          <path d="M588,66.5 Q596,62.5 604,66.5 L606,94.5 L585,94.5 Z" />
          <circle cx="484" cy="67.5" r="3.3" />
          <path d="M477,73.5 Q484,70 491,73.5 L495,94.5 L472,94.5 Z" />
          <circle cx="636" cy="67.5" r="3.3" />
          <path d="M629,73.5 Q636,70 643,73.5 L648,94.5 L625,94.5 Z" />
          <circle cx="430" cy="76.5" r="2.9" />
          <path d="M368,94.5 Q399,80 434,82 L452,94.5 Z" />
          <circle cx="690" cy="76.5" r="2.9" />
          <path d="M752,94.5 Q721,80 686,82 L668,94.5 Z" />
        </g>

        {/* Projecting Corona Cornice & Continuous Sculpted Dentils */}
        <rect x="6" y="99.5" width="1108" height="5.5" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="1.05" />
        <rect x="14" y="105" width="1092" height="6.8" fill="#6d5d43" fillOpacity="0.48" stroke={ink} strokeWidth="0.8" />
        {Array.from({ length: 71 }).map((_, i) => (
          <rect key={i} x={19 + i * 15.2} y="105.5" width="8.8" height="5.8" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="0.7" />
        ))}

        {/* Entablature Frieze with Triglyphs, Relief Metopes & Carved Stone Plaque */}
        <rect x="14" y="111.8" width="1092" height="23.5" fill={`url(#${uid}-w-shadow)`} stroke={ink} strokeWidth="1" />
        {[20, 96, 172, 248, 324, 778, 854, 930, 1006, 1082].map((tx, idx) => (
          <g key={tx}>
            <TriglyphBlock x={tx} y={114} w={17} h={19} ink={ink} stoneFill={`url(#${uid}-w-stone)`} />
            {idx < 4 && (
              <MetopeReliefPanel x={tx + 22} y={114} w={48} h={19} variant={(idx % 2) as 0 | 1} ink={ink} />
            )}
            {idx >= 5 && idx < 9 && (
              <MetopeReliefPanel x={tx + 22} y={114} w={48} h={19} variant={((idx + 1) % 2) as 0 | 1} ink={ink} />
            )}
          </g>
        ))}

        {/* Center Carved Epigraphic Plaque */}
        <rect x="386" y="113.5" width="348" height="20" rx="1.4" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="0.95" />
        <rect x="390.5" y="115.8" width="339" height="15.4" fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="0.7" />
        <text x="560" y="126.8" textAnchor="middle" fill="#2e2215" fontSize="10.2" fontFamily="Georgia, serif" letterSpacing="3.8">
          {inscription}
        </text>

        {/* Three-Fascia Stepped Architrave Bearing Directly on Column Capitals */}
        <rect x="11" y="135.3" width="1098" height="4.4" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="0.95" />
        <rect x="13" y="139.7" width="1094" height="4.2" fill={`url(#${uid}-w-stone)`} stroke={ink} strokeWidth="0.9" />
        <rect x="15" y="143.9" width="1090" height="4.1" fill={`url(#${uid}-w-shadow)`} stroke={ink} strokeWidth="0.95" />
      </svg>

      {/* 2. SANCTUARY CHAMBER — DESKTOP TEMPLE CELL vs CLEAN MOBILE APPLE SURFACE */}
      <div className="relative flex w-full items-stretch bg-transparent px-0 lg:px-[1.1%]">
        <div className="hidden lg:block">
          <IonicSidePillar side="left" />
        </div>

        {/* Recessed Sanctuary Cella Interior on Desktop / Clean Surface on Mobile */}
        <div className="vex-m-flat relative z-10 min-w-0 flex-1 select-text rounded-[22px] border border-[#dad6ca] bg-[#fffef9] text-[#2c2821] lg:rounded-none lg:border-y-0 lg:border-x lg:border-[#3a2d1d]/30 lg:bg-[#f5efe0] lg:shadow-[inset_14px_0_22px_-12px_rgba(45,35,20,0.28),inset_-14px_0_22px_-12px_rgba(45,35,20,0.28),inset_0_14px_20px_-14px_rgba(45,35,20,0.34)]">
          {children}
        </div>

        <div className="hidden lg:block">
          <IonicSidePillar side="right" />
        </div>
      </div>

      {/* 3. MULTI-STEP TRAVERTINE CREPIDOMA / STYLOBATE FOUNDATION (Desktop Only) */}
      <div className="relative z-30 hidden w-full lg:block">
        <div className="mx-auto h-3.5 w-[98.6%] border border-[#3a2d1d] bg-gradient-to-r from-[#cbb892] via-[#fffdf6] via-35% to-[#baa57e] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]" />
        <div className="mx-auto grid h-5 w-[99.4%] grid-cols-4 border border-[#3a2d1d] bg-gradient-to-b from-[#cbb892] to-[#e8dec5] shadow-inner">
          <div className="border-r border-[#3a2d1d]/35" />
          <div className="border-r border-[#3a2d1d]/35" />
          <div className="border-r border-[#3a2d1d]/35" />
          <div />
        </div>
        <div className="grid h-4 w-full grid-cols-6 rounded-b-[4px] border border-[#3a2d1d] bg-gradient-to-b from-[#baa57e] to-[#d5c5a3]">
          <div className="border-r border-[#3a2d1d]/30" />
          <div className="border-r border-[#3a2d1d]/30" />
          <div className="border-r border-[#3a2d1d]/30" />
          <div className="border-r border-[#3a2d1d]/30" />
          <div className="border-r border-[#3a2d1d]/30" />
          <div />
        </div>
      </div>
    </div>
  );
}
