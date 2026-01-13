# GSAP Integration

## Setup

### Basic Installation

GSAP comes pre-installed. To enable GSAP animations in your project, add the `<GSAPRuntime />` component in `app/layout.tsx`:

```jsx
// app/layout.tsx
import { GSAPRuntime } from '@/components/effects/gsap'

// inside <body>
<GSAPRuntime />
```

This will:

- Synchronize GSAP's ticker with [Tempus](https://www.npmjs.com/package/tempus) for better performance
- Register the CustomEase plugin and used to create a custom easing curves
- Configure GSAP defaults (ease: "none", lagSmoothing: 0)

## Usage

### Basic Animation

```jsx
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function Component() {
  useGSAP(() => {
    gsap.to('.target', {
      x: 100,
      duration: 1
    })
  })

  return <div className="target">Animated element</div>
}
```

### ScrollTrigger

ScrollTrigger sync with Lenis is handled automatically when you use the `<Lenis root />` component in your layout. The `LenisScrollTriggerSync` component is included automatically and handles the synchronization.

You can use ScrollTrigger directly in your components:

```jsx
useGSAP(() => {
  gsap.to('.target', {
    scrollTrigger: {
      trigger: '.target',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    },
    y: 100
  })
})
```

## Advanced Features

### Custom Easing

The `GSAPRuntime` component automatically registers a custom "hop" easing curve that you can use in your animations and extend:

```jsx
gsap.to('.target', {
  x: 100,
  duration: 1,
  ease: 'hop' // Custom easing curve
})
```

### Integration with Tempus

GSAP's ticker is automatically synchronized with Tempus through the `<GSAPRuntime />` component, providing:

- Consistent frame timing
- Better performance
- Synchronized animations across the application

## References

- [GSAP Documentation](https://gsap.com/docs/v3/)
- [ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Tempus Documentation](https://www.npmjs.com/package/tempus)
