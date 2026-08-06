---
title: 部署指南
description: 如何构建并部署这个站点
group: 入门
order: 1
---

# 部署指南

本站在构建时使用 [Pagefind](https://pagefind.app) 生成全站搜索索引。

## 本地构建

```bash
npm run build
```

构建产物输出到 `dist/`，并自动生成 `pagefind/` 搜索索引。

## 本地预览

```bash
npm run preview
```

## 部署

任意支持静态文件的平台均可部署 `dist/` 目录：Vercel、Netlify、GitHub Pages、Cloudflare Pages 等。

## 内容管理（Pages CMS）

本站使用 [Pages CMS](https://pagescms.org) 作为内容后台——一个直接读写 GitHub 仓库的开源 CMS，无需数据库。

### 启用步骤

1. 将仓库托管到 GitHub（例如 `stelarith/stelarith.dev`）
2. 打开 [app.pagescms.org](https://app.pagescms.org)，用 GitHub 账号登录
3. 按提示安装 Pages CMS GitHub App，并授权给本仓库
4. 在仓库列表中选择本站仓库
5. 仓库根目录的 `.pages.yml` 已定义好所有内容集合（文章/项目/笔记/文档/友链/图库），打开即可开始编辑
6. 保存后 Pages CMS 自动 commit 回仓库，触发部署平台的自动构建

### 字段说明

`.pages.yml` 中的字段与 `src/content.config.ts` 的 schema 一一对应：
- `title` / `description` / `body`：标题、摘要、正文（富文本）
- `pubDate` / `updatedDate`：发布日期 / 更新日期
- `tags`：标签（`list: true` 支持多个）
- `draft`：草稿开关
- `layout`：`default` / `wide` 两种内容布局
- 项目特有：`status`（进行中/已归档/构想中）、`repo`、`demo`
