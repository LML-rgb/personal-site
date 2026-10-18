import { useEffect, useRef } from 'react'
import './TwinklingSquares.css'

type Square = {
  x: number
  y: number
  size: number
  opacity: number
  phase: number
  duration: number
  color: string
}

// Original canvas effect. This is independent of the licensed React Bits component.
export default function TwinklingSquares({ className = '' }: { className?: string }) {
  const surface = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = surface.current
    const element = canvas.current
    if (!host || !element) return
    const context = element.getContext('2d', { alpha: true })
    if (!context) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let squares: Square[] = []
    let frame = 0
    let lastFrame = 0
    let lastPaint = 0
    let elapsed = 0
    let inView = true
    let disposed = false

    // Stable per-cell variation keeps the field from reshuffling on every resize.
    const noise = (column: number, row: number, salt: number) => {
      const value = Math.sin(column * 127.1 + row * 311.7 + salt * 73.9) * 43758.5453
      return value - Math.floor(value)
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      for (const square of squares) {
        const wave = (Math.sin(elapsed / square.duration * Math.PI * 2 + square.phase) + 1) / 2
        // A slow diagonal swell joins the individual twinkles without flashing.
        const swell = (Math.sin(square.x / width * 7 + square.y / height * 3 - elapsed * .65) + 1) / 2
        const shimmer = .18 + .65 * wave * wave + .17 * swell ** 3
        const size = square.size * (.85 + .25 * wave)
        const inset = (square.size - size) / 2
        context.fillStyle = square.color
        context.globalAlpha = square.opacity * shimmer
        context.fillRect(square.x + inset, square.y + inset, size, size)
      }
      context.globalAlpha = 1
    }

    const canAnimate = () => !disposed && inView && !document.hidden && !motionPreference.matches

    const tick = (now: number) => {
      frame = 0
      if (!canAnimate()) return
      if (lastFrame) elapsed += Math.min(now - lastFrame, 100) / 1000
      lastFrame = now
      // A quiet background needs only 24 paints per second.
      if (now - lastPaint >= 1000 / 24) {
        draw()
        lastPaint = now
      }
      frame = requestAnimationFrame(tick)
    }

    const syncAnimation = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      lastFrame = 0
      lastPaint = 0
      draw()
      if (canAnimate()) frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1.2e6 / (width * height)))
      element.width = Math.round(width * dpr)
      element.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cell = width < 700 ? 20 : 24
      const columns = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)
      squares = []
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const progress = column / Math.max(1, columns - 1)
          const weight = progress * progress * (3 - 2 * progress)
          if (noise(column, row, 1) > .3 + weight * .65) continue
          const size = 4 + noise(column, row, 2) * 8
          squares.push({
            x: column * cell + (cell - size) / 2,
            y: row * cell + (cell - size) / 2,
            size,
            opacity: (.15 + noise(column, row, 3) * .27) * (.12 + weight * .88),
            phase: noise(column, row, 4) * Math.PI * 2,
            duration: 3.2 + noise(column, row, 5) * 4,
            color: ['#8baac7', '#b2c3d5', '#718ca8'][Math.floor(noise(column, row, 6) * 3)],
          })
        }
      }
      draw()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncAnimation()
    })
    visibilityObserver.observe(host)
    document.addEventListener('visibilitychange', syncAnimation)
    motionPreference.addEventListener('change', syncAnimation)
    resize()
    syncAnimation()

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', syncAnimation)
      motionPreference.removeEventListener('change', syncAnimation)
    }
  }, [])

  return (
    <div ref={surface} className={`twinkling-squares ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvas} className="twinkling-squares-canvas" />
    </div>
  )
}
