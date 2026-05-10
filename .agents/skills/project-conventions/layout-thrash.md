# Avoid Layout Thrash

The browser batches style + layout work and resolves it lazily. Reading any
layout property forces an immediate flush. Doing that on every mousemove,
scroll, or animation frame turns a 60fps page into a slideshow.

This codebase ships at least one canonical instance:
`src/components/effects/underline/hooks/use-underline-animation.ts:52` calls
`getBoundingClientRect()` inside `handleMouseEnter`. With rapid hover, that's
~60 reflows/sec for a non-essential animation.

## The Layout-Reading Properties

Any of these will force a reflow if styles/layout are dirty:
- `getBoundingClientRect()`, `getClientRects()`
- `offsetTop`, `offsetLeft`, `offsetWidth`, `offsetHeight`, `offsetParent`
- `clientTop`, `clientLeft`, `clientWidth`, `clientHeight`
- `scrollTop`, `scrollLeft`, `scrollWidth`, `scrollHeight`
- `getComputedStyle(el)` (and any `.foo` access on its result)
- `innerText` (less obvious — it's layout-dependent)
- `window.innerWidth` / `window.innerHeight`

## The Hot-Path Locations

Anywhere that fires more than once per user action:
- Event handlers on `mousemove`, `mouseenter` (when bound on many elements),
  `scroll`, `wheel`, `pointermove`, `resize`.
- GSAP `onUpdate` callbacks (these fire every frame during scrub).
- `requestAnimationFrame` ticks.
- `useEffect` that runs on every render.

## The Fixes

### Fix 1: Measure once, cache

```ts
// BAD
function onHover(event) {
  const rect = el.getBoundingClientRect() // 60 reflows/sec on rapid hover
  const fromLeft = event.clientX < rect.left + rect.width / 2
}

// GOOD
let rect = el.getBoundingClientRect()
function onHover(event) {
  const fromLeft = event.clientX < rect.left + rect.width / 2
}

// Refresh the cache only when geometry actually changes:
const observer = new ResizeObserver(() => { rect = el.getBoundingClientRect() })
observer.observe(el)
```

### Fix 2: Use observers, not polling

- Element resized? `ResizeObserver`.
- Element scrolled into view? `IntersectionObserver`.
- Document resized? `window.matchMedia` change listener (already wrapped in
  this project as `useMediaQuery` / `useBreakpoint`).

### Fix 3: Pre-compute setup-time values

GSAP timelines that depend on layout: read once *inside* the `useGSAP`
callback (not inside `onUpdate`), and use `invalidateOnRefresh: true` on the
ScrollTrigger so it's recomputed when the page reflows for legitimate
reasons.

```ts
// GOOD — measure at setup, recompute only on refresh
useGSAP(() => {
  const sectionHeight = sectionRef.current.offsetHeight

  ScrollTrigger.create({
    trigger: sectionRef.current,
    start: 'top top',
    end: () => `+=${sectionHeight}`,    // re-evaluated on refresh
    invalidateOnRefresh: true,
    pin: true,
  })
}, { scope: containerRef })
```

### Fix 4: Use GSAP's quickSetter for hot-path writes

If you must touch the DOM 60×/sec, batch through `gsap.quickSetter` — it
writes through GSAP's own queue and avoids extra style mutations.

```ts
const setX = gsap.quickSetter(el, 'x', 'px')
function onScroll() { setX(window.scrollY * 0.3) }
```

## Detection

```sh
# Find layout reads inside event handlers / animation callbacks.
# Manual review required — these are signals, not all of them are bugs.
rg "getBoundingClientRect|offsetWidth|offsetHeight|scrollWidth|scrollHeight" src/components/
```

For each match, ask:
1. Is this inside a function that fires more than once per user action?
2. Is the value stable between fires? (If yes — cache it.)
3. Could a `ResizeObserver` / `IntersectionObserver` replace the polling?

## Known Violations to Fix First

- `src/components/effects/underline/hooks/use-underline-animation.ts:52` —
  `getBoundingClientRect()` per hover.
- `src/components/effects/spotlight/use-spotlight.ts:171–184` — mask-size
  written via `style.setProperty` in `onUpdate`; replace with a
  pre-allocated `gsap.quickSetter`.
