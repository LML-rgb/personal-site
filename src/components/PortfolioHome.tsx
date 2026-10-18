import { useEffect, useRef } from 'react'
import useLiteMotion from '../hooks/useLiteMotion'
import { homeBackground } from '../data/site'
import PortfolioCarousel from './PortfolioCarousel'
import TwinklingSquares from './TwinklingSquares'
import PatternWaves from './DeferredPatternWaves'
import './PortfolioHome.css'

export default function PortfolioHome({ loaded }: { loaded: boolean }) {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const lite = useLiteMotion()

  useEffect(() => {
    const element = video.current
    if (!element || lite || !loaded) return
    let inView = false
    const syncPlayback = () => {
      if (inView && !document.hidden) void element.play().catch(() => {})
      else element.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncPlayback()
    }, { threshold: .05 })
    observer.observe(element)
    document.addEventListener('visibilitychange', syncPlayback)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', syncPlayback); element.pause() }
  }, [lite, loaded])

  return <section id="home" className="portfolio-home" ref={root} aria-labelledby="ph-title">
    <div className="ph-background" aria-hidden="true">
      {homeBackground.poster && <img className="ph-background-media" src={homeBackground.poster} alt="" />}
      {homeBackground.video && !lite && <video ref={video} className="ph-background-media" src={homeBackground.video} poster={homeBackground.poster || undefined} muted playsInline loop preload="none" tabIndex={-1} />}
      <PatternWaves
        preset="silk" pattern="square" spacing={13} markSize={.78}
        color="#8caac7" backgroundColor="transparent" opacity={.68}
        depth={.95} shine={.7} light={25} contrast={1.3}
        speed={.55} scale={1.1} direction={20}
        fade="edges" fadeSize={.45}
        interactive={loaded && !lite} cursorSize={75} cursorStrength={.6}
        intro={!lite} paused={!loaded || lite}
        fallback={<TwinklingSquares />}
      />
      <div className="ph-background-shade" />
    </div>
    <div className={`ph-copy${loaded ? ' is-ready' : ''}`}>
      <p className="ph-kicker"><span /> SELECTED WORKS · 2026</p>
      <h1 id="ph-title"><span className="ph-name">LIU MAOLIN</span><span className="ph-portfolio">PORTFOLIO<span className="ph-period">.</span></span><span className="sr-only">刘茂林的作品集</span></h1>
      <p className="ph-identity"><strong>刘茂林</strong><span>AI 短剧编导 · 全流程制作</span></p>
      <p className="ph-description">让剧本中的情绪，成为可见的画面。<br />从故事构思到成片，用 AI 创作每一帧。</p>
    </div>
    <PortfolioCarousel />
  </section>
}
