// 文件读取/输出 API：/api/files?key=uploads/xxx.png
// local → 本地磁盘流式输出；cloudflare → R2 读取
import { readUpload, listUploads } from "../utils/storage";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const key = String(query.key || "");

  // 无 key → 列出所有上传文件（图库管理用）
  if (!key) {
    const files = await listUploads();
    return files.map((k) => ({ key: k, url: `/api/files?key=${encodeURIComponent(k)}` }));
  }

  const file = await readUpload(key);
  if (!file) {
    throw createError({ statusCode: 404, statusMessage: "文件不存在" });
  }
  setHeader(event, "content-type", file.contentType);
  setHeader(event, "cache-control", "public, max-age=31536000, immutable");
  return file.data;
});
