"use client";

import { useEffect, useRef, RefObject, useCallback, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";

const H_LINES = [{ top: "28%" }, { top: "72%" }];

const V_LINES = [
  { left: "8%",  alpha: 0.12 },
  { left: "22%", alpha: 0.18 },
  { left: "38%", alpha: 0.25 },
  { left: "62%", alpha: 0.25 },
  { left: "78%", alpha: 0.18 },
  { left: "91%", alpha: 0.12 },
];

const BOXES = [
  { top: "calc(27% - 16px)", left: "calc(14% - 16px)" },
  { top: "calc(71% - 16px)", left: "calc(31% - 16px)" },
  { top: "calc(27% - 16px)", left: "calc(84% - 16px)" },
];

const V_OFFSETS   = [-60, -40, -15, 15, 40, 60];
const BOX_OFFSETS = [
  { x: -60, y: -60 },
  { x:  40, y:  60 },
  { x: -40, y:  40 },
];

export interface DashedGridOverlayHandle {
  showGrid: (onComplete?: () => void) => void;
  hideGrid: () => void;
}

interface Props {
  containerRef: RefObject<HTMLElement | null>;
  contactRef:   RefObject<HTMLDivElement | null>;
}

const DashedGridOverlay = forwardRef<DashedGridOverlayHandle, Props>(
  function DashedGridOverlay({ containerRef, contactRef }, ref) {
    const overlayRef         = useRef<HTMLDivElement>(null);
    const hLineRefs          = useRef<(HTMLDivElement | null)[]>([]);
    const vLineRefs          = useRef<(HTMLDivElement | null)[]>([]);
    const boxRefs            = useRef<(HTMLDivElement | null)[]>([]);
    const wobbleTweens       = useRef<gsap.core.Tween[]>([]);
    const showTl             = useRef<gsap.core.Timeline | null>(null);
    const fromPixelsTimeout  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const gridVisibleRef     = useRef(false);

    const startWobble = useCallback(() => {
      wobbleTweens.current.forEach(t => t.kill());
      wobbleTweens.current = [];
      boxRefs.current.forEach((el, i) => {
        if (!el) return;
        wobbleTweens.current.push(
          gsap.to(el, {
            x: (i % 2 === 0 ? 1 : -1) * 2,
            y: (i % 3 === 0 ? 1 : -1) * 2,
            duration: 2 + i * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          })
        );
      });
    }, []);

    useEffect(() => {
      startWobble();
      return () => {
        wobbleTweens.current.forEach(t => t.kill());
        wobbleTweens.current = [];
      };
    }, [startWobble]);

    const showGrid = useCallback((onComplete?: () => void) => {
      if (fromPixelsTimeout.current) { clearTimeout(fromPixelsTimeout.current); fromPixelsTimeout.current = null; }
      if (showTl.current) showTl.current.kill();
      gridVisibleRef.current = true;

      showTl.current = gsap.timeline()
        .to(overlayRef.current, { opacity: 1, duration: 0 })
        .fromTo(
          hLineRefs.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        )
        .fromTo(
          vLineRefs.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          boxRefs.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.3"
        )
        .call(() => {
          if (onComplete) {
            fromPixelsTimeout.current = setTimeout(onComplete, 300);
          }
        });
    }, []);

    const hideGrid = useCallback(() => {
      if (fromPixelsTimeout.current) { clearTimeout(fromPixelsTimeout.current); fromPixelsTimeout.current = null; }
      if (showTl.current) { showTl.current.kill(); showTl.current = null; }
      gridVisibleRef.current = false;
      gsap.to(overlayRef.current, { opacity: 0, duration: 0 });
    }, []);

    useImperativeHandle(ref, () => ({ showGrid, hideGrid }), [showGrid, hideGrid]);

    // Scroll check: only hides when scrolled past contact section
    // contactRef.current를 lazy하게 읽어야 함 —
    // About의 useEffect가 DashedGridOverlay의 effect보다 늦게 실행되므로
    // 마운트 시점에 스냅샷을 찍으면 null이 됨.
    useEffect(() => {
      const check = () => {
        const contact = contactRef.current;
        if (!contact) return;
        const contactBottom = contact.getBoundingClientRect().bottom + window.scrollY;
        if (window.scrollY >= contactBottom && gridVisibleRef.current) {
          gridVisibleRef.current = false;
          hideGrid();
        }
      };

      window.addEventListener("scroll", check, { passive: true });
      return () => window.removeEventListener("scroll", check);
    }, [contactRef, hideGrid]);

    // Mouse parallax
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const overlay = overlayRef.current;
        if (!overlay || overlay.style.opacity === "0") return;

        const nx   = e.clientX / window.innerWidth  - 0.5;
        const ny   = e.clientY / window.innerHeight - 0.5;
        const opts = { duration: 1.2, ease: "power2.out", overwrite: "auto" as const };

        hLineRefs.current.forEach((el, i) => {
          if (el) gsap.to(el, { y: ny * (i === 0 ? 40 : -40), ...opts });
        });
        vLineRefs.current.forEach((el, i) => {
          if (el) gsap.to(el, { x: nx * V_OFFSETS[i], ...opts });
        });
        boxRefs.current.forEach((el, i) => {
          if (el) gsap.to(el, { x: nx * BOX_OFFSETS[i].x, y: ny * BOX_OFFSETS[i].y, ...opts });
        });
      };

      const handleMouseLeave = () => {
        const overlay = overlayRef.current;
        if (!overlay || overlay.style.opacity === "0") return;
        const all = [
          ...hLineRefs.current,
          ...vLineRefs.current,
          ...boxRefs.current,
        ].filter(Boolean);
        gsap.to(all, { x: 0, y: 0, duration: 1.5, ease: "power3.out", overwrite: "auto" });
        setTimeout(startWobble, 1600);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [startWobble]);

    return (
      <div
        ref={overlayRef}
        style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: 0 }}
      >
        {H_LINES.map((l, i) => (
          <div
            key={i}
            ref={el => { hLineRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: l.top, left: 0, right: 0,
              height: "1px",
              borderTop: "1px dashed rgba(255,255,255,0.15)",
            }}
          />
        ))}

        {V_LINES.map((v, i) => (
          <div
            key={i}
            ref={el => { vLineRefs.current[i] = el; }}
            style={{
              position: "absolute",
              left: v.left, top: 0, bottom: 0,
              width: "1px",
              borderLeft: `1px dashed rgba(255,255,255,${v.alpha})`,
            }}
          />
        ))}

        {BOXES.map((pos, i) => (
          <div
            key={i}
            ref={el => { boxRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: 32,
              height: 32,
              border: "1px dashed rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    );
  }
);

export default DashedGridOverlay;
