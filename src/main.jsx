import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import QRCode from "qrcode";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Cpu,
  Film,
  Mail,
  MapPin,
  Mic2,
  PenTool,
  WandSparkles,
  Workflow,
  X,
} from "lucide-react";
import BorderGlow from "./components/BorderGlow";
import Grainient from "./components/Grainient";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "经历", href: "#experience" },
  { label: "作品", href: "#hero" },
  { label: "优势", href: "#advantages" },
  { label: "联系", href: "#contact" },
];

const heroWorks = [
  {
    title: "官印丢了",
    label: "短剧样片",
    image: "/assets/work-01-cover.webp",
    projectUrl: "https://v.douyin.com/M20j6dPnIW0/",
    qrImage: "/assets/work-01-douyin-qr.png",
    qrCaption: "抖音app扫码观看",
    copy: "县令官印竟然弄丢了？真相竟然是",
  },
  {
    title: "量子余烬",
    label: "短剧样片",
    image: "/assets/work-02-cover.webp",
    projectUrl: "https://v.douyin.com/8iPy8bFQRhc/",
    qrImage: "/assets/work-02-douyin-qr.png",
    qrCaption: "抖音app扫码观看",
    copy: "末世来临，我靠系统逆风翻盘",
  },
  {
    title: "收油工",
    label: "短剧样片",
    image: "/assets/work-03-cover.webp",
    projectUrl: "/projects/work-03",
    linkUnavailableText: "参赛作品，暂不展示",
    copy: "地沟油到航空煤油的蜕变",
  },
  {
    title: "月老不好当",
    label: "短剧样片",
    image: "/assets/work-04-cover.webp",
    projectUrl: "https://v.douyin.com/jN7_c14tfho/",
    qrImage: "/assets/work-04-douyin-qr.png",
    qrCaption: "抖音 app 扫码观看",
    copy: "月老把姻缘连错了，看其如何补救",
  },
  {
    title: "人小鬼大",
    label: "短剧样片",
    image: "/assets/work-05-cover.webp",
    projectUrl: "https://v.douyin.com/WmN1CwKA438/",
    qrImage: "/assets/work-05-douyin-qr.png",
    qrCaption: "抖音 app 扫码观看",
    copy: "萌宝跟随师傅隐居修炼，一出山便惊天动地",
  },
  {
    title: "鱼水谣",
    label: "短剧样片",
    image: "/assets/work-06-cover.webp",
    projectUrl: "https://v.douyin.com/owWZG3oj95A/",
    qrImage: "/assets/work-06-douyin-qr.png",
    qrCaption: "抖音 app 扫码观看",
    copy: "抗日电视剧",
  },
  {
    title: "交易筹码",
    label: "短剧样片",
    image: "/assets/work-07-cover.webp",
    projectUrl: "/projects/work-07",
    linkUnavailableText: "出海短剧，不便展示",
    copy: "我的评价是：毁三观，拉完了",
  },
];

const stats = [
  { value: "1年", label: "高密度AI短剧实战" },
  { value: "全流程", label: "小说 / 剧本 / 抽卡 / 剪辑 / 成片" },
  { value: "6+", label: "核心AI工具与工作流节点" },
  { value: "2025", label: "山东理工大学毕业" },
];

const toolStrip = ["Seedance 2.0", "可灵 Omini3", "GPT-image", "Nano Banana", "ComfyUI", "AI配音"];

