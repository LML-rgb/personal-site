import { lazy, Suspense, useEffect, useState } from 'react'
import type { PatternWavesProps } from './PatternWaves'
import './DeferredPatternWaves.css'

function StaticPattern({ className = '', style }: PatternWavesProps) {
  return <div className={`pattern-waves pattern-preview ${className}`} style={style} aria-hidden="true" />
}

const PatternWaves = lazy(() => import('./PatternWaves').catch(() => ({ default: StaticPattern })))

// Let text and covers paint before downloading/compiling the decorative WebGL surface.
export default function DeferredPatternWaves(props: PatternWavesProps) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let frame = 0
    let idle = 0
    let timer = 0
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if ('requestIdleCallback' in window) {
          idle = window.requestIdleCallback(() => setReady(true), { timeout: 600 })
        } else {
          timer = setTimeout(() => setReady(true), 100)
        }
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      if (idle) window.cancelIdleCallback(idle)
      clearTimeout(timer)
    }
  }, [])
  return ready ? <Suspense fallback={<StaticPattern {...props} />}><PatternWaves {...props} /></Suspense> : <StaticPattern {...props} />
}
