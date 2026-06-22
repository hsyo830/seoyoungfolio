'use client';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollVelocity from "@/components/ui/ScrollVelocity";
import ScrollFloat from "@/components/ui/ScrollFloat";
import ProjectCard from "@/components/cards/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const LABEL_FLOAT_SHARED = {
  animationDuration: 1.5,
  ease: "back.out(3)",
  stagger: 0.05,
  containerClassName: "!font-normal !my-0",
} as const;

// Hero 글래스/엠보 텍스처 — 소형 텍스트 크기에 맞춰 shadow 스케일 다운
const GLASS_EMBOSS: React.CSSProperties = {
  color: 'transparent',
  backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #c6cad2 48%, #f2f2f4 78%, #ffffff 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  textShadow: [
    '0 1px 0 rgba(255,255,255,0.9)',
    '0 -1px 1px rgba(0,0,0,0.12)',
    '0 1px 2px rgba(0,0,0,0.08)',
    '0 2px 4px rgba(0,0,0,0.10)',
  ].join(', '),
};

// 뷰포트 진입 시점부터 순차 등장: SELECTED WORKS → 04 PROJECTS
// "center bottom"   = 엘리먼트 센터가 뷰포트 하단에 닿는 순간 (막 진입)
// "center bottom-=15%" = 뷰포트 85% 지점 (SELECTED WORKS 완료 & 04 PROJECTS 시작)
// "center center"   = 뷰포트 중앙 (04 PROJECTS 완료)
const LABEL_FLOAT_FIRST  = { ...LABEL_FLOAT_SHARED, scrollStart: "center bottom",      scrollEnd: "center bottom-=15%" } as const;
const LABEL_FLOAT_SECOND = { ...LABEL_FLOAT_SHARED, scrollStart: "center bottom-=15%", scrollEnd: "center center"      } as const;

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

      {/* 수평 카드 트랙 (ScrollTrigger pin) */}
      <div ref={pinRef} className="h-screen relative pt-32">
        {/* 카드 위 좌측 상단 라벨 — ScrollFloat 효과 + 핀 중 고정 위치 유지 */}
        <div
          className="absolute top-8 left-10 z-10 pointer-events-none select-none"
          style={{ fontFamily: "'KblJumpExtended', sans-serif" }}
        >
          <ScrollFloat
            {...LABEL_FLOAT_FIRST}
            textClassName="!text-sm uppercase"
            textStyle={{ ...GLASS_EMBOSS, letterSpacing: '0.25em' }}
          >
            SELECTED WORKS
          </ScrollFloat>
          <ScrollFloat
            {...LABEL_FLOAT_SECOND}
            textClassName="!text-xs"
            textStyle={{ ...GLASS_EMBOSS, letterSpacing: '0.15em' }}
          >
            04 PROJECTS / 2025
          </ScrollFloat>
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
