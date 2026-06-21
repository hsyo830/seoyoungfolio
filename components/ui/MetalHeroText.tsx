'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function MetalHeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const h1 = h1Ref.current;
    const container = containerRef.current;
    if (!canvas || !video || !h1 || !container) return;

    let raf: number;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (video.readyState < 2) return;

      // canvas 픽셀 크기 = container CSS 크기 (불일치 → 비트맵 스트레칭 방지)
      const w = container.offsetWidth;
      const h = container.offsetHeight;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext('2d')!;
      const cs = getComputedStyle(h1);
      const size = parseFloat(cs.fontSize);

      ctx.clearRect(0, 0, w, h);

      // 1단계: 텍스트 shape으로 마스크 픽셀 채우기 (background-clip: text 역할)
      ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
      try { ctx.letterSpacing = cs.letterSpacing; } catch (_) {}
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#000';

      // h1의 실제 위치(offsetLeft, offsetTop)를 기준으로 좌표 계산 → margin/padding 영향 제거
      const cx = h1.offsetLeft + h1.offsetWidth / 2;
      const cy = h1.offsetTop;
      ctx.fillText('FRONTEND', cx, cy);
      ctx.fillText('DEVELOPER', cx, cy + size);

      // 2단계: 텍스트 픽셀 안에만 비디오 합성
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(video, 0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { left, top } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // 3단계: 마우스 위치 기준 radial-gradient mask로 reveal
    const mask = `radial-gradient(circle 150px at ${x}px ${y}px, black, transparent)`;
    canvas.style.maskImage = mask;
    canvas.style.webkitMaskImage = mask;
    canvas.style.opacity = '1';
  }, []);

  const onMouseLeave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = '0';
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* 기본 레이어: 흰색 텍스트 */}
      <h1
        ref={h1Ref}
        className="font-title font-bold leading-none tracking-tighter"
        style={{ fontSize: 'clamp(4rem, 14vw, 11rem)', color: '#ffffff', margin: 0 }}
      >
        FRONTEND
        <br />
        DEVELOPER
      </h1>

      {/* display:none 대신 1px 처리 — Safari에서 display:none은 drawImage 불가 */}
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

      {/* 메탈 레이어: canvas로 텍스트 클리핑 + CSS mask로 radial reveal */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
