"use client";

import { type ImageProps } from "@/components/ui/image";
import { cn } from "@/lib/utils/helpers";

import { ParallaxImage } from "../parallax-image";
import { useSpotlightContext } from "./spotlight-context";

/**
 * One row of the spotlight grid: exactly 4 cells.
 * Each cell is either image props (src, alt, etc.) or "" for an empty placeholder.
 */
type GridRow = [
  ImageProps | "",
  ImageProps | "",
  ImageProps | "",
  ImageProps | "",
];

/** Grid of rows, each with 4 cells. Used for the scrolling image strip. */
export type Grid = GridRow[];

/**
 * Props for the spotlight images grid.
 *
 * @property grid - Rows of 4 cells each; empty string = placeholder, else ImageProps
 */
type SpotlightImagesProps = {
  grid: Grid;
};

/**
 * Scrollable grid of images used as the background strip in the spotlight section.
 *
 * Must be used inside Spotlight.Root. The container receives the ref that the scroll
 * animation uses to translate the strip (0–50% progress). Renders 5 rows of 4 cells;
 * use "" for empty cells and ImageProps for image cells.
 *
 * @param grid - [x]×4 grid of image props or empty strings (default: built-in placeholder grid)
 *
 * @example
 * ```tsx
 * <Spotlight.Root>
 *   <Spotlight.Images grid={myGrid} />
 * </Spotlight.Root>
 * ```
 */
export function SpotlightImages({ grid }: SpotlightImagesProps) {
  const { imagesRef } = useSpotlightContext();

  return (
    <div
      ref={imagesRef}
      className={cn(
        "absolute top-0 left-[-25vw] z-0 lg:left-0",
        "flex flex-col justify-between w-[200vw] lg:w-screen h-[300svh] translate-y-[5%] will-change-transform",
      )}
    >
      {grid.map((row, index) => (
        <div key={index} className="flex w-full gap-8 px-6 py-8">
          {row.map((cell, index) => {
            const { className, ...rest } = cell as ImageProps
            const isEven = index % 2 === 0

            return cell === "" ? (
              <div key={index} className="flex-1/2 md:flex-1 overflow-hidden" aria-hidden="true" />
            ) : (
              <div key={index} className={cn("flex-1/2 md:flex-1 saturate-0 overflow-hidden", isEven ? "aspect-5/7" : "aspect-1/1", className)}>
                <ParallaxImage className="w-full h-full object-cover" {...rest} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  );
}
