<template>
  <div class="search-dialog-overlay" :class="{ show: visible }" @click.self="close">
    <div class="search-dialog" role="dialog" aria-modal="true" aria-label="搜索">
      <div class="flex items-center gap-3 border-b border-space-500/15 pb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="text-star-400 shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          v-model="query"
          type="search"
          placeholder="搜索文章、项目、笔记…"
          autocomplete="off"
          spellcheck="false"
          class="flex-1 bg-transparent text-base text-star-100 outline-none placeholder:text-star-400"
        />
        <kbd class="shrink-0 rounded border border-white/20 px-2 py-0.5 text-[0.7rem] text-star-400">Esc</kbd>
      </div>
      <div class="max-h-[60vh] overflow-y-auto p-2" v-html="resultsHtml" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const visible = ref(false);
const query = ref("");
const resultsHtml = ref("");

let pagefind: any = null;
let debounce: ReturnType<typeof setTimeout> | null = null;

function loadPagefind(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (pagefind) return resolve(pagefind);
    const script = document.createElement("script");
    script.src = useRuntimeConfig().app.baseURL + "pagefind/pagefind.js";
    script.async = true;
    script.onload = () => resolve((window as any).pagefind);
    script.onerror = () => reject(new Error("pagefind load failed"));
    document.head.appendChild(script);
  });
}

async function runSearch(q: string) {
  try {
    pagefind = await loadPagefind();
    const search = await pagefind.search(q);
    if (!search.results.length) {
      resultsHtml.value = '<p class="p-8 text-center text-sm text-star-400">没有找到相关内容。</p>';
      return;
    }
    const data = await Promise.all(search.results.slice(0, 12).map((r: any) => r.data()));
    resultsHtml.value = data
      .map(
        (d: any) => `
        <a href="${d.url}" class="block border-b border-space-500/10 px-4 py-3 transition-colors hover:bg-space-500/5">
          <p class="text-sm text-star-100">${d.meta?.title || d.url}</p>
          ${d.excerpt ? `<p class="mt-1 line-clamp-2 text-xs text-star-400">${d.excerpt}</p>` : ""}
        </a>`,
      )
      .join("");
  } catch (e) {
    resultsHtml.value = '<p class="p-8 text-center text-sm text-star-400">搜索索引不可用，请重新构建。</p>';
    console.error("[Search]", e);
  }
}

watch(query, (q) => {
  if (debounce) clearTimeout(debounce);
  const value = q.trim();
  if (!value) { resultsHtml.value = ""; return; }
  debounce = setTimeout(() => runSearch(value), 200);
});

const open = () => {
  visible.value = true;
  query.value = "";
  resultsHtml.value = "";
  setTimeout(() => {
    document.querySelector<HTMLInputElement>(".search-dialog input")?.focus();
  }, 50);
  document.body.style.overflow = "hidden";
};
const close = () => {
  visible.value = false;
  document.body.style.overflow = "";
};

onMounted(() => {
  window.addEventListener("stelarith:open-search", open);
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      visible.value ? close() : open();
    }
    if (e.key === "Escape") close();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("stelarith:open-search", open);
});
</script>
