import ScrollFloat from "@/components/ui/ScrollFloat";
import React from "react";

const ironKnightStyle: React.CSSProperties = {
  color: "transparent",
  // 폴리싱된 실버 — 어두운 금속 바탕에 강한 백색 스펙큘러 하이라이트
  backgroundImage: [
    "repeating-linear-gradient(",
    "  90deg,",
    "  #3a3a3a 0%,",
    "  #888888 7%,",
    "  #ffffff 13%,",   // 강한 스펙큘러
    "  #c8c8c8 18%,",
    "  #4a4a4a 26%,",
    "  #adadad 34%,",
    "  #ffffff 40%,",   // 두 번째 하이라이트
    "  #d8d8d8 46%,",
    "  #5a5a5a 54%,",
    "  #b0b0b0 63%,",
    "  #f0f0f0 70%,",   // 세 번째, 약한 하이라이트
    "  #3a3a3a 80%,",
    "  #7a7a7a 90%,",
    "  #3a3a3a 100%",
    ")",
  ].join(""),
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  // 위쪽 흰 글로우로 내부에서 빛이 새는 느낌 + 아래쪽 그림자로 두께감
  textShadow: [
    "0 0 12px rgba(255,255,255,0.6)",  // 내부 빛 글로우
    "0 0 30px rgba(220,220,220,0.25)", // 부드러운 외부 후광
    "0 1px 0 rgba(255,255,255,0.9)",   // 상단 하이라이트
    "0 2px 0 #999",
    "0 3px 0 #666",
    "0 4px 4px rgba(0,0,0,0.55)",      // 바닥 그림자로 입체감
  ].join(", "),
  // 전체 글로우 + 배경 위 외곽 강조
  filter: [
    "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
    "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
  ].join(" "),
};

export default function Projects() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-6">
      <div style={{ fontFamily: "'KblJumpExtended', sans-serif" }}>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="bottom center"
          stagger={0.03}
          containerClassName="!font-normal"
          textClassName="tracking-tighter !text-[clamp(1.5rem,3vw,3.5rem)] !leading-none"
          textStyle={ironKnightStyle}
        >
          SELECTED WORKS
        </ScrollFloat>
      </div>
    </section>
  );
}
