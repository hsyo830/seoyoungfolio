"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import VariableProximity from "@/components/ui/VariableProximity";
import type { DashedGridOverlayHandle } from "@/components/ui/DashedGridOverlay";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── Data ────────────────────────────────────────────────────────────────────

const SKILLS_TITLE = [..."SKILLS & STACK"];
const EXP_TITLE = [..."EXPERIENCE"];

const SKILLS = [
  "Next.js",
  "TypeScript",
  "React",
  "TanStack Query",
  "Tailwind CSS",
  "GSAP",
  "Framer Motion",
  "Supabase",
];

const EXPERIENCES = [
  {
    year: "2025.09 – 2026.02",
    title: "Codeit",
    role: "Frontend Engineering Bootcamp",
    type: "education",
  },
  {
    year: "2023.01 – 2024.05",
    title: "Seoul Game Art Academy",
    role: "Game Engine & AI Programming",
    type: "education",
  },
  {
    year: "2022.09 – 2022.12",
    title: "Carrysoft",
    role: "3D Animator Intern",
    type: "work",
  },
  {
    year: "2022.04 – 2022.08",
    title: "Seoul Metropolitan Gov.",
    role: "Virtual Space Creator Training",
    type: "education",
  },
  {
    year: "2021.10 – 2022.02",
    title: "Wonderful Platform",
    role: "Frontend Intern",
    type: "work",
  },
  {
    year: "2021.07 – 2021.08",
    title: "TheHigh Company",
    role: "Design Intern",
    type: "work",
  },
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
  textShadow:
    "0 0 18px rgba(255,255,255,0.14), 0 12px 40px rgba(120,90,180,0.12)",
};

const BACKDROP: React.CSSProperties = {
  position: "absolute",
  inset: "-60px",
  background:
    "radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, transparent 70%)",
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
  refsArr: React.RefObject<(HTMLSpanElement | null)[]>;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ ...OUTLINE, ...style }}>
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            refsArr.current[i] = el;
          }}
          style={{ display: "inline-block", opacity: 0 }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface AboutProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
  contactRef?: { current: HTMLDivElement | null };
  gridRef?: React.RefObject<DashedGridOverlayHandle | null>;
}

