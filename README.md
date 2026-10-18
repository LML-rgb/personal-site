# 刘茂林 网页版简历

依据用户提供的 DOCX 简历、网页要求与首页参考视频制作。React + Vite + TypeScript + Tailwind CSS；动画使用 GSAP 与 Framer Motion。首页为暗色极简背景、清晰的中英文标题与放大的连续作品轮播。

## 本地运行

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

生产构建：`pnpm run build`，输出目录 `dist/`。

## 8 个作品

`src/data/projects.ts` 已按用户提供顺序配置 8 个作品：天宫计划、异变边界-1、异变边界-2、时租女友、穿越成虫，我契约了美女校花、微缩大冒险-1、微缩大冒险-2、微缩大冒险-3。标题、封面和飞书链接分别位于 `title`、`poster`、`url` 字段。

封面为 `public/works/01-cover-640.webp` / `01-cover-1280.webp` 至第 08 组，依次对应附件图一至图八，完整保留原始构图。使用 `srcset` 按屏幕和像素比选择清晰度；首张封面预加载，其余按需加载。轮播封面固定 16:9，卡片宽度随屏幕适配；点击卡片在新标签页打开对应飞书作品。标题区域支持长名称换行。

## 个人信息

首页排版在 `src/components/PortfolioHome.tsx`，轮播在 `src/components/PortfolioCarousel.tsx`，履历在 `src/components/ResumeSection.tsx`，联系方式在 `src/App.tsx`。简历下载文件为 `public/Liu-Maolin-Resume.docx`，原始 DOCX 未修改。源简历公司名称末尾存在截断，网页使用简称“绘梦文化传媒”。作品平均播放量 300 万+、1 年经验均按用户提供简历呈现。

## 替换首页背景视频

把背景 MP4 放入 `public/media/`，编辑 `src/data/site.ts` 中的 `homeBackground.video` 为 `/media/home-background.mp4`，可同时填写 `poster` 封面路径。留空时显示暗色极简背景。参考视频只用于设计，不作为背景播放。

## 动效与媒体

自动轮播为 50px/s，是原来速度的两倍。桌面鼠标悬停或键盘聚焦卡片时放大 8%、上浮 18px，并增强边框和投影；减少动态效果偏好下关闭放大与上浮。

保留短暂品牌开场、悬浮导航、入场与页脚跑马灯。首次开场约 0.95 秒，同一浏览会话重复访问或直接进入内页时跳过。首页文字用等效 CSS 动画入场，GSAP 跑马灯在进入视口时才加载并播放，离屏/标签隐藏时暂停。放大的作品轮播支持缓慢错峰呼吸、自动循环、鼠标悬停/键盘聚焦暂停、手动暂停、左右切换、手机横滑和飞书作品跳转。重复卡片仅用于无缝循环，对辅助阅读和键盘导航隐藏；只对轮播视口中的卡片播放呼吸动画。开启减少动态效果时关闭呼吸、自动循环、背景波动和背景视频。网站没有后端、表单收件或上传管理。

性能审查、体积对比及验证口径见 `PERFORMANCE.md`。WebGL 在首批内容绘制后按需加载，桌面首页最高 60 帧、其他慢速背景和触屏/低配置设备最高 30 帧；保留波形与颜色。导航和轮播缓存几何尺寸，指针事件按帧合并。

## 方块背景与 React Bits Pro

首页已接入用户附件提供的 `PatternWaves` JavaScript + CSS 源码，依赖 `ogl`，使用 silk 波形、13px 密集方块、灰蓝色与透明底色。支持丝绸褶皱波动、入场展开、光影流动、鼠标拖尾涟漪与点击扰动。源码在 `src/components/PatternWaves.jsx`，TypeScript 调用声明在同名 `.d.ts`。项目适配增加隐藏/离屏暂停、动态读取减少动效偏好、DPR/像素预算上限和 WebGL 不可用时的回退。首页参数位于 `PortfolioHome.tsx`。

原有独立原创组件 `src/components/TwinklingSquares.tsx` 作为 WebGL 不可用时的回退；正常渲染波浪后即卸载，不同时运行两套动画。官方 Blinking Squares 需要有效的 Starter 或以上许可证；用户先前已选择原创同风格效果，未安装该付费组件。

其余区域使用 `SectionPatternBackground.tsx`：个人优势为点阵海浪，简历为缓慢流动线条，联系区为十字涟漪。各区保持灰蓝暗色调，通过形状、波形、速度和方向区别于首页。背景铺满屏幕宽度，内容仍保持原有栏宽；卡片使用深色半透明底以确保文字对比。额外 WebGL 实例只在接近视口时挂载，远离时释放。联系区已改用 PatternWaves 背景。

## 卡片边缘光晕与悬停上浮

`BorderGlow.jsx` / `.css` 接入用户附件的 React Bits 组件，`GlowCard.tsx` 统一为灰蓝银色边缘光晕及低强度填色。个人优势的 4 张卡片，以及个人介绍、项目经历、成果、教育背景、求职意向卡片均已接入。首次进入视口时播放一次扫光，鼠标移动时光晕随边缘位置变化；悬停时卡片上浮 7px、加深阴影（嵌套成果卡片额外上浮 3px）。触屏保留入场扫光，减少动态效果偏好下关闭扫光和上浮。含链接的卡片支持键盘聚焦光晕，原有链接焦点样式保留。

项目适配保留原有卡片根元素、网格与排版，不额外包裹内容；扫光计时器、动画帧与观察器在离屏或卸载时清理。参数在 `GlowCard.tsx`，上浮样式在 `GlowCard.css`。

`components.json` 已按官方安装文档配置两个注册源与 `Authorization: Bearer ${REACTBITS_LICENSE_KEY}`，同时配置 TypeScript 与 Vite 的 `@/` 路径。需要使用官方组件时，在项目根目录的 `.env.local` 中设置 `REACTBITS_LICENSE_KEY`（已被 Git 忽略，不要添加 `VITE_` 前缀），然后运行：

```sh
npx shadcn@latest add @reactbits-starter/blinking-squares-tw
```

安装后按实际导出接口替换 `PortfolioHome.tsx` 中的 `TwinklingSquares`。密钥只供安装工具访问官方注册源，不进入浏览器包或 Sites 运行时。
