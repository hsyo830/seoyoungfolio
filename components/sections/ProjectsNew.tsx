"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_H = 48;
const BOX_INSET = 20;

// ── Data ──────────────────────────────────────────────────────────────────────
interface Project {
  index: string;
  title: string;
  subtitle: string;
  type: string;
  stack: string[];
  github: string;
  demo: string;
  live: string;
  video: string;
}

const projects: Project[] = [
  {
    index: "001", title: "직관GO",
    subtitle: "KBO BASEBALL GAME INFORMATION SERVICE. SOLO PROJECT.",
    type: "SOLO PROJECT  //  2024",
    stack: ["Next.js", "TypeScript", "TanStack Query", "Tailwind CSS", "Supabase"],
    github: "https://github.com/hsyo830/jikgwango", demo: "", live: "https://jikgwango.vercel.app",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "002", title: "Global Nomad",
    subtitle: "ACTIVITY RESERVATION PLATFORM. TEAM PROJECT OF 6.",
    type: "TEAM PROJECT OF 6  //  2024",
    stack: ["Next.js", "TypeScript", "React Query", "Tailwind CSS", "Axios"],
    github: "https://github.com/GlobalNomad-20/GlobalNomad", demo: "", live: "",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "003", title: "The Julge",
    subtitle: "JOB LISTING PLATFORM FOR PART-TIME WORKERS. TEAM PROJECT OF 5.",
    type: "TEAM PROJECT OF 5  //  2024",
    stack: ["Next.js", "TypeScript", "React Hook Form", "Tailwind CSS"],
    github: "https://github.com/albaform-team/albaform", demo: "", live: "",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "004", title: "Rolling",
    subtitle: "MESSAGE CARD SHARING SERVICE. TEAM PROJECT OF 6.",
    type: "TEAM PROJECT OF 6  //  2023",
    stack: ["React", "JavaScript", "Styled Components", "Axios"],
    github: "https://github.com/Jieunsse/codeit-rolling", demo: "", live: "",
    video: "/videos/jikgwango.mp4",
  },
];

// ── Background SVG Grid ───────────────────────────────────────────────────────
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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <line ref={hLine1Ref as React.RefObject<SVGLineElement>}
        x1="0" y1="5" x2="100" y2="5"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.15"
        style={{ transformOrigin: "0 5%", transform: "scaleX(0)" }} />
      <line ref={hLine2Ref as React.RefObject<SVGLineElement>}
        x1="0" y1="37" x2="100" y2="37"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.15"
        style={{ transformOrigin: "0 37%", transform: "scaleX(0)" }} />
      <line ref={vLine1Ref as React.RefObject<SVGLineElement>}
        x1="33.3" y1="37" x2="33.3" y2="100"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.15"
        style={{ transformOrigin: "33.3% 37%", transform: "scaleY(0)" }} />
      <line ref={vLine2Ref as React.RefObject<SVGLineElement>}
        x1="55.6" y1="37" x2="55.6" y2="100"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.15"
        style={{ transformOrigin: "55.6% 37%", transform: "scaleY(0)" }} />
      <line ref={hDash1Ref as React.RefObject<SVGLineElement>}
        x1="33.3" y1="58" x2="55.6" y2="58"
        stroke="rgba(255,255,255,0.1)" strokeWidth="0.12" strokeDasharray="0.8 1.2"
        style={{ transformOrigin: "33.3% 58%", transform: "scaleX(0)" }} />
      <line ref={hDash2Ref as React.RefObject<SVGLineElement>}
        x1="33.3" y1="79" x2="55.6" y2="79"
        stroke="rgba(255,255,255,0.1)" strokeWidth="0.12" strokeDasharray="0.8 1.2"
        style={{ transformOrigin: "33.3% 79%", transform: "scaleX(0)" }} />
    </svg>
  );
}

