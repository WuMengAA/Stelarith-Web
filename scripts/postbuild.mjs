// ============================================================
//  构建后处理：
//   1. 生成 Pagefind 搜索索引（静态部署所需）
//   2. 将 404 页面复制为 404.html（GitHub Pages SPA 回退）
//   3. 输出 base 提示
// ============================================================
import { execSync } from "node:child_process";
import { existsSync, copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve("dist");
const base = process.env.BASE_URL || "/";

console.log(`[postbuild] dist=${dist} base=${base}`);

// 1. Pagefind 索引
if (existsSync(dist)) {
  try {
    console.log("[postbuild] 生成 Pagefind 索引…");
    execSync("npx pagefind --site dist", { stdio: "inherit", shell: true });
    console.log("[postbuild] Pagefind 索引完成");
  } catch (e) {
    console.warn("[postbuild] Pagefind 失败（可忽略）:", e.message);
  }
}

// 2. 404 回退页（GitHub Pages 需要顶层 404.html）
const spaFallback = resolve(dist, "404.html");
if (existsSync(spaFallback)) {
  const copyTarget = resolve(dist, "404.html");
  copyFileSync(spaFallback, copyTarget);
  console.log("[postbuild] 404.html 已就绪");
}

console.log(`[postbuild] 完成。部署基础路径: ${base}`);
