"use client";

import { useEffect, useRef, RefObject, useCallback } from "react";
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
const WOBBLE = [
  { amp: 3,   dur: 2.1 },
  { amp: 2.5, dur: 2.6 },
  { amp: 3.5, dur: 1.9 },
];

interface Props {
  containerRef: RefObject<HTMLElement | null>;
  contactRef:   RefObject<HTMLDivElement | null>;
}

export default function DashedGridOverlay({ containerRef, contactRef }: Props) {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const hLineRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const vLineRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const boxRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const wobbleTweens = useRef<gsap.core.Tween[]>([]);

  const startWobble = useCallback(() => {
    wobbleTweens.current.forEach(t => t.kill());
    wobbleTweens.current = [];
    boxRefs.current.forEach((el, i) => {
      if (!el) return;
      wobbleTweens.current.push(
        gsap.to(el, {
          y: `+=${WOBBLE[i].amp}`,
          duration: WOBBLE[i].dur,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      );
    });
  }, []);

  const showGrid = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.timeline()
      .to(overlay, { opacity: 1, duration: 0 })
      .fromTo(
        hLineRefs.current.filter(Boolean),
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        vLineRefs.current.filter(Boolean),
        { opacity: 0 },
        { opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        boxRefs.current.filter(Boolean),
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" },
        "-=0.2"
      )
      .call(startWobble);
  }, [startWobble]);

  const hideGrid = useCallback(() => {
    wobbleTweens.current.forEach(t => t.kill());
    wobbleTweens.current = [];
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  }, []);

  // Scroll-based visibility — immune to GSAP pin/unpin layout recalculations
  useEffect(() => {
    const container = containerRef.current;
    const contact   = contactRef.current;
    if (!container || !contact) return;

    let gridVisible = false;

    const check = () => {
      // Recalc absolute positions on every call so pin-induced layout shifts are reflected
      const charcoalTop    = container.getBoundingClientRect().top  + window.scrollY;
      const contactBottom  = contact.getBoundingClientRect().bottom + window.scrollY;

      // Grid is visible when viewport bottom has entered charcoal AND page top hasn't passed contact bottom
      const viewportBottom = window.scrollY + window.innerHeight;
      const isIn = viewportBottom > charcoalTop && window.scrollY < contactBottom;

      if (isIn && !gridVisible) {
        gridVisible = true;
        showGrid();
      } else if (!isIn && gridVisible) {
        gridVisible = false;
        hideGrid();
      }
    };

    check(); // evaluate immediately on mount
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [containerRef, contactRef, showGrid, hideGrid]);

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
