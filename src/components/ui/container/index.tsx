import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/helpers";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("px-4 md:px-6", className)} {...props}>
      {children}
    </div>
  )
}