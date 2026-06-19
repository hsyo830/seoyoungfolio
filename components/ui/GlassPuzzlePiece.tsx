"use client";

import React, { useId } from "react";

export type TabDir = 1 | -1 | 0;

export interface GlassPuzzlePieceProps {
  width?: number;
  height?: number;
  /** 1 = tab protrudes outward · -1 = socket (concave) · 0 = flat border */
  top?: TabDir;
  right?: TabDir;
  bottom?: TabDir;
  left?: TabDir;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const rv = (n: number) => String(Math.round(n * 100) / 100);

/**
 * Classic jigsaw tab: smooth circular head, gentle neck, perfect interlocking.
 * Shoulders start at 32% / end at 68% of each edge.
 * Tab head is approximated with 2 cubic beziers forming a near-semicircle.
 */
function edgeTab(
  W: number,
  H: number,
  side: "top" | "right" | "bottom" | "left",
  dir: number,
  T: number,
): string[] {
  if (dir === 0) return [];

  switch (side) {
    case "top": {
      const p = -dir * T; // dir=1 → negative y (protrudes up)
      return [
        `L ${rv(W * 0.32)} 0`,
        `C ${rv(W * 0.345)} 0 ${rv(W * 0.375)} ${rv(p * 0.42)} ${rv(W * 0.395)} ${rv(p * 0.65)}`,
        `C ${rv(W * 0.42)}  ${rv(p * 0.93)} ${rv(W * 0.455)} ${rv(p)} ${rv(W * 0.5)} ${rv(p)}`,
        `C ${rv(W * 0.545)} ${rv(p)} ${rv(W * 0.58)}  ${rv(p * 0.93)} ${rv(W * 0.605)} ${rv(p * 0.65)}`,
        `C ${rv(W * 0.625)} ${rv(p * 0.42)} ${rv(W * 0.655)} 0 ${rv(W * 0.68)} 0`,
      ];
    }
    case "right": {
      const p = dir * T; // dir=1 → positive x (protrudes right)
      return [
        `L ${rv(W)} ${rv(H * 0.32)}`,
        `C ${rv(W)} ${rv(H * 0.345)} ${rv(W + p * 0.42)} ${rv(H * 0.375)} ${rv(W + p * 0.65)} ${rv(H * 0.395)}`,
        `C ${rv(W + p * 0.93)} ${rv(H * 0.42)}  ${rv(W + p)} ${rv(H * 0.455)} ${rv(W + p)} ${rv(H * 0.5)}`,
        `C ${rv(W + p)} ${rv(H * 0.545)} ${rv(W + p * 0.93)} ${rv(H * 0.58)}  ${rv(W + p * 0.65)} ${rv(H * 0.605)}`,
        `C ${rv(W + p * 0.42)} ${rv(H * 0.625)} ${rv(W)} ${rv(H * 0.655)} ${rv(W)} ${rv(H * 0.68)}`,
      ];
    }
    case "bottom": {
      const p = dir * T; // dir=1 → positive y (protrudes down)
      // traversed right → left
      return [
        `L ${rv(W * 0.68)} ${rv(H)}`,
        `C ${rv(W * 0.655)} ${rv(H)} ${rv(W * 0.625)} ${rv(H + p * 0.42)} ${rv(W * 0.605)} ${rv(H + p * 0.65)}`,
        `C ${rv(W * 0.58)}  ${rv(H + p * 0.93)} ${rv(W * 0.545)} ${rv(H + p)} ${rv(W * 0.5)}  ${rv(H + p)}`,
        `C ${rv(W * 0.455)} ${rv(H + p)} ${rv(W * 0.42)}  ${rv(H + p * 0.93)} ${rv(W * 0.395)} ${rv(H + p * 0.65)}`,
        `C ${rv(W * 0.375)} ${rv(H + p * 0.42)} ${rv(W * 0.345)} ${rv(H)} ${rv(W * 0.32)} ${rv(H)}`,
      ];
    }
    case "left": {
      const p = -dir * T; // dir=1 → negative x (protrudes left)
      // traversed bottom → top
      return [
        `L 0 ${rv(H * 0.68)}`,
        `C 0 ${rv(H * 0.655)} ${rv(p * 0.42)} ${rv(H * 0.625)} ${rv(p * 0.65)} ${rv(H * 0.605)}`,
        `C ${rv(p * 0.93)} ${rv(H * 0.58)}  ${rv(p)} ${rv(H * 0.545)} ${rv(p)} ${rv(H * 0.5)}`,
        `C ${rv(p)} ${rv(H * 0.455)} ${rv(p * 0.93)} ${rv(H * 0.42)}  ${rv(p * 0.65)} ${rv(H * 0.395)}`,
        `C ${rv(p * 0.42)} ${rv(H * 0.375)} 0 ${rv(H * 0.345)} 0 ${rv(H * 0.32)}`,
      ];
    }
    default:
      return [];
  }
}

function buildPiecePath(
  W: number,
  H: number,
  top: number,
  right: number,
  bottom: number,
  left: number,
  T: number,
): string {
  return [
    "M 0 0",
    ...edgeTab(W, H, "top", top, T),
    `L ${W} 0`,
    ...edgeTab(W, H, "right", right, T),
    `L ${W} ${H}`,
    ...edgeTab(W, H, "bottom", bottom, T),
    `L 0 ${H}`,
    ...edgeTab(W, H, "left", left, T),
    "L 0 0 Z",
  ].join(" ");
}

// Edge-only paths for accent strokes
function topEdgePath(W: number, H: number, top: number, T: number) {
  return ["M 0 0", ...edgeTab(W, H, "top", top, T), `L ${W} 0`].join(" ");
}
function leftEdgePath(W: number, H: number, left: number, T: number) {
  return [`M 0 ${H}`, ...edgeTab(W, H, "left", left, T), "L 0 0"].join(" ");
}
function rightEdgePath(W: number, H: number, right: number, T: number) {
  return [`M ${W} 0`, ...edgeTab(W, H, "right", right, T), `L ${W} ${H}`].join(" ");
}
function bottomEdgePath(W: number, H: number, bottom: number, T: number) {
  return [`M ${W} ${H}`, ...edgeTab(W, H, "bottom", bottom, T), `L 0 ${H}`].join(" ");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlassPuzzlePiece({
  width = 200,
  height = 200,
  top = 1,
  right = -1,
  bottom = 1,
  left = -1,
  children,
  className = "",
  style,
}: GlassPuzzlePieceProps) {
  const uid      = useId().replace(/:/g, "");
  const clipId   = `pp-clip-${uid}`;
  const gTL      = `pp-gtl-${uid}`;
  const gBR      = `pp-gbr-${uid}`;

  const T      = Math.min(width, height) * 0.22;
  const totalW = width  + 2 * T;
  const totalH = height + 2 * T;

  const path = buildPiecePath(width, height, top, right, bottom, left, T);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width:  totalW,
        height: totalH,
        // CSS drop-shadow follows the irregular clip shape
        filter: "drop-shadow(3px 8px 20px rgba(0,0,0,0.30)) drop-shadow(1px 2px 4px rgba(0,0,0,0.18))",
        ...style,
      }}
    >
      {/* ── Clip path (zero-size) ── */}
      <svg
        width={0}
        height={0}
        aria-hidden
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={path} transform={`translate(${T},${T})`} />
          </clipPath>
        </defs>
      </svg>

