import type { ReactNode } from "react";

import { cn } from "@/lib/utils/helpers";

import { Header } from '../header';

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
    <>
      <Header />
      <main className={cn("relative flex grow flex-col", className)} {...props}>
        {children}
      </main>
      <footer>Footer</footer>

      {/** Removed temporarily as we are not using it yet */}
      {/* <WelcomeToast /> */}
    </>
  );
}
