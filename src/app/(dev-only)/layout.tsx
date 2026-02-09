import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { isDev } from "@/lib/utils/config"

type DevOnlyLayoutProps = {
  children: ReactNode
}

export default function DevOnlyLayout({ children }: DevOnlyLayoutProps) {
  if (!isDev) return notFound()

  return children
}