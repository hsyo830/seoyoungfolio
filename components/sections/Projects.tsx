import ScrollFloat from "@/components/ui/ScrollFloat";

export default function Projects() {
  return (
    <section className="w-full py-32 px-6 text-text-primary">
      <div className="max-w-screen-xl mx-auto">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
          textClassName="font-title font-bold tracking-tighter !text-[clamp(3rem,7vw,7rem)] !leading-none"
        >
          SELECTED WORKS
        </ScrollFloat>
      </div>
    </section>
  );
}
