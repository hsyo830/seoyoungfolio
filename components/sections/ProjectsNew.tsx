"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_H = 48; // sticky bar height px

interface Project {
  index: string;
  title: string;
  subtitle: string;
  stack: string[];
  github: string;
  demo: string;
  live: string;
  video: string;
}

const projects: Project[] = [
  {
    index: "001",
    title: "직관GO",
    subtitle: "KBO BASEBALL GAME INFORMATION SERVICE. SOLO PROJECT.",
    stack: ["Next.js", "TypeScript", "TanStack Query", "Tailwind CSS", "Supabase"],
    github: "https://github.com/hsyo830/jikgwango",
    demo: "",
    live: "https://jikgwango.vercel.app",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "002",
    title: "Global Nomad",
    subtitle: "ACTIVITY RESERVATION PLATFORM. TEAM PROJECT OF 6.",
    stack: ["Next.js", "TypeScript", "React Query", "Tailwind CSS", "Axios"],
    github: "https://github.com/GlobalNomad-20/GlobalNomad",
    demo: "",
    live: "",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "003",
    title: "The Julge",
    subtitle: "JOB LISTING PLATFORM FOR PART-TIME WORKERS. TEAM PROJECT OF 5.",
    stack: ["Next.js", "TypeScript", "React Hook Form", "Tailwind CSS"],
    github: "https://github.com/albaform-team/albaform",
    demo: "",
    live: "",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "004",
    title: "Rolling",
    subtitle: "MESSAGE CARD SHARING SERVICE. TEAM PROJECT OF 6.",
    stack: ["React", "JavaScript", "Styled Components", "Axios"],
    github: "https://github.com/Jieunsse/codeit-rolling",
    demo: "",
    live: "",
    video: "/videos/jikgwango.mp4",
  },
];

// ── SVG Grid ──────────────────────────────────────────────────────────────────
// Percentages: sticky bar ≈ 5%, title zone bottom ≈ 37%
// Bottom zone vertical splits: 33.3% (stack), 55.6% (links|video)
// Yellow inner h-lines: 58%, 79%
interface GridProps {
  hLine1Ref: React.RefObject<SVGLineElement | null>;
  hLine2Ref: React.RefObject<SVGLineElement | null>;
  vLine1Ref: React.RefObject<SVGLineElement | null>;
  vLine2Ref: React.RefObject<SVGLineElement | null>;
  hDash1Ref: React.RefObject<SVGLineElement | null>;
  hDash2Ref: React.RefObject<SVGLineElement | null>;
}

function BgGrid({ hLine1Ref, hLine2Ref, vLine1Ref, vLine2Ref, hDash1Ref, hDash2Ref }: GridProps) {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* H solid 1: below sticky bar */}
      <line
        ref={hLine1Ref as React.RefObject<SVGLineElement>}
        x1="0" y1="5" x2="100" y2="5"
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.15"
        style={{ transformOrigin: "0 5%", transform: "scaleX(0)" }}
      />
      {/* H solid 2: title / bottom separator */}
      <line
        ref={hLine2Ref as React.RefObject<SVGLineElement>}
        x1="0" y1="37" x2="100" y2="37"
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.15"
        style={{ transformOrigin: "0 37%", transform: "scaleX(0)" }}
      />
      {/* V solid 1: stack | links */}
      <line
        ref={vLine1Ref as React.RefObject<SVGLineElement>}
        x1="33.3" y1="37" x2="33.3" y2="100"
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.15"
        style={{ transformOrigin: "33.3% 37%", transform: "scaleY(0)" }}
      />
      {/* V solid 2: links | video */}
      <line
        ref={vLine2Ref as React.RefObject<SVGLineElement>}
        x1="55.6" y1="37" x2="55.6" y2="100"
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.15"
        style={{ transformOrigin: "55.6% 37%", transform: "scaleY(0)" }}
      />
      {/* H dashed 1 (links inner) */}
      <line
        ref={hDash1Ref as React.RefObject<SVGLineElement>}
        x1="33.3" y1="58" x2="55.6" y2="58"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.12"
        strokeDasharray="0.8 1.2"
        style={{ transformOrigin: "33.3% 58%", transform: "scaleX(0)" }}
      />
      {/* H dashed 2 (links inner) */}
      <line
        ref={hDash2Ref as React.RefObject<SVGLineElement>}
        x1="33.3" y1="79" x2="55.6" y2="79"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.12"
        strokeDasharray="0.8 1.2"
        style={{ transformOrigin: "33.3% 79%", transform: "scaleX(0)" }}
      />
    </svg>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardRef {
  indexEl:   HTMLElement | null;
  titleEl:   HTMLElement | null;
  subEl:     HTMLElement | null;
  stackEls:  Element[];
  linkEls:   Element[];
  videoEl:   HTMLElement | null;
}

