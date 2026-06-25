"use client";

import { useRef } from "react";
import DashedGridOverlay from "@/components/ui/DashedGridOverlay";
import About from "@/components/sections/About";

export default function CharcoalLayout() {
  const charcoalRef = useRef<HTMLElement>(null);
  const contactRef  = useRef<HTMLDivElement>(null);

  return (
    <>
      <DashedGridOverlay containerRef={charcoalRef} contactRef={contactRef} />
      <About sectionRef={charcoalRef} contactRef={contactRef} />
    </>
  );
}
