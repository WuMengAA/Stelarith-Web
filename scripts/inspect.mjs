import { readFileSync } from "node:fs";
const t = readFileSync("dist/index.html", "utf8");
// 查找站内导航链接（文章/项目/笔记等）
const nav = t.match(/"\/Stelarith-Web\/[a-z]+\/?"/g) || [];
console.log("=== 站内导航链接 ===");
[...new Set(nav)].slice(0, 20).forEach((x) => console.log(x));
console.log("=== 有无裸内部链接（应无 /posts 不带前缀）===");
const bare = t.match(/href="\/(posts|projects|notes|about|tags)\/?"/g) || [];
console.log(bare.length ? bare : "无裸链接（正确）");
