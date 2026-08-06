// ============================================================
//  Stelarith · 内容读取工具（仅服务端）
//  用 node:fs + gray-matter + markdown-it 读取 content/ 目录
//  此文件只应在服务端运行（页面 useAsyncData 中调用）
// ============================================================
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const EXT = [".md", ".mdx", ".json"];

function contentRoot(): string {
  return resolve(process.cwd(), "content");
}

function isContentFile(name: string): boolean {
  const ext = name.slice(name.lastIndexOf("."));
  return EXT.includes(ext);
}

function loadFile(collection: string, fileName: string): any {
  const full = join(contentRoot(), collection, fileName);
  if (!existsSync(full)) return null;
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

export function readCollection(collection: string): any[] {
  const dir = join(contentRoot(), collection);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
  return readdirSync(dir).filter(isContentFile).map((f) => loadFile(collection, f)).filter(Boolean);
}

export function readAllCollections(): Record<string, any[]> {
  const dir = contentRoot();
  if (!existsSync(dir)) return {};
  const out: Record<string, any[]> = {};
  for (const name of readdirSync(dir)) {
    if (statSync(join(dir, name)).isDirectory()) {
      out[name] = readCollection(name);
    }
  }
  return out;
}
