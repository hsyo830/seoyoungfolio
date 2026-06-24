"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VariableProximity from "@/components/ui/VariableProximity";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const ABOUT_TITLE  = [...'FROM PIXELS TO PURPOSE'];
const SKILLS_TITLE = [...'SKILLS & STACK'];
const EXP_TITLE    = [...'EXPERIENCE'];

const ABOUT_TEXT = "3D animation과 디자인 백그라운드에서 출발해 프론트엔드 개발자로 전환. 성능과 미감 둘 다 타협하지 않는 개발을 추구합니다.";

const SKILLS = [
  "Next.js", "TypeScript", "React",
  "TanStack Query", "Tailwind CSS",
  "GSAP", "Framer Motion", "Supabase",
];

const EXPERIENCES = [
  { year: "2025.09 – 2026.02", title: "Codeit",                   role: "Frontend Engineering Bootcamp",    type: "education" },
  { year: "2023.01 – 2024.05", title: "Seoul Game Art Academy",    role: "Game Engine & AI Programming",     type: "education" },
  { year: "2022.09 – 2022.12", title: "Carrysoft",                 role: "3D Animator Intern",               type: "work" },
  { year: "2022.04 – 2022.08", title: "Seoul Metropolitan Gov.",   role: "Virtual Space Creator Training",   type: "education" },
  { year: "2021.10 – 2022.02", title: "Wonderful Platform",        role: "Frontend Intern",                  type: "work" },
  { year: "2021.07 – 2021.08", title: "TheHigh Company",           role: "Design Intern",                    type: "work" },
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
        <span
          key={i}
          ref={el => { refsArr.current[i] = el; }}
          style={{ display: "inline-block", opacity: 0 }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function About() {
  // Backdrop
  const bd1 = useRef<HTMLDivElement>(null);
  const bd2 = useRef<HTMLDivElement>(null);
  const bd3 = useRef<HTMLDivElement>(null);
  const bd4 = useRef<HTMLDivElement>(null);

  // Sections
  const sub1 = useRef<HTMLDivElement>(null);
  const sub2 = useRef<HTMLDivElement>(null);
  const sub3 = useRef<HTMLDivElement>(null);
  const sub4 = useRef<HTMLDivElement>(null);

  // Title chars
  const aboutChars  = useRef<(HTMLSpanElement | null)[]>([]);
  const skillsChars = useRef<(HTMLSpanElement | null)[]>([]);
  const expChars    = useRef<(HTMLSpanElement | null)[]>([]);

  // Timeline (horizontal scroll)
  const expScrollWrapper = useRef<HTMLDivElement>(null);
  const expLine          = useRef<HTMLDivElement>(null);
  const expNodes         = useRef<(HTMLDivElement | null)[]>([]);
  const connectMeRef     = useRef<HTMLButtonElement>(null);

  // Contact
  const photoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Backdrop ──
      const animBd = (el: HTMLDivElement | null, trigger: HTMLDivElement | null) => {
        if (!el || !trigger) return;
        gsap.fromTo(el, { opacity: 0 }, {
          opacity: 1, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger, start: "top 75%", toggleActions: "play none none none" },
        });
      };
      animBd(bd1.current, sub1.current);
      animBd(bd2.current, sub2.current);
      animBd(bd3.current, sub3.current);
      animBd(bd4.current, sub4.current);

      // ── Title chars ──
      const animTitle = (
        refs: React.MutableRefObject<(HTMLSpanElement | null)[]>,
        trigger: HTMLDivElement | null
      ) => {
        const els = refs.current.filter(Boolean) as HTMLSpanElement[];
        if (!els.length || !trigger) return;
        gsap.fromTo(els,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          {
            y: 0, opacity: 1, filter: "blur(0px)",
            duration: 0.65, stagger: 0.025, ease: "power3.out", delay: 0.2,
            onComplete: () => gsap.set(els, { clearProps: "filter" }),
            scrollTrigger: { trigger, start: "top 75%", toggleActions: "play none none none" },
          }
        );
      };
      animTitle(aboutChars,  sub1.current);
      animTitle(skillsChars, sub2.current);
      animTitle(expChars,    sub3.current);

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

    // ── Horizontal scroll timeline ──
    const wrapper   = expScrollWrapper.current;
    const line      = expLine.current;
    const nodes     = expNodes.current.filter(Boolean) as HTMLDivElement[];
    const connectMe = connectMeRef.current;
    const revealed  = new Set<number>();

    const checkReveal = () => {
      if (!wrapper) return;
      const wRect    = wrapper.getBoundingClientRect();
      const sl       = wrapper.scrollLeft;
      const cw       = wrapper.clientWidth;
      const maxScroll = wrapper.scrollWidth - cw;
      const progress  = maxScroll > 0 ? sl / maxScroll : 0;

      // Line grows with scroll
      if (line) {
        gsap.to(line, { width: `${progress * 100}%`, duration: 0.12, ease: "none", overwrite: "auto" });
      }

      // Nodes appear as they enter the visible area
      nodes.forEach((node, i) => {
        if (!node || revealed.has(i)) return;
        const left = node.getBoundingClientRect().left - wRect.left;
        if (left <= cw * 0.85) {
          revealed.add(i);
          gsap.fromTo(node, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
        }
      });

      // CONNECT ME appears last
      if (connectMe && !revealed.has(999)) {
        const left = connectMe.getBoundingClientRect().left - wRect.left;
        if (left <= cw * 0.92) {
          revealed.add(999);
          gsap.fromTo(connectMe, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
        }
      }
    };

    // Fire on section enter + on horizontal scroll
    const st = ScrollTrigger.create({
      trigger: sub3.current,
      start: "top 75%",
      onEnter: checkReveal,
    });

    wrapper?.addEventListener("scroll", checkReveal, { passive: true });

    return () => {
      ctx.revert();
      st.kill();
      wrapper?.removeEventListener("scroll", checkReveal);
    };
  }, []);

  return (
    <section style={{ position: "relative", width: "100%" }}>
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
        .exp-scroll::-webkit-scrollbar { display: none; }
        .exp-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .connect-me-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.22);
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
          margin-left: 32px;
        }
        .connect-me-btn:hover {
          border-color: rgba(140,80,220,0.8);
          color: rgba(160,100,255,0.95);
          background: rgba(140,80,220,0.1);
        }
      `}</style>

      {/* ──────────── 1. ABOUT ──────────── */}
      <div
        ref={sub1}
        style={{ position: "relative", minHeight: "100vh", display: "flex",
          flexDirection: "column", justifyContent: "center", padding: "12vh 55vw 12vh 8vw" }}
      >
        <div ref={bd1} style={BACKDROP} />
        <SplitTitle chars={ABOUT_TITLE} refsArr={aboutChars}
          style={{ fontSize: "clamp(28px, 3.8vw, 60px)", marginBottom: "2.5rem", position: "relative", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <VariableProximity text={ABOUT_TEXT} splitBy="word"
            style={{ fontSize: "clamp(15px, 1.35vw, 20px)", lineHeight: 1.8,
              color: "rgba(255,255,255,0.72)", fontWeight: 300, letterSpacing: "0.02em", ...TS }} />
        </div>
      </div>

      {/* ──────────── 2. SKILLS ──────────── */}
      <div
        ref={sub2}
        style={{ position: "relative", minHeight: "80vh", display: "flex",
          flexDirection: "column", justifyContent: "center", padding: "10vh 8vw 10vh 52vw" }}
      >
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
        style={{ position: "relative", paddingTop: "10vh", paddingBottom: "10vh" }}
      >
        <div ref={bd3} style={BACKDROP} />

        <SplitTitle chars={EXP_TITLE} refsArr={expChars}
          style={{ fontSize: "clamp(24px, 3.2vw, 52px)", marginBottom: "3.5rem",
            position: "relative", zIndex: 1, padding: "0 10vw" }} />

        {/* ── Horizontal scroll strip ── */}
        <div
          ref={expScrollWrapper}
          className="exp-scroll"
          style={{ overflowX: "auto", overflowY: "hidden", position: "relative", zIndex: 1,
            padding: "0 10vw 48px" }}
        >
          <div style={{ position: "relative", width: "max-content" }}>

            {/* Line track */}
            <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.07)", marginBottom: "28px", width: "100%" }}>
              <div ref={expLine} style={{
                position: "absolute", top: 0, left: 0, height: "100%", width: "0%",
                background: "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(160,100,255,0.6) 100%)",
              }} />
            </div>

            {/* Nodes row + CONNECT ME */}
            <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
              {EXPERIENCES.map((exp, i) => {
                const isWork = exp.type === "work";
                return (
                  <div
                    key={i}
                    ref={el => { expNodes.current[i] = el; }}
                    style={{
                      opacity: 0,
                      minWidth: 210,
                      clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                      background: isWork ? "rgba(140,80,220,0.82)" : "rgba(255,255,255,0.06)",
                      filter: isWork ? "none" : "drop-shadow(0 0 1px rgba(255,255,255,0.28))",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      padding: "18px 38px 18px 20px",
                    }}
                  >
                    <p style={{ fontSize: 10, letterSpacing: "0.24em", whiteSpace: "nowrap",
                      color: isWork ? "rgba(255,255,255,0.55)" : "rgba(160,110,255,0.85)",
                      margin: "0 0 7px", fontFamily: "'KblJumpExtended', sans-serif" }}>
                      {exp.year}
                    </p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.95)", whiteSpace: "nowrap",
                      margin: "0 0 5px", fontWeight: 600, letterSpacing: "0.03em", ...TS }}>
                      {exp.title}
                    </p>
                    <p style={{ fontSize: 11, whiteSpace: "nowrap", margin: 0, letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: isWork ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.38)" }}>
                      {exp.role}
                    </p>
                  </div>
                );
              })}

              {/* CONNECT ME → scroll to CONTACT */}
              <button
                ref={connectMeRef}
                className="connect-me-btn"
                style={{ opacity: 0 }}
                onClick={() => sub4.current?.scrollIntoView({ behavior: "smooth" })}
              >
                CONNECT ME ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── 4. CONTACT ──────────── */}
      <div
        ref={sub4}
        style={{ position: "relative", minHeight: "80vh", display: "flex",
          alignItems: "center", justifyContent: "center", gap: "8vw", padding: "10vh 8vw" }}
      >
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
