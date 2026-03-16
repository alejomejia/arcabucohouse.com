/**
 * Centralized GSAP plugin registration and configuration.
 *
 * All GSAP plugins, defaults, and custom easing curves are registered here
 * **once**, guarded by a `globalThis` flag that persists across HMR module
 * re-evaluations. Without this guard, every hot-reload re-runs module-scope
 * side-effects (ticker config, CustomEase allocations, etc.), which
 * accumulates internal GSAP state and progressively degrades dev-server
 * performance.
 *
 * **Usage** — import this module (side-effect only) wherever GSAP plugins are
 * needed. The import is a no-op after the first evaluation:
 *
 * ```ts
 * import "@/components/effects/gsap/register"
 * ```
 */

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

declare global {
  var __gsap_initialized__: boolean | undefined
}

if (typeof window !== "undefined" && !globalThis.__gsap_initialized__) {
  globalThis.__gsap_initialized__ = true

  // ── Plugins ──────────────────────────────────────────────────────────
  gsap.registerPlugin(useGSAP, CustomEase, Flip, ScrollTrigger, SplitText)

  // ── Defaults ─────────────────────────────────────────────────────────
  gsap.defaults({ ease: "none" })
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)

  // ── Custom easing curves ─────────────────────────────────────────────

  // Bouncy, playful, energetic, fun, attention-grabbing
  CustomEase.create("hop", "0.9, 0, 0.1, 1")

  // Progress bars, loading animations, form field focus, subtle opacity changes, premium micro-interactions
  CustomEase.create(
    "gentleSlow",
    "M0,0,C0.11,0.494,0.192,0.726,0.318,0.852,0.45,0.984,0.504,1,1,1",
  )

  // File upload progress, step-by-step processes, buffering animations,
  // data processing feedback, incremental loading sequences, network request visualization
  CustomEase.create(
    "loadingStutter",
    "M0,0 C0.1,0.2 0.15,0.2 0.2,0.2 0.25,0.4 0.3,0.4 0.35,0.4 0.4,0.6 0.45,0.6 0.5,0.6 0.6,0.8 0.7,0.8 0.8,0.8 0.9,0.9 0.95,0.95 1,1",
  )

  // Card flip animations, content reveal, sidebar toggles, smooth scrolling, quick responsive interactions
  CustomEase.create(
    "smoothSnap",
    "M0,0,C0.29,0,0.294,0.018,0.365,0.103,0.434,0.186,0.466,0.362,0.498,0.502,0.518,0.592,0.552,0.77,0.615,0.864,0.69,0.975,0.704,1,1,1",
  )

  // Primary button interactions, form submissions, navigation clicks, confirm actions, decision-making interfaces
  CustomEase.create("withPurpose", "M0,0 C0.165,0.84 0.44,0.99 1,1")
}
