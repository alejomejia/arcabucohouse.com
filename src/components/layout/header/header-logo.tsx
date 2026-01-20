"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { Link } from "@/components/ui/link";
import { Logo } from "@/components/ui/logo";
import { MinimalLogo } from "@/components/ui/logo/minimal";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { orchestraNavigation } from "@/lib/orchestra";

export function HeaderLogo() {
  const { isMobile } = useBreakpoint();

  const containerRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.to("svg path", {
      y: 0,
      ...orchestraNavigation.logo,
    })

  }, { scope: containerRef, dependencies: [isMobile] })

  return (
    <Link ref={containerRef} className="max-w-8 md:max-w-60 overflow-hidden" href="/">
      {isMobile ? (
        <MinimalLogo className="w-full direct-children:translate-y-full" />
      ) : (
        <Logo className="w-full direct-children:translate-y-full" />
      )}
      <span className="visually-hidden">Homepage</span>
    </Link>
  )
}