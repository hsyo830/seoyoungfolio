"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DashedGridOverlayHandle } from "@/components/ui/DashedGridOverlay";

gsap.registerPlugin(ScrollTrigger);

interface BlobRevealProps {
  gridRef?: React.RefObject<DashedGridOverlayHandle | null>;
}

export default function BlobReveal({ gridRef }: BlobRevealProps = {}) {
  const sectionRef    = useRef<HTMLElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const textRef       = useRef<HTMLDivElement>(null);
  const line1Ref      = useRef<HTMLParagraphElement>(null);
  const line2Ref      = useRef<HTMLParagraphElement>(null);
  const line3Ref      = useRef<HTMLParagraphElement>(null);
  const timeRef       = useRef(0);
  const progressProxy = useRef({ value: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── draw (blob only, no canvas text) ─────────────────────────────────
    const draw = () => {
      const w        = canvas.width;
      const h        = canvas.height;
      const t        = timeRef.current;
      const progress = Math.min(1, progressProxy.current.value / 0.5);

      ctx.clearRect(0, 0, w, h);
      if (progress <= 0.001) return;

      const cx        = w / 2;
      const cy        = h / 2;
      const maxRadius = Math.max(w, h) * 0.85;
      const N         = 8;

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2;
        const noise =
          Math.sin(angle * 3 + t * 0.5) * 0.15 +
          Math.sin(angle * 5 - t * 0.3) * 0.05;
        const r = maxRadius * progress * (1 + noise);
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < N; i++) {
        const p0 = pts[(i - 1 + N) % N];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % N];
        const p3 = pts[(i + 2) % N];
        ctx.bezierCurveTo(
          p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
          p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
          p2.x, p2.y,
        );
      }
      ctx.closePath();
      ctx.fillStyle = "#2a2a2e";
      ctx.fill();
    };

    // ── Animation loop ───────────────────────────────────────────────────
    let rafId: number;
    const animate = () => {
      timeRef.current += 0.01;
      draw();
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ── ScrollTrigger + grid/text trigger at progress 0.85 ───────────────
    const showFromPixelsText = () => {
      if (!textRef.current) return;
      gsap.to(textRef.current, { opacity: 1, duration: 0, ease: "power2.out" });
      gsap.timeline()
        .to(line1Ref.current, { opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(line2Ref.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, "+=0.15")
        .to(line3Ref.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, "+=0.15");
    };

    let gridTriggered = false;
    const proxy = progressProxy.current;

    const st = gsap.to(proxy, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;

          if (p >= 0.55 && !gridTriggered) {
            gridTriggered = true;
            setTimeout(() => {
              gridRef?.current?.showGrid(showFromPixelsText);
            }, 200);
          } else if (p < 0.55 && gridTriggered) {
            gridTriggered = false;
            gridRef?.current?.hideGrid();
            gsap.killTweensOf([line1Ref.current, line2Ref.current, line3Ref.current]);
            if (textRef.current) gsap.to(textRef.current, { opacity: 0, duration: 0 });
            gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { opacity: 0 });
          }
        },
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      st.scrollTrigger?.kill();
    };
  }, [gridRef]);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "500vh", width: "100%" }}
    >
      {/* Blob canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "sticky",
          top: 0,
          display: "block",
          width: "100%",
          height: "100vh",
        }}
      />

      {/* FROM PIXELS TO PURPOSE — appears after grid animation via showGrid onComplete */}
      <div
        ref={textRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          marginTop: "-100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 10,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <p ref={line1Ref} style={{
          fontFamily: "var(--font-anton)",
          fontWeight: 400,
          fontSize: "clamp(48px, 6vw, 96px)",
          lineHeight: 1.1,
          color: "#ea5d2a",
          textShadow: [
            "0.9px 0.9px 0 #000",
            "-0.9px 0.9px 0 #000",
            "0.9px -0.9px 0 #000",
            "-0.9px -0.9px 0 #000",
          ].join(", "),
          margin: 0,
          opacity: 0,
        }}>
          EVERY PIXEL<br />HAS PURPOSE
        </p>

        <p ref={line2Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 16,
          lineHeight: "26px",
          color: "rgba(255,255,255,0.75)",
          marginTop: "2em",
          opacity: 0,
        }}>
          사용자가 불편함을 인식하기 전에 먼저 발견하고,<br />
          수치로 증명하며 개선하는 프론트엔드 개발자입니다.<br />
          작은 구현 차이가 사용자의 선택을 바꾼다고 믿습니다.
        </p>

        <p ref={line3Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 13,
          lineHeight: "20px",
          color: "rgba(255,255,255,0.5)",
          marginTop: "1.2em",
          opacity: 0,
        }}>
          Performance | Interaction | Aesthetics<br />
          Clean Code | User Experience | Creativity
        </p>
      </div>
    </section>
  );
}
