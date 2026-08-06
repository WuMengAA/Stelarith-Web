// ============================================================
//  Stelarith · 跨平台存储适配
//  目标：一套 API 代码，同时在「本地自托管」与「Cloudflare 全栈」下运行。
//    local       → node:fs 本地磁盘（.data/uploads）
//    cloudflare  → Cloudflare R2（binding 名 STELARITH_R2）
//    github      → 纯静态，API 不可用（返回 503 占位）
//  用法：isApiAvailable() / saveFile() / readFile() / listFiles() / deleteFile()
// ============================================================

const DEPLOY_TARGET = process.env.DEPLOY_TARGET || "github";

export function isApiAvailable(): boolean {
  return DEPLOY_TARGET !== "github";
}

/** 当前部署目标 */
export function getDeployTarget(): string {
  return DEPLOY_TARGET;
}

/**
 * 保存上传文件
 * @returns {url} 可公开访问的相对 URL；失败抛错
 */
export async function saveUpload(
  fileName: string,
  buffer: ArrayBuffer | Uint8Array,
  contentType: string
): Promise<{ url: string }> {
  if (DEPLOY_TARGET === "cloudflare") {
    // Cloudflare R2：binding 由 wrangler.toml / Pages 环境注入
    const env = (process.env as any).STELARITH_R2;
    if (env?.put) {
      const key = `uploads/${Date.now()}-${fileName}`;
      await env.put(key, buffer as any, { httpMetadata: { contentType } });
      return { url: `/api/files?key=${encodeURIComponent(key)}` };
    }
    throw new Error("R2 binding STELARITH_R2 未配置");
  }

  if (DEPLOY_TARGET === "local") {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dir = join(process.cwd(), ".data", "uploads");
    await mkdir(dir, { recursive: true });
    const safe = fileName.replace(/[^\w.\-@]/g, "_");
    const key = `${Date.now()}-${safe}`;
    await writeFile(join(dir, key), Buffer.from(buffer as Uint8Array));
    return { url: `/api/files?key=${encodeURIComponent(key)}` };
  }

  throw new Error("当前部署模式不支持上传");
}

/**
 * 读取上传文件（用于 /api/files 输出）
 */
export async function readUpload(key: string): Promise<{ data: Uint8Array; contentType: string } | null> {
  const safe = key.replace(/^uploads\//, "").replace(/[^\w.\-@]/g, "_");
  if (DEPLOY_TARGET === "cloudflare") {
    const env = (process.env as any).STELARITH_R2;
    if (env?.get) {
      const obj = await env.get(`uploads/${safe}`);
      if (!obj) return null;
      const bytes = await obj.arrayBuffer();
      return { data: new Uint8Array(bytes), contentType: obj.httpMetadata?.contentType || "application/octet-stream" };
    }
    return null;
  }
  if (DEPLOY_TARGET === "local") {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const { extname } = await import("node:path");
    const mime: Record<string, string> = {
      ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
      ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
      ".ico": "image/x-icon", ".txt": "text/plain", ".md": "text/markdown",
      ".pdf": "application/pdf", ".zip": "application/zip", ".json": "application/json",
    };
    try {
      const data = new Uint8Array(await readFile(join(process.cwd(), ".data", "uploads", safe)));
      return { data, contentType: mime[extname(safe).toLowerCase()] || "application/octet-stream" };
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * 列出已上传文件（local / r2 通用）
 */
/**
 * 删除上传文件（local / r2 通用），成功返回 true
 */
export async function deleteUpload(key: string): Promise<boolean> {
  const safe = key.replace(/^uploads\//, "").replace(/[^\w.\-@]/g, "_");
  if (DEPLOY_TARGET === "cloudflare") {
    const env = (process.env as any).STELARITH_R2;
    if (env?.delete) {
      await env.delete(`uploads/${safe}`);
      return true;
    }
    return false;
  }
  if (DEPLOY_TARGET === "local") {
    const { unlink } = await import("node:fs/promises");
    const { join } = await import("node:path");
    try {
      await unlink(join(process.cwd(), ".data", "uploads", safe));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function listUploads(): Promise<string[]> {
  if (DEPLOY_TARGET === "cloudflare") {
    const env = (process.env as any).STELARITH_R2;
    if (env?.list) {
      const listed = await env.list({ prefix: "uploads/" });
      return listed.objects?.map((o: any) => o.key) || [];
    }
    return [];
  }
  if (DEPLOY_TARGET === "local") {
    const { readdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    try {
      const names = await readdir(join(process.cwd(), ".data", "uploads"));
      return names.map((n) => `uploads/${n}`);
    } catch {
      return [];
    }
  }
  return [];
}
