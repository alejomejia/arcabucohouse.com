import { cn } from "@/lib/utils/helpers"

import type { PortalId } from "./types"

export type PortalRootProps = {
  id: PortalId
  className?: string
}

/**
 * Renders the DOM node that Portal targets by id. Place in layout so portaled
 * content has a mount point. Safe in server or client components.
 *
 * @example
 * <body>
 *   <PortalRoot id={PORTAL_IDS.bodyTop} />
 *   {children}
 *   <PortalRoot id={PORTAL_IDS.bodyBottom} />
 * </body>
 */
export function PortalRoot({ id, className }: PortalRootProps) {
  return <div id={id} className={cn(className)} aria-hidden />
}
