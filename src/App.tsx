import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownToLine, ArrowUpRight, Check, Clapperboard, Copy, FileText, Film, Mail, MonitorPlay, Phone, Sparkles } from 'lucide-react'
import PortfolioHome from './components/PortfolioHome'
import ResumeSection from './components/ResumeSection'
import SectionPatternBackground from './components/SectionPatternBackground'
import GlowCard from './components/GlowCard'
import useLiteMotion, { isLiteMotion } from './hooks/useLiteMotion'
import { resumeDownload } from './data/resume'

const EMAIL = '2447325248@qq.com'
const INTRO_KEY = 'lm-portfolio-intro-seen'

function shouldShowIntro() {
  if (isLiteMotion() || !['', '#home'].includes(location.hash)) return false
  try { return !sessionStorage.getItem(INTRO_KEY) } catch { return true }
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    let id = 0
    let timer: ReturnType<typeof setTimeout>
    const start = performance.now()
    const frame = (now: number) => {
      const progress = Math.min((now - start) / (reduced ? 120 : 700), 1)
      setCount(Math.round(progress * 100))
      if (progress < 1) id = requestAnimationFrame(frame)
      else timer = setTimeout(onComplete, 0)
    }
    id = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(id); clearTimeout(timer) }
  }, [onComplete, reduced])
  const word = ['Imagine.', 'Create.', 'Inspire.'][Math.min(2, Math.floor(count / 34))]
  return <motion.div className="loading-screen" exit={{ opacity: 0, transition: { duration: .25 } }} aria-label="页面载入中" aria-live="off">
    <span className="loading-brand">LM / PORTFOLIO '26</span>
    <AnimatePresence mode="wait"><motion.span className="loading-word" key={word} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .12 }}>{word}</motion.span></AnimatePresence>
    <span className="loading-counter">{String(count).padStart(3, '0')}<small>%</small></span>
    <div className="loading-progress"><div className="accent-gradient" style={{ transform: `scaleX(${count / 100})` }} /></div>
  </motion.div>
}

