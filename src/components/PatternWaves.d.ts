import type { CSSProperties, ReactElement, ReactNode } from 'react'

export interface PatternWavesProps {
  preset?: 'silk' | 'ocean' | 'pond' | 'lines' | 'terminal' | 'mesh'
  pattern?: 'dot' | 'square' | 'plus' | 'line' | 'glyph'
  wave?: 'silk' | 'swell' | 'ripple'
  spacing?: number
  markSize?: number
  depth?: number
  light?: number
  shine?: number
  contrast?: number
  speed?: number
  scale?: number
  direction?: number
  color?: string
  backgroundColor?: string
  opacity?: number
  fade?: 'edges' | 'center' | 'bottom' | 'top' | 'none'
  fadeSize?: number
  characters?: string
  interactive?: boolean
  cursorSize?: number
  cursorStrength?: number
  intro?: boolean
  paused?: boolean
  maxFps?: number
  fallback?: ReactNode
  className?: string
  style?: CSSProperties
}

export default function PatternWaves(props: PatternWavesProps): ReactElement
