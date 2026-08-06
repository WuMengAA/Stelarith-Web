// 内容读取 API：GET /api/content?collection=posts&id=hello
//   - 无 id：返回集合内全部条目（含原始文件信息）
//   - 有 id：返回单个条目（frontmatter 数据 + body + 原始文件路径）
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import matter from "gray-matter";

const EXT = [".md", ".mdx", ".json"];
const contentRoot = () => resolve(process.cwd(), "content");

function isContentFile(name: string): boolean {
  const ext = name.slice(name.lastIndexOf("."));
  return EXT.includes(ext);
}

export default defineEventHandler((event) => {
  const q = getQuery(event);
  const collection = String(q.collection || "");
  const id = String(q.id || "");

  if (!/^[\w-]+$/.test(collection)) {
    throw createError({ statusCode: 400, statusMessage: "非法集合名" });
  }
  const dir = join(contentRoot(), collection);
  if (!existsSync(dir)) {
    throw createError({ statusCode: 404, statusMessage: `集合 ${collection} 不存在` });
  }

  const files = readdirSync(dir).filter(isContentFile).sort();

  if (id) {
    // 找到 id 对应的文件
    const file = files.find((f) => f.replace(/\.(md|mdx|json)$/, "") === id);
    if (!file) {
      throw createError({ statusCode: 404, statusMessage: `条目 ${id} 不存在` });
    }
    const full = join(dir, file);
    const raw = readFileSync(full, "utf8");
    const isJson = file.endsWith(".json");
    return {
      collection,
      id,
      file,
      isJson,
      raw,
      frontmatter: isJson ? JSON.parse(raw) : matter(raw).data,
      body: isJson ? null : matter(raw).content,
    };
  }

  // 列表：返回每个文件的 id + 标题/名称
  return files.map((f) => {
    const itemId = f.replace(/\.(md|mdx|json)$/, "");
    const full = join(dir, f);
    const raw = readFileSync(full, "utf8");
    let label = itemId;
    try {
      if (f.endsWith(".json")) {
        const d = JSON.parse(raw);
        label = d.name || d.title || itemId;
      } else {
        label = matter(raw).data.title || itemId;
      }
    } catch {}
    return { id: itemId, file: f, label };
  });
});
