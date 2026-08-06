// ============================================================
//  Stelarith · Nuxt 3 配置
//  三重部署模式（通过环境变量 DEPLOY_TARGET 切换）：
//    github      → SSG 静态导出，GitHub Pages 子路径部署（BASE_URL=/Stelarith-Web/）
//    cloudflare  → Cloudflare Pages 全栈（静态 + Server API + KV/R2/D1 绑定）
//    local       → 本地 node-server 自托管（本地磁盘存储，经 Tunnel 对外）
//  默认 github，兼容旧工作流。
// ============================================================
import tailwindcss from "@tailwindcss/vite";

const target = process.env.DEPLOY_TARGET || "github";

// baseURL 与 nitro preset 按模式映射
const modeMap: Record<string, { preset: string; baseURL: string; port?: number }> = {
  github: {
    preset: "static",
    baseURL: process.env.BASE_URL || "/",
  },
  cloudflare: {
    preset: "cloudflare_pages",
    baseURL: "/",
  },
  local: {
    preset: "node-server",
    baseURL: "/",
  },
};

const mode = modeMap[target] || modeMap.github;

console.log(`[nuxt] DEPLOY_TARGET=${target} preset=${mode.preset} baseURL=${mode.baseURL}`);

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  // 站点基础 URL（不同部署模式前缀不同）
  app: {
    baseURL: mode.baseURL,
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "zh-CN" },
      meta: [{ name: "theme-color", content: "#0a0a0a" }],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  // 构建目标（静态 / 云全栈 / 本地 node-server）
  nitro: {
    preset: mode.preset as any,
    output: { publicDir: "dist" },
  },

  // Tailwind CSS v4（Vite 插件方式）
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  modules: [],

  runtimeConfig: {
    public: {
      // 站点元信息（与 config.ts 对应）
      siteTitle: "星璃 · Stelarith",
      siteShort: "星璃",
      siteEn: "Stelarith",
      siteDescription:
        "星璃 / Stelarith —— 在星光中流淌的真理之光。黑与白之间的纯粹星夜，写点东西，做点项目，记点笔记。",
      siteTagline: "星光不问归处，但我会陪你找到答案。",
      siteUrl: "https://stelarith.dev",
      author: "星璃",
      github: "https://github.com/stelarith",
      email: "hello@stelarith.dev",
      // 部署模式（前端可感知：github / cloudflare / local）
      deployTarget: target,
      // giscus 评论
      giscusEnabled: false,
      giscusRepo: "",
      giscusRepoId: "",
      giscusCategory: "",
      giscusCategoryId: "",
      // 公告条
      announcementEnabled: false,
      announcementIcon: "✦",
      announcementText: "",
    },
    // 服务端私有配置（API 用）
    storage: {
      // 上传文件根目录（local 模式：本地磁盘；cloudflare：R2 桶名）
      uploadDir: ".data/uploads",
      r2Bucket: "stelarith-assets",
    },
  },
});
