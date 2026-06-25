"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import VariableProximity from "@/components/ui/VariableProximity";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── Data ────────────────────────────────────────────────────────────────────

const SKILLS_TITLE = [...'SKILLS & STACK'];
const EXP_TITLE    = [...'EXPERIENCE'];

const SKILLS = [
  "Next.js", "TypeScript", "React",
  "TanStack Query", "Tailwind CSS",
  "GSAP", "Framer Motion", "Supabase",
];

const EXPERIENCES = [
  { year: "2025.09 – 2026.02", title: "Codeit",                 role: "Frontend Engineering Bootcamp",  type: "education" },
  { year: "2023.01 – 2024.05", title: "Seoul Game Art Academy", role: "Game Engine & AI Programming",   type: "education" },
  { year: "2022.09 – 2022.12", title: "Carrysoft",              role: "3D Animator Intern",             type: "work" },
  { year: "2022.04 – 2022.08", title: "Seoul Metropolitan Gov.",role: "Virtual Space Creator Training", type: "education" },
  { year: "2021.10 – 2022.02", title: "Wonderful Platform",     role: "Frontend Intern",               type: "work" },
  { year: "2021.07 – 2021.08", title: "TheHigh Company",        role: "Design Intern",                 type: "work" },
];

const CONTACTS = [
  { label: "GITHUB", value: "github.com/hsyo830", href: "https://github.com/hsyo830" },
  { label: "EMAIL",  value: "이메일주소",            href: "mailto:#" },
  { label: "PHONE",  value: "전화번호",              href: "tel:#" },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const TS: React.CSSProperties = { textShadow: "0 1px 12px rgba(0,0,0,0.4)" };

const OUTLINE: React.CSSProperties = {
  fontFamily: "'KblJumpExtended', sans-serif",
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  color: "rgba(255,255,255,0.06)",
  WebkitTextStroke: "0.3px rgba(255,255,255,0.5)" as string,
  textShadow: "0 0 18px rgba(255,255,255,0.14), 0 12px 40px rgba(120,90,180,0.12)",
};

const BACKDROP: React.CSSProperties = {
  position: "absolute",
  inset: "-60px",
  background: "radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, transparent 70%)",
  filter: "blur(20px)",
  opacity: 0,
  pointerEvents: "none",
  zIndex: 0,
};

// ─── Helper ──────────────────────────────────────────────────────────────────
function SplitTitle({
  chars,
  refsArr,
  style,
}: {
  chars: string[];
  refsArr: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ ...OUTLINE, ...style }}>
      {chars.map((char, i) => (
        <span key={i} ref={el => { refsArr.current[i] = el; }}
          style={{ display: "inline-block", opacity: 0 }}>
          {char === " " ? " " : char}
        </span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function About() {
  const bd2 = useRef<HTMLDivElement>(null);
  const bd4 = useRef<HTMLDivElement>(null);

  const sub2 = useRef<HTMLDivElement>(null);
  const sub3 = useRef<HTMLDivElement>(null);
  const sub4 = useRef<HTMLDivElement>(null);

  const skillsChars = useRef<(HTMLSpanElement | null)[]>([]);
  const expChars    = useRef<(HTMLSpanElement | null)[]>([]);

  // Experience timeline
  const trackRef     = useRef<HTMLDivElement>(null);
  const expLine      = useRef<HTMLDivElement>(null);
  const expNodes     = useRef<(HTMLDivElement | null)[]>([]);
  const connectMeRef = useRef<HTMLButtonElement>(null);

  const photoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track   = trackRef.current;
    const section = sub3.current;
    if (!track || !section) return;

    // Compute scroll distance after DOM is laid out
    const totalWidth = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

    const ctx = gsap.context(() => {
      // ── Backdrop (sub2, sub4) ──
      const animBd = (el: HTMLDivElement | null, trigger: HTMLDivElement | null) => {
        if (!el || !trigger) return;
        gsap.fromTo(el, { opacity: 0 }, {
          opacity: 1, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger, start: "top 75%", toggleActions: "play none none none" },
        });
      };
      animBd(bd2.current, sub2.current);
      animBd(bd4.current, sub4.current);

      // ── Title chars ──
      const animTitle = (
        refs: React.MutableRefObject<(HTMLSpanElement | null)[]>,
        trigger: HTMLDivElement | null,
        start = "top 75%"
      ) => {
        const els = refs.current.filter(Boolean) as HTMLSpanElement[];
        if (!els.length || !trigger) return;
        gsap.fromTo(els,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          {
            y: 0, opacity: 1, filter: "blur(0px)",
            duration: 0.65, stagger: 0.025, ease: "power3.out", delay: 0.2,
            onComplete: () => gsap.set(els, { clearProps: "filter" }),
            scrollTrigger: { trigger, start, toggleActions: "play none none none" },
          }
        );
      };
      animTitle(skillsChars, sub2.current);
      animTitle(expChars,    sub3.current, "top 90%");  // fires just before pin

      // ── EXPERIENCE: pin + horizontal scroll ──
      if (totalWidth > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onEnter: () => {
              const first3 = expNodes.current.slice(0, 3).filter(Boolean) as HTMLDivElement[];
              gsap.fromTo(first3,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }
              );
            },
          },
        });

        // Track moves left
        tl.to(track, { x: -totalWidth, ease: "none", duration: 1 }, 0);

        // Line grows
        if (expLine.current) {
          tl.to(expLine.current, { width: "100%", ease: "none", duration: 1 }, 0);
        }

        // Nodes 3–5 appear as they scroll into view
        const at = [0.18, 0.50, 0.78];
        [3, 4, 5].forEach((ni, j) => {
          const node = expNodes.current[ni];
          if (node) tl.fromTo(node, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.08 }, at[j]);
        });

        // CONNECT ME appears last
        if (connectMeRef.current) {
          tl.fromTo(connectMeRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.06 }, 0.92);
        }
      }

      // ── Contact ──
      if (photoRef.current) {
        gsap.fromTo(photoRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2,
            scrollTrigger: { trigger: sub4.current, start: "top 75%", toggleActions: "play none none none" } }
        );
      }
      if (linksRef.current) {
        gsap.fromTo(linksRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.35,
            scrollTrigger: { trigger: sub4.current, start: "top 75%", toggleActions: "play none none none" } }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    if (!sub4.current) return;
    gsap.to(window, { scrollTo: { y: sub4.current }, duration: 1.2, ease: "power2.inOut" });
  };

  return (
    <section style={{ position: "relative", width: "100%", background: "#2a2a2e", paddingBottom: "80px" }}>
      <style>{`
        .about-link {
          position: relative; display: inline-flex; align-items: flex-start;
          gap: 0.5rem; padding: 6px 10px; text-decoration: none;
          color: rgba(255,255,255,0.78); transition: color 0.3s ease;
        }
        .about-link:hover { color: rgba(110,90,255,0.95); }
        .about-link .cb { position: absolute; width: 9px; height: 9px; opacity: 0; transition: all 0.3s ease; }
        .about-link::before { content:""; position:absolute; top:-7px; left:-7px; width:9px; height:9px; border-top:1px solid rgba(255,255,255,0.8); border-left:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .about-link::after  { content:""; position:absolute; top:-7px; right:-7px; width:9px; height:9px; border-top:1px solid rgba(255,255,255,0.8); border-right:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .about-link .cb-l { bottom:-7px; left:-7px; border-bottom:1px solid rgba(255,255,255,0.8); border-left:1px solid rgba(255,255,255,0.8); }
        .about-link .cb-r { bottom:-7px; right:-7px; border-bottom:1px solid rgba(255,255,255,0.8); border-right:1px solid rgba(255,255,255,0.8); }
        .about-link:hover::before { top:-1px; left:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .about-link:hover::after  { top:-1px; right:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .about-link:hover .cb-l { bottom:-1px; left:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .about-link:hover .cb-r { bottom:-1px; right:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .connect-me-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.28);
          color: rgba(255,255,255,0.82);
          padding: 14px 28px;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.3s, color 0.3s, background 0.3s;
          white-space: nowrap;
          align-self: center;
          flex-shrink: 0;
          margin-left: 40px;
        }
        .connect-me-btn:hover {
          border-color: rgba(160,100,255,0.9);
          color: rgba(180,130,255,0.95);
          background: rgba(140,80,220,0.12);
        }
      `}</style>

      {/* ──────────── 1. SKILLS ──────────── */}
      <div ref={sub2} style={{ position: "relative", minHeight: "80vh", display: "flex",
        flexDirection: "column", justifyContent: "center", padding: "10vh 8vw 10vh 52vw" }}>
        <div ref={bd2} style={BACKDROP} />
        <SplitTitle chars={SKILLS_TITLE} refsArr={skillsChars}
          style={{ fontSize: "clamp(24px, 3.2vw, 52px)", marginBottom: "2.5rem", position: "relative", zIndex: 1 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", position: "relative", zIndex: 1 }}>
          {SKILLS.map(skill => (
            <VariableProximity key={skill} text={skill} splitBy="char" minWeight={300} maxWeight={700}
              style={{ fontSize: "clamp(11px, 1vw, 15px)", color: "rgba(255,255,255,0.78)",
                letterSpacing: "0.1em", padding: "6px 14px",
                border: "1px solid rgba(255,255,255,0.22)", borderRadius: "3px", ...TS }} />
          ))}
        </div>
      </div>

      {/* ──────────── 3. EXPERIENCE ──────────── */}
      <div
        ref={sub3}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          zIndex: 10,
          background: "#2a2a2e",
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* Title (핀 중에도 고정 노출) */}
        <div style={{ padding: "8vh 10vw 0", flexShrink: 0, position: "relative", zIndex: 3 }}>
          <SplitTitle chars={EXP_TITLE} refsArr={expChars}
            style={{ fontSize: "clamp(24px, 3.2vw, 52px)" }} />
        </div>

        {/* 트랙 영역 — 수직 중앙 정렬, overflow hidden으로 양쪽 클리핑 */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden", position: "relative", zIndex: 3 }}>
          <div
            ref={trackRef}
            style={{ width: "max-content", padding: "0 10vw", willChange: "transform" }}
          >
            {/* 수평 라인 트랙 */}
            <div style={{ position: "relative", height: 2,
              background: "rgba(255,255,255,0.08)", marginBottom: 28, width: "100%" }}>
              <div ref={expLine} style={{
                position: "absolute", top: 0, left: 0, height: "100%", width: "0%",
                background: "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(160,100,255,0.7) 100%)",
              }} />
            </div>

            {/* 노드 행 */}
            <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
              {EXPERIENCES.map((exp, i) => {
                const isWork = exp.type === "work";
                return (
                  <div
                    key={i}
                    ref={el => { expNodes.current[i] = el; }}
                    style={{
                      opacity: 0,
                      minWidth: "33vw",
                      clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                      background: isWork ? "rgba(140,80,220,0.82)" : "rgba(255,255,255,0.06)",
                      filter: isWork ? "none" : "drop-shadow(0 0 1px rgba(255,255,255,0.25))",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      padding: "20px 40px 20px 24px",
                    }}
                  >
                    <p style={{ fontSize: 10, letterSpacing: "0.24em", whiteSpace: "nowrap",
                      color: isWork ? "rgba(255,255,255,0.5)" : "rgba(160,110,255,0.85)",
                      margin: "0 0 8px", fontFamily: "'KblJumpExtended', sans-serif" }}>
                      {exp.year}
                    </p>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.94)", whiteSpace: "nowrap",
                      margin: "0 0 6px", fontWeight: 700, letterSpacing: "0.03em", ...TS }}>
                      {exp.title}
                    </p>
                    <p style={{ fontSize: 11, whiteSpace: "nowrap", margin: 0, letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: isWork ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)" }}>
                      {exp.role}
                    </p>
                  </div>
                );
              })}

              {/* CONNECT ME ↓ */}
              <button
                ref={connectMeRef}
                className="connect-me-btn"
                style={{ opacity: 0 }}
                onClick={scrollToContact}
              >
                CONNECT ME ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── 4. CONTACT ──────────── */}
      <div ref={sub4} style={{ position: "relative", minHeight: "100vh", background: "#2a2a2e", display: "flex",
        alignItems: "center", justifyContent: "center", gap: "8vw", padding: "10vh 8vw" }}>
        <div ref={bd4} style={BACKDROP} />
        <div ref={photoRef} style={{ opacity: 0, position: "relative", zIndex: 1, flexShrink: 0 }}>
          <ProfileAvatar />
        </div>
        <div ref={linksRef}
          style={{ display: "flex", flexDirection: "column", gap: "2.5rem", opacity: 0, position: "relative", zIndex: 1 }}>
          {CONTACTS.map(({ label, value, href }) => (
            <a key={label} href={href} className="about-link" onClick={e => e.preventDefault()}>
              <span className="cb cb-l" /><span className="cb cb-r" />
              <div>
                <span style={{ display: "block", fontSize: 10, letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.3)", marginBottom: 5, textTransform: "uppercase" }}>
                  {label}
                </span>
                <span style={{ fontSize: "clamp(13px, 1vw, 16px)", letterSpacing: "0.12em", ...TS }}>
                  {value} ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
