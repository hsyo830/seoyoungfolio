"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_H = 48;
const BOX_INSET = 20;

interface Project {
  index: string;
  title: string;
  subtitle: string;
  type: string;
  stack: string[];
  github: string;
  demo: string;
  live: string;
  video: string;
}

const projects: Project[] = [
  {
    index: "001",
    title: "Jikgwan GO",
    subtitle:
      "KBO 야구 직관을 앞둔 팬을 위한 경기 일정·구장·음식 부스·날씨 통합 서비스",
    type: "SOLO PROJECT  //  2026",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Swiper",
    ],
    github: "https://github.com/hsyo830/jikgwango",
    demo: "",
    live: "https://jikgwango.vercel.app",
    video: "/videos/jikgwango.mp4",
  },
  {
    index: "002",
    title: "Global Nomad",
    subtitle:
      "체험 액티비티 탐색·예약 웹 서비스. TanStack Query 기반 무한스크롤·페이지네이션 UX 구현",
    type: "TEAM PROJECT OF 4  //  2026",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Axios",
      "TanStack Query",
      "Tailwind CSS",
      "Framer Motion",
      "Swiper",
    ],
    github: "https://github.com/GlobalNomad-20/GlobalNomad",
    demo: "",
    live: "https://global-nomad-woad.vercel.app/activities",
    video: "/videos/globalnomad.mp4",
  },
  {
    index: "003",
    title: "The Julge",
    subtitle:
      "구인·구직 매칭 웹 서비스. 검색·필터·정렬 기반 공고 탐색과 예약·지원 흐름 전반 개발",
    type: "TEAM PROJECT OF 3  //  2025-2026",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Axios",
      "Emotion",
      "MUI",
      "Lottie",
    ],
    github: "https://github.com/albaform-team/albaform",
    demo: "",
    live: "https://albaform-rust.vercel.app/store",
    video: "/videos/thejulge.mp4",
  },
  {
    index: "004",
    title: "Rolling",
    subtitle:
      "익명 롤링페이퍼 생성·공유 웹 서비스. 배경 커스터마이징과 카드 UI 인터랙션 구현",
    type: "TEAM PROJECT OF 5  //  2025",
    stack: ["React", "React Router DOM", "CSS Modules", "MUI"],
    github: "https://github.com/Jieunsse/codeit-rolling",
    demo: "https://youtu.be/SJL-az9JhT4?si=aLWeCLv5qv0JGNJi",
    live: "https://codeit-rolling.vercel.app/",
    video: "/videos/rolling.mp4",
  },
];

interface CardRef {
  boxTopEl: HTMLElement | null;
  boxRightEl: HTMLElement | null;
  boxBottomEl: HTMLElement | null;
  boxLeftEl: HTMLElement | null;
  hDivEl: HTMLElement | null;
  vDiv1El: HTMLElement | null;
  vDiv2El: HTMLElement | null;
  hLink1El: HTMLElement | null;
  hLink2El: HTMLElement | null;
  indexEl: HTMLElement | null;
  titleEl: HTMLElement | null;
  subEl: HTMLElement | null;
  typeEl: HTMLElement | null;
  stackLabel: HTMLElement | null;
  tagEls: HTMLElement[];
  link1El: HTMLElement | null;
  link2El: HTMLElement | null;
  link3El: HTMLElement | null;
  videoEl: HTMLElement | null;
  squareEls: HTMLElement[];
  plusEls: SVGSVGElement[];
}

const LINE_COLOR = "rgba(0,0,0,0.18)";
const LINE_STYLE: React.CSSProperties = {
  background: LINE_COLOR,
  flexShrink: 0,
};
const BOX_COLOR = "rgba(0,0,0,0.25)";

const SQUARE_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 32,
  height: 32,
  border: "2px dashed rgba(0,0,0,0.2)",
  pointerEvents: "auto",
  zIndex: 6,
};

const SQUARES_ODD: React.CSSProperties[] = [
  { top: 24, right: 24 },
  { top: "calc(45% - 16px)", left: "20%" },
  { bottom: 24, left: "30%" },
];

const SQUARES_EVEN: React.CSSProperties[] = [
  { top: 24, left: "20%" },
  { top: "calc(40% - 16px)", right: 24 },
  { top: "calc(60% - 16px)", left: "22%" },
  { bottom: 16, left: "28%" },
];

const TEXT_HIDDEN: React.CSSProperties = {
  opacity: 0,
  willChange: "opacity, transform",
};

