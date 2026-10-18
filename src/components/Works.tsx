import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Film, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects, type Project } from "../data/projects";
import "./Works.css";

export function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="work-dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <motion.div
        ref={dialogRef}
        className="work-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-dialog-title"
        aria-describedby="work-dialog-description"
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25 }}
      >
        <span className="sr-only" tabIndex={0} onFocus={() => (videoRef.current ?? closeRef.current)?.focus()} />
        <div className="work-dialog-heading">
          <div>
            <p className="work-dialog-eyebrow">{project.category}{project.year ? ` / ${project.year}` : ""}</p>
            <h3 id="work-dialog-title">{project.title}</h3>
          </div>
          <button ref={closeRef} className="work-dialog-close" type="button" onClick={onClose} aria-label="关闭作品预览">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        {project.video ? (
          <video ref={videoRef} className="work-dialog-video" controls playsInline preload="metadata" poster={project.poster || undefined} src={project.video} tabIndex={0}>
            你的浏览器暂不支持视频播放。
          </video>
        ) : (
          <div className="work-dialog-empty">
            {project.poster && <img className="work-dialog-poster" src={project.poster} alt={`${project.title}封面`} />}
            <div className="work-dialog-empty-content">
              <Film size={32} strokeWidth={1} aria-hidden="true" />
              <p>作品待上线</p>
              <span>此展示位暂未添加视频</span>
            </div>
          </div>
        )}
        <p id="work-dialog-description" className="work-dialog-description">{project.description || "项目说明待补充。"}</p>
        <span className="sr-only" tabIndex={0} onFocus={() => closeRef.current?.focus()} />
      </motion.div>
    </motion.div>
  );
}

export default function Works() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // A stable close callback keeps the dialog's focus and scroll effects mounted.
  const closeDialog = useRef(() => setSelectedProject(null)).current;

  return (
    <section id="work" className="works-section section-shell" aria-labelledby="work-section-title">
      <motion.div className="work-section-heading" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}>
        <div className="work-eyebrow"><span aria-hidden="true" />SELECTED WORK <span className="work-section-number">/ 01</span></div>
        <div className="work-heading-row">
          <h2 id="work-section-title">作品集</h2>
          <p>每一帧，都服务于故事。<br /><span>这里预留 8 个作品展示位，视频与项目说明待补充。</span></p>
        </div>
      </motion.div>

      <div className="work-grid">
        {projects.map((project, index) => {
          const number = String(index + 1).padStart(2, "0");
          return (
            <motion.div key={project.id} className={`work-card-wrapper work-card-wrapper-${index % 4}`} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}>
              <button type="button" className={`work-card work-card-tone-${index % 4}`} onClick={() => setSelectedProject(project)} aria-label={`打开${project.title}${project.video ? "预览" : "预留展示位"}`} aria-haspopup="dialog">
                <div className="work-frame">
                  {project.poster && <img className="work-poster" src={project.poster} alt="" loading="lazy" />}
                  <div className="work-frame-grid" aria-hidden="true" />
                  <div className="work-film-frame" aria-hidden="true"><i /><i /><i /><i /></div>
                  <span className="work-frame-number">{number}</span>
                  <span className="work-frame-ratio">16:9</span>
                  <span className="work-placeholder">
                    <span className="work-plus"><Plus size={24} strokeWidth={1} aria-hidden="true" /></span>
                    <span>{project.video ? "查看作品" : "作品待上线"}</span>
                  </span>
                  <span className="work-frame-label">{project.video ? "VIEW PROJECT" : "RESERVED FOR THE NEXT STORY"}</span>
                </div>
                <span className="work-card-caption">
                  <span><strong>{project.title}</strong><span className="work-card-category">{project.category}</span></span>
                  <span className="work-card-arrow" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.3} /></span>
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>
      {createPortal(<AnimatePresence>{selectedProject && <ProjectDialog key={selectedProject.id} project={selectedProject} onClose={closeDialog} />}</AnimatePresence>, document.body)}
    </section>
  );
}
