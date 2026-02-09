# Orchestra

A centralized collection of GSAP animation options organized by context to ensure smooth, consistent animations across the application.

## Purpose

The `orchestra` folder serves as a single source of truth for GSAP animation configurations. By organizing animation options in one place, we can:

- **Maintain consistency** across similar animations
- **Match timing and easing** between related elements
- **Easily adjust** global animation feel by updating shared values
- **Reduce duplication** of animation configuration code

## Structure

Each orchestra object is organized by page or feature context (e.g., `orchestraNavigation`, `orchestraHome`). Within each orchestra, animation options are grouped by element or component.

```typescript
type Orchestra = Record<string, gsap.TweenVars>

export const orchestraNavigation: Orchestra = {
  logo: {
    duration: 0.5,
    delay: 0.25,
    stagger: 0.05,
    ease: "gentleSlow",
  },
  menu: {
    duration: 0.5,
    delay: 0.25,
    stagger: 0.05,
    ease: "gentleSlow",
  },
  // ... more elements
}
```

## Usage

Import the orchestra object and spread its options into your GSAP animations:

```typescript
import { orchestraNavigation } from '@/lib/orchestra'
import gsap from 'gsap'

// Spread the options into your animation
gsap.to(element, {
  y: 100,
  ...orchestraNavigation.menu, // Merges duration, delay, stagger, ease, etc.
})
```

### Example: Navigation Toggle

```typescript
import { orchestraNavigation } from '@/lib/orchestra'

// Animate menu text reveal
gsap.to(menuSplit.chars, {
  yPercent: 0,
  opacity: 1,
  ...orchestraNavigation.menu, // Uses shared timing and easing
})
```

## Available Easing Curves

The project includes custom easing curves registered in `GSAPRuntime`:

- `"gentleSlow"` - Smooth, premium feel for subtle animations
- `"hop"` - Bouncy, playful, energetic
- `"loadingStutter"` - Step-by-step progress animations
- `"smoothSnap"` - Quick, responsive interactions
- `"withPurpose"` - Confident, decisive actions

See `src/components/effects/gsap/index.tsx` for full easing definitions.

## Best Practices

### 1. Group by Context

Organize orchestras by page or feature area:

```typescript
export const orchestraNavigation: Orchestra = { /* ... */ }
export const orchestraHome: Orchestra = { /* ... */ }
export const orchestraProduct: Orchestra = { /* ... */ }
```

### 2. Use Descriptive Keys

Name keys after the element or component they animate:

```typescript
{
  logo: { /* ... */ },
  menu: { /* ... */ },
  cart: { /* ... */ },
  heroTitle: { /* ... */ },
  productImage: { /* ... */ },
}
```

### 3. Match Related Elements

Use the same timing and easing for elements that animate together:

```typescript
export const orchestraNavigation: Orchestra = {
  logo: {
    duration: 0.5,
    delay: 0.25,
    ease: "gentleSlow",
  },
  menu: {
    duration: 0.5,      // Same duration
    delay: 0.25,        // Same delay
    ease: "gentleSlow", // Same easing
    stagger: 0.05,      // Additional stagger for menu items
  },
}
```

### 4. Override When Needed

You can still override specific properties after spreading:

```typescript
gsap.to(element, {
  ...orchestraNavigation.menu,
  delay: 0.5, // Override the delay from orchestra
})
```

### 5. Keep Options Focused

Only include properties that should be shared. Component-specific options (like `scrollTrigger`, `onComplete`, etc.) should be defined in the component, not in the orchestra.

## Adding New Orchestras

1. Create a new orchestra object in `index.ts`:

```typescript
export const orchestraProduct: Orchestra = {
  image: {
    duration: 1,
    ease: "smoothSnap",
  },
  title: {
    duration: 0.8,
    delay: 0.2,
    ease: "gentleSlow",
  },
}
```

2. Import and use in your components:

```typescript
import { orchestraProduct } from '@/lib/orchestra'

gsap.to(productImage, {
  scale: 1,
  ...orchestraProduct.image,
})
```