const advantages = [
  {
    icon: Clapperboard,
    title: "AI短剧全流程交付",
    text: "能独立推进从文本、剧本、分镜、抽卡到剪辑后期的完整制作，不只停留在单张画面生成。",
  },
  {
    icon: Film,
    title: "视频生成控制",
    text: "熟悉Seedance 2.0、可灵 Omini3，对剧情镜头、人物动作、面部表情和多镜头衔接有实战经验。",
  },
  {
    icon: WandSparkles,
    title: "生图与视觉资产",
    text: "能用GPT-image、Nano Banana建立角色形象、首帧参考、场景图和海报资产，让视频生成有稳定视觉依据。",
  },
  {
    icon: PenTool,
    title: "提示词工程",
    text: "提示词结构清晰，重视人物、空间、光影、情绪和动作因果，减少抽卡随机性与重复返工。",
  },
  {
    icon: Mic2,
    title: "声音制作意识",
    text: "能够使用AI完成配音、旁白、角色对白、配乐和基础音效，让画面节奏与情绪表达保持统一。",
  },
  {
    icon: Cpu,
    title: "本地工作流部署",
    text: "关注开源AI领域，具备部署开源项目与搭建ComfyUI本地工作流的能力，适配批量生产需求。",
  },
  {
    icon: Bot,
    title: "Codex辅助工作",
    text: "熟练运用Codex辅助梳理创意、优化提示词、管理资料与推进网页制作，提高工作效率和执行稳定性。",
  },
  {
    icon: Clapperboard,
    title: "导演基础与镜头语言",
    text: "有导演基础，对景别、运动、调度、节奏和情绪表达理解深刻，能把画面生成转化为可执行的镜头设计。",
  },
];

function getWorkProjectUrl(work) {
  const rawUrl = work?.projectUrl || "#";

  if (typeof window === "undefined") {
    return rawUrl;
  }

  try {
    return new URL(rawUrl, window.location.origin).href;
  } catch {
    return rawUrl;
  }
}