// ── Card types ────────────────────────────────────────────────────────────────
interface CardRef {
  boxTopEl:    HTMLElement | null;
  boxRightEl:  HTMLElement | null;
  boxBottomEl: HTMLElement | null;
  boxLeftEl:   HTMLElement | null;
  hDivEl:      HTMLElement | null;
  vDiv1El:     HTMLElement | null;
  vDiv2El:     HTMLElement | null;
  hLink1El:    HTMLElement | null;
  hLink2El:    HTMLElement | null;
  indexEl:     HTMLElement | null;
  titleEl:     HTMLElement | null;
  subEl:       HTMLElement | null;
  typeEl:      HTMLElement | null;
  stackLabel:  HTMLElement | null;
  tagEls:      HTMLElement[];
  link1El:     HTMLElement | null;
  link2El:     HTMLElement | null;
  link3El:     HTMLElement | null;
  videoEl:     HTMLElement | null;
}

// ── Card component ────────────────────────────────────────────────────────────
const LINE_COLOR = "rgba(255,255,255,0.18)";
const LINE_STYLE: React.CSSProperties = { background: LINE_COLOR, flexShrink: 0 };
const BOX_COLOR  = "rgba(255,255,255,0.25)";
const TEXT_HIDDEN: React.CSSProperties = { opacity: 0, willChange: "opacity, transform" };

