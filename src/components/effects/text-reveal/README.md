# TextAnimation Component

A high-performance, flexible text animation component built with GSAP SplitText for Next.js applications.

## Features

- **Multiple Split Types**: Animate by lines, words, or characters for different effects
- **Line-based Animation**: Smooth reveal animations that split text into individual lines
- **Scroll Triggered**: Optional scroll-based animation triggers
- **Multiple Elements**: Support for animating multiple text elements simultaneously
- **Customizable**: Extensive animation options including duration, easing, and timing
- **Performance Optimized**: Proper cleanup, memoization, and memory management
- **TypeScript First**: Full type safety and IntelliSense support
- **SSR Safe**: Client-side only GSAP registration prevents hydration issues

## Installation

This component requires GSAP with SplitText plugin. Ensure you have the necessary dependencies:

```bash
npm install gsap @gsap/react
```

## Basic Usage

```tsx
import { TextAnimation } from '@/components/text-animation'

// Simple text animation
<TextAnimation>
  <h1>Animated heading text</h1>
</TextAnimation>

// Multiple elements
<TextAnimation>
  <h1>Title</h1>
  <p>Subtitle text</p>
</TextAnimation>
```

## Animation Presets

### Duration Presets

- `fast`: 0.6s - Quick, snappy animations
- `normal`: 1s - Balanced timing (default)
- `slow`: 1.4s - Deliberate, dramatic effect
- `dramatic`: 2s - Very slow, cinematic feel

### Easing Presets

- `smooth`: `power4.out` - Smooth, professional (default)
- `bouncy`: `back.out(1.7)` - Playful bounce effect
- `elastic`: `elastic.out(1, 0.3)` - Elastic, spring-like
- `sharp`: `power2.out` - Quick, sharp motion
- `gentle`: `power1.out` - Subtle, gentle easing

### Scroll Positions

- `early`: `'top 90%'` - Animation starts early
- `normal`: `'top 75%'` - Standard timing (default)
- `late`: `'top 50%'` - Animation starts when element is centered
- `center`: `'center center'` - Element must be centered in viewport

## Advanced Examples

### Line Animation (Default)

```tsx
<TextAnimation type="lines" stagger={0.1}>
  <h1>Smooth line-by-line reveal</h1>
</TextAnimation>
```

### Word Animation

```tsx
<TextAnimation type="words" stagger={0.15} ease="bouncy">
  <h1>Word by word emphasis</h1>
</TextAnimation>
```

### Character Animation (Typewriter Effect)

```tsx
<TextAnimation type="chars" stagger={0.05} duration="slow">
  <h1>Typewriter character effect</h1>
</TextAnimation>
```

### Custom Animation Configuration

```tsx
<TextAnimation
  type="words"
  duration="dramatic"
  ease="elastic"
  stagger={0.2}
  scrollStart="late"
  onComplete={() => console.log('Animation complete!')}
>
  <h1>Custom animated text</h1>
</TextAnimation>
```

### Immediate Animation (No Scroll Trigger)

```tsx
<TextAnimation animateOnScroll={false} delay={0.5} type="chars">
  <h1>Immediately animated text</h1>
</TextAnimation>
```

### Multiple Elements with Different Timing

```tsx
<TextAnimation stagger={0.15} duration="slow" type="words">
  <h1>Main Title</h1>
  <p>Subtitle with longer stagger</p>
  <span>Additional text element</span>
</TextAnimation>
```

### Custom Easing and Duration

```tsx
<TextAnimation type="lines" duration={1.5} ease="cubic-bezier(0.25, 0.46, 0.45, 0.94)" stagger={0.05}>
  <h1>Custom timing text</h1>
</TextAnimation>
```

## Performance Considerations

### Memory Management

The component automatically handles cleanup of GSAP instances and DOM modifications. SplitText instances are properly reverted when the component unmounts.

### Optimization Features

- **Memoized Configuration**: Animation settings are memoized to prevent unnecessary recalculations
- **Efficient Refs**: Separate refs for different element types improve organization
- **Client-Side Only**: GSAP plugins are registered only on the client to prevent SSR issues
- **Proper Cleanup**: All SplitText instances are reverted on unmount

### Split Type Performance

- **Lines**: Best performance, recommended for most use cases
- **Words**: Good performance, suitable for emphasis and shorter text
- **Characters**: Higher CPU usage, use sparingly for dramatic effects

### Best Practices

1. **Choose Type Wisely**: Use `lines` for most cases, `words` for emphasis, `chars` sparingly
2. **Avoid Overuse**: Don't animate every text element on the page
3. **Consider Performance**: Use shorter durations and fewer characters for better performance
4. **Test on Mobile**: Ensure animations work well on slower devices
5. **Accessibility**: Consider users who prefer reduced motion
6. **Stagger Optimization**: Characters need smaller stagger values (0.05), words can use larger values (0.15)

## CSS Classes

The component adds the `all-children-span:inline-block` class to ensure proper display of split text elements. This works with the custom CSS variant defined in our TailwindCSS custom variants styles.

## Browser Support

- Modern browsers with ES6+ support
- Requires GSAP SplitText plugin (premium)
- Optimized for Chrome, Firefox, Safari, and Edge

## Troubleshooting

### Common Issues

1. **SplitText not working**: Ensure GSAP SplitText plugin is properly licensed and registered
2. **Animation not triggering**: Check that ScrollTrigger is properly set up in your app
3. **Text layout issues**: Verify CSS classes are properly applied
4. **Performance issues**: Reduce stagger values and animation duration

### Debug Mode

Enable GSAP markers in development:

```tsx
// In your GSAP setup
ScrollTrigger.defaults({
  markers: process.env.NODE_ENV === 'development'
})
```
