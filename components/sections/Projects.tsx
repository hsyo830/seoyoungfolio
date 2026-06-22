"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollVelocity from "@/components/ui/ScrollVelocity";
import ScrollFloat from "@/components/ui/ScrollFloat";
import ProjectCard from "@/components/cards/ProjectCard";
import ShinyText from "@/components/ui/ShinyText";
import ScrambleText from "@/components/ui/ScrambleText";

gsap.registerPlugin(ScrollTrigger);

const CARDS = ["001", "002", "003", "004"];
const CARD_COUNT = CARDS.length;

const LABEL_FLOAT_SHARED = {
  animationDuration: 1.5,
  ease: "back.out(3)",
  stagger: 0.05,
  containerClassName: "!font-normal !my-0",
} as const;

const GLASS_EMBOSS: React.CSSProperties = {
  color: "transparent",
  backgroundImage:
    "linear-gradient(180deg, #ffffff 0%, #c6cad2 48%, #f2f2f4 78%, #ffffff 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  textShadow: [
    "0 1px 0 rgba(255,255,255,0.9)",
    "0 -1px 1px rgba(0,0,0,0.12)",
    "0 1px 2px rgba(0,0,0,0.08)",
    "0 2px 4px rgba(0,0,0,0.10)",
  ].join(", "),
};

const LABEL_FLOAT_FIRST = {
  ...LABEL_FLOAT_SHARED,
  scrollStart: "center bottom",
  scrollEnd: "center bottom-=15%",
} as const;
const LABEL_FLOAT_SECOND = {
  ...LABEL_FLOAT_SHARED,
  scrollStart: "center bottom-=15%",
  scrollEnd: "center center",
} as const;

export default function Projects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScramble, setShowScramble] = useState(false);
  const lastIndexRef = useRef(-1);

  useEffect(() => {
    const pin = pinRef.current;
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
          onEnter: () => {
            setShowScramble(true);
            setActiveIndex(0);
            lastIndexRef.current = 0;
          },
          onLeaveBack: () => {
            setShowScramble(false);
            lastIndexRef.current = -1;
          },
          onUpdate: (self) => {
            const idx = Math.min(
              Math.round(self.progress * (CARD_COUNT - 1)),
              CARD_COUNT - 1
            );
            if (idx !== lastIndexRef.current) {
              lastIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
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
            <ShinyText
              key="v1"
              text="CRAFT · PERFORMANCE · AESTHETICS · AMBITION · INNOVATION ·"
              color="rgba(180,150,220,0.35)"
              shineColor="rgba(220,200,255,0.55)"
              speed={5}
            />,
            <ShinyText
              key="v2"
              text="SELECTED WORKS · INTERACTIVE PROJECTS · FRONTEND EXPERIENCES ·"
              color="rgba(255,255,255,0.35)"
              shineColor="rgba(255,255,255,0.65)"
              speed={5}
            />,
            <ShinyText
              key="v3"
              text="NEXT.JS · TYPESCRIPT · TAILWIND · GSAP · FRAMER MOTION ·"
              color="rgba(180,150,220,0.35)"
              shineColor="rgba(220,200,255,0.55)"
              speed={5}
            />,
          ]}
          velocity={100}
          numCopies={4}
          scrollerStyle={{
            fontFamily: "'KblJumpExtended', sans-serif",
            fontWeight: 100,
            WebkitTextStroke: "0.5px rgba(58, 58, 58, 0.4)",
          }}
        />
      </div>

      {/* 수평 카드 트랙 (ScrollTrigger pin) */}
      <div ref={pinRef} className="h-screen relative pt-32">
        {/* 카드 위 좌측 상단 라벨 */}
        <div
          className="absolute top-8 left-10 z-10 pointer-events-none select-none"
          style={{ fontFamily: "'KblJumpExtended', sans-serif" }}
        >
          {showScramble ? (
            <div className="my-5">
              <div className="flex items-center">
                <span
                  className="inline-block text-sm uppercase shrink-0"
                  style={{ ...GLASS_EMBOSS, letterSpacing: "0.25em" }}
                >
                  PROJECT
                </span>
                <div
                  className="mx-4 shrink-0 h-[2px] w-28"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(198,202,210,0.35) 100%)",
                    boxShadow: [
                      "0 1px 0 rgba(255,255,255,0.6)",
                      "0 -1px 0 rgba(0,0,0,0.08)",
                      "0 0 8px rgba(255,255,255,0.35)",
                    ].join(", "),
                  }}
                />
                <ScrambleText
                  text={CARDS[activeIndex]}
                  className="inline-block text-sm uppercase shrink-0"
                  style={{ ...GLASS_EMBOSS, letterSpacing: "0.25em" }}
                  duration={500}
                />
              </div>
            </div>
          ) : (
            <ScrollFloat
              {...LABEL_FLOAT_FIRST}
              textClassName="!text-base uppercase"
              textStyle={{ ...GLASS_EMBOSS, letterSpacing: "0.25em" }}
            >
              SELECTED WORKS
            </ScrollFloat>
          )}
          {!showScramble && (
            <ScrollFloat
              {...LABEL_FLOAT_SECOND}
              textClassName="!text-sm"
              textStyle={{ ...GLASS_EMBOSS, letterSpacing: "0.15em" }}
            >
              04 PROJECTS / 2025
            </ScrollFloat>
          )}
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
