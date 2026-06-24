"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";

const SIZE  = 220;
const PURPLE = "rgba(80,40,160,0.85)";

export default function ProfileAvatar() {
  const leftEyeRef  = useRef<SVGGElement>(null);
  const rightEyeRef = useRef<SVGGElement>(null);
  const mouthRef    = useRef<SVGGElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2; // -1 ~ 1
    const ny = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;

    gsap.to(leftEyeRef.current,  { x: nx * 6, y: ny * 4, duration: 0.4, ease: "power2.out" });
    gsap.to(rightEyeRef.current, { x: nx * 6, y: ny * 4, duration: 0.4, ease: "power2.out" });
    gsap.to(mouthRef.current,    { x: nx * 3, y: ny * 2, duration: 0.4, ease: "power2.out" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(
      [leftEyeRef.current, rightEyeRef.current, mouthRef.current],
      { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" }
    );
  }, []);

  // 눈/입 기준 좌표 (SIZE 기준 비율)
  const lx = SIZE * 0.35;   // 77
  const rx = SIZE * 0.65;   // 143
  const ey = SIZE * 0.38;   // 83.6
  const my = SIZE * 0.58;   // 127.6
  const mx = SIZE * 0.50;   // 110

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        width: SIZE, height: SIZE,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "crosshair",
        flexShrink: 0,
      }}
    >
      {/* 프로필 이미지 — 준비되면 img 태그로 교체 */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <img
          src="/images/profile-halftone.png"
          alt="Profile"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      </div>

      {/* SVG 인터랙티브 오버레이 */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* 왼쪽 눈 */}
        <g ref={leftEyeRef}>
          <circle cx={lx} cy={ey} r={8} fill={PURPLE} />
        </g>

        {/* 오른쪽 눈 */}
        <g ref={rightEyeRef}>
          <circle cx={rx} cy={ey} r={8} fill={PURPLE} />
        </g>

        {/* 입 — 미소 arc */}
        <g ref={mouthRef}>
          <path
            d={`M ${mx - SIZE * 0.12},${my} Q ${mx},${my + SIZE * 0.10} ${mx + SIZE * 0.12},${my}`}
            stroke={PURPLE}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
