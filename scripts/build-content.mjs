// ============================================================
//  构建前预生成内容数据（消除运行时 node:fs 依赖）
//  读取 content/ 目录 → 解析 → 输出到 data/ 目录（JSON + 索引）
//  data/ 里的 JSON 由 Vite 静态打包进 SSR，无需运行时 HTTP 请求
// ============================================================
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const contentRoot = resolve("content");
const dataRoot = resolve("data");

const EXT = [".md", ".mdx", ".json"];

function loadFile(collection, fileName) {
  const full = join(contentRoot, collection, fileName);
  const raw = readFileSync(full, "utf8");
  const id = fileName.replace(/\.(md|mdx|json)$/, "");
  if (fileName.endsWith(".json")) {
    const data = JSON.parse(raw);
    return { ...data, _id: id, id, path: `/${collection}/${id}` };
  }
  const { data, content } = matter(raw);
  return {
    ...data,
    _id: id,
    id,
    path: `/${collection}/${id}`,
    title: data.title || id,
    body: content,
    bodyHtml: md.render(content),
  };
}

mkdirSync(dataRoot, { recursive: true });
let total = 0;
const collections = {};
for (const name of readdirSync(contentRoot)) {
  const dir = join(contentRoot, name);
  if (!statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir).filter((f) => EXT.includes(f.slice(f.lastIndexOf("."))));
  const items = files.map((f) => loadFile(name, f)).filter(Boolean);
  collections[name] = items;
  writeFileSync(join(dataRoot, `${name}.json`), JSON.stringify(items), "utf8");
  total += items.length;
  console.log(`[content] ${name}: ${items.length} items`);
}
console.log(`[content] 总计 ${total} 条内容 → ${dataRoot}`);
