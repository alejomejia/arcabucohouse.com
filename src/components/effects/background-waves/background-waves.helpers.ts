/**
 * 2D Perlin noise and per-frame helpers used by `BackgroundWaves`.
 * Extracted from the component to keep the React file focused on
 * lifecycle + DOM and to make these pure-JS pieces independently testable.
 */

export class Grad {
  x: number
  y: number
  z: number
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }
  dot2(x: number, y: number): number {
    return this.x * x + this.y * y
  }
}

export class Noise {
  grad3: Grad[]
  p: number[]
  perm: number[]
  gradP: Grad[]

  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ]
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
      21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
      237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
      111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216,
      80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
      3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
      17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
      129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
      238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
      195, 78, 66, 215, 61, 156, 180,
    ]
    this.perm = new Array(512)
    this.gradP = new Array(512)
    this.seed(seed)
  }
  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536
    seed = Math.floor(seed)
    if (seed < 256) seed |= seed << 8
    for (let i = 0; i < 256; i++) {
      const pValue = this.p[i]
      if (pValue === undefined) continue
      const v = i & 1 ? pValue ^ (seed & 255) : pValue ^ ((seed >> 8) & 255)
      this.perm[i] = this.perm[i + 256] = v
      const grad = this.grad3[v % 12]
      if (grad) {
        this.gradP[i] = this.gradP[i + 256] = grad
      }
    }
  }
  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b
  }
  perlin2(x: number, y: number): number {
    let X = Math.floor(x)
    let Y = Math.floor(y)
    x -= X
    y -= Y
    X &= 255
    Y &= 255
    const permY = this.perm[Y]
    const permY1 = this.perm[Y + 1]
    const gradP00 = this.gradP[X + (permY ?? 0)]
    const gradP01 = this.gradP[X + (permY1 ?? 0)]
    const gradP10 = this.gradP[X + 1 + (permY ?? 0)]
    const gradP11 = this.gradP[X + 1 + (permY1 ?? 0)]
    const n00 = gradP00?.dot2(x, y) ?? 0
    const n01 = gradP01?.dot2(x, y - 1) ?? 0
    const n10 = gradP10?.dot2(x - 1, y) ?? 0
    const n11 = gradP11?.dot2(x - 1, y - 1) ?? 0
    const u = this.fade(x)
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y))
  }
}

export interface Point {
  x: number
  y: number
  wave: { x: number; y: number }
  cursor: { x: number; y: number; vx: number; vy: number }
}

export interface Mouse {
  x: number
  y: number
  lx: number
  ly: number
  sx: number
  sy: number
  v: number
  vs: number
  a: number
  set: boolean
}

export interface BackgroundWavesConfig {
  lineColor: string
  waveSpeedX: number
  waveSpeedY: number
  waveAmpX: number
  waveAmpY: number
  friction: number
  tension: number
  maxCursorMove: number
  xGap: number
  yGap: number
}

/**
 * Mutates `lines` in place: applies a noise-driven wave displacement and a
 * cursor-driven elastic offset to every `Point`. Called per frame from the
 * `tick` loop with the current animation time.
 */
export function movePoints(
  lines: Point[][],
  mouse: Mouse,
  noise: Noise,
  config: BackgroundWavesConfig,
  time: number,
) {
  const { waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove } = config
  lines.forEach((pts) => {
    pts.forEach((p) => {
      const move = noise.perlin2((p.x + time * waveSpeedX) * 0.002, (p.y + time * waveSpeedY) * 0.0015) * 12
      p.wave.x = Math.cos(move) * waveAmpX
      p.wave.y = Math.sin(move) * waveAmpY

      const dx = p.x - mouse.sx
      const dy = p.y - mouse.sy
      const dist = Math.hypot(dx, dy)
      const l = Math.max(175, mouse.vs)
      if (dist < l) {
        const s = 1 - dist / l
        const f = Math.cos(dist * 0.001) * s
        p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
        p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
      }

      p.cursor.vx += (0 - p.cursor.x) * tension
      p.cursor.vy += (0 - p.cursor.y) * tension
      p.cursor.vx *= friction
      p.cursor.vy *= friction
      p.cursor.x += p.cursor.vx * 2
      p.cursor.y += p.cursor.vy * 2
      p.cursor.x = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.x))
      p.cursor.y = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.y))
    })
  })
}

/** Resolves a point's animated display coordinates, rounded to 1-decimal precision. */
export function moved(point: Point, withCursor = true): { x: number; y: number } {
  const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0)
  const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0)
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

/** Clears the canvas and renders every line as a connected path with the current stroke color. */
export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: Point[][],
  lineColor: string,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  ctx.strokeStyle = lineColor
  lines.forEach((points) => {
    const firstPoint = points[0]
    if (!firstPoint) return
    let p1 = moved(firstPoint, false)
    ctx.moveTo(p1.x, p1.y)
    points.forEach((p, idx) => {
      const isLast = idx === points.length - 1
      p1 = moved(p, !isLast)
      const nextPoint = points[idx + 1] || points[points.length - 1]
      if (nextPoint) {
        const p2 = moved(nextPoint, !isLast)
        ctx.lineTo(p1.x, p1.y)
        if (isLast) ctx.moveTo(p2.x, p2.y)
      }
    })
  })
  ctx.stroke()
}
