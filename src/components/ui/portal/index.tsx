import { type ReactNode } from "react"
import { createPortal } from "react-dom"

import { PORTAL_IDS } from "@/lib/styles/const"

type PortalId = (typeof PORTAL_IDS)[keyof typeof PORTAL_IDS]

type PortalProps = {
  id: PortalId
  children: ReactNode
}

export function Portal({ id, children }: PortalProps) {
  return createPortal(children, document.getElementById(id)!)
}