---
name: tailwind-css-patterns
description: Apply project-specific Tailwind CSS class naming conventions and organization patterns. Use when writing or reviewing component styles in tsx files.
metadata:
  version: "1.0.0"
  scope: "internal"
---

# Tailwind CSS Patterns

Follow these established patterns when writing Tailwind CSS classes in components.

## Core Rule: Always Use `cn()` Helper

All components must use the `cn()` utility from `src/lib/utils/helpers.ts`:

```tsx
import { cn } from "@/lib/utils/helpers";

className={cn(
  "base-classes",
  {
    "conditional-class": condition,
  }
)}
```

The `cn()` helper combines `clsx` + `tailwind-merge`, ensuring clean class composition.

## Class Organization Order

Group Tailwind classes **functionally** in this order:

1. **Positioning** - `position`, `top`, `left`, `right`, `bottom`, `inset`
2. **Z-Index & Layout** - `z-*`, `flex`, `grid`, `w-*`, `h-*`, `gap-*`
3. **Spacing** - `p-*`, `m-*`, `px-*`, `py-*` (padding/margin)
4. **Typography** - `text-*`, `font-*`, `leading-*`, `font-semibold`
5. **Colors** - `bg-*`, `text-*`, `border-*`, `fill-*`
6. **Effects & States** - `opacity-*`, `mix-blend-*`, `transition`, `duration-*`, `ease-*`
7. **Utilities** - `select-none`, `will-change-*`, `cursor-*`

**Example:**

```tsx
className={cn(
  "fixed top-0 left-0 right-0",           // Positioning
  "z-80 h-16",                            // Z-index & Layout
  "py-4",                                 // Spacing
  "text-lg font-semibold",     // Typography
  "text-zinc-100",                           // Colors
  "mix-blend-difference select-none",     // Effects & utilities
)}
```

## Spacing Values

**Use numeric spacing (TailwindCSS v4):**
- ✅ `p-4`, `px-6`, `py-2`, `gap-8`, `m-0`, `ml-2.5`
- ❌ Avoid arbitrary `[px]` values unless absolutely necessary

## Responsive Design (Mobile-First)

Always use mobile-first approach with breakpoint prefixes:

- `xs:` (custom breakpoint at 30rem)
- `md:` (Tailwind default - 768px)
- `lg:` (Tailwind default - 1024px)

**Example:**

```tsx
className={cn(
  "px-4 md:px-6 lg:px-8",                 // Responsive padding
  "flex-col gap-4 xs:flex-row xs:gap-2",  // Responsive flex direction
  "grid-cols-12 md:grid-cols-16 lg:grid-cols-24", // Responsive grid
)}
```

## Conditional Classes with Objects

Use object notation with `cn()` for state-based classes:

```tsx
cn(
  "base-classes",
  {
    "class-when-true": isActive,
    "class-when-false": !isActive,
    "hover:bg-zinc-700": isInteractive,
  }
)
```

**Or use predefined class constants for complex states:**

```tsx
const ACTIVE_VARIANT = "bg-zinc-700 text-zinc-100 border-zinc-700";
const INACTIVE_VARIANT = "text-zinc-300 border-zinc-100 hover:bg-zinc-700";

// In component:
className={cn(
  "border-2 transition duration-300",
  isActive ? ACTIVE_VARIANT : INACTIVE_VARIANT
)}
```

## State Classes

### Hover States
```tsx
"hover:bg-zinc-700 hover:text-zinc-100 hover:border-zinc-700"
```

### Transition Classes
```tsx
"transition duration-300 ease-in-out"
// or for specific properties
"transition-transform duration-350 ease-in-out"
```

### Dynamic Classes (Ternary)
```tsx
cn({
  "scale-110": hoveredIndex === index,
  "scale-100": hoveredIndex !== index,
})
```

## Z-Index Management

Use centralized z-index constants from `src/lib/styles/const.ts`:

```tsx
import { Z_INDEX_CLASSNAMES } from "@/lib/styles/const";

className={Z_INDEX_CLASSNAMES.header} // "z-80"
```

