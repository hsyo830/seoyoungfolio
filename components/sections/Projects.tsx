'use client';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/components/ui/ScrollFloat";
import ShinyText from "@/components/ui/ShinyText";
import ProjectCard from "@/components/cards/ProjectCard";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

const metalBaseStyle: React.CSSProperties = {
  color: "transparent",
  backgroundImage: [
    "repeating-linear-gradient(",
    "  90deg,",
    "  #3a3a3a 0%,",
    "  #888888 7%,",
    "  #ffffff 13%,",
    "  #c8c8c8 18%,",
    "  #4a4a4a 26%,",
    "  #adadad 34%,",
    "  #ffffff 40%,",
    "  #d8d8d8 46%,",
    "  #5a5a5a 54%,",
    "  #b0b0b0 63%,",
    "  #f0f0f0 70%,",
    "  #3a3a3a 80%,",
    "  #7a7a7a 90%,",
    "  #3a3a3a 100%",
    ")",
  ].join(""),
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  textShadow: [
    "0 1px 0 #888",
    "0 2px 0 #666",
    "0 3px 0 #444",
    "0 4px 4px rgba(0,0,0,0.5)",
  ].join(", "),
  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
};

const TEXT_CLASS =
  "font-normal tracking-tighter !text-[clamp(1.5rem,3vw,3.5rem)] !leading-none";

export default function Projects() {
  const pinRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin   = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - pin.offsetWidth),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 1,
          start: "top top",
          // 가로 이동 거리만큼 추가 스크롤 공간 확보
          end: () => `+=${track.scrollWidth - pin.offsetWidth}`,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── 1. SELECTED WORKS 타이틀 (ScrollFloat + ShinyText) ── */}
      <section className="w-full min-h-screen flex items-center justify-center px-6">
        <div
          className="relative"
          style={{ fontFamily: "'KblJumpExtended', sans-serif" }}
        >
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top bottom"
            scrollEnd="bottom center"
            stagger={0.03}
            containerClassName="!font-normal !my-0"
            textClassName={TEXT_CLASS}
            textStyle={metalBaseStyle}
          >
            SELECTED WORKS
          </ScrollFloat>

          {/* ShinyText: mix-blend-mode screen으로 메탈 위에 광택 오버레이 */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ mixBlendMode: "screen" }}
          >
            <ShinyText
              text="SELECTED WORKS"
              className={TEXT_CLASS}
              color="#000000"
              shineColor="#ffffff"
              speed={3}
              spread={120}
              direction="left"
            />
          </div>
        </div>
      </section>

      {/* ── 2. 수평 카드 트랙 (ScrollTrigger pin + translateX) ── */}
      <div ref={pinRef} className="h-screen overflow-hidden">
        {/*
          w-max → 카드 4개의 실제 너비 합산으로 트랙 크기 결정
          GSAP: x = -(track.scrollWidth - viewport.width) 로 끝까지 이동
        */}
        <div
          ref={trackRef}
          className="flex h-full w-max items-center gap-8 px-[10vw]"
        >
          {[0, 1, 2, 3].map((i) => (
            <ProjectCard key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
