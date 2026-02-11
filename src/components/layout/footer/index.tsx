"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useRef } from "react";

import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/helpers";

import { FOOTER_COLUMN_HEADING_CLASSNAME, FOOTER_COLUMNS, START_YEAR } from "./const";
import { FooterLogo } from "./footer-logo";

const ANIMATION_CONFIG = {
  duration: 2,
  stagger: 0.25,
  ease: "gentleSlow",
} as const;

/** Delay between each column starting its animation */
const COLUMN_STAGGER = 0.25;

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const footerLogoRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();

  useGSAP(() => {
    if (!footerRef.current) return;

    const columns = gsap.utils.toArray<HTMLElement>("[data-footer-col]");
    const bottomBar = footerRef.current.querySelector("[data-footer-bottom]");

    // Master timeline with ScrollTrigger — column staggers are
    // positioned inside the timeline so scroll drives everything.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#main",
        start: () => `bottom-=${window.innerHeight / 2}px bottom`,
        end: () => `bottom-=${window.innerHeight / 2}px top`,
        invalidateOnRefresh: true,
      },
    });

    // Animate each column at a staggered position within the timeline
    columns.forEach((col, index) => {
      const split = GSAPSplitText.create(col.querySelectorAll("h4, p, a"), {
        type: "lines",
        mask: "lines",
      });

      if (split.lines.length === 0) return;

      gsap.set(split.lines, { yPercent: 100 });

      tl.to(
        split.lines,
        { yPercent: 0, ...ANIMATION_CONFIG },
        index * COLUMN_STAGGER
      );
    });

    // Bottom bar enters after all columns
    if (bottomBar) {
      const split = GSAPSplitText.create(bottomBar.querySelectorAll("span"), {
        type: "lines",
        mask: "lines",
      });

      if (split.lines.length > 0) {
        gsap.set(split.lines, { yPercent: 100 });

        tl.to(
          split.lines,
          { yPercent: 0, ...ANIMATION_CONFIG },
          columns.length * COLUMN_STAGGER
        );
      }
    }
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      className={cn(
        "overflow-hidden sticky bottom-0 left-0 right-0 z-0",
        "flex h-full min-h-screen flex-col bg-primary-base text-primary-100"
      )}>
      <div ref={footerLogoRef} className="bg-secondary-base min-h-0 flex-1" aria-hidden />
      <Container className="py-8 lg:py-16">
        <div className="grid grid-cols-12 gap-8 mb-12 lg:mb-24 font-serif">
          <div data-footer-col className="text-primary-200 col-span-12 md:col-span-6 lg:col-span-3 md:pr-8 lg:border-r border-primary-100/30">
            <h4 className={FOOTER_COLUMN_HEADING_CLASSNAME}>About</h4>
            <p>
              Arcabuco is a creative collective amplifying South American artistic voices.
              Inspired by architecture and interior design, we curate handcrafted objects
              that blend cultural heritage with contemporary form.
            </p>
          </div>
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <div key={title} data-footer-col className="text-primary-200 col-span-6 lg:col-span-3 md:pr-8 lg:border-r border-primary-100/30">
              <h4 className={FOOTER_COLUMN_HEADING_CLASSNAME}>{title}</h4>
              <ul className="group/list w-fit flex flex-col gap-3">
                {links.map(({ id, name, href }) => (
                  <UnderlineLink
                    key={id}
                    href={href}
                    className={cn(
                      "opacity-100 group-hover/list:opacity-50 hover:opacity-100",
                      "leading-none transition-opacity duration-300 ease-in-out"
                    )}
                  >
                    {name}
                  </UnderlineLink>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          data-footer-bottom
          className={cn(
            "flex flex-col md:flex-row md:justify-between md:items-center gap-4",
            "text-xs uppercase font-medium tracking-wider",
            "border-t border-primary-100/30 pt-8 md:pt-4"
          )}
        >
          <span>South American interior art and objects</span>
          <span>Copyright © {START_YEAR} - {currentYear} Arcabuco</span>
        </div>
      </Container>
      <FooterLogo footerRef={footerLogoRef} />
    </footer >
  );
}
