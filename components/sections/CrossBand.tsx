"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CrossBand() {
  const crossBandRef = useRef<HTMLElement>(null);
  const band1Ref = useRef<HTMLDivElement>(null);
  const band2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 초기 상태 즉시 적용 (hydration flash 방지)
      gsap.set([band1Ref.current, band2Ref.current], { opacity: 0 });

      const triggerConfig = {
        trigger: crossBandRef.current,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      };

      gsap.fromTo(band1Ref.current, { opacity: 0 }, { opacity: 1, scrollTrigger: triggerConfig });
      gsap.fromTo(band2Ref.current, { opacity: 0 }, { opacity: 1, scrollTrigger: triggerConfig });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={crossBandRef}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        border: "none",
        outline: "none",
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        @keyframes xb-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes xb-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .xb-band {
          position: absolute;
          top: 50%;
          left: -50vw;
          width: 200vw;
          height: 60px;
          background: rgba(210,210,210,0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-top: 1px solid rgba(255,255,255,0.15);
          border-bottom: 1px solid rgba(255,255,255,0.15);
          overflow: hidden;
          display: flex;
          align-items: center;
          transform-origin: center center;
        }
        /* 두 띠 모두 동일한 중심점(50vw, 50%)에서 반대 방향 회전 → 정중앙 X 교차 */
        .xb-band-1 { transform: translateY(-50%) rotate(10deg); }
        .xb-band-2 { transform: translateY(-50%) rotate(-10deg); }
        .xb-track {
          display: flex;
          width: max-content;
          white-space: nowrap;
          align-items: center;
        }
        .xb-track-left  { animation: xb-left  40s linear infinite; }
        .xb-track-right { animation: xb-right 40s linear infinite; }
        .xb-item {
          display: inline-block;
          font-family: 'KblJumpExtended', sans-serif;
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.85);
          -webkit-text-stroke: 0.5px rgba(40,40,40,0.55);
          text-transform: uppercase;
          padding: 0 48px;
          white-space: nowrap;
        }
      `}</style>

      {/* 띠 1: 위치 고정, GSAP opacity만 제어 */}
      <div ref={band1Ref} className="xb-band xb-band-1">
        <div className="xb-track xb-track-left">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="xb-item">
              CRAFT · PERFORMANCE · AESTHETICS · AMBITION · INNOVATION ·
            </span>
          ))}
        </div>
      </div>

      {/* 띠 2: 위치 고정, GSAP opacity만 제어 */}
      <div ref={band2Ref} className="xb-band xb-band-2">
        <div className="xb-track xb-track-right">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="xb-item">
              SELECTED WORKS · 04 PROJECTS · FRONTEND DEVELOPER ·
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