const TYPE_ROW_H = 65;
const CONTENT_H = `calc(100vh - ${MARQUEE_H}px - 2px)`; // card has 1px border top+bottom (border-box)

function Card({
  project,
  index,
  onRef,
}: {
  project: Project;
  index: number;
  onRef: (r: CardRef) => void;
}) {
  const boxTopRef = useRef<HTMLDivElement>(null);
  const boxRightRef = useRef<HTMLDivElement>(null);
  const boxBottomRef = useRef<HTMLDivElement>(null);
  const boxLeftRef = useRef<HTMLDivElement>(null);
  const hDivRef = useRef<HTMLDivElement>(null);
  const vDiv1Ref = useRef<HTMLDivElement>(null);
  const vDiv2Ref = useRef<HTMLDivElement>(null);
  const hLink1Ref = useRef<HTMLDivElement>(null);
  const hLink2Ref = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const typeRef = useRef<HTMLParagraphElement>(null);
  const stackLblRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const link1Ref = useRef<HTMLAnchorElement>(null);
  const link2Ref = useRef<HTMLAnchorElement>(null);
  const link3Ref = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const squareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plusRefs = useRef<(SVGSVGElement | null)[]>([]);
  const squares = index % 2 === 0 ? SQUARES_ODD : SQUARES_EVEN;

  useEffect(() => {
    onRef({
      boxTopEl: boxTopRef.current,
      boxRightEl: boxRightRef.current,
      boxBottomEl: boxBottomRef.current,
      boxLeftEl: boxLeftRef.current,
      hDivEl: hDivRef.current,
      vDiv1El: vDiv1Ref.current,
      vDiv2El: vDiv2Ref.current,
      hLink1El: hLink1Ref.current,
      hLink2El: hLink2Ref.current,
      indexEl: indexRef.current,
      titleEl: titleRef.current,
      subEl: subRef.current,
      typeEl: typeRef.current,
      stackLabel: stackLblRef.current,
      tagEls: tagsRef.current
        ? (Array.from(tagsRef.current.children) as HTMLElement[])
        : [],
      link1El: link1Ref.current,
      link2El: link2Ref.current,
      link3El: link3Ref.current,
      videoEl: videoRef.current,
      squareEls: squareRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      ),
      plusEls: plusRefs.current.filter(
        (el): el is SVGSVGElement => el !== null,
      ),
    });
  });

  const hasGH = !!project.github;
  const hasDemo = !!project.demo;
  const hasLive = !!project.live;

  // Title zone = 55% of the zone between marquee and type row
  const TITLE_H = `calc((100vh - ${MARQUEE_H}px - ${TYPE_ROW_H}px) * 0.55)`;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        position: "relative",
        border: "2px dashed rgba(0,0,0,0.14)",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Inner box border — 4 absolute edges drawn clockwise */}
      <div
        ref={boxTopRef}
        style={{
          position: "absolute",
          top: MARQUEE_H + BOX_INSET,
          left: BOX_INSET,
          right: BOX_INSET,
          height: 2,
          background: BOX_COLOR,
          transformOrigin: "left center",
          transform: "scaleX(0)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
      <div
        ref={boxRightRef}
        style={{
          position: "absolute",
          top: MARQUEE_H + BOX_INSET,
          right: BOX_INSET,
          bottom: BOX_INSET,
          width: 2,
          background: BOX_COLOR,
          transformOrigin: "top center",
          transform: "scaleY(0)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
      <div
        ref={boxBottomRef}
        style={{
          position: "absolute",
          bottom: BOX_INSET,
          left: BOX_INSET,
          right: BOX_INSET,
          height: 2,
          background: BOX_COLOR,
          transformOrigin: "right center",
          transform: "scaleX(0)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
      <div
        ref={boxLeftRef}
        style={{
          position: "absolute",
          top: MARQUEE_H + BOX_INSET,
          left: BOX_INSET,
          bottom: BOX_INSET,
          width: 2,
          background: BOX_COLOR,
          transformOrigin: "bottom center",
          transform: "scaleY(0)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Dashed square markers */}
      {squares.map((pos, i) => (
        <div
          key={i}
          ref={(el) => {
            squareRefs.current[i] = el;
          }}
          style={{
            ...SQUARE_STYLE,
            ...pos,
            opacity: 0,
            transform: "scale(0.8)",
          }}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, {
              scale: 1.3,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, {
              scale: 1,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            })
          }
        />
      ))}

      {/* Sticky placeholder */}
      <div style={{ flexShrink: 0, height: MARQUEE_H }} />

      {/* Content area — everything below sticky bar */}
      <div
        style={{
          height: CONTENT_H,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          paddingLeft: BOX_INSET,
          paddingRight: BOX_INSET,
          paddingBottom: BOX_INSET,
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title zone — explicit height, no flex growth */}
        <div
          style={{
            flexShrink: 0,
            height: TITLE_H,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "3rem 5vw 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* + 아이콘 4개 — 우측 상단 */}
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "0.75rem",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <svg
                key={i}
                ref={(el) => {
                  plusRefs.current[i] = el;
                }}
                width="68"
                height="68"
                viewBox="0 0 68 68"
                style={{ opacity: 0, overflow: "visible" }}
              >
                <line
                  x1="0"
                  y1="34"
                  x2="68"
                  y2="34"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="34"
                  y1="0"
                  x2="34"
                  y2="68"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ))}
          </div>

          <p
            ref={indexRef}
            style={{
              ...TEXT_HIDDEN,
              fontFamily: "var(--font-inter)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.25em",
              color: "rgba(0,0,0,0.5)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: "0.6em",
              position: "relative",
              zIndex: 1,
            }}
          >
            PROJECT // {project.index}
          </p>

          <h2
            ref={titleRef}
            style={{
              ...TEXT_HIDDEN,
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "#ea5d2a",
              textShadow: `
  0.9px 0.9px 0 #000,
  -0.9px 0.9px 0 #000,
  0.9px -0.9px 0 #000,
  -0.9px -0.9px 0 #000
`,
              margin: 0,
              marginBottom: "0.4em",
              position: "relative",
              zIndex: 1,
            }}
          >
            {project.title}
          </h2>

          <p
            ref={subRef}
            style={{
              ...TEXT_HIDDEN,
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(10px, 1vw, 13px)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: "rgba(0,0,0,0.55)",
              textTransform: "uppercase",
              margin: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {project.subtitle}
          </p>
        </div>

        {/* H divider */}
        <div
          ref={hDivRef}
          style={{
            ...LINE_STYLE,
            height: 2,
            transformOrigin: "left center",
            transform: "scaleX(0)",
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Bottom zone — flex:1 absorbs the 1px rounding surplus from the divider */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
            willChange: "transform",
          }}
        >
          {/* Stack col — 22% */}
          <div
            style={{
              flexShrink: 0,
              width: "22%",
              overflow: "hidden",
              padding: "1.8rem 2.5vw",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            <p
              ref={stackLblRef}
              style={{
                ...TEXT_HIDDEN,
                fontFamily: "var(--font-inter)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "rgba(0,0,0,0.45)",
                textTransform: "uppercase",
                margin: 0,
                marginBottom: "0.5rem",
              }}
            >
              STACK //
            </p>
            <div
              ref={tagsRef}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.4rem",
                alignItems: "start",
              }}
            >
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    ...TEXT_HIDDEN,
                    background: "#000000",
                    borderRadius: "999px",
                    border: "none",
                    padding: "5px 12px",
                    fontFamily: "var(--font-inter)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    color: "#f7eddc",
                    textTransform: "uppercase",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* V divider 1 */}
          <div
            ref={vDiv1Ref}
            style={{
              ...LINE_STYLE,
              flexShrink: 0,
              width: 2,
              transformOrigin: "top center",
              transform: "scaleY(0)",
            }}
          />

          {/* Links col — 20% */}
          <div
            style={{
              flexShrink: 0,
              width: "20%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <a
              ref={link1Ref}
              href={hasGH ? project.github : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="pn-link-row"
              style={{
                ...TEXT_HIDDEN,
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.5vw",
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: hasGH ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.25)",
                cursor: hasGH ? "pointer" : "default",
              }}
            >
              <span>GITHUB</span>
              {hasGH && <span style={{ fontSize: 14 }}>↗</span>}
            </a>

            <div
              ref={hLink1Ref}
              style={{
                ...LINE_STYLE,
                flexShrink: 0,
                height: 2,
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />

            <a
              ref={link2Ref}
              href={hasLive ? project.live : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="pn-link-row"
              style={{
                ...TEXT_HIDDEN,
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.5vw",
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: hasLive ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.25)",
                cursor: hasLive ? "pointer" : "default",
              }}
            >
              <span>LIVE SITE</span>
              {hasLive && <span style={{ fontSize: 14 }}>↗</span>}
            </a>

            <div
              ref={hLink2Ref}
              style={{
                ...LINE_STYLE,
                flexShrink: 0,
                height: 2,
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />

            <a
              ref={link3Ref}
              href={hasDemo ? project.demo : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="pn-link-row"
              style={{
                ...TEXT_HIDDEN,
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.5vw",
                fontFamily: "var(--font-inter)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: hasDemo ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.25)",
                cursor: hasDemo ? "pointer" : "default",
              }}
            >
              <span>{hasDemo ? "DEMO VIDEO" : "DEMO VIDEO (COMING SOON)"}</span>
              {hasDemo && <span style={{ fontSize: 14 }}>↗</span>}
            </a>
          </div>

          {/* V divider 2 */}
          <div
            ref={vDiv2Ref}
            style={{
              ...LINE_STYLE,
              flexShrink: 0,
              width: 2,
              transformOrigin: "top center",
              transform: "scaleY(0)",
            }}
          />

          {/* Video col — takes remaining width */}
          <div
            ref={videoRef}
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              position: "relative",
              ...TEXT_HIDDEN,
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "1.2rem",
                left: "1.5vw",
                zIndex: 2,
                fontFamily: "var(--font-inter)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "#d6d6d6",
                textTransform: "uppercase",
                margin: 0,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(4px)",
                padding: "4px 10px",
                borderRadius: 2,
              }}
            >
              PREVIEW //
            </p>
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Type row — fixed height, always at bottom */}
        <div
          style={{
            flexShrink: 0,
            height: TYPE_ROW_H,
            borderTop: "1px solid rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            padding: "0 5vw",
            position: "relative",
            zIndex: 2,
            overflow: "hidden",
          }}
        >
          <p
            ref={typeRef}
            style={{
              ...TEXT_HIDDEN,
              fontFamily: "var(--font-inter)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "rgba(0,0,0,0.6)",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {project.type}
          </p>
        </div>
      </div>
      {/* /content area */}

      <style>{`
        .pn-link-row:hover { background: rgba(0,0,0,0.9) !important; color: #f7eddc !important; }
        .pn-link-row:hover span { color: #f7eddc !important; }
      `}</style>
    </div>
  );
}

function buildCardInTl(refs: CardRef, fast: boolean): gsap.core.Timeline {
  const {
    boxTopEl,
    boxRightEl,
    boxBottomEl,
    boxLeftEl,
    hDivEl,
    vDiv1El,
    vDiv2El,
    hLink1El,
    hLink2El,
    indexEl,
    titleEl,
    subEl,
    typeEl,
    stackLabel,
    tagEls,
    link1El,
    link2El,
    link3El,
    videoEl,
    squareEls,
    plusEls,
  } = refs;

  const d = fast ? 0.5 : 1;

  gsap.set([boxTopEl, boxBottomEl].filter(Boolean), { scaleX: 0 });
  gsap.set([boxRightEl, boxLeftEl, vDiv1El, vDiv2El].filter(Boolean), {
    scaleY: 0,
  });
  gsap.set([hDivEl, hLink1El, hLink2El].filter(Boolean), { scaleX: 0 });
  if (squareEls.length)
    gsap.set(squareEls, { opacity: 0, scale: 0.8, rotation: 0 });
  if (plusEls.length) {
    gsap.set(plusEls, { opacity: 0, rotation: 0 });
    plusEls.forEach((el) => {
      gsap.set(el.querySelectorAll("line"), { strokeDasharray: "none" });
    });
  }
  gsap.set(
    [
      indexEl,
      titleEl,
      subEl,
      typeEl,
      stackLabel,
      ...tagEls,
      link1El,
      link2El,
      link3El,
      videoEl,
    ].filter(Boolean),
    { opacity: 0, x: 0, y: 0 },
  );

  const tl = gsap.timeline();

  tl.addLabel("phase1")
    .to(boxTopEl, { scaleX: 1, duration: 0.14 * d, ease: "none" })
    .to(boxRightEl, { scaleY: 1, duration: 0.11 * d, ease: "none" })
    .to(boxBottomEl, { scaleX: 1, duration: 0.14 * d, ease: "none" })
    .to(boxLeftEl, { scaleY: 1, duration: 0.11 * d, ease: "none" })
    .to(
      hDivEl,
      { scaleX: 1, duration: 0.3 * d, ease: "power2.out" },
      `phase1+=${0.38 * d}`,
    )
    .to(
      [vDiv1El, vDiv2El],
      { scaleY: 1, duration: 0.25 * d, stagger: 0.1 * d, ease: "power2.out" },
      `phase1+=${0.5 * d}`,
    )
    .to(
      [hLink1El, hLink2El],
      { scaleX: 1, duration: 0.2 * d, stagger: 0.08 * d, ease: "power2.out" },
      `phase1+=${0.6 * d}`,
    );

  // + 아이콘 4개 — 선이 다 그려진 뒤 왼쪽부터 하나씩 빠르게 등장
  if (plusEls.length)
    tl.to(plusEls, {
      opacity: 0.5,
      duration: 0.08 * d,
      stagger: 0.06 * d,
      ease: "none",
    });

  tl.addLabel("phase2");

  // ── Phase 2: 텍스트 순차 등장 ─────────────────────────────────────────────
  // 각 요소가 이전 요소 등장 완료 후 순서대로 나타남
  if (indexEl)
    tl.fromTo(
      indexEl,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
      "phase2",
    );

  if (titleEl)
    tl.fromTo(
      titleEl,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      `phase2+=${0.12 * d}`,
    );

  if (subEl)
    tl.fromTo(
      subEl,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
      `phase2+=${0.38 * d}`,
    );

  if (stackLabel)
    tl.fromTo(
      stackLabel,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" },
      `phase2+=${0.55 * d}`,
    );

  if (tagEls.length)
    tl.fromTo(
      tagEls,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.18, stagger: 0.05, ease: "power2.out" },
      `phase2+=${0.65 * d}`,
    );

  const links = [link1El, link2El, link3El].filter(Boolean);
  if (links.length)
    tl.fromTo(
      links,
      { opacity: 0 },
      { opacity: 1, duration: 0.18, stagger: 0.08, ease: "power2.out" },
      `phase2+=${0.75 * d}`,
    );

  if (videoEl)
    tl.fromTo(
      videoEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" },
      `phase2+=${0.85 * d}`,
    );

  if (squareEls.length)
    tl.fromTo(
      squareEls,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.06,
        ease: "back.out(1.4)",
      },
      `phase2+=${0.9 * d}`,
    );

  if (typeEl)
    tl.fromTo(
      typeEl,
      { opacity: 0 },
      { opacity: 0.6, duration: 0.2, ease: "power2.out" },
      `phase2+=${1.05 * d}`,
    );

  return tl;
}

function startSquareRotation(squareEls: HTMLElement[]): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1 });
  squareEls.forEach((el, i) => {
    tl.to(
      el,
      { rotation: "+=720", duration: 0.6, ease: "power2.inOut" },
      i * 0.4,
    ).to({}, { duration: 1.4 });
  });
  return tl;
}

function startPlusAnimation(plusEls: SVGSVGElement[]): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1 });

  plusEls.forEach((el, i) => {
    const lines = el.querySelectorAll("line");
    const startTime = i * 1.6;

    tl.to(
      lines,
      { strokeDasharray: "4 4", duration: 0.2, ease: "none" },
      startTime,
    );

    tl.to(
      el,
      {
        rotation: 360,
        duration: 0.6,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
      },
      startTime + 0.5,
    );

    tl.to(
      lines,
      { strokeDasharray: "none", duration: 0.2, ease: "none" },
      startTime + 1.1,
    );

    tl.set(el, { rotation: 0 }, startTime + 1.3);
  });

  return tl;
}

export default function ProjectsNew() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefsMap = useRef<Map<number, CardRef>>(new Map());
  const activeTlRef = useRef<gsap.core.Timeline | null>(null);
  const squareRotationTlRef = useRef<gsap.core.Timeline | null>(null);
  const plusRotationTlRef = useRef<gsap.core.Timeline | null>(null);
  const currentIdxRef = useRef(-1);
  const isAnimatingRef = useRef(false);
  const isPinnedRef = useRef(false);

  const runCardIn = useCallback((idx: number, fast: boolean) => {
    const refs = cardRefsMap.current.get(idx);
    if (!refs) return;
    activeTlRef.current?.kill();
    squareRotationTlRef.current?.kill();
    squareRotationTlRef.current = null;
    plusRotationTlRef.current?.kill();
    plusRotationTlRef.current = null;
    activeTlRef.current = buildCardInTl(refs, fast);
    activeTlRef.current.eventCallback("onComplete", () => {
      if (refs.squareEls.length) {
        squareRotationTlRef.current = startSquareRotation(refs.squareEls);
      }
      if (refs.plusEls.length) {
        plusRotationTlRef.current = startPlusAnimation(refs.plusEls);
      }
    });
  }, []);

  const runCardOut = useCallback((idx: number) => {
    squareRotationTlRef.current?.kill();
    squareRotationTlRef.current = null;
    plusRotationTlRef.current?.kill();
    plusRotationTlRef.current = null;
    const refs = cardRefsMap.current.get(idx);
    if (!refs) return;
    const {
      indexEl,
      titleEl,
      subEl,
      typeEl,
      stackLabel,
      tagEls,
      link1El,
      link2El,
      link3El,
      videoEl,
      squareEls,
    } = refs;
    if (squareEls.length)
      gsap.to(squareEls, { opacity: 0, duration: 0.15, overwrite: true });
    const all = [
      indexEl,
      titleEl,
      subEl,
      typeEl,
      stackLabel,
      ...tagEls,
      link1El,
      link2El,
      link3El,
      videoEl,
    ].filter(Boolean);
    gsap.to(all, {
      opacity: 0,
      x: -20,
      duration: 0.22,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => gsap.set(all, { x: 0 }),
    });
  }, []);

  const goToCard = useCallback(
    (nextIdx: number) => {
      if (isAnimatingRef.current) return;
      if (nextIdx < 0 || nextIdx >= projects.length) return;

      const prevIdx = currentIdxRef.current;
      isAnimatingRef.current = true;
      currentIdxRef.current = nextIdx;

      // 이전 카드 퇴장
      if (prevIdx >= 0 && prevIdx !== nextIdx) {
        runCardOut(prevIdx);
      }

      // 트랙 이동 — 무게감 있는 탄력 전환
      const targetX = -nextIdx * window.innerWidth;
      gsap.to(trackRef.current, {
        x: targetX,
        duration: 0.75,
        ease: "power3.out",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      // 새 카드 콘텐츠 등장 (이동과 동시에 시작, 선→텍스트 순차 등장 유지)
      const delay = prevIdx === -1 ? 0 : 0.15; // 첫 진입은 딜레이 없이
      gsap.delayedCall(delay, () => {
        runCardIn(nextIdx, prevIdx >= 0); // prevIdx >= 0이면 fast 모드
      });
    },
    [runCardIn, runCardOut],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "projects-pin",
        trigger: section,
        start: "top top",
        end: `+=${projects.length * window.innerHeight}`, // 충분한 pin 공간 (실제 전환은 휠 이벤트로 제어)
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onEnter() {
          isPinnedRef.current = true;
          if (currentIdxRef.current === -1) {
            goToCard(0);
          }
        },
        onEnterBack() {
          isPinnedRef.current = true;
        },
        onLeave() {
          isPinnedRef.current = false;
        },
        onLeaveBack() {
          isPinnedRef.current = false;
          // 섹션 위로 나가면 초기화
          if (currentIdxRef.current >= 0) {
            runCardOut(currentIdxRef.current);
          }
          currentIdxRef.current = -1;
          gsap.set(trackRef.current, { x: 0 });
        },
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [goToCard, runCardOut]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let wheelDelta = 0;
    const WHEEL_THRESHOLD = 50; // 이 이상 휠 누적 시 카드 전환

    const onWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) return;

      e.preventDefault(); // 기본 스크롤 방지

      if (isAnimatingRef.current) return; // 전환 중 입력 무시 (lockout)

      wheelDelta += e.deltaY;

      if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) return;

      const direction = wheelDelta > 0 ? 1 : -1;
      wheelDelta = 0; // 리셋

      const nextIdx = currentIdxRef.current + direction;
      const pinTrigger = ScrollTrigger.getById("projects-pin");

      if (nextIdx >= projects.length) {
        // 마지막 카드에서 아래로 → 섹션 퇴장 (pin 해제)
        isPinnedRef.current = false;
        if (pinTrigger) pinTrigger.scroll(pinTrigger.end + 1);
        return;
      }

      if (nextIdx < 0) {
        // 첫 카드에서 위로 → 섹션 위로 퇴장
        isPinnedRef.current = false;
        if (pinTrigger) pinTrigger.scroll(pinTrigger.start - 1);
        return;
      }

      goToCard(nextIdx);
    };

    // passive: false 필수 (preventDefault 사용하려면)
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goToCard]);

  const setCardRef = useCallback(
    (idx: number) => (refs: CardRef) => {
      cardRefsMap.current.set(idx, refs);
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: `${projects.length * 100}vw`,
          willChange: "transform",
          position: "relative",
          zIndex: 2,
        }}
      >
        {projects.map((p, i) => (
          <Card key={p.index} project={p} index={i} onRef={setCardRef(i)} />
        ))}
      </div>
    </section>
  );
}
