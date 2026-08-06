// ============================================================
//  Stelarith · 计数存储（下载次数等）
//    local       → 本地磁盘 .data/counters.json
//    cloudflare  → Cloudflare KV（binding STELARITH_KV）
//    github      → 只读空实现（纯静态）
//  用法：bumpCounter(key) / getCounter(key)
// ============================================================

const DEPLOY_TARGET = process.env.DEPLOY_TARGET || "github";
const CACHE: Record<string, number> = {};

async function loadAll(): Promise<Record<string, number>> {
  if (DEPLOY_TARGET === "cloudflare") {
    const env = (process.env as any).STELARITH_KV;
    if (env?.get) {
      const raw = await env.get("counters");
      if (raw) {
        try { return JSON.parse(raw); } catch {}
      }
    }
    return {};
  }
  if (DEPLOY_TARGET === "local") {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    try {
      return JSON.parse(readFileSync(join(process.cwd(), ".data", "counters.json"), "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

async function persistAll(map: Record<string, number>) {
  if (DEPLOY_TARGET === "cloudflare") {
    const env = (process.env as any).STELARITH_KV;
    if (env?.put) {
      await env.put("counters", JSON.stringify(map));
    }
    return;
  }
  if (DEPLOY_TARGET === "local") {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "counters.json"), JSON.stringify(map), "utf8");
  }
}

/**
 * 对某个 key 的计数 +1，返回累加后的值
 */
export async function bumpCounter(key: string): Promise<number> {
  const safe = key.replace(/[^\w.\-/]/g, "_");
  if (DEPLOY_TARGET === "github") return 0;

  const map = await loadAll();
  const next = (map[safe] || 0) + 1;
  map[safe] = next;
  CACHE[safe] = next;
  await persistAll(map);
  return next;
}

/**
 * 读取某个 key 的当前计数
 */
export async function getCounter(key: string): Promise<number> {
  const safe = key.replace(/[^\w.\-/]/g, "_");
  if (CACHE[safe] != null) return CACHE[safe];
  const map = await loadAll();
  return map[safe] || 0;
}
