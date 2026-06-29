"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SEGMENT_TEXT = "  ~/  PLAYGROUND  → 4 PROJECTS    ";

function TrackSegment() {
  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      <span className="pm-star">✦</span>
      {SEGMENT_TEXT}
    </span>
  );
}

const COPIES = 10;

export default function ProjectsMarquee() {
  const sectionRef   = useRef<HTMLElement>(null);
  const lineLeftRef  = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const naturalTopRef = useRef<number>(0);
  const [isStuck, setIsStuck] = useState(false);

  // Entry animation
  useEffect(() => {
    const section  = sectionRef.current;
    const ll       = lineLeftRef.current;
    const lr       = lineRightRef.current;
    const content  = contentRef.current;
    if (!section || !ll || !lr || !content) return;

    gsap.set(content, { opacity: 0, y: 40 });
    gsap.set([ll, lr], { scaleX: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
      tl.to([ll, lr], { scaleX: 1, duration: 0.5, ease: "power2.out" })
        .to(content, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.05");
    });

    return () => ctx.revert();
  }, []);

  // Stuck detection via scroll + natural offset
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Measure natural top once (before sticky kicks in)
    const rect = section.getBoundingClientRect();
    naturalTopRef.current = rect.top + window.scrollY;

    const onScroll = () => {
      setIsStuck(window.scrollY >= naturalTopRef.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const height = isStuck ? 48 : 72;

  return (
    <>
      <style>{`
        @keyframes pm-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .pm-star {
          display: inline-block;
          animation: pm-spin 4s linear infinite;
          margin-right: 0.45em;
        }
        @keyframes pm-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <section
        ref={sectionRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height,
          minHeight: height,
          background: isStuck ? "#000000" : "transparent",
          transition: "background 0.3s, height 0.3s, min-height 0.3s",
          overflow: "hidden",
          willChange: "height, background",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {/* Left line */}
          <div
            ref={lineLeftRef}
            style={{
              height: 1,
              width: 56,
              flexShrink: 0,
              background: "rgba(255,255,255,0.7)",
              transformOrigin: "left center",
            }}
          />

          {/* Marquee track */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div ref={contentRef}>
              <div
                style={{
                  display: "flex",
                  width: "max-content",
                  animation: "pm-marquee 30s linear infinite",
                  color: isStuck ? "#ffffff" : "rgba(255,255,255,0.9)",
                  fontSize: isStuck ? 13 : "clamp(16px, 1.8vw, 26px)",
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "0.04em",
                  fontWeight: 400,
                  transition: "color 0.3s, font-size 0.3s",
                  userSelect: "none",
                }}
              >
                {Array.from({ length: COPIES }, (_, i) => <TrackSegment key={i} />)}
                {Array.from({ length: COPIES }, (_, i) => <TrackSegment key={`b${i}`} />)}
              </div>
            </div>
          </div>

          {/* Right line */}
          <div
            ref={lineRightRef}
            style={{
              height: 1,
              width: 56,
              flexShrink: 0,
              background: "rgba(255,255,255,0.7)",
              transformOrigin: "left center",
            }}
          />
        </div>
      </section>
    </>
  );
}
