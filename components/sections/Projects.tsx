import ScrollFloat from "@/components/ui/ScrollFloat";
import React from "react";

const charcoalGlassStyle: React.CSSProperties = {
  color: "transparent",
  backgroundImage:
    "linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 40%, #1a1a1a 60%, #3a3a3a 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  textShadow: [
    "0 1px 0 rgba(180,180,180,0.4)",
    "0 -1px 1px rgba(0,0,0,0.3)",
    "0 2px 2px rgba(0,0,0,0.15)",
    "0 4px 6px rgba(0,0,0,0.2)",
  ].join(", "),
  filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.18))",
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
          textStyle={charcoalGlassStyle}
        >
          SELECTED WORKS
        </ScrollFloat>
      </div>
    </section>
  );
}
