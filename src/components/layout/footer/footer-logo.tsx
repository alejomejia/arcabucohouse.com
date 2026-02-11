import type { RefObject } from "react";

import { Logo } from "@/components/ui/logo";

type FooterLogoProps = {
  containerRef: RefObject<HTMLDivElement | null>;
};

/** Presentational logo rendered at the bottom of the footer. Animation is driven by useFooterAnimation. */
export function FooterLogo({ containerRef }: FooterLogoProps) {
  return (
    <div ref={containerRef} className="origin-bottom translate-y-1 md:translate-y-5">
      <Logo className="w-full" />
    </div>
  );
}
