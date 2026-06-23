"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NAME = "Seo Young";
const TAGLINE = "Designing experiences, building interactions.";

export default function HeroAnimText() {
  const nameRef    = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const chars = nameRef.current?.querySelectorAll<HTMLElement>(".hero-char");
    const words = taglineRef.current?.querySelectorAll<HTMLElement>(".hero-word");

    if (chars?.length) {
      gsap.fromTo(
        chars,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.5 }
      );
    }

    if (words?.length) {
      gsap.fromTo(
        words,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.9 }
      );
    }
  }, []);

  return (
    <>
      {/* SEO YOUNG — 글자별 stagger */}
      <p
        ref={nameRef}
        className="mt-6 font-title font-medium tracking-widest uppercase text-text-secondary"
        style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.35em" }}
      >
        {NAME.split("").map((char, i) => (
          <span
            key={i}
            className="hero-char"
            style={{ display: "inline-block", opacity: 0 }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </p>

      {/* 태그라인 — 단어별 stagger */}
      <p
        ref={taglineRef}
        className="mt-4 font-body text-text-secondary"
        style={{
          fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.3em",
        }}
      >
        {TAGLINE.split(" ").map((word, i) => (
          <span
            key={i}
            className="hero-word"
            style={{ display: "inline-block", opacity: 0 }}
          >
            {word}
          </span>
        ))}
      </p>
    </>
  );
}
