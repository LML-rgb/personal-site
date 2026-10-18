import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import useLiteMotion from '../hooks/useLiteMotion'
import type { PatternWavesProps } from './PatternWaves'
import PatternWaves from './DeferredPatternWaves'
import TwinklingSquares from './TwinklingSquares'
import './SectionPatternBackground.css'

type SectionVariant = 'strengths' | 'resume' | 'contact'

const variants: Record<SectionVariant, PatternWavesProps> = {
  strengths: {
    preset: 'ocean', pattern: 'dot', spacing: 12, markSize: .85,
    color: '#829fba', opacity: .66, depth: .6, shine: 1,
    speed: .34, scale: 1.2, direction: 115,
    fade: 'edges', fadeSize: .38,
  },
  resume: {
    preset: 'lines', pattern: 'line', spacing: 24, markSize: .13,
    color: '#7897b0', opacity: .58, depth: .75, shine: .6, light: 35,
    speed: .24, scale: 1.4, direction: -25,
    fade: 'edges', fadeSize: .38,
  },
  contact: {
    preset: 'pond', pattern: 'plus', spacing: 18, markSize: .64,
    color: '#a0b6c9', opacity: .7, depth: .65, shine: 1,
    speed: .38, scale: 1.2, direction: 230,
    fade: 'center', fadeSize: .6,
  },
}

export default function SectionPatternBackground({ variant }: { variant: SectionVariant }) {
  const host = useRef<HTMLDivElement>(null)
  const [activated, setActivated] = useState(false)
  const reduced = useReducedMotion()
  const lite = useLiteMotion()

  useEffect(() => {
    const element = host.current
    if (!element || lite) return
    // Initialize once near the section. PatternWaves pauses offscreen itself;
    // keeping it mounted avoids compiling shaders again on every return visit.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setActivated(true)
      observer.disconnect()
    }, { rootMargin: '180px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [lite])

  return <div ref={host} className={`section-pattern-background section-pattern-${variant}`} aria-hidden="true">
    <div className="section-pattern-surface">
      {(lite || activated) && <PatternWaves
        {...variants[variant]} backgroundColor="transparent" intro={false}
        maxFps={30}
        paused={!!reduced} interactive={!reduced} cursorSize={70} cursorStrength={.4}
        fallback={<TwinklingSquares />}
      />}
    </div>
    <div className="section-pattern-shade" />
  </div>
}
