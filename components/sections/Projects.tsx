import ScrollFloat from "@/components/ui/ScrollFloat";

export default function Projects() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-6 text-text-primary">
      {/* font-family는 상속으로 전달 — ScrollFloat 내부 span까지 도달 */}
      <div style={{ fontFamily: "'KblJumpExtended', sans-serif" }}>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom"
          scrollEnd="center center"
          stagger={0.03}
          containerClassName="!font-normal"
          textClassName="tracking-tighter !text-[clamp(3rem,7vw,7rem)] !leading-none"
        >
          SELECTED WORKS
        </ScrollFloat>
      </div>
    </section>
  );
}
