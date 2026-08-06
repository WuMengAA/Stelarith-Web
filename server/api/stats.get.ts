// 站点统计 API：/api/stats
// 返回内容集合计数、项目状态分布、上传文件数、软件下载量等
import { isApiAvailable, listUploads } from "../utils/storage";
import { readAllCollections } from "../utils/content-reader";
import { getCounter } from "../utils/counter";

export default defineEventHandler(async () => {
  if (!isApiAvailable()) {
    throw createError({ statusCode: 503, statusMessage: "静态部署不支持统计" });
  }

  const collections = readAllCollections();

  // 各集合已发布计数
  const counts: Record<string, number> = {};
  for (const [name, items] of Object.entries(collections)) {
    counts[name] = items.filter((i: any) => !i.draft).length;
  }

  // 项目状态分布
  const statusDist: Record<string, number> = {};
  for (const p of collections.projects || []) {
    const s = p.status || "unknown";
    statusDist[s] = (statusDist[s] || 0) + 1;
  }

  // 上传文件数
  const uploads = await listUploads();

  // 软件下载量（逐个软件文件读取计数）
  const downloads: Record<string, number> = {};
  for (const s of collections.software || []) {
    if (s.file) downloads[s._id || s.id] = await getCounter(`download:${s.file}`);
  }

  return {
    ok: true,
    collections: counts,
    projectStatus: statusDist,
    uploads: uploads.length,
    softwareDownloads: downloads,
    time: new Date().toISOString(),
  };
});
