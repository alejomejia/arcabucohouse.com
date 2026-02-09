'use client'


import { useCursor } from '@/components/effects/cursor/context'
import { CursorTrigger } from '@/components/effects/cursor/cursor-trigger'
import type { CursorConfig } from '@/components/effects/cursor/types'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils/helpers'

/** Cursor with "Explore" text. Use for cards, images, or areas that invite exploration. */
const CURSOR_EXPLORE: CursorConfig = {
  text: 'Explore',
}

/** Cursor with "Details" text and slightly larger scale. Use for product or item detail links. */
const CURSOR_DETAILS: CursorConfig = {
  text: 'Details',
  scale: 1.5,
}

/** Hover zone where the cursor is hidden. Use for custom interactive areas (e.g. canvas, custom controls). */
const CURSOR_HIDDEN: CursorConfig = {
  hidden: true,
}

/** Large cursor (3x). Use for big clickable areas or emphasis. */
const CURSOR_LARGE: CursorConfig = {
  scale: 3,
}

/** Small cursor (0.5x) with dot. Use for minimal or dense UI. */
const CURSOR_SMALL: CursorConfig = {
  scale: 0.5,
  text: '•',
}

function PlayIconSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function ArrowsIconSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/** Cursor with play icon. Use for video or audio play triggers. */
export const CURSOR_PLAY: CursorConfig = {
  content: <PlayIconSvg className="size-4" />,
}

/** Cursor with play icon and larger scale. Use for prominent video hero or primary play button. */
export const CURSOR_PLAY_LARGE: CursorConfig = {
  content: <PlayIconSvg className="size-4" />,
  scale: 1.5,
}

/** Cursor with drag/arrows icon. Use for draggable areas, carousels, or “scroll/drag” hints. */
export const CURSOR_DRAG: CursorConfig = {
  content: <ArrowsIconSvg className="size-4" />,
}


/**
 * Demo card component for consistent styling.
 */
function DemoCard({
  children,
  className,
  dark,
}: {
  children: React.ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        // Layout
        'relative overflow-hidden',
        'flex items-center justify-center',

        // Size
        'aspect-video',

        // Visual
        'rounded-2xl',
        dark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900',

        // Custom
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Interactive card that uses the hook API for dynamic cursor.
 */
function InteractiveCard() {
  const { setHover, setDefault } = useCursor()

  const handleMouseEnter = () => {
    setHover({ text: 'Interactive!', scale: 1.2 })
  }

  return (
    <DemoCard>
      <div
        className={cn(
          'w-full h-full',
          'flex flex-col items-center justify-center gap-4',
          'p-8'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={setDefault}
      >
        <span className="text-lg font-medium">Hook API</span>
        <p className="text-sm text-neutral-500 text-center">
          Using useCustomCursor hook for dynamic control
        </p>
      </div>
    </DemoCard>
  )
}

/**
 * Cursor demo section showcasing different cursor effects.
 * Demonstrates various ways to customize the cursor:
 * - Text cursor
 * - Icon cursor
 * - Scaled cursor
 * - Hidden cursor
 * - Hook-based control
 */
export function CursorDemo() {
  return (
    <section className="py-24 bg-neutral-100">
      <Container>
        <div className="mb-12">
          <h2 className="text-3xl font-serif font-semibold mb-4">
            Custom Cursor Examples
          </h2>
          <p className="text-neutral-600 max-w-xl">
            Hover over each card to see different cursor effects. The custom cursor
            supports text, icons, scaling, and can be completely hidden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Text cursor */}
          <CursorTrigger config={CURSOR_EXPLORE}>
            <DemoCard>
              <div className="text-center">
                <span className="text-lg font-medium">Text Cursor</span>
                <p className="text-sm text-neutral-500 mt-2">
                  Shows "Explore" on hover
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>

          {/* Icon cursor - Play */}
          <CursorTrigger config={CURSOR_PLAY}>
            <DemoCard dark>
              <div className="text-center">
                <span className="text-lg font-medium">Icon Cursor</span>
                <p className="text-sm text-neutral-400 mt-2">
                  Shows play icon on hover
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>

          {/* Icon cursor - Drag */}
          <CursorTrigger config={CURSOR_DRAG}>
            <DemoCard>
              <div className="text-center">
                <span className="text-lg font-medium">Drag Cursor</span>
                <p className="text-sm text-neutral-500 mt-2">
                  Shows arrow icon for draggable areas
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>

          {/* Scaled cursor */}
          <CursorTrigger config={CURSOR_LARGE}>
            <DemoCard dark>
              <div className="text-center">
                <span className="text-lg font-medium">Large Cursor</span>
                <p className="text-sm text-neutral-400 mt-2">
                  3x scaled cursor
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>

          {/* Small cursor */}
          <CursorTrigger config={CURSOR_SMALL}>
            <DemoCard>
              <div className="text-center">
                <span className="text-lg font-medium">Small Cursor</span>
                <p className="text-sm text-neutral-500 mt-2">
                  0.5x scaled cursor
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>

          {/* Interactive hook example */}
          <InteractiveCard />
        </div>

        {/* Full-width hidden cursor example */}
        <div className="mt-12">
          <CursorTrigger config={CURSOR_HIDDEN}>
            <DemoCard className="aspect-auto h-32 bg-gradient-to-r from-neutral-900 to-neutral-700">
              <div className="text-center text-white">
                <span className="text-lg font-medium">Hidden Cursor Zone</span>
                <p className="text-sm text-neutral-300 mt-2">
                  The cursor is completely hidden in this area
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>
        </div>

        {/* Combination example */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CursorTrigger
            config={{
              content: (
                <span className="flex items-center gap-1">
                  <span>Buy</span>
                  <span className="text-[10px]">→</span>
                </span>
              ),
            }}
          >
            <DemoCard className="bg-emerald-600 text-white">
              <div className="text-center">
                <span className="text-lg font-medium">Combined Content</span>
                <p className="text-sm text-emerald-100 mt-2">
                  Text + icon together
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>

          <CursorTrigger config={CURSOR_DETAILS}>
            <DemoCard className="bg-amber-500 text-white">
              <div className="text-center">
                <span className="text-lg font-medium">Text + Scale</span>
                <p className="text-sm text-amber-100 mt-2">
                  Custom text with 1.5x scale
                </p>
              </div>
            </DemoCard>
          </CursorTrigger>
        </div>
      </Container>
    </section>
  )
}
