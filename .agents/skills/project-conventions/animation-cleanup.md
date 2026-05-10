# Animation Cleanup Discipline

Every animation in this codebase has a non-trivial chance of running on a
component that gets cached, navigated-away-from, or re-rendered before its
animation completes. If side effects aren't paired with cleanup, the bugs
range from "minor memory leak" to "GSAP timeline fires against unmounted
refs" to "two clones appear in the DOM after a back/forward navigation."

`src/components/effects/cinema-scroll/use-cinema-scroll.ts` is the reference
— every ScrollTrigger is `.kill(true)`'d, every inline style is `clearProps`'d,
and the cloned `<img>` appended to `document.body` is removed in the cleanup.
Read that file's return block (lines ~245–264) before writing any new
animation hook.

## The Cleanup Checklist

For every side effect you create, write the cleanup *at the same time* as
the create — not later. If you can't write the cleanup, you don't understand
the side effect well enough yet.

| Created with… | Cleaned up with… |
|---|---|
| `setTimeout` / `setInterval` | `clearTimeout` / `clearInterval` on the saved handle |
| `requestAnimationFrame` | `cancelAnimationFrame` on the saved handle |
| `ScrollTrigger.create(…)` | `.kill(true)` on the returned trigger (the `true` reverts inline pin styles) |
| `gsap.to/from/fromTo/timeline` | `.kill()` on the returned tween/timeline (auto-handled if inside `useGSAP({ scope })`) |
| `new ResizeObserver(…)` / `IntersectionObserver` | `.disconnect()` |
| `addEventListener` | `removeEventListener` (same options object) |
| `document.body.appendChild(node)` | `node.remove()` |
| Inline GSAP-applied styles on long-lived elements | `gsap.set(el, { clearProps: 'transform,opacity,…' })` |
| `SplitText` / `Flip` instances | `split.revert()` / `flip.kill()` — `useGSAP` does *not* auto-clean these |

## The Standard Hook Shape

```ts
useGSAP(() => {
  // 1. Capture refs / DOM that exists.
  if (!containerRef.current) return

  // 2. Create side effects, capturing return values.
  const trigger = ScrollTrigger.create({ /* … */ })
  const timeline = gsap.timeline().to(/* … */)
  const observer = new ResizeObserver(() => { /* … */ })
  observer.observe(containerRef.current)

  const handleResize = () => { /* … */ }
  window.addEventListener('resize', handleResize)

  // 3. Return cleanup. Mirror creation order, reversed.
  return () => {
    window.removeEventListener('resize', handleResize)
    observer.disconnect()
    timeline.kill()
    trigger.kill(true)

    // Clear any inline styles GSAP wrote to long-lived elements:
    if (containerRef.current) {
      gsap.set(containerRef.current, { clearProps: 'transform,backgroundColor' })
    }
  }
}, { scope: containerRef })
```

## Defensive Reset (cinema-scroll precedent)

Next.js Router Cache means a component can mount, animate, get cached on a
back-navigation, and re-mount with stale GSAP-applied inline styles still on
its DOM. The cinema-scroll hook addresses this at the **start** of the
`useGSAP` callback by explicitly resetting elements before re-binding
ScrollTriggers (see `use-cinema-scroll.ts:60–74`).

If your component animates background, transform, or opacity on long-lived
elements, do the same: at the top of the `useGSAP` callback, `gsap.set(el, …)`
back to the initial visual state and remove any DOM nodes (clones, portals)
left over from a cached session.

## Common Failure Modes

| Symptom | Likely Cause |
|---|---|
| Animation fires twice or stutters after a back-nav | ScrollTrigger from a previous mount wasn't killed; new mount registered a duplicate |
| `Cannot read properties of null (reading 'style')` in production | Timer/RAF/timeline fired against a ref that has since unmounted |
| Background color stuck after navigating away from a section | Inline styles GSAP applied weren't `clearProps`'d on cleanup |
| Two cloned elements in the DOM after pressing Back | Appended DOM nodes (`document.body.appendChild`) weren't removed on cleanup |
| Memory grows monotonically with route changes | Observers / event listeners / RAF tickers accumulating |

## Known Violations to Fix First

- `src/components/effects/image-stack/use-image-stack-reveal.ts` — debounce
  timer (`debounceTimerRef`) is cleared by `cancelPendingAnimation()` but
  **not** on unmount. Add a `useEffect` cleanup.
- `src/components/effects/stacked-image-reveal/index.tsx` — timeline created
  inside the `createAnimation` callback isn't stored on a ref for explicit
  kill. Capture it and `.kill()` in cleanup.

## Detection

```sh
# Side effects that often miss cleanup:
rg "setTimeout|setInterval|requestAnimationFrame" src/components/
rg "new (ResizeObserver|IntersectionObserver|MutationObserver)" src/components/
rg "appendChild|prepend\(|insertBefore" src/components/
rg "ScrollTrigger\.create" src/components/

# Manually verify each match has a paired cleanup in the same useGSAP/useEffect.
```
