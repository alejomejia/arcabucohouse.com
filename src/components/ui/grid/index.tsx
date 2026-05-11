import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/helpers";
import type { ReactNode } from "react";

type GridProps = {
  as?: 'section' | 'div';
  className?: string;
  children: ReactNode;
  withContainer?: boolean;
}

/**
 * Responsive 12 / 16 / 24-column grid. Wraps its content in a `<Container>`
 * by default so the grid respects the site-wide horizontal padding; pass
 * `withContainer={false}` to opt out (e.g. when nesting inside another
 * container or for full-bleed layouts).
 *
 * @example
 * ```tsx
 * <Grid as="section" className="gap-y-12">
 *   <article className="col-span-12 md:col-span-8 lg:col-span-12">…</article>
 *   <aside className="col-span-12 md:col-span-8 lg:col-span-12">…</aside>
 * </Grid>
 * ```
 */
export function Grid({ as = "div", className, children, withContainer = true }: GridProps) {
  const Component = as;

  const content = (
    <Component className={cn("grid grid-cols-12 md:grid-cols-16 lg:grid-cols-24 gap-4", className)}>
      {children}
    </Component>
  );

  if (!withContainer) {
    return content;
  }

  return (
    <Container>
      {content}
    </Container>
  );
}