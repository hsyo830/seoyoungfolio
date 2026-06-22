'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%&';

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}

export default function ScrambleText({
  text,
  className = '',
  style,
  duration = 500,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState('');
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const chars = Array.from(text);
    const len = chars.length;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const resolved = Math.floor(progress * len);

      setDisplay(
        chars.map((char, i) => {
          if (char === ' ' || char === '—' || i < resolved) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
}
