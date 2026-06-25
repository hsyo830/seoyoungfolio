"use client";

import { useRef } from "react";
import BlobReveal from "@/components/sections/BlobReveal";
import DashedGridOverlay, { type DashedGridOverlayHandle } from "@/components/ui/DashedGridOverlay";
import About from "@/components/sections/About";

export default function CharcoalLayout() {
  const gridRef     = useRef<DashedGridOverlayHandle>(null);
  const charcoalRef = useRef<HTMLElement>(null);
  const contactRef  = useRef<HTMLDivElement>(null);

  return (
    <>
      <BlobReveal gridRef={gridRef} />
      <DashedGridOverlay ref={gridRef} containerRef={charcoalRef} contactRef={contactRef} />
      <About sectionRef={charcoalRef} contactRef={contactRef} />
    </>
  );
}
