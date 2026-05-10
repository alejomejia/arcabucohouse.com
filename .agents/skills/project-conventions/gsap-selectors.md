# GSAP Scoped Selectors

GSAP selector strings (`"[data-x]"`, `".foo"`, `"#bar"`) match against the
**entire document** unless they're given a scope. Two instances of the same
component on the same page will fight over the same DOM nodes — last one in
wins, animations stutter, refs get clobbered.

## The Rule

When using GSAP inside a React component:

1. Capture every animated element on a ref, not a selector string.
2. Pass `{ scope: containerRef }` to `useGSAP`.
3. If you must use a string selector (rare — usually only for batch
   operations on N children), keep it inside a `useGSAP({ scope })` block so
   GSAP scopes the lookup to your container automatically.

## Anti-Pattern

```tsx
// BAD — global selector, two <Parallax> instances will clobber each other
function Parallax({ children }) {
  useGSAP(() => {
    gsap.set('[data-parallax-content]', { yPercent: 30 })
    gsap.fromTo(
      '[data-parallax-content]',
      { yPercent: 30 },
      { yPercent: -30, scrollTrigger: { /* … */ } },
    )
  }, [])

  return <div data-parallax-content>{children}</div>
}
```

## Correct Pattern A — ref-based (preferred for single elements)

```tsx
function Parallax({ children }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!contentRef.current) return
    gsap.set(contentRef.current, { yPercent: 30 })
    gsap.fromTo(
      contentRef.current,
      { yPercent: 30 },
      { yPercent: -30, scrollTrigger: { trigger: containerRef.current /* … */ } },
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
```

## Correct Pattern B — scoped selector (for batch ops on N children)

```tsx
function Marquee({ items }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // The string selector is now scoped to containerRef.current via useGSAP({ scope }).
    // Without { scope }, this would still hit every "[data-marquee-item]" in the document.
    gsap.to('[data-marquee-item]', { x: '-100%', ease: 'none' })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      {items.map((item) => (
        <div key={item.id} data-marquee-item>{item.label}</div>
      ))}
    </div>
  )
}
```

## Why `{ scope }` Matters Beyond Selector Resolution

`useGSAP({ scope })` also auto-cleans every animation, tween, timeline, and
ScrollTrigger created inside the callback when the component unmounts. You
get two wins for one prop. **Always pass it.**

## Detection

```sh
# Find string-selector GSAP calls. Each match needs a scope-or-ref audit.
rg "gsap\.(set|to|from|fromTo|killTweensOf)\(['\"]" src/
rg "ScrollTrigger\.create\(\s*\{\s*trigger:\s*['\"]" src/
```

## Reference

`src/components/effects/cinema-scroll/use-cinema-scroll.ts` is the gold
standard: every animated element is captured on a ref (`containerRef`,
`marqueeRef`, `marqueeImagesRef`, …), `useGSAP` is called with `{ scope:
containerRef }`, and the cleanup return explicitly `.kill(true)`s every
ScrollTrigger. Copy this pattern.
