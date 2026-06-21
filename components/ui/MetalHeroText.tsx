'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function MetalHeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const h1 = h1Ref.current;
    if (!canvas || !video || !h1) return;

    // 초기 상태: 마우스 미진입 → 메탈 효과 완전히 숨김
    canvas.style.opacity = '0';

    let animId = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      if (video.readyState < 2) return;

      const w = h1.offsetWidth;
      const h = h1.offsetHeight;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext('2d')!;
      const computed = getComputedStyle(h1);
      const fontSize = parseFloat(computed.fontSize);

      ctx.clearRect(0, 0, w, h);

      ctx.font = `${computed.fontWeight} ${fontSize}px ${computed.fontFamily}`;
      try { ctx.letterSpacing = computed.letterSpacing; } catch (_) {}
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'black';

      // line-height: 1 → 각 줄 높이 = fontSize
      ctx.fillText('FRONTEND', w / 2, 0);
      ctx.fillText('DEVELOPER', w / 2, fontSize);

      // 텍스트 픽셀에만 비디오 클리핑
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(video, 0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gradient = `radial-gradient(circle 150px at ${x}px ${y}px, black 0%, transparent 100%)`;

    // CSS 변수 경유 없이 canvas 스타일 직접 업데이트
    canvas.style.opacity = '1';
    canvas.style.maskImage = gradient;
    canvas.style.webkitMaskImage = gradient;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = '0';
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 아래 레이어: 검정 텍스트 */}
      <h1
        ref={h1Ref}
        className="font-title font-bold leading-none tracking-tighter"
        style={{ fontSize: 'clamp(4rem, 14vw, 11rem)', color: '#ffffff' }}
      >
        FRONTEND
        <br />
        DEVELOPER
      </h1>

      {/* 숨겨진 비디오 소스 — display:none은 Safari에서 drawImage 불가 */}
      <video
        ref={videoRef}
        src="/videos/metal-texture.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
      />

      {/* 위 레이어: 메탈 캔버스 (mask는 이벤트 핸들러에서 직접 설정) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
