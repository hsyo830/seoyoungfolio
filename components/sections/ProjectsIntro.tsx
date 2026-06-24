"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHARS = [...'PROJECTS'];

export default function ProjectsIntro() {
  const sectionRef   = useRef<HTMLElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const numRef       = useRef<HTMLParagraphElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);
  const charsRef     = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section   = sectionRef.current;
    const titleWrap = titleWrapRef.current;
    const num       = numRef.current;
    const chars     = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!section || !titleWrap || !num || !chars.length) return;

    const ctx = gsap.context(() => {
      // "04" — 조용히 fade in
      gsap.fromTo(num,
        { opacity: 0 },
        {
          opacity: 0.15,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );

      // "PROJECTS" — 글자별 blur + y 등장
      gsap.fromTo(chars,
        { y: 60, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.04,
          ease: "power4.out",
          onComplete: () => {
            gsap.set(chars, { clearProps: "y,opacity,filter" });
          },
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // 전체 콘텐츠 스크롤 아웃: pin + scrub
      gsap.to(titleWrap, {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: "bottom top",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "28vh",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes projectsShine {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        .projects-shine-overlay {
          position: absolute;
          top: 0; left: 0;
          white-space: nowrap;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.65) 50%, transparent 65%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          opacity: 0.45;
          animation: projectsShine 5s ease-in-out infinite;
        }
        @keyframes halftoneShift {
          0%, 100% { background-size: 6px 6px; opacity: 0.28; }
          50%       { background-size: 9px 9px; opacity: 0.48; }
        }
        .projects-halftone-overlay {
          position: absolute;
          top: 0; left: 0;
          white-space: nowrap;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px);
          background-size: 6px 6px;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: halftoneShift 3s ease-in-out infinite;
        }
      `}</style>

      {/* SELECTED WORKS + 04 + PROJECTS + 2025-2026 — 함께 스크롤 아웃 */}
      <div
        ref={titleWrapRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.72)",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: 1,
          }}
        >
          SELECTED WORKS
        </p>

        {/* "04" — flex 흐름 밖, 배경 레이어 */}
        <p
          ref={numRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "20vw",
            fontFamily: "'KblJumpExtended', sans-serif",
            fontWeight: 900,
            lineHeight: 1,
            color: "rgba(255,255,255,0.15)",
            margin: 0,
            opacity: 0,
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 0,
          }}
        >
          04
        </p>

        {/* "PROJECTS" — char spans (GSAP 타겟) + shine overlay */}
        <div
          ref={titleRef}
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: "'KblJumpExtended', sans-serif",
            fontSize: "clamp(72px, 10vw, 150px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            margin: "0 auto",
            maxWidth: "75vw",
            width: "fit-content",
            overflow: "visible",
            color: "rgba(255,255,255,0.06)",
            WebkitTextStroke: "0.3px rgba(255,255,255,0.4)",
            textShadow: "0 0 18px rgba(255,255,255,0.14), 0 12px 40px rgba(120,90,180,0.12)",
          }}
        >
          {CHARS.map((char, i) => (
            <span
              key={i}
              ref={el => { charsRef.current[i] = el; }}
              style={{ display: "inline-block" }}
            >
              {char}
            </span>
          ))}

          {/* shine sweep 오버레이 */}
          <span className="projects-shine-overlay">PROJECTS</span>

          {/* halftone 도트 텍스처 오버레이 */}
          <span className="projects-halftone-overlay">PROJECTS</span>
        </div>

        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            lineHeight: 1,
          }}
        >
          04 PROJECTS
        </p>
      </div>
    </section>
  );
}
