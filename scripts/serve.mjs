// 静态预览服务器：服务 dist/ 目录
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const root = "dist";
const mime = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain",
  ".xml": "application/xml", ".woff": "font/woff", ".woff2": "font/woff2",
};

createServer((req, res) => {
  try {
    let url = req.url.split("?")[0];
    if (url === "/") url = "/index.html";
    let file = join(root, url);
    // SPA 回退：找不到文件时用 404.html
    if (!existsSync(file) || statSync(file).isDirectory()) {
      file = join(root, url.endsWith("/") ? url + "index.html" : url);
      if (!existsSync(file)) { file = join(root, "404.html"); res.statusCode = 404; }
    }
    const data = readFileSync(file);
    res.setHeader("content-type", mime[extname(file).toLowerCase()] || "application/octet-stream");
    res.end(data);
  } catch (e) {
    res.statusCode = 500;
    res.end("Server error: " + (e.message || e));
  }
}).listen(8800, () => console.log("Static server: http://localhost:8800/"));
