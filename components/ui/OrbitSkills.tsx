"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TS: React.CSSProperties = { textShadow: "0 1px 12px rgba(0,0,0,0.4)" };

interface OrbitSkillsProps {
  skills: string[];
}

export default function OrbitSkills({ skills }: OrbitSkillsProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const skillRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const isHoveringRef = useRef(false);
  const snappedRef    = useRef(false);

  const angleOffsets = useRef(
    skills.map((_, i) => (i / skills.length) * Math.PI * 2),
  );
  const positionsRef = useRef(
    skills.map(() => ({ x: 0, y: 0 })),
  );
  // 전역 궤도 상태 (hover 시 함께 보간)
  const orbitStateRef = useRef({ radiusScale: 1, sizeScale: 1 });

  // ── Orbit animation loop ─────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf: number;
    let t = 0;

    const animate = () => {
      t += 0.0015;

      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rx = rect.width  * 0.44;   // 14개 기준 약간 확장
      const ry = rect.height * 0.38;
      const isH = isHoveringRef.current;

      // hover 시 반경·크기 보간 (사라지지 않고 줄어들기만 함)
      const os = orbitStateRef.current;
      os.radiusScale += ((isH ? 0.55 : 1.0) - os.radiusScale) * 0.1;
      os.sizeScale   += ((isH ? 0.70 : 1.0) - os.sizeScale)   * 0.12;

      skills.forEach((_, i) => {
        const el  = skillRefs.current[i];
        const pos = positionsRef.current[i];
        if (!el) return;

        const angle  = angleOffsets.current[i] - t;
        const rv     = 1 + Math.sin(i * 1.7) * 0.12;
        const floatY = Math.sin(t * 3 + i * 2) * 6;
        const targetX = cx + Math.cos(angle) * rx * rv * os.radiusScale;
        const targetY = cy + Math.sin(angle) * ry * rv * os.radiusScale + floatY;

        if (!snappedRef.current) {
          pos.x = targetX;
          pos.y = targetY;
        } else {
          pos.x += (targetX - pos.x) * 0.12;
          pos.y += (targetY - pos.y) * 0.12;
        }

        el.style.transform =
          `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${os.sizeScale.toFixed(4)})`;
      });

      if (!snappedRef.current) snappedRef.current = true;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [skills]);

  // ── ScrollTrigger entry fade-in ──────────────────────────────────────────
  useEffect(() => {
    const els = skillRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!els.length) return;

    gsap.set(els, { opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to(els, {
        opacity: 1,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Hover handlers (scale only — opacity는 건드리지 않음) ────────────────
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (centerTextRef.current)
      gsap.to(centerTextRef.current, { scale: 1.08, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (centerTextRef.current)
      gsap.to(centerTextRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "70vh",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* 위치 래퍼 (translate) ← GSAP scale 충돌 방지를 위해 분리 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <div
          ref={centerTextRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            fontFamily: "var(--font-anton)",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#ea5d2a",
            textShadow: [
              "0.9px 0.9px 0 #000",
              "-0.9px 0.9px 0 #000",
              "0.9px -0.9px 0 #000",
              "-0.9px -0.9px 0 #000",
            ].join(", "),
            fontSize: "clamp(28px, 3.5vw, 56px)",
            whiteSpace: "nowrap",
            cursor: "default",
            userSelect: "none",
          }}
        >
          SKILLS&amp;STACK
        </div>
      </div>

      {/* 궤도 스킬 태그 */}
      {skills.map((skill, i) => (
        <div
          key={skill}
          ref={el => { skillRefs.current[i] = el; }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            fontSize: "clamp(10px, 0.9vw, 14px)",
            color: "rgba(255,255,255,0.78)",
            letterSpacing: "0.08em",
            padding: "5px 12px",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: "999px",
            whiteSpace: "nowrap",
            opacity: 0,
            pointerEvents: "none",
            willChange: "transform",
            ...TS,
          }}
        >
          {skill}
        </div>
      ))}
    </div>
  );
}
