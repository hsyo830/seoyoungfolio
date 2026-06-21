'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function MetalHeroText() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const metalH1Ref = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const metalH1 = metalH1Ref.current;
    if (!video || !metalH1) return;

    // canvas는 video 픽셀을 읽어 background-image URL 생성만 담당
    // 텍스트 형태 클리핑은 CSS background-clip: text이 처리 → 정렬 어긋남 없음
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    let lastTs = 0;

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (video.readyState < 2 || ts - lastTs < 40) return; // ~24fps
      lastTs = ts;

      const w = video.videoWidth || 320;
      const h = video.videoHeight || 180;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.drawImage(video, 0, 0, w, h);
      metalH1.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg', 0.85)})`;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = metalH1Ref.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const mask = `radial-gradient(circle 150px at ${x}px ${y}px, black, transparent)`;
    el.style.setProperty('mask-image', mask);
    el.style.setProperty('-webkit-mask-image', mask);
    el.style.opacity = '1';
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = metalH1Ref.current;
    if (!el) return;
    el.style.opacity = '0';
  }, []);

  const sharedH1: React.CSSProperties = {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    margin: 0,
  };

  return (
    <div
      className="relative font-hero leading-none tracking-tighter"
      style={{ fontSize: 'clamp(4rem, 14vw, 11rem)' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Safari에서 display:none 상태의 video는 drawImage 불가 → 1px 숨김 처리 */}
      <video
        ref={videoRef}
        src="/videos/metal-texture.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />

      {/* 아래 레이어: 흰색 텍스트 */}
      <h1 style={{ ...sharedH1, color: '#ffffff' }}>
        FRONTEND
        <br />
        DEVELOPER
      </h1>

      {/* 위 레이어: video 프레임을 background로, CSS background-clip: text로 글자 형태 클리핑 */}
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
        FRONTEND
        <br />
        DEVELOPER
      </h1>
    </div>
  );
}
