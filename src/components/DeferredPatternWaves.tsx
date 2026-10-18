import { lazy, Suspense, useEffect, useState } from 'react'
import type { PatternWavesProps } from './PatternWaves'
import useLiteMotion from '../hooks/useLiteMotion'
import './DeferredPatternWaves.css'

function StaticPattern({ className = '', style, pattern = 'dot' }: PatternWavesProps) {
  return <div className={`pattern-waves pattern-preview pattern-preview-${pattern} ${className}`} style={style} aria-hidden="true" />
}

const PatternWaves = lazy(() => import('./PatternWaves').catch(() => ({ default: StaticPattern })))

// Let text and covers paint before downloading/compiling the decorative WebGL surface.
export default function DeferredPatternWaves(props: PatternWavesProps) {
  const lite = useLiteMotion()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (lite) return
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
  }, [lite])
  return !lite && ready ? <Suspense fallback={<StaticPattern {...props} />}><PatternWaves {...props} /></Suspense> : <StaticPattern {...props} />
}
