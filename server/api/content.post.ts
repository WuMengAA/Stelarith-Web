// 内容保存 API：POST /api/content
//  body: { collection, id, raw?, frontmatter?, body? }
//    - 传 raw：直接把 raw 原文写回文件（md/mdx/json 通用）
//    - 传 frontmatter/body：md/mdx 用 gray-matter 重建；json 合并
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import matter from "gray-matter";

const contentRoot = () => resolve(process.cwd(), "content");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const collection = String(body?.collection || "");
  const id = String(body?.id || "");

  if (!/^[\w-]+$/.test(collection)) throw createError({ statusCode: 400, statusMessage: "非法集合名" });
  if (!/^[\w-]+$/.test(id)) throw createError({ statusCode: 400, statusMessage: "非法 id" });

  const dir = join(contentRoot(), collection);
  if (!existsSync(dir)) throw createError({ statusCode: 404, statusMessage: `集合 ${collection} 不存在` });

  // 定位文件（优先 md，其次 mdx，最后 json）
  let file = "";
  for (const ext of [".md", ".mdx", ".json"]) {
    if (existsSync(join(dir, id + ext))) { file = id + ext; break; }
  }
  if (!file) throw createError({ statusCode: 404, statusMessage: `条目 ${id} 不存在` });

  const full = join(dir, file);
  const isJson = file.endsWith(".json");

  // 直接写原文（最通用）
  if (typeof body.raw === "string") {
    writeFileSync(full, body.raw, "utf8");
    return { ok: true, collection, id, file, mode: "raw" };
  }

  if (isJson) {
    const current = JSON.parse(readFileSync(full, "utf8"));
    const merged = { ...current, ...(body.frontmatter || {}) };
    writeFileSync(full, JSON.stringify(merged, null, 2) + "\n", "utf8");
  } else {
    const currentRaw = readFileSync(full, "utf8");
    const parsed = matter(currentRaw);
    const mergedData = { ...parsed.data, ...(body.frontmatter || {}) };
    const newBody = typeof body.body === "string" ? body.body : parsed.content;
    writeFileSync(full, matter.stringify(newBody, mergedData), "utf8");
  }

  return { ok: true, collection, id, file };
});
