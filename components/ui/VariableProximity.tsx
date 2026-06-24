"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VariableProximityProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  splitBy?: "char" | "word";
  minWeight?: number;
  maxWeight?: number;
  radius?: number;
}

export default function VariableProximity({
  text,
  className = "",
  style,
  splitBy = "char",
  minWeight = 300,
  maxWeight = 800,
  radius = 160,
}: VariableProximityProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const itemRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const items        = splitBy === "word" ? text.split(" ") : [...text];

  useEffect(() => {
    const container = containerRef.current;
    const els = itemRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !els.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(els,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.65,
          stagger: splitBy === "word" ? 0.055 : 0.028,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    const onMove = (e: MouseEvent) => {
      els.forEach(el => {
        const r   = el.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const d   = Math.hypot(e.clientX - cx, e.clientY - cy);
        const t   = Math.max(0, 1 - d / radius);
        const w   = Math.round(minWeight + t * (maxWeight - minWeight));
        el.style.fontWeight  = String(w);
        el.style.transition  = "font-weight 0.12s ease";
      });
    };

    const onLeave = () => {
      els.forEach(el => { el.style.fontWeight = ""; el.style.transition = ""; });
    };

    window.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [text, splitBy, minWeight, maxWeight, radius]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", ...style }}
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline" }}>
          <span
            ref={el => { itemRefs.current[i] = el; }}
            style={{ display: "inline-block" }}
          >
            {item}
          </span>
          {splitBy === "word" && i < items.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
