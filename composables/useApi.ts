// ============================================================
//  Stelarith · 前端后端调用封装
//  统一处理：部署模式判断、base 前缀、错误抛出、上传进度
//  仅在后端可用（cloudflare / local）时暴露真实能力；github 静态模式降级为无操作
// ============================================================
import { siteBase } from "./useContent";

/** 当前部署模式：github（纯静态，无后端）/ cloudflare（全栈）/ local（自托管） */
export function useDeployTarget(): string {
  const config = useRuntimeConfig();
  return (config.public as any)?.deployTarget || "github";
}

/** 后端 API 是否可用（非纯静态） */
export function isBackendAvailable(): boolean {
  return useDeployTarget() !== "github";
}

/** 拼接带 base 前缀的后端 URL（后端 API 通常挂在站点根，需带 base） */
function apiUrl(path: string): string {
  const base = siteBase();
  return base + (path.startsWith("/") ? path : "/" + path);
}

/** 统一错误提取 */
function extractError(res: Response): string {
  return `${res.status} ${res.statusText}`.trim();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * 健康检查：返回部署目标与存活状态
 */
export async function fetchHealth(): Promise<{ ok: boolean; target: string } | null> {
  if (!isBackendAvailable()) return null;
  try {
    const res = await $fetch(apiUrl("/api/health"));
    return res as any;
  } catch {
    return null;
  }
}

/**
 * 上传文件到图库
 * @returns 可公开访问的 URL；后端不可用或失败时抛 ApiError
 */
export async function uploadFile(
  file: File,
  opts: { onProgress?: (percent: number) => void } = {},
): Promise<string> {
  if (!isBackendAvailable()) throw new ApiError(503, "当前为纯静态部署，不支持上传");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(apiUrl("/api/upload"), {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new ApiError(res.status, extractError(res));

  const data = await res.json();
  if (!data?.ok) throw new ApiError(500, "上传接口异常");
  return data.url as string;
}

/** 读取单个文件（用于 <img> 等场景） */
export function fileUrl(key: string): string {
  return apiUrl(`/api/files?key=${encodeURIComponent(key)}`);
}

/**
 * 列出所有上传文件
 * @returns [{ key, url }]
 */
export async function listFiles(): Promise<{ key: string; url: string }[]> {
  if (!isBackendAvailable()) return [];
  try {
    const res = await $fetch(apiUrl("/api/files"));
    return (res as any) || [];
  } catch {
    return [];
  }
}

/**
 * 删除上传文件
 */
export async function deleteFile(key: string): Promise<boolean> {
  if (!isBackendAvailable()) return false;
  const res = await fetch(apiUrl(`/api/files?key=${encodeURIComponent(key)}`), {
    method: "DELETE",
  });
  return res.ok;
}

/**
 * 站点统计（项目下载 / 访问 / 状态分布等）
 */
export async function fetchStats(): Promise<Record<string, any> | null> {
  if (!isBackendAvailable()) return null;
  try {
    const res = await $fetch(apiUrl("/api/stats"));
    return (res as any) || null;
  } catch {
    return null;
  }
}

/**
 * 软件下载链接（带 base 前缀；下载时后端计数 +1）
 */
export function downloadUrl(fileKey: string): string {
  return apiUrl(`/api/download?key=${encodeURIComponent(fileKey)}`);
}
