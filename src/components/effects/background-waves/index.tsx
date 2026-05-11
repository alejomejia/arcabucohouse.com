import { CSSProperties, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/helpers'

import {
  type BackgroundWavesConfig,
  drawLines,
  type Mouse,
  movePoints,
  Noise,
  type Point,
} from './background-waves.helpers'

interface BackgroundWavesProps {
  lineColor?: string
  backgroundColor?: string
  waveSpeedX?: number
  waveSpeedY?: number
  waveAmpX?: number
  waveAmpY?: number
  xGap?: number
  yGap?: number
  friction?: number
  tension?: number
  maxCursorMove?: number
  style?: CSSProperties
  className?: string
}

/**
 * Full-bleed canvas of softly-animated lines rippling under a Perlin-noise
 * field, with a cursor-tracking elastic offset that pushes nearby line
 * points away from the pointer.
 *
 * The Perlin noise implementation, the per-frame displacement math, and
 * the canvas drawing are extracted to {@link ./background-waves.helpers}
 * to keep this file focused on lifecycle, refs, and DOM wiring.
 *
 * Mounts a single `requestAnimationFrame` loop and tears it down on
 * unmount; window resize is debounced (150ms) before recomputing the
 * canvas size and line lattice.
 *
 * @example
 * ```tsx
 * <BackgroundWaves lineColor="#ffffff20" backgroundColor="#000" />
 * ```
 */
export function BackgroundWaves({
  lineColor = 'black',
  backgroundColor = 'transparent',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  style = {},
  className = '',
}: BackgroundWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const boundingRef = useRef<{
    width: number
    height: number
    left: number
    top: number
  }>({ width: 0, height: 0, left: 0, top: 0 })
  const noiseRef = useRef(new Noise(Math.random()))
  const linesRef = useRef<Point[][]>([])
  const mouseRef = useRef<Mouse>({
    x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false,
  })

  const configRef = useRef<BackgroundWavesConfig>({
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  })

  const frameIdRef = useRef<number | null>(null)

  useEffect(() => {
    configRef.current = {
      lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap,
    }
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    ctxRef.current = canvas.getContext('2d')

    function setSize() {
      if (!container || !canvas) return
      const rect = container.getBoundingClientRect()
      boundingRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      }
      canvas.width = rect.width
      canvas.height = rect.height
    }

    function setLines() {
      const { width, height } = boundingRef.current
      linesRef.current = []
      const oWidth = width + 200
      const oHeight = height + 30
      const { xGap, yGap } = configRef.current
      const totalLines = Math.ceil(oWidth / xGap)
      const totalPoints = Math.ceil(oHeight / yGap)
      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2
      for (let i = 0; i <= totalLines; i++) {
        const pts: Point[] = []
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          })
        }
        linesRef.current.push(pts)
      }
    }

    function tick(t: number) {
      if (!container) return
      const mouse = mouseRef.current
      mouse.sx += (mouse.x - mouse.sx) * 0.1
      mouse.sy += (mouse.y - mouse.sy) * 0.1
      const dx = mouse.x - mouse.lx
      const dy = mouse.y - mouse.ly
      const d = Math.hypot(dx, dy)
      mouse.v = d
      mouse.vs += (d - mouse.vs) * 0.1
      mouse.vs = Math.min(100, mouse.vs)
      mouse.lx = mouse.x
      mouse.ly = mouse.y
      mouse.a = Math.atan2(dy, dx)
      container.style.setProperty('--x', `${mouse.sx}px`)
      container.style.setProperty('--y', `${mouse.sy}px`)

      movePoints(linesRef.current, mouse, noiseRef.current, configRef.current, t)

      const ctx = ctxRef.current
      if (ctx) {
        const { width, height } = boundingRef.current
        drawLines(ctx, linesRef.current, configRef.current.lineColor, width, height)
      }

      frameIdRef.current = requestAnimationFrame(tick)
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setSize()
        setLines()
        resizeTimer = null
      }, 150)
    }

    function updateMouse(x: number, y: number) {
      const mouse = mouseRef.current
      const b = boundingRef.current
      mouse.x = x - b.left
      mouse.y = y - b.top
      if (!mouse.set) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.set = true
      }
    }

    function onMouseMove(e: MouseEvent) {
      updateMouse(e.clientX, e.clientY)
    }
    function onTouchMove(e: TouchEvent) {
      const touch = e.touches[0]
      if (!touch) return
      updateMouse(touch.clientX, touch.clientY)
    }

    setSize()
    setLines()
    frameIdRef.current = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('absolute top-0 left-0 w-full h-full overflow-hidden', className)}
      style={{ backgroundColor, ...style }}
    >
      <div
        className="absolute top-0 left-0 bg-[#160000] rounded-full w-2 h-2"
        style={{
          transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
          willChange: 'transform',
        }}
      />
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
