"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 마퀴 트랙: "PROJECTS  ● " 패턴 (첫 ● 는 bulletRef에서 별도 렌더)
const TRACK = Array.from({ length: 6 }, () => "PROJECTS  ● ").join("");

const textStyle: React.CSSProperties = {
  fontFamily: "'KblJumpExtended', sans-serif",
  fontSize: "clamp(60px, 10vw, 140px)",
  color: "rgba(255,255,255,0.9)",
  letterSpacing: "-0.02em",
  lineHeight: 1,
  whiteSpace: "nowrap",
  userSelect: "none",
};

export default function ProjectsIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const botLineRef = useRef<HTMLDivElement>(null);
  const bulletRef  = useRef<HTMLSpanElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const topLine = topLineRef.current;
    const botLine = botLineRef.current;
    const bullet  = bulletRef.current;
    const marquee = marqueeRef.current;
    if (!section || !topLine || !botLine || !bullet || !marquee) return;

    const ctx = gsap.context(() => {
      // 실선: width 0% → 100%
      const lineTrigger = { trigger: section, start: "top bottom", end: "center center", scrub: 1 };
      gsap.fromTo(topLine, { width: "0%" }, { width: "100%", ease: "none", scrollTrigger: lineTrigger });
      gsap.fromTo(botLine, { width: "0%" }, { width: "100%", ease: "none", scrollTrigger: lineTrigger });

      // 원형 — 텍스트보다 먼저 (end: "top 40%")
      gsap.fromTo(
        bullet,
        { x: 120, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      // 마퀴 텍스트 — 조금 늦게 (start: "top 80%", end: "center center")
      gsap.fromTo(
        marquee,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* 위 실선 */}
        <div
          ref={topLineRef}
          style={{ width: "0%", height: "6px", background: "rgba(255,255,255,0.7)" }}
        />

        {/* 실선↔텍스트 간격 + 원형·마퀴 행 */}
        <div style={{ padding: "32px 0", display: "flex", alignItems: "center" }}>
          {/* 원형 불릿 — 별도 ref, 먼저 슬라이드 인 */}
          <span
            ref={bulletRef}
            style={{
              fontFamily: "'KblJumpExtended', sans-serif",
              fontSize: "clamp(30px, 5vw, 70px)",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1,
              flexShrink: 0,
              userSelect: "none",
              paddingRight: "0.25em",
              opacity: 0,
            }}
          >
            ●
          </span>

          {/* 마퀴 래퍼 — 조금 늦게 슬라이드 인 */}
          <div ref={marqueeRef} style={{ opacity: 0, flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "pf-marquee 40s linear infinite",
                willChange: "transform",
              }}
            >
              <span style={textStyle}>{TRACK}</span>
              <span style={textStyle} aria-hidden="true">{TRACK}</span>
            </div>
          </div>
        </div>

        {/* 아래 실선 */}
        <div
          ref={botLineRef}
          style={{ width: "0%", height: "6px", background: "rgba(255,255,255,0.7)" }}
        />
      </div>

      <style>{`
        @keyframes pf-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
