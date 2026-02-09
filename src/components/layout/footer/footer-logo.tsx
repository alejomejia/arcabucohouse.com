"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type RefObject } from "react";

import { Logo } from "@/components/ui/logo";

type FooterLogoProps = {
  footerRef: RefObject<HTMLDivElement | null>;
};

export function FooterLogo({ footerRef }: FooterLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!footerRef.current || !containerRef.current) return;

    gsap.fromTo(
      "svg path",
      { yPercent: 100 },
      {
        yPercent: 0,
        stagger: 0.05,
        ease: "gentleSlow",
        scrollTrigger: {
          trigger: "#main",
          start: () => `bottom-=${window.innerHeight}px bottom`,
          end: () => `bottom-=${window.innerHeight}px top`,
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="origin-bottom translate-y-1 md:translate-y-5">
      <Logo className="w-full" />
    </div>
  );
}
