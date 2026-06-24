"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VariableProximity from "@/components/ui/VariableProximity";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const ABOUT_TITLE = [...'FROM PIXELS TO PURPOSE'];
const SKILLS_TITLE = [...'SKILLS & STACK'];
const EXP_TITLE = [...'EXPERIENCE'];

const ABOUT_TEXT = "3D animation과 디자인 백그라운드에서 출발해 프론트엔드 개발자로 전환. 성능과 미감 둘 다 타협하지 않는 개발을 추구합니다.";

const SKILLS = [
  "Next.js", "TypeScript", "React",
  "TanStack Query", "Tailwind CSS",
  "GSAP", "Framer Motion", "Supabase",
];

const EXPERIENCES = [
  { year: "2026", title: "Codeit Bootcamp",  desc: "Frontend Engineering" },
  { year: "2025", title: "TheHigh Company",  desc: "Frontend Intern" },
  { year: "2024", title: "Carrysoft",        desc: "Frontend Intern" },
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

// ─── Helper: splitText title ──────────────────────────────────────────────────
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
          {char === " " ? " " : char}
        </span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function About() {
  // Backdrop refs
  const bd1 = useRef<HTMLDivElement>(null);
  const bd2 = useRef<HTMLDivElement>(null);
  const bd3 = useRef<HTMLDivElement>(null);
  const bd4 = useRef<HTMLDivElement>(null);

  // Sub-section trigger refs
  const sub1 = useRef<HTMLDivElement>(null);
  const sub2 = useRef<HTMLDivElement>(null);
  const sub3 = useRef<HTMLDivElement>(null);
  const sub4 = useRef<HTMLDivElement>(null);

  // Title char refs
  const aboutChars  = useRef<(HTMLSpanElement | null)[]>([]);
  const skillsChars = useRef<(HTMLSpanElement | null)[]>([]);
  const expChars    = useRef<(HTMLSpanElement | null)[]>([]);

  // Experience timeline
  const expContainer = useRef<HTMLDivElement>(null);
  const expLine      = useRef<HTMLDivElement>(null);
  const expNodes     = useRef<(HTMLDivElement | null)[]>([]);

  // Contact
  const photoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Backdrop fade-in (0s delay, text has 0.2s delay) ──
      const bd = (el: HTMLDivElement | null, trigger: HTMLDivElement | null) => {
        if (!el || !trigger) return;
        gsap.fromTo(el, { opacity: 0 }, {
          opacity: 1, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger, start: "top 75%", toggleActions: "play none none none" },
        });
      };
      bd(bd1.current, sub1.current);
      bd(bd2.current, sub2.current);
      bd(bd3.current, sub3.current);
      bd(bd4.current, sub4.current);

      // ── Title char animation ──
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

      // ── Experience line ──
      if (expLine.current && expContainer.current) {
        gsap.fromTo(expLine.current,
          { width: "0%" },
          {
            width: "100%", ease: "none",
            scrollTrigger: {
              trigger: expContainer.current,
              start: "top 65%",
              end: "bottom 65%",
              scrub: 1,
            },
          }
        );
      }

      // ── Experience nodes ──
      const nodes = expNodes.current.filter(Boolean) as HTMLDivElement[];
      if (nodes.length) {
        gsap.fromTo(nodes,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.5, stagger: 0.25, ease: "power3.out", delay: 0.1,
            scrollTrigger: { trigger: expContainer.current, start: "top 65%", toggleActions: "play none none none" },
          }
        );
      }

      // ── Contact ──
      if (photoRef.current) {
        gsap.fromTo(photoRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2,
            scrollTrigger: { trigger: sub4.current, start: "top 75%", toggleActions: "play none none none" },
          }
        );
      }
      if (linksRef.current) {
        gsap.fromTo(linksRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.35,
            scrollTrigger: { trigger: sub4.current, start: "top 75%", toggleActions: "play none none none" },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section style={{ position: "relative", width: "100%" }}>
      <style>{`
        .about-link {
          position: relative;
          display: inline-flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 6px 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.78);
          transition: color 0.3s ease;
        }
        .about-link:hover { color: rgba(110,90,255,0.95); }
        .about-link .cb,.about-link .ct { position: absolute; width: 9px; height: 9px; opacity: 0; transition: all 0.3s ease; }
        .about-link::before { content:""; position:absolute; top:-7px; left:-7px; width:9px; height:9px; border-top:1px solid rgba(255,255,255,0.8); border-left:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .about-link::after  { content:""; position:absolute; top:-7px; right:-7px; width:9px; height:9px; border-top:1px solid rgba(255,255,255,0.8); border-right:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .about-link .cb-l { bottom:-7px; left:-7px; border-bottom:1px solid rgba(255,255,255,0.8); border-left:1px solid rgba(255,255,255,0.8); }
        .about-link .cb-r { bottom:-7px; right:-7px; border-bottom:1px solid rgba(255,255,255,0.8); border-right:1px solid rgba(255,255,255,0.8); }
        .about-link:hover::before { top:-1px; left:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .about-link:hover::after  { top:-1px; right:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .about-link:hover .cb-l { bottom:-1px; left:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .about-link:hover .cb-r { bottom:-1px; right:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
      `}</style>

      {/* ──────────── 1. ABOUT ──────────── */}
      <div
        ref={sub1}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "12vh 55vw 12vh 8vw",
        }}
      >
        <div ref={bd1} style={BACKDROP} />

        <SplitTitle
          chars={ABOUT_TITLE}
          refsArr={aboutChars}
          style={{ fontSize: "clamp(28px, 3.8vw, 60px)", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <VariableProximity
            text={ABOUT_TEXT}
            splitBy="word"
            style={{
              fontSize: "clamp(15px, 1.35vw, 20px)",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.72)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              ...TS,
            }}
          />
        </div>
      </div>

      {/* ──────────── 2. SKILLS ──────────── */}
      <div
        ref={sub2}
        style={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10vh 8vw 10vh 52vw",
        }}
      >
        <div ref={bd2} style={BACKDROP} />

        <SplitTitle
          chars={SKILLS_TITLE}
          refsArr={skillsChars}
          style={{ fontSize: "clamp(24px, 3.2vw, 52px)", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", position: "relative", zIndex: 1 }}>
          {SKILLS.map(skill => (
            <VariableProximity
              key={skill}
              text={skill}
              splitBy="char"
              minWeight={300}
              maxWeight={700}
              style={{
                fontSize: "clamp(11px, 1vw, 15px)",
                color: "rgba(255,255,255,0.78)",
                letterSpacing: "0.1em",
                padding: "6px 14px",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: "3px",
                ...TS,
              }}
            />
          ))}
        </div>
      </div>

      {/* ──────────── 3. EXPERIENCE ──────────── */}
      <div
        ref={sub3}
        style={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10vh 10vw",
        }}
      >
        <div ref={bd3} style={BACKDROP} />

        <SplitTitle
          chars={EXP_TITLE}
          refsArr={expChars}
          style={{ fontSize: "clamp(24px, 3.2vw, 52px)", marginBottom: "5rem", position: "relative", zIndex: 1 }}
        />

        <div ref={expContainer} style={{ position: "relative", zIndex: 1 }}>
          {/* Track */}
          <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.07)", marginBottom: "2.5rem" }}>
            <div
              ref={expLine}
              style={{
                position: "absolute", top: 0, left: 0,
                height: "100%", width: "0%",
                background: "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(160,120,255,0.5) 100%)",
              }}
            />
          </div>

          {/* Nodes */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            {EXPERIENCES.map((exp, i) => (
              <div
                key={i}
                ref={el => { expNodes.current[i] = el; }}
                style={{
                  opacity: 0,
                  flex: 1,
                  clipPath: "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  padding: "16px 32px 16px 20px",
                }}
              >
                <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(160,120,255,0.85)", margin: "0 0 6px", fontFamily: "'KblJumpExtended', sans-serif" }}>
                  {exp.year}
                </p>
                <p style={{ fontSize: "clamp(13px, 1.05vw, 16px)", color: "rgba(255,255,255,0.9)", margin: "0 0 4px", fontWeight: 600, letterSpacing: "0.04em", ...TS }}>
                  {exp.title}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", margin: 0, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────── 4. CONTACT ──────────── */}
      <div
        ref={sub4}
        style={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8vw",
          padding: "10vh 8vw",
        }}
      >
        <div ref={bd4} style={BACKDROP} />

        {/* Photo placeholder */}
        <div
          ref={photoRef}
          style={{
            width: 220, height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            opacity: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: "0.35em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
            PHOTO
          </span>
        </div>

        {/* Links */}
        <div
          ref={linksRef}
          style={{ display: "flex", flexDirection: "column", gap: "2.5rem", opacity: 0, position: "relative", zIndex: 1 }}
        >
          {CONTACTS.map(({ label, value, href }) => (
            <a key={label} href={href} className="about-link" onClick={e => e.preventDefault()}>
              <span className="cb cb-l" /><span className="cb cb-r" />
              <div>
                <span style={{ display: "block", fontSize: 10, letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", marginBottom: 5, textTransform: "uppercase" }}>
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
