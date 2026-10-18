import { ArrowDownToLine, ArrowUpRight } from 'lucide-react'
import SectionPatternBackground from './SectionPatternBackground'
import GlowCard from './GlowCard'
import './ResumeSection.css'

const RESUME_DOWNLOAD = '/Liu-Maolin-Resume.docx'

export default function ResumeSection() {
  return (
    <section id="resume" className="resume-r-section pattern-section" aria-labelledby="resume-r-title">
      <SectionPatternBackground variant="resume" />
      <div className="section-shell section-pattern-content">
      <div className="resume-r-heading">
        <div>
          <p className="resume-r-eyebrow"><span aria-hidden="true" /> 关于我 / 03</p>
          <h2 id="resume-r-title">关于我，<span>与我的经历。</span></h2>
        </div>
        <a className="resume-r-download" href={RESUME_DOWNLOAD} download="刘茂林_简历.docx">
          下载简历 <ArrowDownToLine size={19} aria-hidden="true" />
        </a>
      </div>

      <GlowCard className="resume-r-profile" radius={22}>
        <div className="resume-r-identity">
          <p className="resume-r-name">刘茂林</p>
          <h3>AI 短剧编导<span>全流程制作</span></h3>
          <div className="resume-r-facts" aria-label="个人信息">
            <span>24 岁</span><span>本科</span><span>深圳</span>
          </div>
          <div className="resume-r-summary-facts">
            <p><strong>1 年</strong><span>制作经验</span></p>
            <p><strong>8 项</strong><span>创作工具</span></p>
          </div>
        </div>
        <div className="resume-r-introduction">
          <p className="resume-r-intro-lead">重视<strong>剧情理解与画面转化</strong>，根据人物情绪与叙事节奏，设计对应的视觉表达。</p>
          <p>熟悉 AI 视觉生成、提示词设计、镜头语言、分镜构思与剪辑包装流程。</p>
          <div className="resume-r-capabilities" aria-label="核心能力">
            <span>剧情与叙事理解</span><span>镜头与分镜构思</span>
            <span>AI 生成与提示词设计</span><span>剪辑与成片包装</span>
          </div>
          <p className="resume-r-growth">持续学习，认真打磨每一帧。希望在 AI 短剧与 AI 视频制作方向长期发展。</p>
        </div>
      </GlowCard>

      <div className="resume-r-experience">
        <h3 className="resume-r-label">项目经历</h3>
        <GlowCard as="article" className="resume-r-project">
          <div className="resume-r-project-content">
            <div className="resume-r-project-meta">
              <time>2026.08.15 — 2026.10.09</time>
              <span>编导 + 制作</span>
            </div>
            <h4>绘梦文化传媒</h4>
            <ul className="resume-r-responsibilities">
              <li><strong>全流程制作：</strong>负责编导及制作成片全流程。</li>
              <li><strong>镜头与视觉设计：</strong>根据剧情节奏与人物情绪，设计镜头景别、构图方式、光影氛围和画面风格。</li>
              <li><strong>提示词优化：</strong>通过智能体优化提示词，提升画面稳定性与表现力。</li>
            </ul>
          </div>
          <GlowCard className="resume-r-result" label="作品成果" radius={14}>
            <span className="resume-r-result-label">作品平均播放量</span>
            <p className="resume-r-result-number">300<span>万+</span></p>
            <div className="resume-r-account">
              <span>抖音号</span><strong>38850125710</strong>
            </div>
          </GlowCard>
        </GlowCard>
      </div>

      <div className="resume-r-bottom-grid">
        <GlowCard as="article" className="resume-r-detail-card" radius={18}>
          <h3 className="resume-r-label">教育背景</h3>
          <p className="resume-r-card-date">2021.09 — 2025.06</p>
          <h4>山东理工大学</h4>
          <p className="resume-r-education-info">地质学专业 <span>本科</span></p>
        </GlowCard>
        <GlowCard as="article" className="resume-r-detail-card resume-r-job-card" radius={18}>
          <h3 className="resume-r-label">求职意向</h3>
          <h4>AI 短剧全流程制作</h4>
          <p className="resume-r-job-location">工作城市 <strong>深圳</strong></p>
          <p className="resume-r-salary">期望薪资 <strong>11–15k</strong></p>
          <a className="resume-r-contact-link" href="#contact">联系我 <ArrowUpRight size={18} aria-hidden="true" /></a>
        </GlowCard>
      </div>
      </div>
    </section>
  )
}
