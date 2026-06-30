import Grainient from "@/components/ui/Grainient";
import MetalHeroText from "@/components/ui/MetalHeroText";
import HeroAnimText from "@/components/ui/HeroAnimText";
import HeroLines from "@/components/ui/HeroLines";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import ProjectsMarquee from "@/components/sections/ProjectsMarquee";
import ProjectsNew from "@/components/sections/ProjectsNew";
import CharcoalLayout from "@/components/sections/CharcoalLayout";

export default function Home() {
  return (
    <>
      {/* Fixed grainy gradient background */}
      <div className="fixed inset-0 -z-10">
        <Grainient color1="#e4825e" color2="#ea5d2a" color3="#c87455" />
      </div>

      {/* Beige slide-up overlay — hidden below viewport until Projects sticky triggers */}
      <div
        id="beige-overlay"
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#EFEDE7",
          transform: "translateY(100%)",
          willChange: "transform",
        }}
      />

      {/* Hero */}
      <main
        style={{ position: "relative", minHeight: "100vh", zIndex: 10 }}
        className="flex flex-col items-center justify-center px-6 text-center select-none"
      >
        <HeroLines />
        <div
          className="relative flex flex-col items-center"
          style={{ zIndex: 10 }}
        >
          <MetalHeroText />
          <HeroAnimText />
        </div>
        <ScrollIndicator />
      </main>

      <div>
        <ProjectsMarquee />
        <ProjectsNew />
      </div>
      <CharcoalLayout />
    </>
  );
}
