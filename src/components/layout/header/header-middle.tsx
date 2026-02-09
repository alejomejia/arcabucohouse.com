import { ScrollProgressBar } from "@/components/effects/scroll-progress-bar"
import { OverlayTopText } from "./navigation/navigation-overlay/overlay-top-text"

/** Intermediate container for header middle content: 
 * ScrollProgressBar and OverlayTopText
 **/
export function HeaderMiddle() {
  return (
    <>
      <div className="w-full max-w-48 md:max-w-84 mx-auto">
        <ScrollProgressBar />
      </div>
      <div className="absolute hidden md:block">
        <OverlayTopText />
      </div>
    </>
  )
}