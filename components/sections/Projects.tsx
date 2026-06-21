import ScrollFloat from "@/components/ui/ScrollFloat";
import React from "react";

const ironKnightStyle: React.CSSProperties = {
  color: "transparent",
  // 세로 스트라이프 메탈 텍스처
  backgroundImage: [
    "repeating-linear-gradient(",
    "  90deg,",
    "  #1a1a1a 0%,",
    "  #4a4a4a 8%,",
    "  #e8e8e8 15%,",
    "  #2a2a2a 22%,",
    "  #6a6a6a 30%,",
    "  #1a1a1a 38%,",
    "  #d0d0d0 45%,",
    "  #2a2a2a 52%,",
    "  #5a5a5a 60%,",
    "  #1a1a1a 100%",
    ")",
  ].join(""),
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  // 적층 shadow로 금속 조각 두께감
  textShadow: [
    "0 1px 0 #888",
    "0 2px 0 #666",
    "0 3px 0 #444",
    "0 4px 4px rgba(0,0,0,0.5)",
  ].join(", "),
  // 밝은 배경 위에서 도드라지도록 외곽 그림자
  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
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
          textClassName="tracking-tighter !text-[clamp(2rem,4.5vw,5rem)] !leading-none"
          textStyle={ironKnightStyle}
        >
          SELECTED WORKS
        </ScrollFloat>
      </div>
    </section>
  );
}
