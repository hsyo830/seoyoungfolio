import Grainient from "@/components/ui/Grainient";
import MetalHeroText from "@/components/ui/MetalHeroText";
import HeroAnimText from "@/components/ui/HeroAnimText";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import ProjectsIntro from "@/components/sections/ProjectsIntro";
import Projects from "@/components/sections/Projects";
import CharcoalLayout from "@/components/sections/CharcoalLayout";

export default function Home() {
  return (
    <>
      {/* Fixed grainy gradient background */}
      <div className="fixed inset-0 -z-10">
        <Grainient
          color1="#8C8B88"
          color2="#71716F"
          color3="#6E6D6D"
        />
      </div>

      {/* Hero */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center select-none" style={{ zIndex: 10 }}>
        <MetalHeroText />

        <HeroAnimText />

        <ScrollIndicator />
      </main>

      <ProjectsIntro />
      <Projects />
      <CharcoalLayout />
    </>
  );
}
