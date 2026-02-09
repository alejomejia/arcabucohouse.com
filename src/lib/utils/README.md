# Utils

Pure utility functions organized by concern.

## Common Patterns

```tsx
// Math
clamp(0, value, 100)
lerp(0, 100, 0.5) // → 50
mapRange(0, 1000, scrollY, 0, 1)

// Performance - DOM batching (prevents layout thrashing)
await measure(() => element.getBoundingClientRect())
await mutate(() => element.style.transform = 'translateX(10px)')

// Fetch with timeout
const response = await fetchWithTimeout(url, { timeout: 5000 })

// SEO
export const metadata = generatePageMetadata({ title: 'About' })
```