function Navbar() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const sections = ['home', 'work', 'approach', 'resume'].map(id => document.getElementById(id)).filter((element): element is HTMLElement => !!element)
    let positions: { id: string; top: number }[] = []
    let marker = 0
    let frame = 0
    let lastActive = 'home'
    let lastScrolled = false
    const update = () => {
      frame = 0
      const scroll = window.scrollY
      const isScrolled = scroll > 100
      if (isScrolled !== lastScrolled) { lastScrolled = isScrolled; setScrolled(isScrolled) }
      let current = 'home'
      for (const section of positions) if (section.top <= scroll + marker) current = section.id
      if (current !== lastActive) { lastActive = current; setActive(current) }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => {
      const scroll = window.scrollY
      positions = sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top + scroll }))
      marker = window.innerHeight * .32
      schedule()
    }
    const observer = new ResizeObserver(measure)
    sections.forEach(section => observer.observe(section))
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    measure()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure) }
  }, [])
  return <header className="nav-wrap"><nav className={`floating-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="主导航">
    <a className="logo-ring" href="#home" aria-label="刘茂林 首页"><span>LM</span></a>
    <i className="nav-divider" />
    {[['work', '作品集'], ['approach', '个人优势'], ['resume', '简历']].map(([id, label]) => <a key={id} className={`nav-link ${active === id ? 'is-active' : ''}`} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
    <i className="nav-divider" />
    <a className="nav-contact" href="#contact">聊一聊 <ArrowUpRight size={14} /></a>
  </nav></header>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const lite = useLiteMotion()
  if (lite) return <div className={className}>{children}</div>
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay, ease: [.25, .1, .25, 1] }} viewport={{ once: true, margin: '-60px' }}>{children}</motion.div>
}

const processSteps = [
  { number: '01', en: 'Story & Script', title: '剧本理解与叙事设计', text: '理解剧本、人物关系与叙事节奏，将剧情转化为可执行的视觉表达。', icon: Film, tag: '剧本理解 / 叙事节奏' },
  { number: '02', en: 'Frames & Direction', title: '镜头语言与分镜设计', text: '围绕人物情绪设计景别、构图、光影氛围与画面风格，完成分镜构思。', icon: Clapperboard, tag: '镜头语言 / 分镜设计' },
  { number: '03', en: 'AI & Generation', title: 'AI 视觉与提示词优化', text: '结合 AI 视觉生成工具与智能体优化提示词，提升画面稳定性与表现力。', icon: Sparkles, tag: 'AI 视觉 / 提示词优化' },
  { number: '04', en: 'Edit & Finish', title: '剪辑包装与成片制作', text: '完成剪辑与包装，在画面衔接和剪辑节奏中推进叙事，交付完整成片。', icon: MonitorPlay, tag: '剪辑节奏 / 后期包装' },
]

function Process() {
  return <section id="approach" className="process-section pattern-section">
    <SectionPatternBackground variant="strengths" />
    <div className="section-shell section-pattern-content">
    <Reveal className="section-top"><div><div className="eyebrow"><span className="eyebrow-line" /> PERSONAL STRENGTHS / 02</div><h2>个人优势</h2></div><p className="section-caption">从剧本到成片，<br />让创意稳定落地。</p></Reveal>
    <div className="advantage-grid">{processSteps.map((step, i) => <Reveal key={step.number} delay={i * .05}><GlowCard as="article" className="advantage-card"><div className="advantage-card-top"><span className="advantage-icon"><step.icon size={28} strokeWidth={1.5} /></span><span className="advantage-number">{step.number}</span></div><h3>{step.title}</h3><span className="advantage-english">{step.en}</span><p>{step.text}</p><span className="advantage-tag">{step.tag}</span></GlowCard></Reveal>)}</div>
    </div>
  </section>
}

function Contact() {
  const track = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lite = useLiteMotion()
  useEffect(() => {
    const element = track.current
    if (lite || !element) return
    let inView = false
    let disposed = false
    let requested = false
    let play: (() => void) | undefined
    let pause: (() => void) | undefined
    let kill: (() => void) | undefined
    const sync = () => {
      if (!inView || document.hidden) { pause?.(); return }
      if (play) { play(); return }
      if (requested) return
      requested = true
      void import('gsap').then(({ default: gsap }) => {
        if (disposed) return
        const tween = gsap.to(element, { xPercent: -50, duration: 40, repeat: -1, ease: 'none', paused: true })
        play = () => { tween.play() }
        pause = () => { tween.pause() }
        kill = () => { tween.kill() }
        sync()
      }).catch(() => { requested = false })
    }
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync() })
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', sync); kill?.() }
  }, [lite])
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setCopyError(false); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2200) }
    catch { setCopyError(true) }
  }
  return <footer id="contact" className="contact-section pattern-section"><SectionPatternBackground variant="contact" />
    <div className="contact-content section-shell"><Reveal><div className="eyebrow"><span className="eyebrow-line" /> LET'S MAKE SOMETHING GREAT / 04</div><h2>下一个故事，<br /><em>一起开始。</em></h2><p>寻找 AI 短剧编导与全流程制作机会。<br />欢迎聊聊你的项目，或一个有意思的想法。</p><div className="contact-email"><a className="pill-button primary" href={`mailto:${EMAIL}`}><Mail size={17} /> {EMAIL} <ArrowUpRight size={17} /></a><button className="copy-button" onClick={copyEmail} aria-label={copied ? '邮箱已复制' : '复制邮箱'} title={copied ? '已复制' : '复制邮箱'}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div><div className="copy-feedback" role="status">{copied ? '邮箱已复制' : copyError ? '请直接点击邮箱发送邮件，或选中邮箱复制。' : ''}</div><a className="contact-phone" href="tel:+8615725751655"><Phone size={13} />157 2575 1655</a></Reveal></div>
    <div className="marquee-viewport" aria-hidden="true"><div className="marquee-track" ref={track}>{Array.from({ length: lite ? 1 : 10 }, (_, i) => <span key={i}>STORIES INTO <em>FRAMES.</em><b>✳</b></span>)}</div></div>
    <div className="footer-resume-shell section-shell">
      <a className="footer-resume-download" href={resumeDownload.url} download={resumeDownload.filename} aria-label="下载刘茂林简历（PDF）">
        <span className="footer-resume-icon" aria-hidden="true"><FileText size={32} strokeWidth={1.5} /></span>
        <span className="footer-resume-copy"><strong>下载我的完整简历</strong><span>刘茂林 · AI 短剧编导 · PDF 文件</span></span>
        <span className="footer-resume-action">下载简历 <ArrowDownToLine size={24} aria-hidden="true" /></span>
      </a>
    </div>
    <div className="footer-bar section-shell"><a href="#home" className="footer-brand">Liu <em>Maolin.</em></a><span>© 2026 刘茂林</span><span className="tiny-status"><i /> 期待新的创作机会</span><a href="#home" className="back-top" aria-label="回到顶部"><ArrowUpRight size={17} /></a></div>
  </footer>
}

const finishLoading = (setter: (v: boolean) => void) => () => {
  try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* The page also works with blocked session storage. */ }
  setter(false)
}
export default function App() {
  const lite = useLiteMotion()
  const [loading, setLoading] = useState(shouldShowIntro)
  const complete = useRef(finishLoading(setLoading)).current
  return <MotionConfig reducedMotion="user"><a href="#work" className="skip-link">跳至作品</a><AnimatePresence>{loading && !lite && <LoadingScreen onComplete={complete} />}</AnimatePresence><Navbar /><main><PortfolioHome loaded={!loading || lite} /><Process /><ResumeSection /></main><Contact /></MotionConfig>
}
