// 软件下载分发 API：GET /api/download?key=uploads/xxx.zip
// 每次调用计数 +1，并返回文件流（local 读盘 / cloudflare 读 R2）
import { isApiAvailable, readUpload } from "../utils/storage";
import { bumpCounter } from "../utils/counter";

export default defineEventHandler(async (event) => {
  if (!isApiAvailable()) {
    throw createError({ statusCode: 503, statusMessage: "静态部署不支持下载计数" });
  }
  const query = getQuery(event);
  const key = String(query.key || "");
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: "缺少 key 参数" });
  }

  // 读取文件
  const file = await readUpload(key);
  if (!file) {
    throw createError({ statusCode: 404, statusMessage: "文件不存在" });
  }

  // 计数 +1
  await bumpCounter(`download:${key}`);

  // 返回文件流（强制下载）
  const fileName = key.split("/").pop() || "download";
  setHeader(event, "content-type", file.contentType);
  setHeader(event, "content-disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
  setHeader(event, "cache-control", "public, max-age=31536000, immutable");
  return file.data;
});
