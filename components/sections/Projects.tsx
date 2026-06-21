import ScrollFloat from "@/components/ui/ScrollFloat";
import ShinyText from "@/components/ui/ShinyText";
import React from "react";

// 세로 스트라이프 메탈 베이스 — ShinyText 광택이 위에서 screen 블렌딩으로 덧씌워짐
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

// ScrollFloat + ShinyText 에서 공유하는 텍스트 스타일 클래스
const TEXT_CLASS = "font-normal tracking-tighter !text-[clamp(1.5rem,3vw,3.5rem)] !leading-none";

export default function Projects() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-6">
      <div
        className="relative"
        style={{ fontFamily: "'KblJumpExtended', sans-serif" }}
      >
        {/* 베이스: 세로 스트라이프 메탈 + text-shadow 입체감 */}
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="bottom center"
          stagger={0.03}
          containerClassName={`!font-normal !my-0`}
          textClassName={TEXT_CLASS}
          textStyle={metalBaseStyle}
        >
          SELECTED WORKS
        </ScrollFloat>

        {/* 광택 오버레이: screen 블렌딩으로 메탈 위에서만 빛을 더함
            color="#000000" → screen(검정, 아래) = 아래 그대로
            shineColor="#ffffff" → screen(흰, 아래) = 밝게 → 흰 빛이 스쳐가는 효과 */}
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
  );
}
