import type { ReactNode } from "react";

import { cn } from "@/lib/utils/helpers";

import { Footer } from "../footer";
import { NewsletterSection } from "../newsletter";

type WrapperVariant = "default" | "minimal";

type WrapperProps = {
  className?: string;
  children: ReactNode;
  /**
   * Controls which sections are included in the layout shell.
   *
   * - `"default"` — full layout with footer and newsletter section.
   * - `"minimal"` — footer only; newsletter section is omitted.
   *    Use for pages where the newsletter would be out of context (404, legal, error).
   *
   * @default "default"
   */
  variant?: WrapperVariant;
}

/**
 * Page wrapper providing the main content area and footer.
 * Header, preloader, and page transitions are handled by the root layout.
 *
 * @example
 * ```tsx
 * export default function Page() {
 *   return (
 *     <Wrapper>
 *       <section>My page content</section>
 *     </Wrapper>
 *   )
 * }
 * ```
 */
export function Wrapper({
  children,
  className,
  variant = "default",
}: WrapperProps) {
  return (
    <>
      <main
        id="main"
        className={cn(
          "relative z-10 flex grow flex-col bg-zinc-50",
          className
        )}
      >
        {children}
        {variant === "default" && <NewsletterSection />}
      </main>
      <Footer />
    </>
  );
}
