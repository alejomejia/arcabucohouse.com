import { cn } from "@/lib/utils/helpers";
import type { ReactNode } from "react";

type GridProps = {
  as?: 'section' | 'div';
  className?: string;
  children: ReactNode;
}

export function Grid({ as = "div", className, children }: GridProps) {
  const Component = as;

  return (
    <Component className={cn("grid grid-cols-12 md:grid-cols-16 lg:grid-cols-24 gap-4", className)}>
      {children}
    </Component>
  )
}