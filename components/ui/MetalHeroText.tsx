'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const LERP = 0.11;         // 낮을수록 무겁게 따라옴
const TRAIL_LEN = 14;      // 잔상 개수
const BASE_RX = 100;       // 정지 시 가로 반경(px)
const BASE_RY = 62;        // 세로 반경(px) — 항상 고정
const MAX_RX = 260;        // 최대 가로 반경
const VEL_SCALE = 7;       // 속도 → 가로 늘림 비율
const BLUR = 36;           // SVG feGaussianBlur stdDeviation

type Trail = { x: number; y: number; angle: number; rx: number };

export default function MetalHeroText() {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const metalH1Ref    = useRef<HTMLHeadingElement>(null);
  const baseH1Ref     = useRef<HTMLHeadingElement>(null);
  const videoRafRef   = useRef<number>(0);
  const maskRafRef    = useRef<number>(0);
  const divLeftRef    = useRef<HTMLSpanElement>(null);
  const divLineRef    = useRef<HTMLDivElement>(null);
  const divRightRef   = useRef<HTMLSpanElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  const mouseRef    = useRef({ x: 0, y: 0, active: false });
  const lerpRef     = useRef({ x: 0, y: 0 });
  const prevLerpRef = useRef({ x: 0, y: 0 });
  const trailRef    = useRef<Trail[]>([]);
  const angleRef    = useRef(0);
  const opacityRef  = useRef(0);
  const elSizeRef   = useRef({ w: 0, h: 0 });

  // ── 등장 애니메이션 ───────────────────────────────────────────────────────
  useEffect(() => {
    const chars = baseH1Ref.current?.querySelectorAll<HTMLElement>('.metal-char');
    if (!chars?.length) return;
    gsap.fromTo(
      chars,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power3.out', delay: 0 }
    );

    // 17 chars * 0.04 stagger + 0.6 duration = ~1.3s 완료 후 divider/accent 등장
    const heroEnd = 1.3;

    gsap.timeline({ delay: heroEnd })
      .fromTo(divLeftRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(divLineRef.current,  { width: "0%" }, { width: "100%", duration: 0.8, ease: "power2.out" })
      .fromTo(divRightRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.1");

    gsap.fromTo(
      accentLineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power3.out", transformOrigin: "right center", delay: heroEnd + 0.3 }
    );
  }, []);

  // ── video → background-image ──────────────────────────────────────────────
  useEffect(() => {
    const video   = videoRef.current;
    const metalH1 = metalH1Ref.current;
    if (!video || !metalH1) return;

    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d')!;
    let lastTs   = 0;

    const tick = (ts: number) => {
      videoRafRef.current = requestAnimationFrame(tick);
      if (video.readyState < 2 || ts - lastTs < 40) return;
      lastTs = ts;
      const w = video.videoWidth  || 320;
      const h = video.videoHeight || 180;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      ctx.drawImage(video, 0, 0, w, h);
      metalH1.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg', 0.85)})`;
    };

    videoRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(videoRafRef.current);
  }, []);

  // ── SVG 마스크 애니메이션 루프 ────────────────────────────────────────────
  useEffect(() => {
    const el = metalH1Ref.current;
    if (!el) return;

    const cacheSize = () => {
      const r = el.getBoundingClientRect();
      elSizeRef.current = { w: r.width, h: r.height };
    };
    cacheSize();
    window.addEventListener('resize', cacheSize);

    const animate = () => {
      maskRafRef.current = requestAnimationFrame(animate);
      const { active } = mouseRef.current;

      // 부드러운 opacity 페이드인/아웃
      if (active) {
        opacityRef.current = Math.min(1, opacityRef.current + 0.06);
      } else {
        opacityRef.current = Math.max(0, opacityRef.current - 0.025);
      }

      el.style.opacity = opacityRef.current.toFixed(3);
      if (opacityRef.current <= 0) return;

      // lerp 위치 업데이트
      const { x: mx, y: my } = mouseRef.current;
      const lerp = lerpRef.current;
      const prev = prevLerpRef.current;
      prev.x = lerp.x;
      prev.y = lerp.y;
      if (active) {
        lerp.x += (mx - lerp.x) * LERP;
        lerp.y += (my - lerp.y) * LERP;
      }

      // 속도 → 방향 각도 & 타원 rx 계산
      const vx    = lerp.x - prev.x;
      const vy    = lerp.y - prev.y;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 0.3) angleRef.current = Math.atan2(vy, vx) * (180 / Math.PI);

      const rx = BASE_RX + Math.min(speed * VEL_SCALE, MAX_RX - BASE_RX);

      // 트레일에 현재 위치 추가
      const trail = trailRef.current;
      trail.push({ x: lerp.x, y: lerp.y, angle: angleRef.current, rx });
      if (trail.length > TRAIL_LEN) trail.shift();

      const { w, h } = elSizeRef.current;
      if (!w || !h) return;

      // SVG: 잔상 타원들을 Gaussian blur로 통째로 뭉개기 → 액체 번짐 느낌
      let ellipses = '';
      const len = trail.length;
      for (let i = 0; i < len; i++) {
        const { x, y, angle, rx: trx } = trail[i];
        const t = (i + 1) / len;
        const opacity = (t * t).toFixed(2); // 오래된 잔상일수록 연하게
        ellipses +=
          `<ellipse` +
          ` cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"` +
          ` rx="${trx.toFixed(1)}" ry="${BASE_RY}"` +
          ` transform="rotate(${angle.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"` +
          ` fill="white" opacity="${opacity}"/>`;
      }

      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
        `<defs><filter id="f" x="-60%" y="-60%" width="220%" height="220%">` +
        `<feGaussianBlur stdDeviation="${BLUR}"/></filter></defs>` +
        `<g filter="url(#f)">${ellipses}</g></svg>`;

      const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      el.style.setProperty('mask-image', url);
      el.style.setProperty('-webkit-mask-image', url);
    };

    maskRafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(maskRafRef.current);
      window.removeEventListener('resize', cacheSize);
    };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;

    // 처음 진입 시 lerp를 마우스 위치로 스냅 (원점에서 lerp 튀는 현상 방지)
    if (!mouseRef.current.active) {
      lerpRef.current     = { x, y };
      prevLerpRef.current = { x, y };
      trailRef.current    = [];
    }

    mouseRef.current = { x, y, active: true };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  const sharedH1: React.CSSProperties = { fontSize: 'inherit', fontWeight: 400, margin: 0, padding: 0, backgroundColor: 'transparent', fontFamily: "var(--font-anton)", textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '0.87' };

  return (
    <div
      className="relative leading-none tracking-tighter"
      style={{ fontSize: 'clamp(1.9rem, 6.5vw, 5.2rem)', fontFamily: "'KblJumpExtended', sans-serif", backgroundColor: 'transparent' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Element 2: divider — FRONTEND 텍스트 바로 위 */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span
          ref={divLeftRef}
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.55)",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-space-grotesk)",
            opacity: 0,
            flexShrink: 0,
          }}
        >
          Where Aesthetics
        </span>
        <div style={{ flex: 1, height: "1px", overflow: "hidden" }}>
          <div
            ref={divLineRef}
            style={{ height: "100%", width: "0%", background: "rgba(255,255,255,0.4)" }}
          />
        </div>
        <span
          ref={divRightRef}
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.55)",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-space-grotesk)",
            opacity: 0,
            flexShrink: 0,
          }}
        >
          Meet Engineering
        </span>
      </div>

      {/* Element 3: accent line — DEVELOPER 텍스트 하단 우측 */}
      <div
        ref={accentLineRef}
        style={{
          position: "absolute",
          bottom: "-10px",
          right: 0,
          width: "45%",
          height: "6px",
          background: "rgba(255,255,255,0.4)",
          transform: "scaleX(0)",
          transformOrigin: "right center",
        }}
      />

      {/* Safari drawImage 호환: display:none 대신 1px 숨김 */}
      <video
        ref={videoRef}
        src="/videos/metal-texture.mp4"
        autoPlay loop muted playsInline
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', backgroundColor: 'transparent' }}
      />

      {/* 아래 레이어: 글래스/엠보 텍스트 */}
      <h1
        ref={baseH1Ref}
        style={
          {
            ...sharedH1,
            color: '#F8F8F8',
            textShadow: [
              '0 1px 0 rgba(255,255,255,0.9)',
              '0 -1px 1px rgba(0,0,0,0.15)',
              '0 2px 2px rgba(0,0,0,0.08)',
              '0 4px 6px rgba(0,0,0,0.10)',
            ].join(', '),
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.12))',
          } as React.CSSProperties
        }
      >
        {'FRONTEND DEVELOPER'.split('').map((char, i) => (
          <span key={i} className="metal-char" style={{ display: 'inline-block', opacity: 0 }}>{char}</span>
        ))}
      </h1>

      {/* 위 레이어: 메탈 텍스트 + SVG 잔상 마스크 */}
      <h1
        ref={metalH1Ref}
        aria-hidden="true"
        style={
          {
            ...sharedH1,
            position: 'absolute',
            inset: 0,
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
          } as React.CSSProperties
        }
      >
        FRONTEND DEVELOPER
      </h1>
    </div>
  );
}
