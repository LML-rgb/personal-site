import type { ReactElement, ReactNode } from 'react'

export interface BorderGlowProps {
  children: ReactNode
  label?: string
  as?: 'div' | 'article'
  preserveLayout?: boolean
  className?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  fillOpacity?: number
}

export default function BorderGlow(props: BorderGlowProps): ReactElement