      {/* ── Layer 1: frosted glass backdrop ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `url(#${clipId})`,
          background: "rgba(255,255,255,0.09)",
          backdropFilter: "blur(12px) saturate(1.35)",
          WebkitBackdropFilter: "blur(12px) saturate(1.35)",
        }}
      />

      {/* ── Layer 2: SVG overlays ── */}
      <svg
        width={totalW}
        height={totalH}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Top-left highlight: white/70 → transparent */}
          <linearGradient
            id={gTL}
            gradientUnits="userSpaceOnUse"
            x1={T} y1={T}
            x2={T + width * 0.7} y2={T + height * 0.7}
          >
            <stop offset="0%"   stopColor="rgba(255,255,255,0.68)" />
            <stop offset="35%"  stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Bottom-right shadow: transparent → dark */}
          <linearGradient
            id={gBR}
            gradientUnits="userSpaceOnUse"
            x1={T + width * 0.3} y1={T + height * 0.3}
            x2={T + width} y2={T + height}
          >
            <stop offset="0%"   stopColor="rgba(0,5,30,0)" />
            <stop offset="100%" stopColor="rgba(0,5,30,0.26)" />
          </linearGradient>
        </defs>

        {/* Highlight fill (top-left) */}
        <path
          d={path}
          transform={`translate(${T},${T})`}
          fill={`url(#${gTL})`}
        />

        {/* Shadow fill (bottom-right) */}
        <path
          d={path}
          transform={`translate(${T},${T})`}
          fill={`url(#${gBR})`}
        />

        {/* Inset glow — thick white stroke clipped inside shape */}
        <path
          d={path}
          transform={`translate(${T},${T})`}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="5"
          clipPath={`url(#${clipId})`}
        />

        {/* Outer border: white/50 */}
        <path
          d={path}
          transform={`translate(${T},${T})`}
          fill="none"
          stroke="rgba(255,255,255,0.50)"
          strokeWidth="1.2"
        />

        {/* Top edge bright accent (white/75) */}
        <path
          d={topEdgePath(width, height, top, T)}
          transform={`translate(${T},${T})`}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left edge highlight (white/50) */}
        <path
          d={leftEdgePath(width, height, left, T)}
          transform={`translate(${T},${T})`}
          fill="none"
          stroke="rgba(255,255,255,0.50)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right edge shadow (dark/14) */}
        <path
          d={rightEdgePath(width, height, right, T)}
          transform={`translate(${T},${T})`}
          fill="none"
          stroke="rgba(0,5,30,0.14)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom edge shadow (dark/12) */}
        <path
          d={bottomEdgePath(width, height, bottom, T)}
          transform={`translate(${T},${T})`}
          fill="none"
          stroke="rgba(0,5,30,0.12)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ── Layer 3: children (centered in core) ── */}
      <div
        style={{
          position: "absolute",
          top: T,
          left: T,
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
