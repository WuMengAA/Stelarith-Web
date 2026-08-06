// ============================================================
//  Stelarith · 站点全局配置（对应 Astro 版 src/config.ts）
// ============================================================

export const siteConfig = {
  title: "星璃 · Stelarith",
  shortTitle: "星璃",
  en: "Stelarith",
  description:
    "星璃 / Stelarith —— 在星光中流淌的真理之光。黑与白之间的纯粹星夜，写点东西，做点项目，记点笔记。",
  tagline: "星光不问归处，但我会陪你找到答案。",
  siteUrl: "https://stelarith.dev",
  author: "星璃",
  authorEn: "Stelarith",
  links: {
    github: "https://github.com/stelarith",
    email: "hello@stelarith.dev",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "文章", href: "/posts" },
    { label: "项目", href: "/projects" },
    { label: "笔记", href: "/notes" },
    { label: "瞬间", href: "/moments" },
    { label: "图库", href: "/gallery" },
    { label: "关于", href: "/about" },
  ],
  footerLinks: [
    { label: "标签", href: "/tags" },
    { label: "归档", href: "/archive" },
    { label: "大事记", href: "/timeline" },
    { label: "装备", href: "/gear" },
    { label: "文档", href: "/docs" },
    { label: "友链", href: "/links" },
    { label: "留言板", href: "/guestbook" },
    { label: "RSS", href: "/rss.xml" },
  ],
  giscus: {
    enabled: false,
    repo: "",
    repoId: "",
    category: "",
    categoryId: "",
  },
  announcement: {
    enabled: false,
    icon: "✦",
    text: "",
    link: { href: "", label: "" },
  },
};
