'use client';

import { useRef, useCallback, useEffect } from 'react';
import './BorderGlow.css';

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

function buildGradientVars(colors) {
  return {
    '--glow-start': colors[0],
    '--glow-mid': colors[1] || colors[0],
    '--glow-end': colors[2] || colors[0],
  };
}

function isLightColor(color) {
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

// One 30 Hz timeline replaces four independent RAF chains. Only the decorative
// highlight is throttled; the transform-based hover lift remains compositor driven.
function animateSweep(card, onEnd) {
  const start = performance.now();
  let lastPaint = -Infinity;
  let frame = 0;
  const unit = value => Math.max(0, Math.min(value, 1));
  function tick(now) {
    const elapsed = Math.min(now - start, 4000);
    if (now - lastPaint >= 1000 / 30 - .5 || elapsed === 4000) {
      lastPaint = now;
      const edge = elapsed < 500 ? easeOutCubic(unit(elapsed / 500)) * 100
        : elapsed < 2500 ? 100 : (1 - easeInCubic(unit((elapsed - 2500) / 1500))) * 100;
      const angle = elapsed < 1500 ? easeInCubic(unit(elapsed / 1500)) * .5
        : .5 + easeOutCubic(unit((elapsed - 1500) / 2250)) * .5;
      card.style.setProperty('--edge-proximity', edge.toFixed(2));
      card.style.setProperty('--cursor-angle', `${(110 + 355 * angle).toFixed(2)}deg`);
    }
    if (elapsed < 4000) frame = requestAnimationFrame(tick);
    else onEnd();
  }
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

const BorderGlow = ({
  children,
  label,
  as: Component = 'div',
  preserveLayout = false,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const cancelSweepRef = useRef(() => {});
  const interactingRef = useRef(false);
  const pointerFrameRef = useRef(0);
  const pointerPositionRef = useRef({ x: 0, y: 0 });
  useEffect(() => () => cancelAnimationFrame(pointerFrameRef.current), []);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card || e.pointerType === 'touch') return;
    if (!interactingRef.current) cancelSweepRef.current();
    interactingRef.current = true;
    pointerPositionRef.current = { x: e.clientX, y: e.clientY };
    if (pointerFrameRef.current) return;
    pointerFrameRef.current = requestAnimationFrame(() => {
      pointerFrameRef.current = 0;
      if (!interactingRef.current) return;
      // One geometry read per paint, rather than three per pointer event.
      const rect = card.getBoundingClientRect();
      const cx = Math.max(1, rect.width / 2);
      const cy = Math.max(1, rect.height / 2);
      const dx = pointerPositionRef.current.x - rect.left - cx;
      const dy = pointerPositionRef.current.y - rect.top - cy;
      const edge = Math.min(1, Math.max(Math.abs(dx) / cx, Math.abs(dy) / cy));
      let angle = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;
      card.style.setProperty('--edge-proximity', `${Math.max(58, edge * 100).toFixed(3)}`);
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    interactingRef.current = false;
    cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = 0;
    const card = cardRef.current;
    if (card && !card.contains(document.activeElement)) card.style.setProperty('--edge-proximity', '0');
  }, []);

  const handleFocus = useCallback(() => {
    cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = 0;
    interactingRef.current = true;
    cancelSweepRef.current();
    cardRef.current?.style.setProperty('--edge-proximity', '100');
    cardRef.current?.style.setProperty('--cursor-angle', '130deg');
  }, []);

  const handleBlur = useCallback((event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    interactingRef.current = false;
    cardRef.current?.style.setProperty('--edge-proximity', '0');
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let played = false;
    let cancelAnimation = () => {};
    const stop = () => {
      cancelAnimation();
      cancelAnimation = () => {};
      card.classList.remove('sweep-active');
    };
    cancelSweepRef.current = stop;
    const play = () => {
      if (played || motionPreference.matches) return;
      played = true;
      if (interactingRef.current) return;
      card.classList.add('sweep-active');
      card.style.setProperty('--cursor-angle', '110deg');
      cancelAnimation = animateSweep(card, () => card.classList.remove('sweep-active'));
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else { stop(); card.style.setProperty('--edge-proximity', '0'); }
    }, { threshold: .15 });
    observer.observe(card);
    const onPreference = () => {
      if (motionPreference.matches) { stop(); card.style.setProperty('--edge-proximity', '0'); }
    };
    motionPreference.addEventListener('change', onPreference);
    const onVisibility = () => {
      if (document.hidden) { stop(); card.style.setProperty('--edge-proximity', '0'); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); observer.disconnect(); motionPreference.removeEventListener('change', onPreference); document.removeEventListener('visibilitychange', onVisibility); cancelSweepRef.current = () => {}; };
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const lightSurface = isLightColor(backgroundColor);

  return (
    <Component
      ref={cardRef}
      aria-label={label}
      onPointerEnter={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      className={`border-glow-card${lightSurface ? ' border-glow-card--light' : ''} ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" aria-hidden="true" />
      {preserveLayout ? children : <div className="border-glow-inner">{children}</div>}
    </Component>
  );
};

export default BorderGlow;
