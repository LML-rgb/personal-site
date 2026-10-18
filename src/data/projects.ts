export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  poster: string;
  posterSrcSet: string;
  video: string;
  year: string;
  url: string;
}

// 完整保留原图构图，按显示尺寸提供 WebP 封面，避免下载原始 PNG。
export const projectPosterSizes = "(min-width: 1800px) 480px, (max-width: 700px) min(82vw, 340px), (max-height: 650px) clamp(300px, 28vw, 380px), clamp(320px, 31vw, 460px)";
const portfolioEntries = [
  { title: "天宫计划", url: "https://qcnqogj9cpqc.feishu.cn/wiki/BJY6wHxEUiJJoIkGGpNc4lotnqb" },
  { title: "异变边界-1", url: "https://qcnqogj9cpqc.feishu.cn/wiki/EYYzwcpHSiQUCEkEXOjc0oSJnAe" },
  { title: "异变边界-2", url: "https://qcnqogj9cpqc.feishu.cn/wiki/MC4BwKw9ui2gbPkj83TcF3ACn5w" },
  { title: "时租女友", url: "https://qcnqogj9cpqc.feishu.cn/wiki/Y6iswySbji3Kt3kdlXwcolLin5e" },
  { title: "穿越成虫，我契约了美女校花", url: "https://qcnqogj9cpqc.feishu.cn/wiki/ISQ0wuI7OitpcKkxZSncWzmInOY" },
  { title: "微缩大冒险-1", url: "https://qcnqogj9cpqc.feishu.cn/wiki/XSMrwJ9wGi6JBQkAnjDcqfzEnDd" },
  { title: "微缩大冒险-2", url: "https://qcnqogj9cpqc.feishu.cn/wiki/QZIRw4ROtiNO9ZkczCIcOH3an5e" },
  { title: "微缩大冒险-3", url: "https://qcnqogj9cpqc.feishu.cn/wiki/M7jfw3NVAitFnbkR5kbcPjlTnje" },
];

export const projects: Project[] = portfolioEntries.map((entry, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `project-${number}`,
    ...entry,
    category: "AI 视频作品",
    description: "点击封面，在飞书查看完整作品。",
    poster: `/works/${number}-cover-1280.webp`,
    posterSrcSet: `/works/${number}-cover-640.webp 640w, /works/${number}-cover-1280.webp 1280w`,
    video: "",
    year: "",
  };
});
