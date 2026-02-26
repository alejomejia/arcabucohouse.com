"use client"

import gsap from "gsap";
import { useRef } from "react";

import { useCursor } from "@/components/effects/cursor/context";
import { Link } from "@/components/ui/link";
import { Logo } from "@/components/ui/logo";
import { MinimalLogo } from "@/components/ui/logo/minimal";
import { usePreloaderGSAP } from "@/components/ui/preloader/hooks/use-preloader-gsap";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";

const ANIMATION_CONFIG = {
  duration: 0.5,
  delay: 0.25,
  stagger: 0.05,
  ease: "gentleSlow",
} as const;

export function HeaderLogo() {
  const { isMobile } = useBreakpoint();
  const containerRef = useRef<HTMLAnchorElement>(null);
  const { setHover, setDefault } = useCursor()

  // Wait for preloader before animating logo
  usePreloaderGSAP(
    () => {
      if (!containerRef.current) return;

      return gsap.to("svg path", {
        y: 0,
        ...ANIMATION_CONFIG,
      });
    },
    { scope: containerRef, dependencies: [isMobile] }
  );

  const handleMouseEnter = () => {
    setHover()
  }

  const handleMouseLeave = () => {
    setDefault()
  }

  return (
    <Link
      ref={containerRef}
      className="max-w-8 md:max-w-60 overflow-hidden"
      href="/"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isMobile ? (
        <MinimalLogo className="block md:hidden w-full direct-children:translate-y-full" />
      ) : (
        <Logo className="hidden md:block w-full direct-children:translate-y-full" />
      )}
      <span className="visually-hidden">Homepage</span>
    </Link>
  );
}