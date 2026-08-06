// ============================================================
//  Stelarith · 站点全局配置（单一数据源）
//  —— 导航栏 / 页脚 / 品牌 / 链接 全部从这里读取，改一处全局生效
//  —— 对应 Astro 版 src/config.ts，并扩展了 nav 分组 + 页脚同步
// ============================================================

export type NavItem = {
  label: string;
  href: string;
  /** 次要入口（进 footerLinks / 下拉），默认 false */
  secondary?: boolean;
  /** 是否外链 */
  external?: boolean;
};

// 主导航：桌面导航栏 + 移动菜单 + 页脚主栏目（三处共用，保证页末同步）
export const mainNav: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/posts" },
  { label: "项目", href: "/projects" },
  { label: "软件", href: "/software" },
  { label: "笔记", href: "/notes" },
  { label: "瞬间", href: "/moments" },
  { label: "图库", href: "/gallery" },
  { label: "关于", href: "/about" },
];

// 次级导航：归档 / 标签 / 大事记等，供页脚补充区展示
export const secondaryNav: NavItem[] = [
  { label: "归档", href: "/archive" },
  { label: "标签", href: "/tags" },
  { label: "大事记", href: "/timeline" },
  { label: "装备", href: "/gear" },
  { label: "文档", href: "/docs" },
  { label: "友链", href: "/links" },
  { label: "留言板", href: "/guestbook" },
  { label: "RSS", href: "/rss.xml", external: true },
];

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
  // 品牌视觉（全局唯一，避免组件内硬编码重复色值）
  brand: {
    slogan: "黑白之间的星夜空间",
    footerNote: "在黑与白之间，做一颗发光的星。",
  },
  links: {
    github: "https://github.com/stelarith",
    email: "hello@stelarith.dev",
  },
  // 主导航（header + mobile + footer 主栏目共用）
  nav: mainNav,
  // 次级导航（footer 补充区 / 归档类入口）
  secondaryNav,
  // 页脚链接 = 主导航（主栏目） + 次级导航（补充）的合并结果
  footerLinks: [...mainNav, ...secondaryNav],
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
