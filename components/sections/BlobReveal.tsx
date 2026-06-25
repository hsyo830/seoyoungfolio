"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BlobReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const timeRef    = useRef(0);
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

    // ── draw ─────────────────────────────────────────────────────────────
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

      // Blob control points
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2;
        const noise =
          Math.sin(angle * 3 + t * 0.5) * 0.15 +
          Math.sin(angle * 5 - t * 0.3) * 0.05;
        const r = maxRadius * progress * (1 + noise);
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }

      // Catmull-Rom → bezier smooth blob
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

      // ── Text ────────────────────────────────────────────────────────
      if (progress < 0.3) return;

      const textOpacity = Math.min(1, (progress - 0.3) / 0.3);
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";

      const fontSize = Math.round(Math.max(48, Math.min(96, w * 0.06)));
      const lh       = fontSize * 1.2;

      ctx.font      = `800 ${fontSize}px 'KblJumpExtended', sans-serif`;
      ctx.fillStyle = `rgba(255,255,255,${textOpacity})`;
      ctx.fillText("FROM PIXELS", cx, cy - lh * 0.85);
      ctx.fillText("TO PURPOSE",  cx, cy + lh * 0.15);

      const subLines = [
        "3D animation과 디자인 백그라운드에서 출발해",
        "프론트엔드 개발자로 전환.",
        "성능과 미감 둘 다 타협하지 않는 개발을 추구합니다.",
      ];
      ctx.font      = `300 16px 'Inter', sans-serif`;
      ctx.fillStyle = `rgba(255,255,255,${textOpacity * 0.75})`;
      const subY = cy + lh * 1.25;
      subLines.forEach((line, i) => ctx.fillText(line, cx, subY + i * 26));

      const kwLines = [
        "Performance | Interaction | Aesthetics",
        "Clean Code | User Experience | Creativity",
      ];
      ctx.font      = `300 13px 'Inter', sans-serif`;
      ctx.fillStyle = `rgba(255,255,255,${textOpacity * 0.5})`;
      const kwY = subY + subLines.length * 26 + 20;
      kwLines.forEach((line, i) => ctx.fillText(line, cx, kwY + i * 20));
    };

    // ── Animation loop ───────────────────────────────────────────────────
    let rafId: number;
    const animate = () => {
      timeRef.current += 0.01;
      draw();
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ── ScrollTrigger (CSS sticky handles pinning) ───────────────────────
    const proxy = progressProxy.current;
    const st = gsap.to(proxy, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      st.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "300vh", width: "100%" }}
    >
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
    </section>
  );
}
