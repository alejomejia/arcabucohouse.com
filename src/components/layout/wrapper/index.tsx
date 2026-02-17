import type { ReactNode } from "react";

import { PageTransitionProvider } from "@/components/effects/page-transition-provider";
import { PreloaderProvider } from "@/components/ui/preloader/hooks/preloader-context";
import { PreloaderGate } from "@/components/ui/preloader/preloader-gate";
import { cn } from "@/lib/utils/helpers";

import { Footer } from "../footer";
import { Header } from "../header";

type WrapperProps = {
  className?: string;
  children: ReactNode;
}

/**
 * Main page wrapper component providing layout structure, 
 * could be used to extend with Theming or WebGL for instance.
 *
 * This component serves as the root container for pages, 
 * automatically handling layout structure. 
 * It includes header and footer.
 *
 * @param props.children - Page content
 * @param props.className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Basic usage
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
  ...props
}: WrapperProps) {
  return (
    <PreloaderProvider>
      <PreloaderGate />
      <Header />
      <PageTransitionProvider>
        <main
          id="main"
          className={cn(
            "relative z-10 flex grow flex-col bg-neutral-50",
            className
          )}
          {...props}
        >
          {children}
        </main>
      </PageTransitionProvider>

      {/* Parallax zone: min-h-screen so footer can stick while this area scrolls */}
      <Footer />

      {/** Removed temporarily as we are not using it yet */}
      {/* <WelcomeToast /> */}
    </PreloaderProvider>
  );
}