function Card({ project, onRef }: { project: Project; onRef: (r: CardRef) => void }) {
  const boxTopRef    = useRef<HTMLDivElement>(null);
  const boxRightRef  = useRef<HTMLDivElement>(null);
  const boxBottomRef = useRef<HTMLDivElement>(null);
  const boxLeftRef   = useRef<HTMLDivElement>(null);
  const hDivRef      = useRef<HTMLDivElement>(null);
  const vDiv1Ref     = useRef<HTMLDivElement>(null);
  const vDiv2Ref     = useRef<HTMLDivElement>(null);
  const hLink1Ref    = useRef<HTMLDivElement>(null);
  const hLink2Ref    = useRef<HTMLDivElement>(null);
  const indexRef     = useRef<HTMLParagraphElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const typeRef      = useRef<HTMLParagraphElement>(null);
  const stackLblRef  = useRef<HTMLParagraphElement>(null);
  const tagsRef      = useRef<HTMLDivElement>(null);
  const link1Ref     = useRef<HTMLAnchorElement>(null);
  const link2Ref     = useRef<HTMLAnchorElement>(null);
  const link3Ref     = useRef<HTMLAnchorElement>(null);
  const videoRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onRef({
      boxTopEl:    boxTopRef.current,
      boxRightEl:  boxRightRef.current,
      boxBottomEl: boxBottomRef.current,
      boxLeftEl:   boxLeftRef.current,
      hDivEl:      hDivRef.current,
      vDiv1El:     vDiv1Ref.current,
      vDiv2El:     vDiv2Ref.current,
      hLink1El:    hLink1Ref.current,
      hLink2El:    hLink2Ref.current,
      indexEl:     indexRef.current,
      titleEl:     titleRef.current,
      subEl:       subRef.current,
      typeEl:      typeRef.current,
      stackLabel:  stackLblRef.current,
      tagEls:      tagsRef.current ? (Array.from(tagsRef.current.children) as HTMLElement[]) : [],
      link1El:     link1Ref.current,
      link2El:     link2Ref.current,
      link3El:     link3Ref.current,
      videoEl:     videoRef.current,
    });
  });

  const hasGH   = !!project.github;
  const hasDemo = !!project.demo;
  const hasLive = !!project.live;

  return (
    <div style={{
      width: "100vw", height: "100vh", flexShrink: 0,
      position: "relative",
      border: "1px dashed rgba(255,255,255,0.14)",
      boxSizing: "border-box", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Inner box border — 4 edges, drawn clockwise (absolute) ── */}
      <div ref={boxTopRef} style={{
        position: "absolute", top: MARQUEE_H + BOX_INSET,
        left: BOX_INSET, right: BOX_INSET, height: 2,
        background: BOX_COLOR,
        transformOrigin: "left center", transform: "scaleX(0)",
        pointerEvents: "none", zIndex: 5,
      }} />
      <div ref={boxRightRef} style={{
        position: "absolute", top: MARQUEE_H + BOX_INSET,
        right: BOX_INSET, bottom: BOX_INSET, width: 2,
        background: BOX_COLOR,
        transformOrigin: "top center", transform: "scaleY(0)",
        pointerEvents: "none", zIndex: 5,
      }} />
      <div ref={boxBottomRef} style={{
        position: "absolute", bottom: BOX_INSET,
        left: BOX_INSET, right: BOX_INSET, height: 2,
        background: BOX_COLOR,
        transformOrigin: "right center", transform: "scaleX(0)",
        pointerEvents: "none", zIndex: 5,
      }} />
      <div ref={boxLeftRef} style={{
        position: "absolute", top: MARQUEE_H + BOX_INSET,
        left: BOX_INSET, bottom: BOX_INSET, width: 2,
        background: BOX_COLOR,
        transformOrigin: "bottom center", transform: "scaleY(0)",
        pointerEvents: "none", zIndex: 5,
      }} />

      {/* ── Sticky placeholder ── */}
      <div style={{ flexShrink: 0, height: MARQUEE_H }} />

      {/* ── Content area: everything below sticky bar ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* Title zone — 45% of content area */}
        <div style={{
          flex: "0 0 45%", minHeight: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 5vw",
          position: "relative", zIndex: 2,
        }}>
          <p ref={indexRef} style={{
            ...TEXT_HIDDEN,
            fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase", marginBottom: "0.6em",
          }}>PROJECT // {project.index}</p>

          <h2 ref={titleRef} style={{
            ...TEXT_HIDDEN,
            fontFamily: "'KblJumpExtended', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em",
            color: "#ffffff", margin: 0, marginBottom: "0.4em",
          }}>{project.title}</h2>

          <p ref={subRef} style={{
            ...TEXT_HIDDEN,
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(10px, 1vw, 13px)", fontWeight: 400,
            letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase", margin: 0,
          }}>{project.subtitle}</p>
        </div>

        {/* H divider: title ↔ bottom */}
        <div ref={hDivRef} style={{
          ...LINE_STYLE,
          flexShrink: 0, height: 1,
          transformOrigin: "left center", transform: "scaleX(0)",
          position: "relative", zIndex: 2,
        }} />

        {/* Bottom zone: 3 columns — flex-1, takes remaining space */}
        <div style={{ flex: 1, display: "flex", position: "relative", zIndex: 2, minHeight: 0 }}>

          {/* Stack col — 33.3% */}
          <div style={{
            flex: "0 0 33.3%", minWidth: 0, overflow: "hidden",
            padding: "1.8rem 2.5vw",
            display: "flex", flexDirection: "column", gap: "0.45rem",
          }}>
            <p ref={stackLblRef} style={{
              ...TEXT_HIDDEN,
              fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", margin: 0, marginBottom: "0.8rem",
            }}>STACK //</p>
            <div ref={tagsRef} style={{ display: "flex", flexDirection: "column", gap: "0.45rem", alignItems: "flex-start" }}>
              {project.stack.map((tech) => (
                <span key={tech} style={{
                  ...TEXT_HIDDEN,
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "4px 12px",
                  fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.06em", color: "rgba(255,255,255,0.75)",
                }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* V divider 1 */}
          <div ref={vDiv1Ref} style={{
            ...LINE_STYLE, flexShrink: 0, width: 1,
            transformOrigin: "top center", transform: "scaleY(0)",
          }} />

          {/* Links col — 22.2% */}
          <div style={{ flex: "0 0 22.2%", minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <a ref={link1Ref} href={hasGH ? project.github : undefined}
                target="_blank" rel="noopener noreferrer"
                className="pn-link-row"
                style={{
                  ...TEXT_HIDDEN, flex: 1, minHeight: 0,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0 1.5vw",
                  fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
                  color: hasGH ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
                  cursor: hasGH ? "pointer" : "default",
                }}>
                <span>GITHUB</span>{hasGH && <span style={{ fontSize: 14 }}>↗</span>}
              </a>

              <div ref={hLink1Ref} style={{
                ...LINE_STYLE, flexShrink: 0, height: 1,
                transformOrigin: "left center", transform: "scaleX(0)",
              }} />

              <a ref={link2Ref} href={hasDemo ? project.demo : undefined}
                target="_blank" rel="noopener noreferrer"
                className="pn-link-row"
                style={{
                  ...TEXT_HIDDEN, flex: 1, minHeight: 0,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0 1.5vw",
                  fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
                  color: hasDemo ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
                  cursor: hasDemo ? "pointer" : "default",
                }}>
                <span>DEMO VIDEO</span>{hasDemo && <span style={{ fontSize: 14 }}>↗</span>}
              </a>

              <div ref={hLink2Ref} style={{
                ...LINE_STYLE, flexShrink: 0, height: 1,
                transformOrigin: "left center", transform: "scaleX(0)",
              }} />

              <a ref={link3Ref} href={hasLive ? project.live : undefined}
                target="_blank" rel="noopener noreferrer"
                className="pn-link-row"
                style={{
                  ...TEXT_HIDDEN, flex: 1, minHeight: 0,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0 1.5vw",
                  fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
                  color: hasLive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
                  cursor: hasLive ? "pointer" : "default",
                }}>
                <span>LIVE SITE</span>{hasLive && <span style={{ fontSize: 14 }}>↗</span>}
              </a>
            </div>
          </div>

          {/* V divider 2 */}
          <div ref={vDiv2Ref} style={{
            ...LINE_STYLE, flexShrink: 0, width: 1,
            transformOrigin: "top center", transform: "scaleY(0)",
          }} />

          {/* Video col — flex-1, takes remaining width */}
          <div ref={videoRef} style={{
            flex: 1, minWidth: 0, position: "relative", overflow: "hidden",
            ...TEXT_HIDDEN,
          }}>
            <p style={{
              position: "absolute", top: "1.2rem", left: "1.5vw", zIndex: 2,
              fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase", margin: 0,
            }}>PREVIEW //</p>
            <video src={project.video} autoPlay loop muted playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* Type row — fixed 40px, always at the very bottom */}
        <div style={{
          flexShrink: 0, height: 40,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center",
          padding: "0 5vw",
          position: "relative", zIndex: 2,
        }}>
          <p ref={typeRef} style={{
            ...TEXT_HIDDEN,
            fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase", margin: 0,
          }}>{project.type}</p>
        </div>

      </div>{/* /content area */}

      <style>{`
        .pn-link-row:hover { background: rgba(255,255,255,0.95) !important; color: #000 !important; }
        .pn-link-row:hover span { color: #000 !important; }
      `}</style>
    </div>
  );
}

// ── Animation helpers ─────────────────────────────────────────────────────────

function buildCardInTl(refs: CardRef, fast: boolean): gsap.core.Timeline {
  const {
    boxTopEl, boxRightEl, boxBottomEl, boxLeftEl,
    hDivEl, vDiv1El, vDiv2El, hLink1El, hLink2El,
    indexEl, titleEl, subEl, typeEl, stackLabel, tagEls,
    link1El, link2El, link3El, videoEl,
  } = refs;

  const d = fast ? 0.5 : 1;

  // Reset all to initial hidden state
  gsap.set(
    [boxTopEl, boxBottomEl].filter(Boolean),
    { scaleX: 0, transformOrigin: undefined }
  );
  gsap.set(
    [boxRightEl, boxLeftEl, vDiv1El, vDiv2El].filter(Boolean),
    { scaleY: 0 }
  );
  gsap.set(
    [hDivEl, hLink1El, hLink2El].filter(Boolean),
    { scaleX: 0 }
  );
  gsap.set(
    [indexEl, titleEl, subEl, typeEl, stackLabel, ...tagEls, link1El, link2El, link3El, videoEl].filter(Boolean),
    { opacity: 0, x: 0, y: 0 }
  );

  const tl = gsap.timeline();

  // ── Phase 1: draw lines ───────────────────────────────────────────────────
  tl.addLabel("phase1")
    // Inner box: clockwise
    .to(boxTopEl,    { scaleX: 1, duration: 0.14 * d, ease: "none" })
    .to(boxRightEl,  { scaleY: 1, duration: 0.11 * d, ease: "none" })
    .to(boxBottomEl, { scaleX: 1, duration: 0.14 * d, ease: "none" })
    .to(boxLeftEl,   { scaleY: 1, duration: 0.11 * d, ease: "none" })
    // Internal dividers (overlapping with tail of box)
    .to(hDivEl,          { scaleX: 1, duration: 0.3 * d, ease: "power2.out" }, `phase1+=${0.38 * d}`)
    .to([vDiv1El, vDiv2El], { scaleY: 1, duration: 0.25 * d, stagger: 0.1 * d, ease: "power2.out" }, `phase1+=${0.5 * d}`)
    .to([hLink1El, hLink2El], { scaleX: 1, duration: 0.2 * d, stagger: 0.08 * d, ease: "power2.out" }, `phase1+=${0.6 * d}`)
    .addLabel("phase2"); // ~0.88s * d

  // ── Phase 2: text ─────────────────────────────────────────────────────────
  if (indexEl)    tl.fromTo(indexEl,    { y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, "phase2");
  if (titleEl)    tl.fromTo(titleEl,    { y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "phase2+=0.08");
  if (subEl)      tl.to(subEl,          { opacity: 1, duration: 0.25 }, "phase2+=0.15");
  if (stackLabel) tl.to(stackLabel,     { opacity: 1, duration: 0.25 }, "phase2+=0.15");
  if (tagEls.length) tl.fromTo(tagEls, { y: 6 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" }, "phase2+=0.2");
  const links = [link1El, link2El, link3El].filter(Boolean);
  if (links.length) tl.to(links, { opacity: 1, duration: 0.2, stagger: 0.06 }, "phase2+=0.25");
  if (videoEl)    tl.to(videoEl,        { opacity: 1, duration: 0.4 }, "phase2+=0.3");
  if (typeEl)     tl.to(typeEl,         { opacity: 0.6, duration: 0.3 }, "phase2+=0.5");

  return tl;
}

// ── Main component ────────────────────────────────────────────────────────────
const ENTRY_DWELL = 500; // px of vertical scroll held at card 0 before horizontal starts
const EXIT_DWELL  = 400; // px held at last card after horizontal ends

export default function ProjectsNew() {
  const sectionRef     = useRef<HTMLElement>(null);
  const trackRef       = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const prevIdxRef     = useRef(-1);
  const scrollIdxRef   = useRef(-1); // dedup guard for tween onUpdate
  const cardRefsMap    = useRef<Map<number, CardRef>>(new Map());
  const activeTlRef    = useRef<gsap.core.Timeline | null>(null);
  const gridAnimDone   = useRef(false);
  const isInSection    = useRef(false);

  // Background SVG line refs
  const hLine1Ref = useRef<SVGLineElement>(null);
  const hLine2Ref = useRef<SVGLineElement>(null);
  const vLine1Ref = useRef<SVGLineElement>(null);
  const vLine2Ref = useRef<SVGLineElement>(null);
  const hDash1Ref = useRef<SVGLineElement>(null);
  const hDash2Ref = useRef<SVGLineElement>(null);

  const animateBgGrid = useCallback(() => {
    if (gridAnimDone.current) return;
    gridAnimDone.current = true;
    gsap.timeline()
      .to([hLine1Ref.current, hLine2Ref.current], { scaleX: 1, duration: 0.3, ease: "power2.out", stagger: 0.05 })
      .to([vLine1Ref.current, vLine2Ref.current], { scaleY: 1, duration: 0.3, ease: "power2.out", stagger: 0.1 }, "-=0.1")
      .to([hDash1Ref.current, hDash2Ref.current], { scaleX: 1, duration: 0.2, ease: "power2.out", stagger: 0.1 }, "-=0.05");
  }, []);

  const runCardIn = useCallback((idx: number, fast: boolean) => {
    const refs = cardRefsMap.current.get(idx);
    if (!refs) return;
    activeTlRef.current?.kill();
    activeTlRef.current = buildCardInTl(refs, fast);
  }, []);

  const runCardOut = useCallback((idx: number) => {
    const refs = cardRefsMap.current.get(idx);
    if (!refs) return;
    const { indexEl, titleEl, subEl, typeEl, stackLabel, tagEls, link1El, link2El, link3El, videoEl } = refs;
    const all = [indexEl, titleEl, subEl, typeEl, stackLabel, ...tagEls, link1El, link2El, link3El, videoEl].filter(Boolean);
    gsap.to(all, { opacity: 0, x: -20, duration: 0.22, ease: "power2.in", overwrite: true,
      onComplete: () => gsap.set(all, { x: 0 }) });
  }, []);

  // GSAP horizontal scroll with entry + exit dwell zones
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const dist        = (projects.length - 1) * window.innerWidth;
    const totalScroll = dist + ENTRY_DWELL + EXIT_DWELL;
    const ENTRY_FRAC  = ENTRY_DWELL / totalScroll;
    const EXIT_FRAC   = (totalScroll - EXIT_DWELL) / totalScroll;

    const proxy = { val: 0 };

    const ctx = gsap.context(() => {
      // Proxy tween: scrub drives proxy.val 0→1 smoothly.
      // onUpdate applies the custom nonlinear x mapping.
      const tween = gsap.to(proxy, {
        val: 1,
        ease: "none",
        paused: true,
        onUpdate() {
          if (!isInSection.current) return;
          const p = proxy.val;

          let x: number;
          let scrollFrac: number;
          if (p <= ENTRY_FRAC) {
            x = 0;
            scrollFrac = 0;
          } else if (p >= EXIT_FRAC) {
            x = -dist;
            scrollFrac = 1;
          } else {
            scrollFrac = (p - ENTRY_FRAC) / (EXIT_FRAC - ENTRY_FRAC);
            x = -scrollFrac * dist;
          }

          gsap.set(track, { x });

          const newIdx = Math.max(
            0,
            Math.min(Math.floor(scrollFrac * projects.length), projects.length - 1)
          );
          if (newIdx !== scrollIdxRef.current) {
            scrollIdxRef.current = newIdx;
            setActiveIdx(newIdx);
          }
        },
      });

      ScrollTrigger.create({
        id: "projects-main",
        trigger: section,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        onEnter() {
          isInSection.current = true;
          animateBgGrid();
          scrollIdxRef.current = 0;
          setActiveIdx(0);
        },
        onLeaveBack() {
          isInSection.current = false;
          gridAnimDone.current = false;
          gsap.set(
            [hLine1Ref.current, hLine2Ref.current, vLine1Ref.current,
             vLine2Ref.current, hDash1Ref.current, hDash2Ref.current],
            { scaleX: 0, scaleY: 0 }
          );
          scrollIdxRef.current = -1;
          setActiveIdx(-1);
        },
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [animateBgGrid]);

  // Trigger card animations on index change
  useEffect(() => {
    const prev = prevIdxRef.current;
    prevIdxRef.current = activeIdx;
    if (prev === activeIdx) return;

    if (prev >= 0) runCardOut(prev);

    if (activeIdx >= 0) {
      const isTransition = prev >= 0;
      const delay = isTransition ? 0.25 : 0;
      gsap.delayedCall(delay, () => runCardIn(activeIdx, isTransition));
    }
  }, [activeIdx, runCardIn, runCardOut]);

  const setCardRef = useCallback((idx: number) => (refs: CardRef) => {
    cardRefsMap.current.set(idx, refs);
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", overflow: "hidden" }}>
      <BgGrid
        hLine1Ref={hLine1Ref} hLine2Ref={hLine2Ref}
        vLine1Ref={vLine1Ref} vLine2Ref={vLine2Ref}
        hDash1Ref={hDash1Ref} hDash2Ref={hDash2Ref}
      />

      <div ref={trackRef} style={{
        display: "flex",
        width: `${projects.length * 100}vw`,
        willChange: "transform",
        position: "relative", zIndex: 2,
      }}>
        {projects.map((p, i) => (
          <Card key={p.index} project={p} onRef={setCardRef(i)} />
        ))}
      </div>
    </section>
  );
}
