---
title: "Tailwind 4 的 @theme 小记"
pubDate: 2026-08-05
tags: ["技术", "Tailwind"]
---

Tailwind CSS 4 使用 CSS-first 配置：

```css
@import "tailwindcss";

@theme {
  --color-night-950: #0b0a1f;
}
```

之后 `bg-night-950` 就能直接用，无需 config 文件。
