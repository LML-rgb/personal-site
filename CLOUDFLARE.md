# GitHub Desktop 与 Cloudflare 部署

日常使用原项目目录“个人网站搭建”。保留原仓库的 `.git`、远程地址和 `master` 分支，不新建仓库，不更换 Cloudflare 绑定。

## 构建参数

- 项目根目录：仓库根目录。
- 构建命令：`pnpm run build`；现有 `npm run build` / `pnpm build` 也调用相同脚本。
- 构建输出目录：`dist`。
- Node.js：`.node-version` 指定 22 主版本，不修改电脑的全局 Node。
- 依赖：使用 `pnpm-lock.yaml`；已由新网站的 npm 锁文件转换，保留已验证的包版本。
- `pnpm-workspace.yaml` 保留原有 esbuild 构建许可，并兼容 Cloudflare 默认的 pnpm 10 与电脑上的 pnpm 11。

本次没有修改 Cloudflare 控制台中的构建设置、域名、环境变量或仓库绑定。如果控制台原设置不同，应保留原绑定并核对上面的构建命令和输出目录。

## 本地开发

```sh
pnpm install --frozen-lockfile
pnpm run dev
pnpm run build
pnpm run preview
```

GitHub Desktop 中审查本次文件变更后，提交并推送到原分支，由既有 Cloudflare Git 集成触发构建。仅替换本地文件不会改变线上网站。

## 文件保留规则

| 文件或目录 | 用途与处理 |
| --- | --- |
| `.git` | 原仓库历史、分支、远程关联，完整保留 |
| `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml` | 依赖、构建脚本与安装许可，需要随源码提交 |
| `.gitignore`、`.node-version` | 保留原忽略规则，补充缓存/日志忽略与构建运行时版本 |
| `src`、`public`、`index.html` 和 Vite/TS/Tailwind/PostCSS 配置 | 当前新网站的必要源码与素材，需要提交 |
| `source-assets` | 原始素材保留在本机，继续按原规则忽略 |
| `node_modules`、`dist`、`*.tsbuildinfo`、开发日志 | 安装/构建可重新生成，不提交 |
| `.openai`、`.sites-runtime`、新项目的 `.git`、临时原图和截图 | 属于编辑工作区或 Sites，不带入此 GitHub 仓库 |

原 `.gitignore` 对 MP4/MOV 的忽略规则仍在。以后加入背景视频时，需要单独检查文件是否应提交；当前网站通过飞书外链打开作品，无需把作品视频放进仓库。

完整旧项目和文件校验清单已备份到桌面的“个人网站搭建_旧版备份_日期时间”目录，恢复资料不放进 Git 仓库。

参考：[Cloudflare React/Vite 部署](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)、[构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[构建环境](https://developers.cloudflare.com/pages/configuration/build-image/)、[pnpm 锁文件导入](https://pnpm.io/cli/import)。
