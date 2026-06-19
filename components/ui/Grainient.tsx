"use client";

import { useId } from "react";

interface GrainientProps {
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Grainient({
  color1 = "#d8d2cb",
  color2 = "#d8d6d0",
  color3 = "#d8d3cc",
  className = "",
  style,
}: GrainientProps) {
  const filterId = useId().replace(/:/g, "");

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={style}>
      {/* Gradient base */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 15% 25%, ${color1} 0%, transparent 55%),
            radial-gradient(ellipse at 85% 75%, ${color2} 0%, transparent 55%),
            radial-gradient(ellipse at 50% 55%, ${color3} 0%, transparent 70%)
          `,
          backgroundColor: color2,
        }}
      />

      {/* Grain overlay via SVG feTurbulence */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
          <feComposite in="blended" in2="SourceGraphic" operator="in" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity="0.28" />
      </svg>
    </div>
  );
}
