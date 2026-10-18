import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects, projectPosterSizes, type Project } from "../data/projects";
import "./PortfolioCarousel.css";

export default function PortfolioCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const cycleWidthRef = useRef(0);
  const cardStepRef = useRef(0);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownRef = useRef(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [repeatCount, setRepeatCount] = useState(1);
  const paused = manuallyPaused || hovered || focused || interacting || reducedMotion || !visible || !pageVisible;

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = firstGroupRef.current;
    if (!viewport || !group) return;
    const updateCopies = () => {
      const width = group.getBoundingClientRect().width;
      cycleWidthRef.current = width;
      const card = group.firstElementChild as HTMLElement | null;
      cardStepRef.current = (card?.offsetWidth ?? 0) + (parseFloat(getComputedStyle(group).columnGap) || 0);
      if (width > 0) setRepeatCount(Math.max(1, Math.ceil(viewport.clientWidth / width)));
    };
    updateCopies();
    const observer = new ResizeObserver(updateCopies);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
    }, { root: viewport });
    viewport.querySelectorAll('.pc-card').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [repeatCount]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const finishPointerInteraction = () => {
      if (!pointerDownRef.current) return;
      pointerDownRef.current = false;
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = setTimeout(() => setInteracting(false), 2400);
    };
    window.addEventListener("pointerup", finishPointerInteraction);
    window.addEventListener("pointercancel", finishPointerInteraction);
    return () => {
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
      window.removeEventListener("pointerup", finishPointerInteraction);
      window.removeEventListener("pointercancel", finishPointerInteraction);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    let frame = 0;
    let previousTime = 0;
    // Preserve sub-pixel progress: some browsers round scrollLeft to whole pixels.
    let position = viewportRef.current?.scrollLeft ?? 0;
    const move = (time: number) => {
      const viewport = viewportRef.current;
      if (viewport) {
        if (previousTime && !document.hidden) {
          position += Math.min(time - previousTime, 50) * 0.05;
          const cycleWidth = cycleWidthRef.current;
          if (cycleWidth > 0 && position >= cycleWidth) position %= cycleWidth;
          viewport.scrollLeft = position;
        }
      }
      previousTime = time;
      frame = window.requestAnimationFrame(move);
    };
    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [paused]);

  const pauseForInteraction = () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    setInteracting(true);
  };

  const resumeAfterInteraction = () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => setInteracting(false), 2400);
  };

  const moveByCard = (direction: number) => {
    const viewport = viewportRef.current;
    const group = firstGroupRef.current;
    if (!viewport || !group) return;
    pauseForInteraction();
    const cycleWidth = cycleWidthRef.current;
    const step = cardStepRef.current || 344;
    if (direction < 0 && viewport.scrollLeft < step) viewport.scrollLeft += cycleWidth;
    if (direction > 0 && viewport.scrollLeft >= cycleWidth) viewport.scrollLeft -= cycleWidth;
    viewport.scrollBy({ left: direction * step, behavior: reducedMotion ? "instant" : "smooth" });
    resumeAfterInteraction();
  };

  const renderCard = (project: Project, index: number, repeated: boolean) => {
    const number = String(index + 1).padStart(2, "0");
    return (
      <a
        key={`${repeated ? "repeat" : "primary"}-${project.id}`}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="pc-card pc-has-media"
        style={{ "--pc-breathe-delay": `${index * -.82}s`, "--pc-breathe-duration": `${6.4 + index % 3 * .6}s` } as CSSProperties}
        tabIndex={repeated ? -1 : 0}
        aria-label={`${project.title}，第 ${index + 1} 部，共 ${projects.length} 部，在新标签页打开飞书作品`}
        onMouseDown={repeated ? (event) => event.preventDefault() : undefined}
      >
        <span className="pc-cover" aria-hidden="true">
          <img className="pc-poster" src={project.poster} srcSet={project.posterSrcSet} sizes={projectPosterSizes} alt="" width={1280} height={720} loading={index < 3 && !repeated ? "eager" : "lazy"} fetchPriority={index === 0 && !repeated ? "high" : "auto"} decoding="async" />
          <span className="pc-cover-top"><span>AI FILM</span><span>{number} / 08</span></span>
          <span className="pc-cover-bottom"><span>查看作品</span><ArrowUpRight size={18} strokeWidth={1.6} /></span>
        </span>
        <span className="pc-caption"><strong>{project.title}</strong><span>{project.category}</span></span>
      </a>
    );
  };

  return (
    <div id="work" className="portfolio-carousel" data-motion-paused={paused} aria-label="作品集，8 部作品">
      <div className="pc-header">
        <p className="pc-heading"><strong>作品集</strong><span>/ 08 部作品</span></p>
        <div className="pc-controls" aria-label="作品集滚动控制">
          <button type="button" onClick={() => moveByCard(-1)} aria-label="查看上一个作品"><ArrowLeft size={17} /></button>
          <button type="button" disabled={reducedMotion} onClick={() => setManuallyPaused((value) => !value)} aria-label={reducedMotion ? "已按系统偏好关闭自动滚动" : manuallyPaused ? "开始自动滚动" : "暂停自动滚动"} aria-pressed={reducedMotion || manuallyPaused}>{manuallyPaused || reducedMotion ? <Play size={14} /> : <Pause size={14} />}</button>
          <button type="button" onClick={() => moveByCard(1)} aria-label="查看下一个作品"><ArrowRight size={17} /></button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className="pc-viewport"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
        onPointerDown={() => { pointerDownRef.current = true; pauseForInteraction(); }}
        onPointerUp={resumeAfterInteraction}
        onPointerCancel={resumeAfterInteraction}
        onWheel={() => { pauseForInteraction(); resumeAfterInteraction(); }}
      >
        <div className="pc-track">
          <div className="pc-group" ref={firstGroupRef}>{projects.map((project, index) => renderCard(project, index, false))}</div>
          {Array.from({ length: repeatCount }, (_, copy) => <div className="pc-group" aria-hidden="true" key={`repeat-${copy}`}>{projects.map((project, index) => renderCard(project, index, true))}</div>)}
        </div>
      </div>
      <p className="pc-note">点击封面，在飞书查看完整作品<span>横向滑动，探索更多故事</span></p>
    </div>
  );
}
