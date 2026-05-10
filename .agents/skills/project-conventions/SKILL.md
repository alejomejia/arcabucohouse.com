---
name: project-conventions
description: House code-organization conventions for this project — component file/naming pattern (the cinema-scroll convention), constants extraction, context guard hooks, GSAP scoping, layout-thrash avoidance, animation cleanup discipline, and form accessibility chain
user-invocable: false
---

# Project Conventions

How code is organized, named, and structured in this codebase. Apply these rules
when writing or reviewing any code in `src/` (excluding the vendored
`src/components/from-template/`).

The reference implementation that satisfies every rule below is
`src/components/effects/cinema-scroll/`. When in doubt, read those files first.

## Component Pattern

The canonical multi-file component layout: `index.tsx` (compound root via
`Object.assign`), `<name>.types.ts`, `<name>.const.ts`, `<name>.context.ts`,
`use-<name>.ts`, `<name>-<sub>.tsx` per subcomponent.

See [component-pattern.md](./component-pattern.md) for:
- File layout and naming
- The `Object.assign(Root, { Sub })` compound export
- When to apply (multi-file components) vs. when not (primitives, vendored
  code, intentionally split server/client layouts like `footer/`)
- Verification greps

## Component Constants

Magic numbers, easings, durations, color tokens used in inline styles, and
class variant tables belong in a sibling `<name>.const.ts` file — never
inlined in the `.tsx`.

See [component-constants.md](./component-constants.md) for:
- What counts as a constant vs. what stays inline
- The `as const` + derived-type idiom
- Canonical violations to fix first (`text/`, `skeleton/`, `preloader/`)

## Context Guard Hook

Every `createContext` export must be paired with a `use<Name>Context()` hook
that throws when consumed outside the provider. Sub-components only ever call
the guard hook, never `useContext` directly.

See [context-guard-hook.md](./context-guard-hook.md) for:
- The `T | null` typing rule
- The required throw + descriptive error message
- Why "context with default value" is an anti-pattern here
- Verification greps

## GSAP Scoped Selectors

Never pass string selectors to GSAP without a scope. Global selectors like
`gsap.set("[data-foo]", …)` cause cross-instance interference when the same
component renders twice on a page. Capture refs and pass `{ scope }` to
`useGSAP`.

See [gsap-selectors.md](./gsap-selectors.md) for:
- Ref-based pattern (preferred)
- Scoped-selector pattern (for batch ops on N children)
- Why `{ scope }` also handles cleanup automatically
- Detection greps

## Avoiding Layout Thrash

Layout-property reads (`getBoundingClientRect`, `offsetWidth`,
`offsetHeight`, `scrollTop`, `getComputedStyle`, `window.innerWidth`) inside
event handlers, scroll callbacks, or animation loops force a reflow on every
fire. Measure once, cache, or use observers.

See [layout-thrash.md](./layout-thrash.md) for:
- The full list of layout-reading properties
- Hot-path locations to audit
- Fix patterns: cache + ResizeObserver, setup-time measurement,
  `gsap.quickSetter` for hot-path writes
- Known violations to fix first

## Animation Cleanup Discipline

Every non-React side effect created during an animation (timers, RAF,
ScrollTriggers, observers, appended DOM nodes, GSAP timelines) must be
paired with explicit cleanup. Write the cleanup at the same time as the
create — not later.

See [animation-cleanup.md](./animation-cleanup.md) for:
- The cleanup checklist (created with → cleaned up with)
- The standard `useGSAP` hook shape
- Defensive reset for Next.js Router Cache (cinema-scroll precedent)
- Common failure modes and their root causes

## Form Accessibility Chain

Form fields must wire `htmlFor`, `aria-describedby`, and `aria-invalid` via a
shared `FormField` context that allocates a single id per field. Independent
label/input/error components without a shared id are functionally unlabeled
to assistive tech.

See [form-accessibility.md](./form-accessibility.md) for:
- The required ARIA chain
- The `FormField` context pattern
- Why prop-drilling ids is worse than context
- Detection greps
