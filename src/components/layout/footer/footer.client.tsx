"use client";

import { useRef, type ReactNode } from "react";

import { Z_INDEX_CLASSNAMES } from "@/lib/styles/const";
import { cn } from "@/lib/utils/helpers";

import { FooterLogo } from "./footer-logo";
import { useFooterAnimation } from "./hooks/use-footer-animation";

type FooterClientProps = {
  children: ReactNode;
};

/** Client wrapper that owns DOM refs and drives the footer reveal animation. */
export function FooterClient({ children }: FooterClientProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  useFooterAnimation(footerRef, logoContainerRef);

  return (
    <footer
      ref={footerRef}
      className={cn(
        "overflow-hidden sticky bottom-0 left-0 right-0",
        Z_INDEX_CLASSNAMES.footer,
        "flex h-full min-h-screen flex-col bg-primary-base text-primary-100"
      )}
    >
      <div className="bg-primary-100 min-h-0 flex-1" aria-hidden />
      {children}
      <FooterLogo containerRef={logoContainerRef} />
    </footer>
  );
}
