import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/helpers";
import type { ReactNode } from "react";

type GridProps = {
  as?: 'section' | 'div';
  className?: string;
  children: ReactNode;
  withContainer?: boolean;
}

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