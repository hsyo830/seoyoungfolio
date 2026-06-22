'use client';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollVelocity from "@/components/ui/ScrollVelocity";
import ScrollFloat from "@/components/ui/ScrollFloat";
import ProjectCard from "@/components/cards/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const pinRef   = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin   = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const dist = track.scrollWidth - window.innerWidth;
    if (dist <= 0) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -dist,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          start: "top top",
          end: `+=${dist}`,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hero → 카드 섹션 전환 텍스트 */}
      <div className="min-h-screen flex flex-col items-center justify-center pb-32">
        <ScrollVelocity
          texts={[
            'SELECTED WORKS · INTERACTIVE PROJECTS · FRONTEND EXPERIENCES ·',
            'NEXT.JS · TYPESCRIPT · TAILWIND · GSAP · FRAMER MOTION ·',
          ]}
          velocity={80}
          numCopies={4}
          className="text-[#3a3a3a]/60"
          scrollerStyle={{ fontFamily: "'KblJumpExtended', sans-serif" }}
        />
      </div>

      {/* SELECTED WORKS 타이틀 */}
      <section className="w-full flex items-center justify-center px-6 py-20">
        <div style={{ fontFamily: "'KblJumpExtended', sans-serif" }}>
          <ScrollFloat
            animationDuration={1.5}
            ease="back.out(3)"
            stagger={0.08}
            yPercent={200}
            scaleY={3.5}
            scrollStart="center bottom+=20%"
            scrollEnd="center center"
            containerClassName="!font-normal !my-0"
            textClassName="!text-7xl !leading-none tracking-tight"
            textStyle={{ color: "white" }}
          >
            SELECTED WORKS
          </ScrollFloat>
        </div>
      </section>

      {/* 수평 카드 트랙 (ScrollTrigger pin) */}
      <div ref={pinRef} className="h-screen relative pt-32">
        {/* 섹션 라벨 — 핀 활성 중에도 고정 위치 유지 */}
        <div className="absolute top-8 left-10 flex flex-col gap-1 z-10 pointer-events-none select-none">
          <span
            className="font-title uppercase text-neutral-500"
            style={{ fontSize: "0.65rem", letterSpacing: "0.28em" }}
          >
            Selected Works
          </span>
          <span
            className="font-body text-neutral-400"
            style={{ fontSize: "0.6rem", letterSpacing: "0.12em" }}
          >
            04 Projects / 2025
          </span>
        </div>

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
