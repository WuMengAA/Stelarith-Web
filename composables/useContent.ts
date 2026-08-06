// ============================================================
//  Stelarith · 内容查询工具
//  内容数据由 scripts/build-content.mjs 预生成为 data/*.json
//  通过 Vite 的 import.meta.glob 静态加载（无运行时 node:fs / HTTP）
// ============================================================

// 加载 data/ 下的所有集合 JSON（懒加载，SSR/客户端都可用）
const contentModules = import.meta.glob("~/data/*.json");

async function loadCollection(collection: string): Promise<any[]> {
  const key = Object.keys(contentModules).find((k) => k.includes(`/${collection}.json`));
  if (!key) return [];
  try {
    const mod = await contentModules[key]();
    const data = (mod as any).default || mod;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ===== 日期工具 =====
export function fmtDate(d: Date | string | number | undefined, withDay = false): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  if (withDay) opts.day = "numeric";
  return date.toLocaleDateString("zh-CN", opts);
}

/** 内容 id → 路由 slug */
export function slug(id: string): string {
  return id.replace(/\.(md|mdx|json)$/, "");
}

/** 项目状态 → 中文文案 */
export const projectStatusText: Record<string, string> = {
  active: "进行中",
  archived: "已归档",
  idea: "构想中",
};

/** 项目状态 → 徽章类名 */
export function projectStatusClass(status: string): string {
  switch (status) {
    case "active": return "bg-glaze-400/15 text-glaze-300";
    case "idea": return "bg-space-400/15 text-space-400";
    default: return "bg-star-400/10 text-star-400";
  }
}

/**
 * 读取集合，过滤草稿并按 pubDate 倒序
 */
export async function getPublished(collection: string, limit?: number): Promise<any[]> {
  const all = await loadCollection(collection);
  const published = all
    .filter((i) => !i.draft)
    .sort((a, b) => {
      const at = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const bt = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return bt - at;
    });
  return limit ? published.slice(0, limit) : published;
}

/** 读取全部（含草稿过滤） */
export async function getAllPublished(collection: string): Promise<any[]> {
  return getPublished(collection);
}

/** 按 slug 读取单个文档 */
export async function getBySlug(collection: string, targetSlug: string): Promise<any | null> {
  const all = await loadCollection(collection);
  return all.find((i) => i._id === targetSlug || i.path.endsWith(`/${targetSlug}`)) || null;
}

/** 站点 base 前缀 */
export function siteBase(): string {
  const config = useRuntimeConfig();
  const base = ((config.app as any)?.baseURL) || "/";
  return base.replace(/\/+$/, "");
}

/** 给站内链接补 base 前缀 */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("#")) return path;
  const base = siteBase();
  if (path.startsWith(base)) return path;
  return base + (path.startsWith("/") ? path : "/" + path);
}
