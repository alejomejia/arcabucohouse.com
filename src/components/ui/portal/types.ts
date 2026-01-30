import { PORTAL_IDS } from "@/lib/styles/const"

/** Known portal target IDs. */
export type PortalId = (typeof PORTAL_IDS)[keyof typeof PORTAL_IDS]