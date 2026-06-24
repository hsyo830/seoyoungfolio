"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const rand = () => POOL[Math.floor(Math.random() * POOL.length)];

interface ShuffleProps {
  text: string;
  shuffleDirection?: "up" | "down";
  duration?: number;
  animationMode?: "normal" | "evenodd";
  shuffleTimes?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Shuffle({
  text,
  shuffleDirection = "up",
  duration = 0.5,
  animationMode = "normal",
  shuffleTimes = 2,
  ease = "power4.out",
  stagger = 0.05,
  threshold = 0.2,
  triggerOnce = true,
  triggerOnHover = false,
  loop = false,
  className = "",
  style,
}: ShuffleProps) {
  const containerRef  = useRef<HTMLSpanElement>(null);
  const charRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const triggeredRef  = useRef(false);
  const timerIds      = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalIds   = useRef<ReturnType<typeof setInterval>[]>([]);

  const finalChars = text.split("");
  const [display, setDisplay] = useState<string[]>(finalChars);

  const clearTimers = useCallback(() => {
    timerIds.current.forEach(clearTimeout);
    intervalIds.current.forEach(clearInterval);
    timerIds.current   = [];
    intervalIds.current = [];
  }, []);

  const play = useCallback(() => {
    if (triggerOnce && triggeredRef.current && !loop) return;
    triggeredRef.current = true;
    clearTimers();

    const yFrom = shuffleDirection === "up" ? 24 : -24;

    charRefs.current.forEach((el, i) => {
      if (!el) return;

      // evenodd 모드: 홀수 인덱스는 stagger를 0.5배 앞당겨 엇갈림
      const charDelay =
        animationMode === "evenodd"
          ? i % 2 === 0
            ? i * stagger
            : i * stagger - stagger * 0.5
          : i * stagger;

      // GSAP y/opacity 등장
      gsap.fromTo(
        el,
        { y: yFrom, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
          delay: Math.max(0, charDelay),
          clearProps: "y,opacity",
        }
      );

      // 셔플 텍스트 효과
      const fc = finalChars[i];
      if (fc === " ") {
        setDisplay(prev => { const n = [...prev]; n[i] = " "; return n; });
        return;
      }

      const steps      = shuffleTimes * 4;
      const totalMs    = (duration + Math.max(0, charDelay)) * 1000 * 0.8;
      const intervalMs = Math.max(30, totalMs / steps);

      const tid = setTimeout(() => {
        let step = 0;
        const iid = setInterval(() => {
          step++;
          if (step >= steps) {
            setDisplay(prev => { const n = [...prev]; n[i] = fc; return n; });
            clearInterval(iid);
          } else {
            setDisplay(prev => { const n = [...prev]; n[i] = rand(); return n; });
          }
        }, intervalMs);
        intervalIds.current.push(iid);
      }, Math.max(0, charDelay) * 1000);

      timerIds.current.push(tid);
    });
  }, [
    text, shuffleDirection, duration, animationMode,
    shuffleTimes, ease, stagger, triggerOnce, loop, clearTimers,
  ]);

  // IntersectionObserver로 스크롤 진입 감지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            if (triggerOnce) observer.disconnect();
          }
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [play, threshold, triggerOnce]);

  // hover 트리거
  useEffect(() => {
    if (!triggerOnHover) return;
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => { triggeredRef.current = false; play(); };
    el.addEventListener("mouseenter", onEnter);
    return () => el.removeEventListener("mouseenter", onEnter);
  }, [triggerOnHover, play]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        ...style,
        display: "inline-block",
      }}
    >
      {display.map((char, i) => (
        <span
          key={i}
          ref={el => { charRefs.current[i] = el; }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