export default function About({ sectionRef, contactRef, gridRef }: AboutProps = {}) {
  const ownRef = useRef<HTMLElement>(null);
  const bd2 = useRef<HTMLDivElement>(null);

  const sub2 = useRef<HTMLDivElement>(null);
  const sub3 = useRef<HTMLDivElement>(null);
  const sub4 = useRef<HTMLDivElement>(null);

  const skillsChars = useRef<(HTMLSpanElement | null)[]>([]);
  const expChars = useRef<(HTMLSpanElement | null)[]>([]);

  // Experience timeline
  const trackRef = useRef<HTMLDivElement>(null);
  const expLine = useRef<HTMLDivElement>(null);
  const expNodes = useRef<(HTMLDivElement | null)[]>([]);
  const connectMeRef = useRef<HTMLButtonElement>(null);

  const c2026Ref      = useRef<HTMLDivElement>(null);
  const panelRef      = useRef<HTMLDivElement>(null);
  const linksRef      = useRef<(HTMLAnchorElement | null)[]>([]);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  const charcoalRef = sectionRef ?? ownRef;

  useEffect(() => {
    const track = trackRef.current;
    const section = sub3.current;
    if (!track || !section) return;

    const totalWidth = Math.max(
      0,
      track.scrollWidth - document.documentElement.clientWidth,
    );

    const ctx = gsap.context(() => {
      // ── Backdrop (sub2, sub4) ──
      const animBd = (
        el: HTMLDivElement | null,
        trigger: HTMLDivElement | null,
      ) => {
        if (!el || !trigger) return;
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      };
      animBd(bd2.current, sub2.current);

      // ── Title chars ──
      const animTitle = (
        refs: React.RefObject<(HTMLSpanElement | null)[]>,
        trigger: HTMLDivElement | null,
        start = "top 75%",
      ) => {
        const els = refs.current.filter(Boolean) as HTMLSpanElement[];
        if (!els.length || !trigger) return;
        gsap.fromTo(
          els,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.65,
            stagger: 0.025,
            ease: "power3.out",
            delay: 0.2,
            onComplete: () => gsap.set(els, { clearProps: "filter" }),
            scrollTrigger: {
              trigger,
              start,
              toggleActions: "play none none none",
            },
          },
        );
      };
      animTitle(skillsChars, sub2.current);
      animTitle(expChars, sub3.current, "top 90%");

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
              const first3 = expNodes.current
                .slice(0, 3)
                .filter(Boolean) as HTMLDivElement[];
              gsap.fromTo(
                first3,
                { opacity: 0, y: 14 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.12,
                  ease: "power2.out",
                },
              );
            },
          },
        });

        tl.to(track, { x: -totalWidth, ease: "none", duration: 1 }, 0);

        if (expLine.current) {
          tl.to(
            expLine.current,
            { width: "100%", ease: "none", duration: 1 },
            0,
          );
        }

        const at = [0.18, 0.5, 0.78];
        [3, 4, 5].forEach((ni, j) => {
          const node = expNodes.current[ni];
          if (node)
            tl.fromTo(
              node,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.08 },
              at[j],
            );
        });

        if (connectMeRef.current) {
          tl.fromTo(
            connectMeRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.06 },
            0.92,
          );
        }
      }

      // ── Contact: 패널 → 이미지 → 버튼 순차 등장 ──
      if (panelRef.current && c2026Ref.current) {
        // 초기 상태 설정
        gsap.set(c2026Ref.current, { y: 160, opacity: 0 });
        gsap.set(linksRef.current.filter(Boolean), { y: 20, opacity: 0 });

        // 1단계: 검정 패널 슬라이드업
        gsap.to(panelRef.current, {
          y: 0,
          duration: 1.0,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sub4.current,
            start: "top 60%",
            toggleActions: "play none none none",
            onEnter: () => gridRef?.current?.hideOnContact(),
            onLeaveBack: () => gridRef?.current?.showOnLeaveContact(),
          },
          onComplete: () => {
            // 2단계: ©2026 이미지 등장
            gsap.to(c2026Ref.current, {
              y: 0,
              opacity: 1,
              duration: 1.4,
              ease: "power3.out",
              onComplete: () => {
                // 3단계: 링크 버튼 순차 fade in
                gsap.to(linksRef.current.filter(Boolean), {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out",
                });
              },
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, [gridRef]);

  useEffect(() => {
    if (!contactRef) return;
    contactRef.current = sub4.current;
    return () => {
      contactRef.current = null;
    };
  }, [contactRef]);

  // ── Contact 패널 grid cell edge hover ──
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const panel  = panelRef.current;
    if (!canvas || !panel) return;

    const CELL = 100;
    const HALF = CELL / 2;
    const BASE = "133, 87, 207";

    const NEIGHBOR_OFFSETS = [
      { dc:  0, dr: -1 },
      { dc:  0, dr:  1 },
      { dc: -1, dr:  0 },
      { dc:  1, dr:  0 },
    ] as const;

    let mouseX = -1, mouseY = -1;
    let lastCol = -1, lastRow = -1;
    let isHovering = false;
    let raf: number | null = null;
    let cols = 0, rows = 0;

    // 인접 셀 / 중심 셀 lerp opacity
    const neighborOps = [0, 0, 0, 0];
    let centerOp = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width  / CELL);
      rows = Math.ceil(canvas.height / CELL);
    };
    resize();

    const drawDot = (
      ctx: CanvasRenderingContext2D,
      cx: number, cy: number,
      opacity: number,
      flicker: number,
    ) => {
      if (opacity < 0.02) return;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BASE}, ${opacity * flicker})`;
      ctx.fill();
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { raf = null; return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cTarget = isHovering ? 0.18 : 0;
      const nTarget = isHovering ? 0.06 : 0;
      let anyVisible = false;

      // 1. 인접 셀 fill (뒤)
      if (lastCol >= 0) {
        NEIGHBOR_OFFSETS.forEach(({ dc, dr }, i) => {
          const nc = lastCol + dc;
          const nr = lastRow + dr;
          neighborOps[i] += (nTarget - neighborOps[i]) * 0.08;
          if (neighborOps[i] > 0.001 && nc >= 0 && nr >= 0 && nc < cols && nr < rows) {
            anyVisible = true;
            ctx.fillStyle = `rgba(${BASE}, ${neighborOps[i]})`;
            ctx.fillRect(nc * CELL, nr * CELL, CELL, CELL);
          }
        });

        // 2. 중심 셀 fill (앞)
        centerOp += (cTarget - centerOp) * 0.08;
        if (centerOp > 0.001) {
          anyVisible = true;
          ctx.fillStyle = `rgba(${BASE}, ${centerOp})`;
          ctx.fillRect(lastCol * CELL, lastRow * CELL, CELL, CELL);
        }
      }

      // 3. 기존 테두리 + 꼭지점 원 (호버 중에만)
      if (isHovering && mouseX >= 0) {
        anyVisible = true;
        const col = Math.floor(mouseX / CELL);
        const row = Math.floor(mouseY / CELL);
        const x   = col * CELL;
        const y   = row * CELL;

        const dx = mouseX - (x + HALF);
        const dy = mouseY - (y + HALF);

        const lp = Math.max(0, -dx / HALF);
        const rp = Math.max(0,  dx / HALF);
        const tp = Math.max(0, -dy / HALF);
        const bp = Math.max(0,  dy / HALF);

        const centerProx = 1 - Math.max(Math.abs(dx), Math.abs(dy)) / HALF;
        const minOp      = Math.max(0, centerProx * 0.6);

        const flp = Math.max(lp, minOp);
        const frp = Math.max(rp, minOp);
        const ftp = Math.max(tp, minOp);
        const fbp = Math.max(bp, minOp);

        const flicker = Math.sin(Date.now() / 1000 * 8) * 0.15 + 0.85;

        ctx.lineWidth = 1.5;

        if (flp > 0.05) {
          ctx.strokeStyle = `rgba(${BASE}, ${flp * 0.7 * flicker})`;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); ctx.stroke();
        }
        if (frp > 0.05) {
          ctx.strokeStyle = `rgba(${BASE}, ${frp * 0.7 * flicker})`;
          ctx.beginPath(); ctx.moveTo(x + CELL, y); ctx.lineTo(x + CELL, y + CELL); ctx.stroke();
        }
        if (ftp > 0.05) {
          ctx.strokeStyle = `rgba(${BASE}, ${ftp * 0.7 * flicker})`;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); ctx.stroke();
        }
        if (fbp > 0.05) {
          ctx.strokeStyle = `rgba(${BASE}, ${fbp * 0.7 * flicker})`;
          ctx.beginPath(); ctx.moveTo(x, y + CELL); ctx.lineTo(x + CELL, y + CELL); ctx.stroke();
        }

        drawDot(ctx, x,        y,        flp * ftp, flicker);
        drawDot(ctx, x + CELL, y,        frp * ftp, flicker);
        drawDot(ctx, x,        y + CELL, flp * fbp, flicker);
        drawDot(ctx, x + CELL, y + CELL, frp * fbp, flicker);
      }

      if (anyVisible || isHovering) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = null;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      mouseX  = e.clientX - rect.left;
      mouseY  = e.clientY - rect.top;
      lastCol = Math.floor(mouseX / CELL);
      lastRow = Math.floor(mouseY / CELL);
      isHovering = true;
      if (raf === null) raf = requestAnimationFrame(draw);
    };

    const onMouseLeave = () => {
      isHovering = false;
      mouseX = -1;
      mouseY = -1;
      // RAF 유지 — neighborOps/centerOp가 0으로 lerp되며 자연스럽게 종료
    };

    window.addEventListener("resize", resize);
    panel.addEventListener("mousemove", onMouseMove);
    panel.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      panel.removeEventListener("mousemove", onMouseMove);
      panel.removeEventListener("mouseleave", onMouseLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToContact = () => {
    if (!sub4.current) return;
    gsap.to(window, {
      scrollTo: { y: sub4.current },
      duration: 1.2,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      ref={charcoalRef}
      style={{ position: "relative", width: "100%", background: "#2a2a2e" }}
    >
      <style>{`
        .contact-link {
          position: relative; display: inline-flex; align-items: center;
          padding: 6px 10px; text-decoration: none;
          color: rgba(255,255,255,0.75); font-size: 13px; letter-spacing: 0.2em;
          transition: color 0.3s ease, opacity 0.3s ease;
        }
        .contact-link:hover { opacity: 1; color: rgba(255,255,255,0.95); }
        .contact-link::before { content:""; position:absolute; top:-7px; left:-7px; width:9px; height:9px; border-top:1px solid rgba(255,255,255,0.8); border-left:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .contact-link::after  { content:""; position:absolute; top:-7px; right:-7px; width:9px; height:9px; border-top:1px solid rgba(255,255,255,0.8); border-right:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .contact-link .cb-l { position:absolute; bottom:-7px; left:-7px; width:9px; height:9px; border-bottom:1px solid rgba(255,255,255,0.8); border-left:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .contact-link .cb-r { position:absolute; bottom:-7px; right:-7px; width:9px; height:9px; border-bottom:1px solid rgba(255,255,255,0.8); border-right:1px solid rgba(255,255,255,0.8); opacity:0; transition:all .3s ease; }
        .contact-link:hover::before { top:-1px; left:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .contact-link:hover::after  { top:-1px; right:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .contact-link:hover .cb-l { bottom:-1px; left:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
        .contact-link:hover .cb-r { bottom:-1px; right:-1px; opacity:1; border-color:rgba(110,90,255,0.8); }
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
          style={{
            fontSize: "clamp(24px, 3.2vw, 52px)",
            marginBottom: "2.5rem",
            position: "relative",
            zIndex: 1,
          }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {SKILLS.map((skill) => (
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
          height: "100vh",
          overflow: "hidden",
          zIndex: 10,
          background: "#2a2a2e",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "8vh 10vw 0",
            flexShrink: 0,
            position: "relative",
            zIndex: 3,
          }}
        >
          <SplitTitle
            chars={EXP_TITLE}
            refsArr={expChars}
            style={{ fontSize: "clamp(24px, 3.2vw, 52px)" }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            zIndex: 3,
          }}
        >
          <div
            ref={trackRef}
            style={{
              width: "max-content",
              padding: "0 10vw",
              willChange: "transform",
            }}
          >
            <div
              style={{
                position: "relative",
                height: 2,
                background: "rgba(255,255,255,0.08)",
                marginBottom: 28,
                width: "100%",
              }}
            >
              <div
                ref={expLine}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "0%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(160,100,255,0.7) 100%)",
                }}
              />
            </div>

            <div
              style={{ display: "flex", gap: "20px", alignItems: "stretch" }}
            >
              {EXPERIENCES.map((exp, i) => {
                const isWork = exp.type === "work";
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      expNodes.current[i] = el;
                    }}
                    style={{
                      opacity: 0,
                      minWidth: "33vw",
                      clipPath:
                        "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                      background: isWork
                        ? "rgba(140,80,220,0.82)"
                        : "rgba(255,255,255,0.06)",
                      filter: isWork
                        ? "none"
                        : "drop-shadow(0 0 1px rgba(255,255,255,0.25))",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      padding: "20px 40px 20px 24px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        whiteSpace: "nowrap",
                        color: isWork
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(160,110,255,0.85)",
                        margin: "0 0 8px",
                        fontFamily: "'KblJumpExtended', sans-serif",
                      }}
                    >
                      {exp.year}
                    </p>
                    <p
                      style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.94)",
                        whiteSpace: "nowrap",
                        margin: "0 0 6px",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        ...TS,
                      }}
                    >
                      {exp.title}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        margin: 0,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: isWork
                          ? "rgba(255,255,255,0.55)"
                          : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {exp.role}
                    </p>
                  </div>
                );
              })}

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
      <div
        ref={sub4}
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#2a2a2e",
          overflow: "hidden",
        }}
      >
        {/* 검정 패널 — 아래에서 위로 슬라이드 */}
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "#07070b",
            zIndex: 1,
            transform: "translateY(100%)",
            pointerEvents: "auto",
          }}
        >
          {/* hover 격자 highlight canvas */}
          <canvas
            ref={gridCanvasRef}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* 링크 버튼 */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 48,
            display: "flex",
            gap: 40,
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <a
            ref={el => { linksRef.current[0] = el; }}
            href="https://github.com/hsyo830"
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="cb-l" />
            <span className="cb-r" />
            GITHUB ↗
          </a>
          <a
            ref={el => { linksRef.current[1] = el; }}
            href="mailto:nah830@gmail.com"
            className="contact-link"
          >
            <span className="cb-l" />
            <span className="cb-r" />
            EMAIL ↗
          </a>
          <a
            ref={el => { linksRef.current[2] = el; }}
            href="tel:01082528608"
            className="contact-link"
          >
            <span className="cb-l" />
            <span className="cb-r" />
            PHONE ↗
          </a>
        </div>

        {/* ©2026 이미지 — 상단 기준 배치, 하단 클립 */}
        <div
          ref={c2026Ref}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "75vh",
            overflow: "hidden",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/c2026.png"
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}
