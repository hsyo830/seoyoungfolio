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
    id: 1, year: "2025.09 - 2026.02", company: "Codeit",
    role: "Frontend Engineering Bootcamp",
    desc: "React, TypeScript, Next.js 기반 프로젝트 수행",
    type: "education", position: "top", checkpointProgress: 0.12,
  },
  {
    id: 2, year: "2023.01 - 2024.05", company: "Seoul Game Art Academy",
    role: "Game Engine & AI Programming",
    desc: "C++, Unreal Engine 기반 게임 개발 학습",
    type: "education", position: "bottom", checkpointProgress: 0.28,
  },
  {
    id: 3, year: "2022.09 - 2022.12", company: "Carrysoft",
    role: "3D Animator Intern",
    desc: "MAYA 기반 3D 애니메이팅, 장편 애니메이션 제작 참여",
    type: "work", position: "top", checkpointProgress: 0.44,
  },
  {
    id: 4, year: "2022.04 - 2022.08", company: "Seoul Metropolitan Gov.",
    role: "Virtual Space Creator Training",
    desc: "Unreal Engine 기반 가상공간 콘텐츠 제작",
    type: "education", position: "bottom", checkpointProgress: 0.60,
  },
  {
    id: 5, year: "2021.10 - 2022.02", company: "Wonderful Platform",
    role: "Frontend Intern",
    desc: "모바일 웹 브릿지 페이지 UI 구현, Cafe24 웹페이지 개발",
    type: "work", position: "top", checkpointProgress: 0.76,
  },
  {
    id: 6, year: "2021.07 - 2021.08", company: "TheHigh Company",
    role: "Design Intern",
    desc: "광고 배너, 웹사이트 시안 디자인 제작",
    type: "work", position: "bottom", checkpointProgress: 0.90,
  },
];

