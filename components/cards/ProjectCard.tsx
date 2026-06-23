"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrambleText from "@/components/ui/ScrambleText";

export interface Project {
  index: string;
  title: string;
  titleEn: string;
  description: string;
  techStack: string[];
  links: { github: string; live: string; demo: string };
  videoSrc: string | null;
}

interface Props {
  project: Project;
  progressLineRef: (el: HTMLDivElement | null) => void;
}

const TS: React.CSSProperties = { textShadow: "0 1px 12px rgba(0,0,0,0.4)" };

export default function ProjectCard({ project, progressLineRef }: Props) {
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const stackRef   = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (tlRef.current) tlRef.current.kill();

    const title      = titleRef.current;
    const desc       = descRef.current;
    const stackItems = stackRef.current ? Array.from(stackRef.current.children) : [];
    const links      = linksRef.current;

    if (!title || !desc || !links) return;

    gsap.set([title, desc, links], { opacity: 0, y: 30 });
    gsap.set(stackItems, { opacity: 0, y: 30 });

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(title,      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
    tl.to(desc,       { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.2);
    tl.to(stackItems, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.4);
    tl.to(links,      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.4 + project.techStack.length * 0.08 + 0.1);

    return () => { tl.kill(); };
  }, [project.index, project.techStack.length]);

  return (
    <div className="w-screen h-screen flex-shrink-0 relative" style={{ overflow: "visible" }}>
      <style>{`
        @keyframes chromaShine {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .project-title-chrome {
          background: linear-gradient(
            160deg,
            #ffffff 0%, #f0f0f0 20%, #ffffff 35%,
            #d0d0d0 50%, #ffffff 65%, #ececec 80%, #ffffff 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.85),
            0 -1px 1px rgba(0,0,0,0.18),
            0 2px 3px rgba(0,0,0,0.10),
            0 5px 10px rgba(0,0,0,0.14);
          filter: drop-shadow(0 0 24px rgba(255,255,255,0.55))
                  drop-shadow(0 3px 8px rgba(0,0,0,0.22));
          animation: chromaShine 4s ease-in-out infinite;
        }
        .project-visual {
          position: absolute;
          right: 6vw;
          top: 34%;
          width: 46vw;
          height: 50vh;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0,0,0,0.18);
          transform: perspective(1200px) rotateY(-8deg) rotateX(4deg);
          transition: transform 0.6s ease;
        }
        .project-visual:hover {
          transform: perspective(1200px) rotateY(-4deg) rotateX(2deg) scale(1.02);
        }
        .link-arrow {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 4px 8px;
          font-weight: 300;
          font-size: 0.875rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.78);
          text-decoration: none;
          text-shadow: 0 1px 12px rgba(0,0,0,0.4);
          transition: opacity 0.3s ease, color 0.3s ease;
          cursor: pointer;
        }
        .link-arrow:hover { opacity: 1; color: rgba(110,90,255,0.95); }

        .link-arrow::before,
        .link-arrow::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .link-arrow .corner-bl,
        .link-arrow .corner-br {
          position: absolute;
          width: 8px;
          height: 8px;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .link-arrow::before {
          top: -7px; left: -7px;
          border-top: 1px solid rgba(255,255,255,0.8);
          border-left: 1px solid rgba(255,255,255,0.8);
        }
        .link-arrow::after {
          top: -7px; right: -7px;
          border-top: 1px solid rgba(255,255,255,0.8);
          border-right: 1px solid rgba(255,255,255,0.8);
        }
        .link-arrow .corner-bl {
          bottom: -7px; left: -7px;
          border-bottom: 1px solid rgba(255,255,255,0.8);
          border-left: 1px solid rgba(255,255,255,0.8);
        }
        .link-arrow .corner-br {
          bottom: -7px; right: -7px;
          border-bottom: 1px solid rgba(255,255,255,0.8);
          border-right: 1px solid rgba(255,255,255,0.8);
        }
        .link-arrow:hover::before { top: -1px; left: -1px; opacity: 1; border-color: rgba(110,90,255,0.8); }
        .link-arrow:hover::after  { top: -1px; right: -1px; opacity: 1; border-color: rgba(110,90,255,0.8); }
        .link-arrow:hover .corner-bl { bottom: -1px; left: -1px; opacity: 1; border-color: rgba(110,90,255,0.8); }
        .link-arrow:hover .corner-br { bottom: -1px; right: -1px; opacity: 1; border-color: rgba(110,90,255,0.8); }
        .skill-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.78);
          text-shadow: 0 1px 12px rgba(0,0,0,0.4);
        }
        .project-copy {
          position: relative;
          width: 42vw;
          padding: 32px 0;
        }
        .project-copy::before {
          content: "";
          position: absolute;
          inset: -40px -60px;
          z-index: -1;
          background: radial-gradient(
            ellipse at left,
            rgba(0,0,0,0.28),
            rgba(0,0,0,0.12) 45%,
            transparent 75%
          );
          filter: blur(24px);
        }
      `}</style>

      {/* 우측 비주얼 */}
      <div className="project-visual">
        {project.videoSrc ? (
          <video
            src={project.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <span
              className="text-xs tracking-[0.35em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Video Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* 좌측 텍스트 콘텐츠 */}
      <div
        className="absolute left-16 top-[12vh] flex flex-col w-[42vw]"
        style={{ overflow: "visible" }}
      >
        {/* 인덱스 */}
        <p
          className="text-[15px] tracking-[0.4em] uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.28)", ...TS }}
        >
          <ScrambleText text={project.index} duration={300} />
        </p>

        {/* 제목 — ScrambleText 유지, GSAP fadeUp 동시 적용 */}
        <h2
          ref={titleRef}
          className="project-title-chrome text-[clamp(3.5rem,6.5vw,7rem)] font-black leading-[1.2] tracking-tight mb-1 whitespace-nowrap self-start"
          style={{
            fontFamily: "'KblJumpExtended', sans-serif",
            overflow: "visible",
            paddingBottom: "0.15em",
          }}
        >
          <ScrambleText text={project.title} duration={600} />
        </h2>

        {/* 영문 제목 */}
        <p
          className="text-[15px] tracking-[0.35em] uppercase mb-6"
          style={{ color: "rgba(255,255,255,0.28)", ...TS }}
        >
          <ScrambleText text={project.titleEn} duration={400} />
        </p>

        {/* Progress line */}
        <div
          className="relative h-[3px] w-full mb-8"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            ref={progressLineRef}
            className="absolute top-0 left-0 h-full"
            style={{
              width: "10%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 100%)",
            }}
          />
        </div>

        {/* 설명 · 스택 · 링크 */}
        <div className="project-copy">
          {/* 설명 — ScrambleText 제거, GSAP fadeUp */}
          <p
            ref={descRef}
            className="mb-6"
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "18px",
              lineHeight: 1.6,
              fontWeight: 500,
              ...TS,
            }}
          >
            {project.description}
          </p>

          {/* 기술 스택 — 각 항목 개별 stagger */}
          <div ref={stackRef} className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech) => (
              <span key={tech} className="skill-tag">{tech}</span>
            ))}
          </div>

          {/* 링크 버튼 */}
          <div
            ref={linksRef}
            className="flex flex-row flex-wrap"
            style={{ gap: "1.5rem" }}
          >
            <a href={project.links.github} className="link-arrow" onClick={(e) => e.preventDefault()}>
              <span className="corner-bl" /><span className="corner-br" />
              GITHUB <span>↗</span>
            </a>
            <a href={project.links.live} className="link-arrow" onClick={(e) => e.preventDefault()}>
              <span className="corner-bl" /><span className="corner-br" />
              LIVE SITE <span>↗</span>
            </a>
            <a href={project.links.demo} className="link-arrow" onClick={(e) => e.preventDefault()}>
              <span className="corner-bl" /><span className="corner-br" />
              DEMO VIDEO <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