interface CardProps {
  project: Project;
  cardRef: (refs: CardRef) => void;
}

function Card({ project, cardRef }: CardProps) {
  const indexRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef({
      indexEl:  indexRef.current,
      titleEl:  titleRef.current,
      subEl:    subRef.current,
      stackEls: stackRef.current ? Array.from(stackRef.current.children) : [],
      linkEls:  linksRef.current ? Array.from(linksRef.current.children) : [],
      videoEl:  videoRef.current,
    });
  });

  const hasLive  = !!project.live;
  const hasDemo  = !!project.demo;
  const hasGH    = !!project.github;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        position: "relative",
        border: "1px dashed rgba(255,255,255,0.18)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Sticky bar placeholder */}
      <div style={{ height: MARQUEE_H }} />

      {/* Title zone — 1/3 of remaining height */}
      <div
        style={{
          height: `calc((100vh - ${MARQUEE_H}px) / 3)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 5vw",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <p
          ref={indexRef}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            marginBottom: "0.6em",
            opacity: 0,
          }}
        >
          PROJECT // {project.index}
        </p>
        <h2
          ref={titleRef}
          style={{
            fontFamily: "'KblJumpExtended', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: 0,
            marginBottom: "0.4em",
            opacity: 0,
          }}
        >
          {project.title}
        </h2>
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(10px, 1vw, 13px)",
            fontWeight: 400,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            margin: 0,
            opacity: 0,
          }}
        >
          {project.subtitle}
        </p>
      </div>

      {/* Bottom zone — 2/3 remaining, 3 columns */}
      <div
        style={{
          height: `calc((100vh - ${MARQUEE_H}px) * 2 / 3)`,
          display: "flex",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Stack column 3/9 */}
        <div
          ref={stackRef}
          style={{
            flex: "0 0 33.3%",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            padding: "2rem 2.5vw",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            marginBottom: "1rem",
            opacity: 0,
          }}>
            STACK //
          </p>
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "4px 12px",
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.75)",
                opacity: 0,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links column 2/9 */}
        <div
          ref={linksRef}
          style={{
            flex: "0 0 22.3%",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {[
            { label: "GITHUB", href: project.github, show: hasGH },
            { label: "DEMO VIDEO", href: project.demo, show: hasDemo },
            { label: "LIVE SITE", href: project.live, show: hasLive },
          ].map(({ label, href, show }) => (
            <a
              key={label}
              href={show && href ? href : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="pn-link-row"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.5vw",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: show ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
                textDecoration: "none",
                textTransform: "uppercase",
                cursor: show ? "pointer" : "default",
                opacity: 0,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <span>{label}</span>
              {show && <span style={{ fontSize: 14 }}>↗</span>}
            </a>
          ))}
        </div>

        {/* Video column 4/9 */}
        <div
          ref={videoRef}
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            opacity: 0,
          }}
        >
          <p style={{
            position: "absolute",
            top: "1.2rem",
            left: "1.5vw",
            zIndex: 2,
            fontFamily: "var(--font-inter)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            margin: 0,
          }}>
            PREVIEW //
          </p>
          <video
            src={project.video}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      <style>{`
        .pn-link-row:hover {
          background: rgba(255,255,255,0.95);
          color: #000 !important;
        }
        .pn-link-row:last-child { border-bottom: none; }
      `}</style>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProjectsNew() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const prevIdxRef  = useRef(-1);
  const cardRefsMap = useRef<Map<number, CardRef>>(new Map());
  const gridAnimDoneRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  // SVG line refs
  const hLine1Ref = useRef<SVGLineElement>(null);
  const hLine2Ref = useRef<SVGLineElement>(null);
  const vLine1Ref = useRef<SVGLineElement>(null);
  const vLine2Ref = useRef<SVGLineElement>(null);
  const hDash1Ref = useRef<SVGLineElement>(null);
  const hDash2Ref = useRef<SVGLineElement>(null);

  const animateGrid = useCallback(() => {
    if (gridAnimDoneRef.current) return;
    gridAnimDoneRef.current = true;
    const tl = gsap.timeline();
    tl.to([hLine1Ref.current, hLine2Ref.current],
        { scaleX: 1, duration: 0.3, ease: "power2.out", stagger: 0.05 })
      .to([vLine1Ref.current, vLine2Ref.current],
        { scaleY: 1, duration: 0.3, ease: "power2.out", stagger: 0.1 }, "-=0.1")
      .to([hDash1Ref.current, hDash2Ref.current],
        { scaleX: 1, duration: 0.2, ease: "power2.out", stagger: 0.1 }, "-=0.05");
  }, []);

  const animateCardIn = useCallback((idx: number) => {
    const refs = cardRefsMap.current.get(idx);
    if (!refs) return;
    const { indexEl, titleEl, subEl, stackEls, linkEls, videoEl } = refs;

    // All stack items except first (label)
    const tags = stackEls.slice(1);

    gsap.set([indexEl, titleEl, subEl, ...tags, ...linkEls, videoEl].filter(Boolean), { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.05 });
    if (indexEl) tl.to(indexEl, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    if (titleEl) tl.fromTo(titleEl, { y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
    if (subEl)   tl.to(subEl,  { opacity: 1, duration: 0.3 }, "-=0.2");
    // Stack label (first child)
    if (stackEls[0]) tl.to(stackEls[0], { opacity: 1, duration: 0.3 }, "-=0.2");
    if (tags.length) tl.fromTo(tags, { y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.1");
    if (linkEls.length) tl.to(linkEls, { opacity: 1, duration: 0.3, stagger: 0.08 }, "-=0.1");
    if (videoEl) tl.to(videoEl, { opacity: 1, duration: 0.5 }, "-=0.1");
  }, []);

  const animateCardOut = useCallback((idx: number) => {
    const refs = cardRefsMap.current.get(idx);
    if (!refs) return;
    const { indexEl, titleEl, subEl, stackEls, linkEls, videoEl } = refs;
    const all = [indexEl, titleEl, subEl, ...stackEls, ...linkEls, videoEl].filter(Boolean);
    gsap.to(all, { opacity: 0, x: -20, duration: 0.25, ease: "power2.in",
      onComplete: () => gsap.set(all, { x: 0 }) });
  }, []);

  // GSAP horizontal scroll
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const dist = (projects.length - 1) * window.innerWidth;

    const ctx = gsap.context(() => {
      const anim = gsap.to(track, {
        x: -dist,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          start: "top top",
          end: `+=${dist}`,
          invalidateOnRefresh: true,
          onEnter: () => {
            animateGrid();
            setActiveIdx(0);
          },
          onLeaveBack: () => {
            gridAnimDoneRef.current = false;
            gsap.set([hLine1Ref.current, hLine2Ref.current, vLine1Ref.current, vLine2Ref.current, hDash1Ref.current, hDash2Ref.current],
              { scaleX: 0, scaleY: 0 });
            setActiveIdx(-1);
          },
          onUpdate(self) {
            const idx = Math.min(Math.floor(self.progress * projects.length), projects.length - 1);
            setActiveIdx(idx);
          },
        },
      });
      stRef.current = anim.scrollTrigger ?? null;
    });

    return () => {
      stRef.current?.kill();
      ctx.revert();
    };
  }, [animateGrid]);

  // Card animations on activeIdx change
  useEffect(() => {
    const prev = prevIdxRef.current;
    prevIdxRef.current = activeIdx;
    if (prev === activeIdx) return;
    if (prev >= 0) animateCardOut(prev);
    if (activeIdx >= 0) {
      const delay = prev >= 0 ? 0.3 : 0;
      gsap.delayedCall(delay, () => animateCardIn(activeIdx));
    }
  }, [activeIdx, animateCardIn, animateCardOut]);

  const setCardRef = useCallback((idx: number) => (refs: CardRef) => {
    cardRefsMap.current.set(idx, refs);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Background grid SVG */}
      <BgGrid
        hLine1Ref={hLine1Ref}
        hLine2Ref={hLine2Ref}
        vLine1Ref={vLine1Ref}
        vLine2Ref={vLine2Ref}
        hDash1Ref={hDash1Ref}
        hDash2Ref={hDash2Ref}
      />

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: `${projects.length * 100}vw`,
          willChange: "transform",
          position: "relative",
          zIndex: 2,
        }}
      >
        {projects.map((p, i) => (
          <Card key={p.index} project={p} cardRef={setCardRef(i)} />
        ))}
      </div>
    </section>
  );
}
