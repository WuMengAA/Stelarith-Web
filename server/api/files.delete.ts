// 文件删除 API：DELETE /api/files?key=uploads/xxx.png
import { isApiAvailable, deleteUpload } from "../utils/storage";

export default defineEventHandler(async (event) => {
  if (!isApiAvailable()) {
    throw createError({ statusCode: 503, statusMessage: "静态部署不支持删除文件" });
  }
  const query = getQuery(event);
  const key = String(query.key || "");
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: "缺少 key 参数" });
  }
  const ok = await deleteUpload(key);
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: "文件不存在或删除失败" });
  }
  return { ok: true };
});
