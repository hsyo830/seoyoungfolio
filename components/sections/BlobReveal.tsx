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
      const progress = progressProxy.current.value;

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
      gsap.to(textRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
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

          if (p >= 0.85 && !gridTriggered) {
            gridTriggered = true;
            setTimeout(() => {
              gridRef?.current?.showGrid(showFromPixelsText);
            }, 200);
          } else if (p < 0.85 && gridTriggered) {
            gridTriggered = false;
            gridRef?.current?.hideGrid();
            if (textRef.current) gsap.to(textRef.current, { opacity: 0, duration: 0 });
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
      style={{ position: "relative", height: "300vh", width: "100%" }}
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
        <p style={{
          fontFamily: "'KblJumpExtended', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(48px, 6vw, 96px)",
          lineHeight: 1.2,
          color: "rgba(255,255,255,0.95)",
          margin: 0,
        }}>
          FROM PIXELS<br />TO PURPOSE
        </p>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 16,
          lineHeight: "26px",
          color: "rgba(255,255,255,0.75)",
          marginTop: "2em",
        }}>
          3D animation과 디자인 백그라운드에서 출발해<br />
          프론트엔드 개발자로 전환.<br />
          성능과 미감 둘 다 타협하지 않는 개발을 추구합니다.
        </p>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 13,
          lineHeight: "20px",
          color: "rgba(255,255,255,0.5)",
          marginTop: "1.2em",
        }}>
          Performance | Interaction | Aesthetics<br />
          Clean Code | User Experience | Creativity
        </p>
      </div>
    </section>
  );
}
