'use client';

import { motion } from 'framer-motion';

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary select-none pointer-events-none"
      style={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
    >
      {/* 마우스 아이콘 — SVG 외곽 고정, 내부 스크롤 도트만 바운스 */}
      <div className="relative" style={{ width: 22, height: 34 }}>
        <svg
          width="22"
          height="34"
          viewBox="0 0 22 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <rect x="1.7" y="1.7" width="18.6" height="30.6" rx="9.3" />
        </svg>

        {/* 바운스 도트 */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-current"
          style={{ width: 3, height: 5, top: 8 }}
          animate={{ y: [0, 9, 0] }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <span
        className="font-title uppercase tracking-widest"
        style={{ fontSize: '0.52rem', letterSpacing: '0.32em' }}
      >
        scroll
      </span>
    </motion.div>
  );
}