**Standard z-index values:**
- `z-9999` - Preloader (topmost)
- `z-100` - Cursor/custom elements
- `z-90` - Dialog/modals
- `z-80` - Header
- `z-70` - Page transitions
- `z-40` - Navigation overlay
- `z-10` - Main content
- `z-0` - Footer/background

## CSS Variables & Arbitrary Values

Use CSS custom properties for dynamic/layout values:

```tsx
// For layout configuration
"gap-[var(--slide-spacing)]"
"[flex:0_0_var(--slide-size)]"
"h-[var(--slide-height)]"

// For special properties (touch action, etc)
"[touch-action:pan-x_pinch-zoom]"
```

## Custom CSS for Complex Properties

For mask images, clip-paths, or other complex properties, use CSS module files instead of arbitrary Tailwind classes:

**spotlight.module.css:**
```css
.spotlight-mask {
  mask-image: var(--spotlight-mask-url);
  mask-position: center;
  mask-size: contain;
}
```

**Component:**
```tsx
import styles from "./spotlight.module.css";

<div className={styles["spotlight-mask"]} />
```

## Custom Utilities & Variants

Available custom utilities from `/src/lib/styles/utilities.css`:
- `.visually-hidden` - Screen reader only text
- `.leading-tighter` - Tighter line-height (1.05)
- `.arc-images-animation` - Complex clip-path animation
- `.brand-gradient-zinc` - Primary radial gradient

Available custom variants from `/src/lib/styles/variants.css`:
- `first-child:` - First child pseudo-element
- `last-child:` - Last child pseudo-element
- `bafter:` - Before/after pseudo-elements
- `not-last:` - Not last child
- `all-children-span:` - All child span elements
- `direct-children:` - Direct children only
- `char:` - GSAP Split Text character
- `word:` - GSAP Split Text word
- `line:` - GSAP Split Text line

## Common Patterns

### Layout Container
```tsx
className={cn("px-4 md:px-6", className)}
```

### Card/Component Base
```tsx
className={cn(
  "rounded border border-zinc-300",
  "px-4 py-3 md:px-6 md:py-4",
  "bg-zinc-700 text-zinc-100",
  "transition duration-300 ease-in-out"
)}
```

### Flexbox Row with Responsive Gap
```tsx
className={cn(
  "flex items-center",
  "gap-4 xs:gap-2 md:gap-6",
)}
```

### Grid with Responsive Columns
```tsx
className={cn(
  "grid",
  "grid-cols-12 md:grid-cols-16 lg:grid-cols-24",
  "gap-4"
)}
```

### Interactive Element
```tsx
className={cn(
  "cursor-pointer select-none",
  "transition duration-300 ease-in-out",
  "hover:opacity-80 hover:scale-105",
  {
    "pointer-events-none opacity-50": isDisabled,
  }
)}
```

## Anti-Patterns ❌

- ❌ Don't mix `cn()` with direct className string concatenation
- ❌ Don't use `clsx` directly instead of `cn()`
- ❌ Don't use `dark:` variants (project uses dark theme by default)
- ❌ Don't hardcode colors instead of using theme colors
- ❌ Don't use arbitrary pixel values when numeric spacing works: `[4px]` → `p-1`
- ❌ Don't scatter z-index values: use `Z_INDEX_CLASSNAMES` constants
- ❌ Don't duplicate class constants across files

## Quick Reference

| Need | Pattern |
|------|---------|
| Merge classes | `cn(classA, classB, { conditional: true })` |
| Spacing | `p-4`, `px-6`, `gap-8` (numeric only) |
| Colors | `bg-zinc-700`, `text-zinc-100` |
| Responsive | `px-4 md:px-6 lg:px-8` |
| States | Conditional objects or predefined constants |
| Z-Index | `Z_INDEX_CLASSNAMES.header` |
| CSS Variables | `[var(--custom-value)]` |
| Transitions | `transition duration-300 ease-in-out` |
| Helper | Always import `cn` from `@/lib/utils/helpers` |