const PATH_D =
  "M 0 400 C 200 400 300 150 600 150 S 900 600 1100 400 " +
  "C 1300 200 1500 650 1800 400 S 2100 150 2400 300 " +
  "C 2600 450 2800 600 3000 400 S 3300 150 3600 250 " +
  "C 3800 350 4000 600 4200 400 S 4500 200 4800 350 " +
  "C 5000 500 5200 150 5400 400 S 5700 500 6000 400";

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
  const trackRef        = useRef<HTMLDivElement>(null);
  const svgRef          = useRef<SVGSVGElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const cardRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const checkpointRefs  = useRef<(SVGCircleElement | null)[]>([]);

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

      // ── EXPERIENCE: SVG path timeline pin + horizontal scroll ──
      if (totalWidth > 0) {
        const triggeredCheckpoints = new Set<number>();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;

              // SVG progress path strokeDashoffset
              const progPath = progressPathRef.current;
              if (progPath) {
                const len = progPath.getTotalLength();
                progPath.style.strokeDashoffset = String(len * (1 - p));
              }

              // Checkpoint 도달 → 카드/원 등장
              EXPERIENCES.forEach((exp, i) => {
                if (p >= exp.checkpointProgress - 0.02 && !triggeredCheckpoints.has(i)) {
                  triggeredCheckpoints.add(i);

                  const circle = checkpointRefs.current[i];
                  if (circle) gsap.to(circle, { opacity: 1, duration: 0.3 });

                  const card = cardRefs.current[i];
                  const media = mediaRefs.current[i];
                  const initY = exp.position === "top" ? -20 : 20;
                  if (card) {
                    gsap.fromTo(card,
                      { opacity: 0, y: initY },
                      { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" },
                    );
                  }
                  if (media) {
                    gsap.to(media, { opacity: 1, duration: 0.5, delay: 0.7 });
                  }
                }
                // scrub 역방향 처리
                if (p < exp.checkpointProgress - 0.04 && triggeredCheckpoints.has(i)) {
                  triggeredCheckpoints.delete(i);
                  const circle = checkpointRefs.current[i];
                  if (circle) gsap.to(circle, { opacity: 0, duration: 0.2 });
                  const card = cardRefs.current[i];
                  if (card) gsap.to(card, { opacity: 0, duration: 0.2 });
                  const media = mediaRefs.current[i];
                  if (media) gsap.to(media, { opacity: 0, duration: 0.2 });
                }
              });
            },
          },
        });

        tl.to(track, { x: -totalWidth, ease: "none", duration: 1 }, 0);
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

  // ── Experience SVG path 초기화 (pathLength + 카드/체크포인트 위치) ──
  useEffect(() => {
    const progPath = progressPathRef.current;
    if (!progPath) return;

    const raf = requestAnimationFrame(() => {
      const len = progPath.getTotalLength();
      if (len === 0) return;

      progPath.style.strokeDasharray = String(len);
      progPath.style.strokeDashoffset = String(len);

      const svgW = window.innerWidth * 6;
      const svgH = window.innerHeight;

      EXPERIENCES.forEach((exp, i) => {
        const pt = progPath.getPointAtLength(len * exp.checkpointProgress);

        const circle = checkpointRefs.current[i];
        if (circle) {
          circle.setAttribute("cx", String(pt.x));
          circle.setAttribute("cy", String(pt.y));
        }

        const card = cardRefs.current[i];
        if (card) {
          const cssX = (pt.x / 6000) * svgW;
          const cssY = (pt.y / 800) * svgH;
          card.style.left = `${cssX - 120}px`;
          card.style.top  = exp.position === "top"
            ? `${cssY - 220}px`
            : `${cssY + 24}px`;
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

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
        }}
      >
        {/* 타이틀 — 좌상단 고정 */}
        <div
          style={{
            position: "absolute",
            top: "8vh",
            left: "10vw",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <SplitTitle
            chars={EXP_TITLE}
            refsArr={expChars}
            style={{ fontSize: "clamp(24px, 3.2vw, 52px)" }}
          />
        </div>

        {/* 가로 스크롤 트랙 */}
        <div
          ref={trackRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "600vw",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* SVG 곡선 경로 */}
          <svg
            ref={svgRef}
            width="600vw"
            height="100%"
            viewBox="0 0 6000 800"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* 점선 배경 경로 */}
            <path
              d={PATH_D}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
            {/* 진행 실선 (strokeDashoffset으로 제어) */}
            <path
              ref={progressPathRef}
              d={PATH_D}
              stroke="#F4F4F6"
              strokeWidth="2"
              fill="none"
            />
            {/* 체크포인트 원 (cx/cy는 useEffect에서 설정) */}
            {EXPERIENCES.map((exp, i) => (
              <circle
                key={exp.id}
                ref={el => { checkpointRefs.current[i] = el; }}
                r={6}
                fill="#F4F4F6"
                opacity={0}
                style={{ transformOrigin: "center", transformBox: "fill-box" }}
              />
            ))}
          </svg>

          {/* 경력 카드 (left/top은 useEffect에서 설정) */}
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.id}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute",
                width: 240,
                opacity: 0,
                transform: `translateY(${exp.position === "top" ? -20 : 20}px)`,
                zIndex: 5,
              }}
            >
              {/* 미디어 영역 */}
              <div
                ref={el => { mediaRefs.current[i] = el; }}
                data-video-src=""
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "rgba(133,87,207,0.08)",
                  borderRadius: 4,
                  marginBottom: 10,
                  opacity: 0,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(133,87,207,0.06) 0px, rgba(133,87,207,0.06) 1px, transparent 1px, transparent 10px), " +
                    "repeating-linear-gradient(-45deg, rgba(133,87,207,0.03) 0px, rgba(133,87,207,0.03) 1px, transparent 1px, transparent 10px)",
                }} />
              </div>

              {/* 카드 본문 */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: 16,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "box-shadow 0.3s ease",
              }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: "0 0 4px", letterSpacing: "0.1em" }}>
                  {exp.year}
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,1.0)", fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.02em", ...TS }}>
                  {exp.company}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", margin: "0 0 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {exp.role}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
                  {exp.desc}
                </p>
              </div>
            </div>
          ))}
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
