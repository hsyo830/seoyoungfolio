import Grainient from "@/components/ui/Grainient";
import MetalHeroText from "@/components/ui/MetalHeroText";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import Projects from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      {/* Fixed grainy gradient background */}
      <div className="fixed inset-0 -z-10">
        <Grainient
          color1="#b3b3b3"
          color2="#ccc0ff"
          color3="#b497cf"
        />
      </div>

      {/* Hero */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center select-none">
        <MetalHeroText />

        <p
          className="mt-6 font-title font-medium tracking-widest uppercase text-text-secondary"
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.35em" }}
        >
          Seo Young
        </p>

        <p
          className="mt-4 font-body text-text-secondary"
          style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)" }}
        >
          Designing experiences, building interactions.
        </p>

        <ScrollIndicator />
      </main>

      <Projects />
    </>
  );
}
