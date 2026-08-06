# Stelarith · 星璃官网（Nuxt 3 全栈版）

星璃 Stelarith 的官网与博客，基于 **Nuxt 3 + Vue 3 + Tailwind CSS v4** 重构版。
比 Astro 版更轻量、更全栈：原生 SSG 静态导出、双模式 base、自写内容加载器（无 SQLite 原生依赖）。

## 技术栈

- **Nuxt 3**（SSG 静态导出，GitHub Pages 部署）
- **Vue 3 + Vue Router**（组件化）
- **Tailwind CSS v4**（Vite 插件方式）
- **自写内容加载器**（gray-matter + markdown-it 读 `content/` → 预生成 `data/*.json`）
- **Pagefind**（静态搜索索引）
- **giscus**（可选评论）

## 内容管理（Pages CMS）

本站的**内容后台统一交给 Pages CMS**（Git 驱动的开源 CMS，`https://app.pagescms.org`），直接编辑 `content/` 下的 md / mdx / json 并 commit 回仓库，触发自动部署。无需本地再维护一套内容编辑后台。

配置文件 `.pages.yml` 已覆盖全部集合：

| 集合 | 路径 | 说明 |
|------|------|------|
| `posts` | `content/posts` | 文章（标题/摘要/日期/标签/状态/正文） |
| `notes` | `content/notes` | 笔记 |
| `projects` | `content/projects` | 项目（状态/源码/演示） |
| `software` | `content/software` | 软件（版本/平台/分类/下载 key） |
| `gallery` | `content/gallery` | 图库（图片/标签） |
| `gears` | `content/gears` | 装备 |
| `moments` | `content/moments` | 瞬间 |
| `links` | `content/links` | 友链 |
| `milestones` | `content/milestones` | 大事记 |
| `docs` | `content/docs` | 文档 |

**接入步骤**：
1. 打开 <https://app.pagescms.org>，用 GitHub 登录
2. 选择本仓库 `WuMengAA/Stelarith-Web`（首次需授权 Pages CMS 的 GitHub App）
3. 左侧即可编辑各集合内容，保存即 commit + 触发部署

> 说明：图库图片/软件图标等通过 Pages CMS 的媒体上传到 `public/images/`；**软件文件（zip）等二进制**仍走站内 `/api/upload`（PageCMS 只写 Git 仓库，不托管大文件），上传后用返回的 key 填软件的 `file` 字段。

## 快速开始

```bash
npm install
npm run dev        # 本地开发 http://localhost:3000
npm run generate   # 静态导出到 dist/（含内容预生成 + Pagefind）
npm run preview    # 预览构建产物
```

## 目录结构

```
stelarith-vue/
├── nuxt.config.ts           # Nuxt 配置（双模式 base / Tailwind / 内容）
├── content/                 # 内容源（md / mdx / json）
├── content.config.ts.bak    # 旧 Nuxt Content 配置（已弃用，改自写加载器）
├── data/                    # 构建时预生成的内容 JSON
├── components/              # Vue 组件（Header/Footer/卡片/搜索/灯箱/黑洞）
├── composables/             # useContent / useSiteConfig
├── pages/                   # 页面（首页/文章/项目/笔记/图库/文档/瞬间/大事记/装备/友链/标签/归档/关于/留言板/安全跳转）
├── public/                  # 静态资源（favicon / 图片）
├── scripts/
│   ├── build-content.mjs    # 内容预生成（md/json → data/*.json）
│   ├── postbuild.mjs        # Pagefind 索引 + 404 处理
│   └── serve.mjs            # 本地静态预览
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

## 部署

GitHub Pages 子路径部署（`https://WuMengAA.github.io/Stelarith-Web/`）：

- 代码 push 到 `main` → GitHub Actions 自动构建部署
- `nuxt.config.ts` 通过 `BASE_URL` 环境变量双模式：
  - 本地 `BASE_URL` 空 → `/`
  - 线上 `BASE_URL=/Stelarith-Web/` → 子路径

## 页面

| 路由 | 内容 |
|------|------|
| `/` | 首页：Hero + 品牌介绍 + 最近文章/项目/笔记 |
| `/posts` | 文章列表 + 详情 |
| `/projects` | 项目 + 详情 |
| `/notes` | 随记 |
| `/gallery` | 图库（筛选 + 灯箱） |
| `/docs` | 文档 |
| `/moments` | 瞬间 |
| `/timeline` | 大事记 |
| `/gear` | 装备 |
| `/links` | 友链 |
| `/tags` | 标签 + 标签筛选 |
| `/archive` | 归档 |
| `/about` | 关于星璃 |
| `/guestbook` | 留言板 |
| `/go` | 安全跳转 |
| `/search` | 搜索 |

## 彩蛋

按 **B** 键或点右下角按钮，切换 WebGL 黑洞背景（类 2D 吸积盘 + 恒星吞噬 + 星野环绕）。
