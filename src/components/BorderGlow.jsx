import React, { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars = {};

  for (let index = 0; index < opacities.length; index += 1) {
    vars[`--glow-color${keys[index]}`] = `hsl(${base} / ${Math.min(opacities[index] * intensity, 100)}%)`;
  }

  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};

  for (let index = 0; index < 7; index += 1) {
    const color = colors[Math.min(COLOR_MAP[index], colors.length - 1)];
    vars[GRADIENT_KEYS[index]] = `radial-gradient(at ${GRADIENT_POSITIONS[index]}, ${color} 0px, transparent 50%)`;
  }

  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
  return x * x * x;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  let rafId = 0;
  let timeoutId = 0;
  let stopped = false;
  const startTime = performance.now() + delay;

  function tick() {
    if (stopped) return;

    const elapsed = performance.now() - startTime;
    const t = Math.min(Math.max(elapsed / duration, 0), 1);
    onUpdate(start + (end - start) * ease(t));

    if (t < 1) rafId = requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }

  timeoutId = window.setTimeout(() => {
    if (!stopped) rafId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    stopped = true;
    window.clearTimeout(timeoutId);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null);
  const pointerFrameRef = useRef(0);

  const getCenterOfElement = useCallback((element) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((element, x, y) => {
    const [cx, cy] = getCenterOfElement(element);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;

    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);

    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((element, x, y) => {
    const [cx, cy] = getCenterOfElement(element);
    const dx = x - cx;
    const dy = y - cy;

    if (dx === 0 && dy === 0) return 0;

    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const clientX = event.clientX;
    const clientY = event.clientY;
    if (pointerFrameRef.current) return;

    pointerFrameRef.current = requestAnimationFrame(() => {
      pointerFrameRef.current = 0;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      card.style.setProperty("--edge-proximity", `${(getEdgeProximity(card, x, y) * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${getCursorAngle(card, x, y).toFixed(3)}deg`);
    });
  }, [getCursorAngle, getEdgeProximity]);

  useEffect(() => () => {
    if (pointerFrameRef.current) cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    let cancelAnimations = [];
    let hasPlayed = false;

    const playSweep = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      card.classList.add("sweep-active");
      card.style.setProperty("--cursor-angle", `${angleStart}deg`);

      cancelAnimations = [
        animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty("--edge-proximity", value) }),
        animateValue({
          ease: easeInCubic,
          duration: 1500,
          end: 50,
          onUpdate: (value) => {
            card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
          },
        }),
        animateValue({
          ease: easeOutCubic,
          delay: 1500,
          duration: 2250,
          start: 50,
          end: 100,
          onUpdate: (value) => {
            card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
          },
        }),
        animateValue({
          ease: easeInCubic,
          delay: 2500,
          duration: 1500,
          start: 100,
          end: 0,
          onUpdate: (value) => card.style.setProperty("--edge-proximity", value),
          onEnd: () => card.classList.remove("sweep-active"),
        }),
      ];
    };

    if (!("IntersectionObserver" in window)) {
      playSweep();
      return () => {
        cancelAnimations.forEach((cancel) => cancel());
        card.classList.remove("sweep-active");
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        playSweep();
        observer.disconnect();
      },
      { threshold: 0.28, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(card);

    return () => {
      observer.disconnect();
      cancelAnimations.forEach((cancel) => cancel());
      card.classList.remove("sweep-active");
    };
  }, [animated]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

export default BorderGlow;