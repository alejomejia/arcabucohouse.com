# StaggeredImageReveal Component

A performant, accessible React component for creating staggered image animations using GSAP.

## Features

- **Performance Optimized**: Memoized ref callbacks, lazy loading, and efficient re-renders
- **Accessible**: ARIA labels and proper semantic markup
- **Error Handling**: Graceful fallbacks when animations fail
- **Customizable**: Configurable animation timing and callbacks
- **Type Safe**: Full TypeScript support with proper interfaces

## Usage

```tsx
import { StaggeredImageReveal } from '@/components/images-animation'

const images = [
  { src: '/img1.jpg', alt: 'Description 1' },
  { src: '/img2.jpg', alt: 'Description 2' },
  { src: '/img3.jpg', alt: 'Description 3' },
]

<StaggeredImageReveal
  images={images}
  className="my-custom-class"
  animationDelay={0.5}
  staggerDelay={0.8}
  onComplete={() => console.log('Animation complete!')}
/>
```

## Props

| Prop                  | Type          | Default | Description                                 |
| --------------------- | ------------- | ------- | ------------------------------------------- |
| `images`              | `ImageData[]` | -       | Array of image objects with `src` and `alt` |
| `className`           | `string`      | `''`    | Additional CSS classes                      |
| `animationDelay`      | `number`      | `0.25`  | Initial delay before animation starts       |
| `staggerDelay`        | `number`      | `0.75`  | Delay between each image animation          |
| `onComplete` | `() => void`  | -       | Callback when animation finishes            |

## Animation Configuration

The component uses a centralized configuration object for consistent timing:

```tsx
const ANIMATION_CONFIG = {
  delay: 0.25, // Initial delay
  wrapperDuration: 1, // Wrapper clip-path animation duration
  imageDuration: 1.5, // Image scale animation duration
  staggerDelay: 0.75, // Delay between animations
  imageOffset: 0.25, // Offset for image animations
  ease: 'hop' // GSAP easing function
}
```

## Performance Optimizations

1. **Memoized Ref Callbacks**: Prevents unnecessary re-renders
2. **Lazy Loading**: Only the first image loads eagerly
3. **Error Boundaries**: Graceful fallbacks for failed animations
4. **Efficient Key Generation**: Uses `src-index` combination for stable keys

## Accessibility

- Proper ARIA labels for screen readers
- Semantic role attributes
- Hidden decorative elements
- Alt text support for all images

## Error Handling

The component includes comprehensive error handling:

- Animation creation errors are caught and logged
- Fallback CSS is applied if GSAP fails
- Image loading errors are logged with warnings
- Empty image arrays are handled gracefully