function isWorkLinkUnavailable(work) {
  return Boolean(work?.linkUnavailableText);
}
function getCarouselOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function getCarouselTransform(offset, length) {
  const angle = offset * (360 / length);
  const radians = (angle * Math.PI) / 180;
  const absOffset = Math.abs(offset);
  const x = Math.sin(radians) * 610;
  const z = (Math.cos(radians) - 1) * 560;
  const y = absOffset * 16;
  const scale = 1 - absOffset * 0.04;
  const opacity = 1 - absOffset * 0.1;

  return {
    absOffset,
    style: {
      "--x": `${Math.round(x)}px`,
      "--y": `${Math.round(y)}px`,
      "--z": `${Math.round(z)}px`,
      "--x-md": `${Math.round(x * 0.82)}px`,
      "--z-md": `${Math.round(z * 0.82)}px`,
      "--x-sm": `${Math.round(x * 0.42)}px`,
      "--y-sm": `${Math.round(y * 0.68)}px`,
      "--z-sm": `${Math.round(z * 0.48)}px`,
      "--rotate-y": `${Math.round(-angle * 0.42)}deg`,
      "--scale": scale.toFixed(3),
      "--card-opacity": opacity.toFixed(3),
      "--z-index": 50 - absOffset,
    },
  };
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playerWork, setPlayerWork] = useState(null);
  const [qrCodeSrc, setQrCodeSrc] = useState("");
  const siteRef = useRef(null);
  useEffect(() => {
    if (!playerWork || isWorkLinkUnavailable(playerWork)) {
      setQrCodeSrc("");
      return undefined;
    }

    let ignored = false;
    const targetUrl = getWorkProjectUrl(playerWork);

    setQrCodeSrc("");
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#121210",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (!ignored) setQrCodeSrc(url);
      })
      .catch(() => {
        if (!ignored) setQrCodeSrc("");
      });

    return () => {
      ignored = true;
    };
  }, [playerWork]);
  const activeWork = heroWorks[activeIndex];

  const carouselCards = useMemo(
    () =>
      heroWorks.map((work, index) => {
        const offset = getCarouselOffset(index, activeIndex, heroWorks.length);
        const { absOffset, style } = getCarouselTransform(offset, heroWorks.length);
        return {
          ...work,
          offset,
          absOffset,
          style,
        };
      }),
    [activeIndex],
  );

  const moveCarousel = (direction) => {
    setActiveIndex((current) => (current + direction + heroWorks.length) % heroWorks.length);
  };

  const openProjectPanel = (work) => {
    setPlayerWork(work);
  };

  const handleCarouselCardClick = (work, index, offset) => {
    if (offset === 0) {
      openProjectPanel(work);
      return;
    }

    setActiveIndex(index);
  };

  const handleCarouselStageClick = (event) => {
    if (event.target.closest(".carousel-card")) {
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const centerX = width / 2;
    const activeCardHalfWidth = 245;

    if (clickX < centerX - activeCardHalfWidth) {
      moveCarousel(-1);
    } else if (clickX > centerX + activeCardHalfWidth) {
      moveCarousel(1);
    }
  };

  useEffect(() => {
    if (!playerWork) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPlayerWork(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerWork]);

  useEffect(() => {
    const root = siteRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      root.classList.add("motion-reduced", "opening-complete");
      return undefined;
    }
    if (!window.location.hash) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const refreshTriggers = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refreshTriggers, 900);
    window.addEventListener("load", refreshTriggers);
    const scrollObservers = [];

    const ctx = gsap.context(() => {
      gsap.set(".opening-mark span", { yPercent: 118, skewY: 8 });
      gsap.set(".opening-line", { scaleX: 0 });
      gsap.set(".topbar", { autoAlpha: 0, y: -34 });
      gsap.set(".hero-ambient-image", { scale: 1.08, filter: "contrast(0.96) saturate(0.94) brightness(0.9)" });
      gsap.set(".hero-content h1", {
        autoAlpha: 1,
        clipPath: "inset(0 0 100% 0)",
        y: 92,
        scaleY: 0.72,
        transformOrigin: "50% 0%",
      });
      gsap.set(".hero-actions, .carousel-copy, .carousel-controls", { autoAlpha: 0, y: 32 });
      gsap.set(".carousel-card", { "--motion-y": "88px" });

      gsap
        .timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            document.body.style.overflow = previousOverflow;
            root.classList.add("opening-complete");
            initScrollMotion();
            refreshTriggers();
          },
        })
        .to(".opening-mark span", {
          yPercent: 0,
          skewY: 0,
          duration: 0.62,
          stagger: 0.05,
        })
        .to(".opening-line", { scaleX: 1, duration: 0.46 }, "-=0.26")
        .to(
          ".opening-mark span",
          {
            yPercent: -118,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.inOut",
          },
          "+=0.04",
        )
        .to(".opening-line", { scaleX: 0, duration: 0.34, ease: "power3.inOut" }, "<")
        .to(".opening-panel-left", { xPercent: -102, duration: 0.72, ease: "expo.inOut" }, "-=0.04")
        .to(".opening-panel-right", { xPercent: 102, duration: 0.72, ease: "expo.inOut" }, "<")
        .to(".opening-animation", { autoAlpha: 0, duration: 0.24, ease: "power2.out" }, "-=0.08")
        .set(".opening-animation", { display: "none" })
        .to(".hero-ambient-image", { scale: 1, filter: "contrast(1.04) saturate(1.02) brightness(0.88)", duration: 0.9 }, "-=0.68")
        .to(".topbar", { autoAlpha: 1, y: 0, duration: 0.58 }, "-=0.78")
        .to(
          ".hero-content h1",
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            scaleY: 1,
            duration: 0.92,
            ease: "expo.out",
          },
          "-=0.58",
        )
        .to(".hero-actions", { autoAlpha: 1, y: 0, duration: 0.54 }, "-=0.46")
        .to(".carousel-copy", { autoAlpha: 1, y: 0, duration: 0.52 }, "-=0.38")
        .to(
          ".carousel-card",
          {
            "--motion-y": "0px",
            duration: 0.82,
            stagger: { each: 0.07, from: "center" },
          },
          "-=0.45",
        )
        .to(".carousel-controls", { autoAlpha: 1, y: 0, duration: 0.46 }, "-=0.52");

      let scrollMotionReady = false;
      const initScrollMotion = () => {
        if (scrollMotionReady) return;
        scrollMotionReady = true;

        const runWhenVisible = (trigger, animate, options = {}) => {
          const target = typeof trigger === "string" ? root.querySelector(trigger) : trigger;
          if (!target) return;

          let hasPlayed = false;
          const play = () => {
            if (hasPlayed) return;
            hasPlayed = true;
            animate();
          };

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                play();
                observer.disconnect();
              });
            },
            {
              threshold: options.threshold ?? 0.12,
              rootMargin: options.rootMargin ?? "0px 0px -22% 0px",
            },
          );

          observer.observe(target);
          scrollObservers.push(observer);

          window.requestAnimationFrame(() => {
            const rect = target.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * -0.08) {
              play();
              observer.disconnect();
            }
          });
        };

        const revealTitle = (selector, trigger) => {
          gsap.utils.toArray(selector).forEach((title) => {
            const triggerTarget = trigger ?? title;
            gsap.set(title, {
              autoAlpha: 1,
              clipPath: "inset(0 0 100% 0)",
              y: 118,
              scaleY: 0.68,
              transformOrigin: "50% 0%",
            });
            runWhenVisible(triggerTarget, () => {
              gsap.to(title, {
                clipPath: "inset(0 0 -4% 0)",
                y: 0,
                scaleY: 1,
                duration: 1.18,
                ease: "expo.out",
              });
            });
          });
        };

        const staggerReveal = (selector, trigger, options = {}) => {
          const items = gsap.utils.toArray(selector);
          if (!items.length) return;

          const fromVars = {
            autoAlpha: 0,
            x: options.x ?? 0,
            y: options.y ?? 56,
            rotateX: options.rotateX ?? 0,
            transformOrigin: options.origin ?? "50% 100%",
          };
          const toVars = {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotateX: 0,
            duration: options.duration ?? 0.95,
            ease: options.ease ?? "power4.out",
            stagger: options.stagger ?? 0.09,
          };

          if (options.scale != null) {
            fromVars.scale = options.scale;
            toVars.scale = 1;
          }

          if (options.mask) {
            fromVars.clipPath = options.clipStart ?? "inset(0 0 100% 0)";
            toVars.clipPath = "inset(0 0 0% 0)";
          }

          gsap.set(items, fromVars);
          runWhenVisible(trigger, () => gsap.to(items, toVars), {
            threshold: options.threshold,
            rootMargin: options.rootMargin,
          });
        };

        const sectionReveal = (selector, options = {}) => {
          gsap.utils.toArray(selector).forEach((section) => {
            gsap.set(section, {
              clipPath: options.clipStart ?? "inset(7% 0 7% 0)",
              filter: options.filter ?? "blur(8px)",
              y: options.y ?? 86,
            });
            runWhenVisible(
              section,
              () => {
                gsap.to(section, {
                  clipPath: "inset(0% 0 0% 0)",
                  filter: "blur(0px)",
                  y: 0,
                  duration: options.duration ?? 1.18,
                  ease: options.ease ?? "expo.out",
                });
              },
              { threshold: options.threshold ?? 0.08, rootMargin: options.rootMargin ?? "0px 0px -18% 0px" },
            );
          });
        };

        const revealToolStrip = () => {
          const strip = root.querySelector(".tool-strip");
          const inner = root.querySelector(".tool-strip-inner");
          const items = gsap.utils.toArray(".tool-strip span");
          if (!strip || !inner || !items.length) return;

          gsap.set(strip, { autoAlpha: 1, clearProps: "clipPath,filter,y" });
          gsap.set(inner, { transformOrigin: "50% 50%", clearProps: "transform,y" });
          gsap.set(items, { autoAlpha: 1, transformOrigin: "50% 100%", clearProps: "transform,opacity,visibility" });

          runWhenVisible(
            strip,
            () => {
              gsap
                .timeline({ defaults: { ease: "expo.out" } })
                .fromTo(
                  strip,
                  { clipPath: "inset(0 48% 0 48%)", filter: "blur(7px)", y: 42 },
                  {
                    clipPath: "inset(0 0% 0 0%)",
                    filter: "blur(0px)",
                    y: 0,
                    duration: 0.92,
                  },
                )
                .fromTo(inner, { scaleX: 0.92, y: 18 }, { scaleX: 1, y: 0, duration: 0.78 }, "-=0.68")
                .from(
                  items,
                  {
                    autoAlpha: 0,
                    y: 30,
                    scale: 0.96,
                    duration: 0.68,
                    stagger: 0.055,
                    ease: "power4.out",
                  },
                  "-=0.46",
                );
            },
            { threshold: 0.04, rootMargin: "0px 0px -8% 0px" },
          );
        };

      revealToolStrip();

      sectionReveal("#experience", { y: 96, duration: 1.22, start: "top 62%" });
      sectionReveal("#advantages", { y: 104, duration: 1.24, start: "top 62%" });
      sectionReveal("#contact", {
        clipStart: "inset(12% 0 0 0)",
        filter: "blur(6px)",
        y: 90,
        duration: 1.25,
        start: "top 70%",
      });

      revealTitle("#experience .experience-copy h2", ".experience-copy");
      revealTitle("#advantages .section-heading h2", "#advantages .section-heading");
      revealTitle("#contact .contact-content h2", "#contact .contact-content");

      staggerReveal("#experience .contact-strip > *", "#experience .contact-strip", { y: 28, stagger: 0.05, start: "top 86%" });
      staggerReveal("#experience .stat-item", "#experience .stat-grid", { y: 70, rotateX: -8, stagger: 0.1 });
      staggerReveal("#advantages .advantage-glow", "#advantages .advantage-grid", {
        y: 88,
        rotateX: -10,
        stagger: 0.11,
        duration: 0.62,
      });
      staggerReveal("#contact .contact-actions > *", "#contact", { y: 42, stagger: 0.1 });
      staggerReveal("#advantages .advantage-icon", "#advantages .advantage-grid", {
        y: 24,
        scale: 0.72,
        stagger: 0.05,
        duration: 0.5,
        start: "top 82%",
      });
      staggerReveal("#advantages .advantage-card h3, #advantages .advantage-card p", "#advantages .advantage-grid", {
        y: 30,
        stagger: 0.045,
        duration: 0.9,
        start: "top 81%",
      });
      staggerReveal("#contact .contact-content > p", "#contact", {
        y: 48,
        mask: true,
        duration: 0.92,
        start: "top 82%",
      });

      staggerReveal("#experience .section-kicker", ".experience-copy", {
        y: 24,
        duration: 0.72,
        ease: "power3.out",
      });
      staggerReveal("#contact .section-kicker", "#contact .contact-content", {
        y: 24,
        duration: 0.72,
        ease: "power3.out",
      });
      staggerReveal("#advantages .split-heading > p", "#advantages .section-heading", {
        x: 70,
        y: 0,
        duration: 1,
        ease: "power4.out",
      });
      staggerReveal(".profile-focus, .experience-copy > p:not(.section-kicker):not(.profile-focus)", ".experience-copy", {
        y: 36,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.1,
      });

      gsap.set(".portrait-panel", { clipPath: "inset(0 100% 0 0)", x: -38 });
      runWhenVisible(".experience-layout", () => {
        gsap.to(".portrait-panel", {
          clipPath: "inset(0 0% 0 0)",
          x: 0,
          duration: 1.28,
          ease: "expo.out",
        });
      });

      gsap.set(".portrait-panel img", { scale: 1.18, xPercent: -6 });
      runWhenVisible(".experience-layout", () => {
        gsap.to(".portrait-panel img", {
          scale: 1,
          xPercent: 0,
          duration: 0.92,
          ease: "power4.out",
        });
      });
      gsap.to(".portrait-panel img", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: "#experience",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(".contact-backdrop", {
        yPercent: -9,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.9,
        },
      });
        window.requestAnimationFrame(refreshTriggers);
      };
    }, root);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", refreshTriggers);
      scrollObservers.forEach((observer) => observer.disconnect());
      ctx.revert();
    };
  }, []);
  return (
    <main className="site-shell" ref={siteRef}>
      <div className="opening-animation" aria-hidden="true">
        <div className="opening-panel opening-panel-left" />
        <div className="opening-panel opening-panel-right" />
        <div className="opening-grid" />
        <div className="opening-mark">
          <span>筑梦师</span>
          <span>三号的</span>
          <span>简历</span>
        </div>
        <div className="opening-line" />
      </div>
      <header className="topbar" aria-label="主导航">
        <a className="brand" href="#hero" aria-label="返回首页">
          <span className="brand-mark">LML</span>
          <span>白日梦想家</span>
        </a>
        <nav className="nav-links" aria-label="页面导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="mailto:2447325248@qq.com">
          <Mail size={18} />
          联系我
        </a>
      </header>

      <section id="hero" className="hero-section">
        <img className="hero-ambient-image" src="/assets/hero-forest-portrait.webp" alt="" aria-hidden="true" draggable="false" />
        <div className="hero-wash" />

        <div className="section-inner hero-content">

          <h1>
            用AI把故事
            <span>做成可交付影像</span>
          </h1>

          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => openProjectPanel(activeWork)}>
              <ArrowUpRight size={18} />
              查看当前作品
            </button>
            <a className="ghost-button" href="#experience">
              了解经历
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="section-inner hero-carousel-wrap" aria-label="3D作品旋转木马">
          <div className="carousel-copy">
            <strong>{activeWork.label}</strong>
            <span>{activeWork.title}</span>
          </div>
          <div className="carousel-stage" onClick={handleCarouselStageClick}>
            <div className="carousel-ring">
              {carouselCards.map((work, index) => (
                <button
                  className={`carousel-card ${index === activeIndex ? "is-active" : ""} ${
                    work.offset < 0 ? "is-left-side" : work.offset > 0 ? "is-right-side" : "is-center"
                  }`}
                  key={work.title}
                  type="button"
                  style={work.style}
                  aria-label={
                    work.offset === 0
                      ? `播放${work.title}视频`
                      : work.offset < 0
                        ? `向左切换到${work.title}`
                        : `向右切换到${work.title}`
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleCarouselCardClick(work, index, work.offset)}
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    loading={index === activeIndex ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === activeIndex ? "high" : "low"}
                    draggable="false"
                  />
                  <span className="carousel-card-label">{work.label}</span>
                  <span className="carousel-card-title">{work.title}</span>
                  <span className="carousel-card-play">
                    {work.offset === 0 ? (
                      <ArrowUpRight size={16} />
                    ) : work.offset < 0 ? (
                      <ChevronLeft size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="carousel-controls" aria-label="轮播控制">
            <button type="button" onClick={() => moveCarousel(-1)} aria-label="上一张">
              <ChevronLeft size={22} />
            </button>
            <div className="carousel-dots">
              {heroWorks.map((work, index) => (
                <button
                  className={index === activeIndex ? "is-active" : ""}
                  key={work.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`切换到${work.title}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => moveCarousel(1)} aria-label="下一张">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      <div className="non-hero-background">
        <div className="grainient-page-bg" aria-hidden="true">
          <Grainient
            color1="#fff4c6"
            color2="#cfff2f"
            color3="#17342f"
            timeSpeed={0.18}
            colorBalance={-0.08}
            warpStrength={0.78}
            warpFrequency={4.2}
            warpSpeed={1.35}
            warpAmplitude={72}
            blendAngle={-18}
            blendSoftness={0.13}
            rotationAmount={260}
            noiseScale={1.5}
            grainAmount={0.055}
            grainScale={2.8}
            grainAnimated
            fps={24}
            maxDpr={1}
            contrast={1.28}
            gamma={1.02}
            saturation={0.9}
            centerX={0.12}
            centerY={-0.08}
            zoom={0.82}
          />
        </div>

      <section className="tool-strip" aria-label="工具能力">
        <div className="section-inner tool-strip-inner">
          {toolStrip.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </section>

      <section id="experience" className="content-section experience-section">
        <div className="section-inner experience-layout">
          <div className="portrait-panel">
            <img src="/assets/profile-reference.webp" alt="AI影视视觉参考图" loading="lazy" decoding="async" />
          </div>

          <div className="experience-copy">
            <p className="section-kicker">个人经历</p>
            <h2>把AI生成能力落到可交付的影视流程里。</h2>
            <p className="profile-focus">
              我是刘茂林，23岁，2025年毕业于山东理工大学资源勘查专业。出于对AI和影视的长期兴趣，
              通过自学进入AI剧制作，并积累了<strong>1年高密度AI短剧实战经验</strong>。
            </p>
            <p>
              我的工作重点不是单次生成，而是把剧本、视觉参考、镜头提示词、抽卡、声音、剪辑和后期连成一条稳定链路，
              让项目能够被持续推进、复盘和迭代。
            </p>
            <div className="contact-strip" aria-label="联系方式">
              <a href="mailto:2447325248@qq.com">
                <Mail size={18} />
                2447325248@qq.com
              </a>
              <span>
                <MapPin size={18} />
                淄博
              </span>
            </div>
          </div>
        </div>
        <div className="section-inner stat-grid" aria-label="项目数据">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="advantages" className="content-section advantages-section">
        <div className="section-inner section-heading split-heading">
          <div>
            <h2>个人优势</h2>
          </div>
          <p>以导演思维理解镜头，以工程化方式管理AI生产，把随机生成收束成可控流程。</p>
        </div>
        <div className="section-inner advantage-grid">
          {advantages.map(({ icon: Icon, title, text }, index) => (
            <BorderGlow
              className="advantage-glow"
              key={title}
              edgeSensitivity={18}
              glowColor="75 96 64"
              backgroundColor="rgba(248, 248, 244, 0.86)"
              borderRadius={8}
              glowRadius={42}
              glowIntensity={1.15}
              coneSpread={28}
              animated
              colors={["#d7ff41", "#71d7ff", "#fff2b8"]}
              fillOpacity={0.22}
            >
              <article className="advantage-card">
                <div className="advantage-icon">
                  <Icon size={24} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </BorderGlow>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-backdrop" />
        <div className="section-inner contact-content">
          <p className="section-kicker">自我评价</p>
          <h2>希望能学到更专业的影视知识，创造出更惊艳的作品</h2>
          <p>
            如果你正在寻找能把AI视频生成、提示词、视觉资产、声音和后期整合到项目里的创作者，可以直接通过邮箱联系我。
          </p>
          <div className="contact-actions">
            <a className="primary-button large" href="mailto:2447325248@qq.com">
              <Mail size={20} />
              发送邮件
              <ArrowUpRight size={20} />
            </a>
            <span>
              <Bot size={20} />
              AI影视制作 / AI视频生成设计师
            </span>
            <span>
              <Workflow size={20} />
              从剧本到成片的AI影像工作流
            </span>
          </div>
        </div>
      </section>
      </div>
      {playerWork && (
        <div className="link-lightbox" role="dialog" aria-modal="true" aria-label={`${playerWork.title}项目链接窗口`} onClick={() => setPlayerWork(null)}>
          <div className="link-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="link-lightbox-header">
              <div>
                <p>{playerWork.label}</p>
                <h2>{playerWork.title}</h2>
              </div>
              <button type="button" aria-label="关闭项目链接窗口" onClick={() => setPlayerWork(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="work-link-content">
              <div className="work-link-preview">
                <img src={playerWork.image} alt={playerWork.title} />
              </div>
              <div className="work-link-details">
                <p className="work-link-kicker">项目入口</p>
                <h3>{playerWork.title}</h3>
                <p>{playerWork.copy}</p>
                {isWorkLinkUnavailable(playerWork) ? (
                  <p className="work-link-url is-disabled">{playerWork.linkUnavailableText}</p>
                ) : (
                  <>
                <a className="work-link-url" href={getWorkProjectUrl(playerWork)} target="_blank" rel="noreferrer">
                  {getWorkProjectUrl(playerWork)}
                </a>
                <div className="work-link-actions">
                  <a className="primary-button" href={getWorkProjectUrl(playerWork)} target="_blank" rel="noreferrer">
                    打开链接
                    <ArrowUpRight size={18} />
                  </a>
                  <button className="ghost-button" type="button" onClick={() => navigator.clipboard?.writeText(getWorkProjectUrl(playerWork))}>
                    复制链接
                  </button>
                </div>
                  </>
                )}
              </div>
              <div className="work-qr-panel">
                {isWorkLinkUnavailable(playerWork) ? (
                  <span className="work-qr-note">{playerWork.linkUnavailableText}</span>
                ) : playerWork.qrImage ? (
                  <img src={playerWork.qrImage} alt={`${playerWork.title}二维码`} />
                ) : qrCodeSrc ? (
                  <img src={qrCodeSrc} alt={`${playerWork.title}二维码`} />
                ) : (
                  <span>二维码生成中</span>
                )}
                <p>{isWorkLinkUnavailable(playerWork) ? "作品链接暂不展示" : playerWork.qrCaption || "手机扫码查看"}</p>
              </div>
            </div>
          </div>
        </div>
      )}    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);





















