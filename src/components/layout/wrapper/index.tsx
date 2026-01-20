import type { ReactNode } from "react";

import { WelcomeToast } from "@/components/toast/welcome-toast";
import { HEADER_TOP_PADDING_CLASSNAME } from "@/lib/styles/const";
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
      {/* <Navbar /> */}
      <Header />
      <main className={cn("relative flex grow flex-col", HEADER_TOP_PADDING_CLASSNAME, className)} {...props}>
        {children}
      </main>
      <footer>Footer</footer>

      <WelcomeToast />
    </>
  );
}
