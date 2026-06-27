"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroLines() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // 9개 선 위치: 8%~92% 균등 배분 (간격 ~10.5%)
  // index: 0   1    2    3    4     5    6    7    8
  // left:  8%  19%  29%  40%  50%  61%  71%  82%  92%

  useEffect(() => {
    const lines = refs.current;
    gsap.timeline({ delay: 0.3 })
      // 중앙 단독 fade-in
      .fromTo(lines[4], { left: "50%", opacity: 0 }, { left: "50%", opacity: 1, duration: 0.5, ease: "power2.out" })
      // 1단계: 중앙 바로 옆
      .fromTo(lines[3], { left: "50%", opacity: 0 }, { left: "40%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.3")
      .fromTo(lines[5], { left: "50%", opacity: 0 }, { left: "61%", opacity: 1, duration: 0.8, ease: "power2.out" }, "<")
      // 2단계
      .fromTo(lines[2], { left: "50%", opacity: 0 }, { left: "29%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .fromTo(lines[6], { left: "50%", opacity: 0 }, { left: "71%", opacity: 1, duration: 0.8, ease: "power2.out" }, "<")
      // 3단계
      .fromTo(lines[1], { left: "50%", opacity: 0 }, { left: "19%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .fromTo(lines[7], { left: "50%", opacity: 0 }, { left: "82%", opacity: 1, duration: 0.8, ease: "power2.out" }, "<")
      // 4단계: 최외곽
      .fromTo(lines[0], { left: "50%", opacity: 0 }, { left: "8%",  opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .fromTo(lines[8], { left: "50%", opacity: 0 }, { left: "92%", opacity: 1, duration: 0.8, ease: "power2.out" }, "<");
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          ref={el => { refs.current[i] = el; }}
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "1.5px",
            height: "100%",
            background: "rgba(255,255,255,0.18)",
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
