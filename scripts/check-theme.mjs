import { readFileSync } from "node:fs";
// 从构建的 CSS 检查主题色
import { execSync } from "node:child_process";
try {
  const css = readFileSync(".output/public/_nuxt/*.css".replace("/*.css", ""), "utf8").slice(0, 0); // noop
} catch {}
// 直接抓取 dev 渲染的 HTML
import { get } from "node:http";
get("http://localhost:3300/", (r) => {
  let d = "";
  r.on("data", (c) => (d += c));
  r.on("end", () => {
    console.log("STATUS", r.statusCode);
    console.log("has 星璃:", d.includes("星 璃"));
    // 检查注入的 CSS 是否有星璃紫变量 --stellaria 和灰阶
    const cssLinks = d.match(/<link[^>]*href="([^"]*\.css[^"]*)"/g) || [];
    console.log("css links:", cssLinks.length);
    cssLinks.slice(0, 3).forEach((l) => console.log(" ", l));
  });
}).on("error", (e) => console.log("ERR", e.message));
