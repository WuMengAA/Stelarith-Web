// 图库上传 API：支持本地磁盘（local）与 Cloudflare R2（cloudflare）
// 仅非纯静态模式下可用；返回可访问相对 URL
import { isApiAvailable, saveUpload } from "../utils/storage";

export default defineEventHandler(async (event) => {
  if (!isApiAvailable()) {
    throw createError({ statusCode: 503, statusMessage: "静态部署不支持上传，请使用自托管或云全栈入口" });
  }
  const form = await readMultipartFormData(event);
  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: "缺少文件" });
  }
  const file = form.find((f) => f.name === "file" && f.data?.length);
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: "字段 file 为空" });
  }
  const name = file.filename || `upload-${Date.now()}`;
  try {
    const { url } = await saveUpload(name, file.data, file.type || "application/octet-stream");
    return { ok: true, url };
  } catch (e: any) {
    throw createError({ statusCode: 500, statusMessage: `上传失败: ${e?.message || e}` });
  }
});
