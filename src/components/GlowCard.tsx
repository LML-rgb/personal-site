import type { ReactNode } from 'react'
import BorderGlow from './BorderGlow'
import useLiteMotion from '../hooks/useLiteMotion'
import './GlowCard.css'

export default function GlowCard({ children, className, as = 'div', radius = 20, label }: {
  children: ReactNode
  className: string
  as?: 'div' | 'article'
  radius?: number
  label?: string
}) {
  const lite = useLiteMotion()
  if (lite) {
    const Component = as
    return <Component className={`glow-card glow-card-static ${className}`} aria-label={label}>{children}</Component>
  }
  return <BorderGlow as={as} label={label} preserveLayout className={`glow-card ${className}`}
    edgeSensitivity={38} glowColor="210 45 80" backgroundColor="#11171c"
    borderRadius={radius} glowRadius={20} glowIntensity={1.3} coneSpread={29}
    animated colors={['#b6c9de', '#6f91b4', '#d5e2ee']} fillOpacity={.12}
  >{children}</BorderGlow>
}
