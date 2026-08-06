// ============================================================
//  Stelarith · Nuxt 3 配置
//  双模式 base：本地无前缀，线上 GitHub Pages 注入 BASE_URL=/Stelarith-Web/
// ============================================================
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  // 站点基础 URL（GitHub Pages 子路径部署）
  app: {
    baseURL: process.env.BASE_URL || "/",
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "zh-CN" },
      meta: [{ name: "theme-color", content: "#0a0a0a" }],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  // 静态导出（SSG）
  nitro: {
    preset: "static",
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
  },
});
