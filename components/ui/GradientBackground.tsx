"use client";

const KEYFRAMES = `
  @keyframes aurora-1 {
    0%   { transform: translate(0%,  0%)   scale(1.0); }
    30%  { transform: translate(6%, -10%)  scale(1.12); }
    60%  { transform: translate(-8%, 6%)   scale(0.94); }
    100% { transform: translate(0%,  0%)   scale(1.0); }
  }
  @keyframes aurora-2 {
    0%   { transform: translate(0%,  0%)   scale(1.05); }
    25%  { transform: translate(-7%, 9%)   scale(0.92); }
    70%  { transform: translate(9%, -6%)   scale(1.1); }
    100% { transform: translate(0%,  0%)   scale(1.05); }
  }
  @keyframes aurora-3 {
    0%   { transform: translate(0%,  0%)   scale(0.95); }
    40%  { transform: translate(-5%, -9%)  scale(1.08); }
    80%  { transform: translate(7%,  4%)   scale(0.9); }
    100% { transform: translate(0%,  0%)   scale(0.95); }
  }
  @keyframes aurora-4 {
    0%   { transform: translate(0%,  0%)   scale(1.0); }
    50%  { transform: translate(10%, 8%)   scale(1.15); }
    100% { transform: translate(0%,  0%)   scale(1.0); }
  }
  @keyframes aurora-5 {
    0%   { transform: translate(0%,  0%)   scale(1.1); }
    35%  { transform: translate(-9%, 5%)   scale(0.9); }
    75%  { transform: translate(5%, -10%)  scale(1.05); }
    100% { transform: translate(0%,  0%)   scale(1.1); }
  }
`;

const blobs = [
  {
    style: {
      top: "-20%",
      left: "-15%",
      width: "80vmax",
      height: "80vmax",
      background: "radial-gradient(circle at 40% 40%, #aecbeb 0%, transparent 68%)",
      filter: "blur(64px)",
      opacity: 0.95,
      animation: "aurora-1 22s ease-in-out infinite",
    },
  },
  {
    style: {
      top: "0%",
      right: "-20%",
      width: "85vmax",
      height: "85vmax",
      background: "radial-gradient(circle at 55% 45%, #83b0e1 0%, transparent 68%)",
      filter: "blur(72px)",
      opacity: 0.88,
      animation: "aurora-2 28s ease-in-out infinite",
    },
  },
  {
    style: {
      bottom: "-25%",
      left: "10%",
      width: "90vmax",
      height: "90vmax",
      background: "radial-gradient(circle at 50% 60%, #71a5de 0%, transparent 68%)",
      filter: "blur(80px)",
      opacity: 0.82,
      animation: "aurora-3 32s ease-in-out infinite",
    },
  },
  {
    style: {
      top: "-15%",
      right: "5%",
      width: "55vmax",
      height: "55vmax",
      background: "radial-gradient(circle at 45% 45%, #aecbeb 0%, transparent 70%)",
      filter: "blur(56px)",
      opacity: 0.78,
      animation: "aurora-4 24s ease-in-out infinite",
    },
  },
  {
    style: {
      bottom: "0%",
      left: "-10%",
      width: "65vmax",
      height: "65vmax",
      background: "radial-gradient(circle at 50% 55%, #83b0e1 0%, transparent 70%)",
      filter: "blur(68px)",
      opacity: 0.75,
      animation: "aurora-5 26s ease-in-out infinite",
    },
  },
];

export default function GradientBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#d6e8f5" }}
      aria-hidden="true"
    >
      <style>{KEYFRAMES}</style>

      {/* SVG displacement filter — makes blob edges melt into each other */}
      <svg
        className="absolute"
        style={{ width: 0, height: 0, position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="aurora-liquid" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004 0.006"
              numOctaves="2"
              seed="8"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.004 0.006; 0.007 0.004; 0.004 0.006"
                dur="35s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Blob layer with liquid displacement applied */}
      <div
        className="absolute inset-0"
        style={{ filter: "url(#aurora-liquid)" }}
      >
        {blobs.map((blob, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              willChange: "transform",
              ...blob.style,
            }}
          />
        ))}
      </div>
    </div>
  );
}
