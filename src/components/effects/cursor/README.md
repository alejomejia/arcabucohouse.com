# Custom Cursor

A performant, customizable cursor component using GSAP and Tempus for smooth animations.

## Features

- **Smooth following** - Uses lerp interpolation synced with Tempus frame loop
- **GSAP animations** - State transitions powered by GSAP with custom easing
- **Customizable** - Add text, custom elements, or adjust size on hover
- **Context-based API** - Control cursor from anywhere in your app
- **Declarative triggers** - Use `CursorTrigger` for easy hover effects

## Installation

Wrap your app (or a section) with the provider:

```tsx
// app/layout.tsx
import { CustomCursorProvider } from '@/components/effects/cursor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CustomCursorProvider>{children}</CustomCursorProvider>
      </body>
    </html>
  )
}
```

## Reusable cursor states

Preset hover cursor configs live in `cursor-states.tsx`. Use them with `CursorTrigger` or `setHover()` for consistency across the app:

```tsx
import { CursorTrigger, CURSOR_EXPLORE, CURSOR_SCROLL, CURSOR_PLAY } from '@/components/effects/cursor/cursor-states'

<CursorTrigger config={CURSOR_EXPLORE}>…</CursorTrigger>
<CursorTrigger config={CURSOR_SCROLL}>…</CursorTrigger>
<CursorTrigger config={CURSOR_PLAY}>…</CursorTrigger>
```

## Usage

### Method 1: CursorTrigger (Declarative)

The simplest way to customize the cursor on hover:

```tsx
import { CursorTrigger } from '@/components/effects/cursor'

// Text cursor
<CursorTrigger config={{ text: 'View' }}>
  <img src="/photo.jpg" alt="Photo" />
</CursorTrigger>

// Custom content (icons, etc.)
<CursorTrigger config={{ content: <PlayIcon className="w-4 h-4" /> }}>
  <video src="/video.mp4" />
</CursorTrigger>

// Scaled cursor
<CursorTrigger config={{ scale: 2 }}>
  <button>Large cursor</button>
</CursorTrigger>

// Hidden cursor
<CursorTrigger config={{ hidden: true }}>
  <CustomInteractiveArea />
</CursorTrigger>

// Custom wrapper element
<CursorTrigger as="span" config={{ text: 'Link' }}>
  <a href="/page">Go to page</a>
</CursorTrigger>
```

### Method 2: useCustomCursor Hook (Imperative)

For more control or complex interactions:

```tsx
import { useCustomCursor } from '@/components/effects/cursor'

function MyComponent() {
  const { setHover, setDefault, hide, show } = useCustomCursor()

  return (
    <button
      onMouseEnter={() => setHover({ text: 'Click me!' })}
      onMouseLeave={setDefault}
    >
      Hover me
    </button>
  )
}
```

### Method 3: Combining Both

```tsx
function Gallery() {
  const { setHover, setDefault } = useCustomCursor()
  const [activeImage, setActiveImage] = useState(null)

  return (
    <div
      onMouseEnter={() => setHover({ text: activeImage?.title })}
      onMouseLeave={setDefault}
    >
      {images.map((img) => (
        <CursorTrigger
          key={img.id}
          config={{ text: img.title }}
          onMouseEnter={() => setActiveImage(img)}
        >
          <img src={img.src} alt={img.title} />
        </CursorTrigger>
      ))}
    </div>
  )
}
```

## Configuration

### Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hideNativeCursor` | `boolean` | `true` | Hide the native cursor globally |
| `defaultSize` | `number` | `16` | Default cursor size in pixels |
| `animationDuration` | `number` | `0.15` | State transition duration in seconds |
| `lerpFactor` | `number` | `0.15` | Smoothing factor for cursor following (0-1) |

### CursorConfig

| Property | Type | Description |
|----------|------|-------------|
| `text` | `string` | Text to display inside the cursor |
| `content` | `ReactNode` | Custom content to render |
| `hidden` | `boolean` | Hide the cursor completely |
| `scale` | `number` | Size multiplier (1 = default) |
| `className` | `string` | Additional CSS class for styling |

## Performance Notes

- Mouse position tracking uses passive event listeners
- Position updates use direct style manipulation (not GSAP) for per-frame updates
- State changes use GSAP for smooth transitions
- Cursor element is rendered in a portal to avoid layout interference
- Uses Tempus frame loop for consistent timing with other animations
