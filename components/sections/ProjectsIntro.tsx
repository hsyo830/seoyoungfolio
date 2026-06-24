"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShinyText from "@/components/ui/ShinyText";

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
        justifyContent: "center",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* SELECTED WORKS + 04 + PROJECTS + 2025-2026 — 함께 스크롤 아웃 */}
      <div
        ref={titleWrapRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          gap: "10px",
        }}
      >
        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.5)",
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

        {/* "PROJECTS" — text-stroke 베이스 + ShinyText 오버레이 */}
        <div
          ref={titleRef}
          style={{
            position: "relative",
            display: "inline-block",
            fontSize: "clamp(50px, 8vw, 110px)",
            fontFamily: "'KblJumpExtended', sans-serif",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            margin: 0,
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.05))",
            WebkitTextStroke: "1px rgba(255,255,255,0.45)",
          }}
        >
          {/* GSAP 애니메이션 타겟: text-stroke 아웃라인 글자 */}
          {CHARS.map((char, i) => (
            <span
              key={i}
              ref={el => { charsRef.current[i] = el; }}
              style={{ display: "inline-block", color: "transparent" }}
            >
              {char}
            </span>
          ))}

          {/* ShinyText: shine sweep 오버레이 */}
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <ShinyText
              text="PROJECTS"
              color="transparent"
              shineColor="rgba(255,255,255,0.6)"
              speed={18}
            />
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.4)",
            margin: 0,
            lineHeight: 1,
          }}
        >
          2025–2026
        </p>
      </div>
    </section>
  );
}
