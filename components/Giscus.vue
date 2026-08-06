<template>
  <div class="giscus-wrap">
    <div class="mt-20 border-t border-space-500/10 pt-8" ref="container" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { siteConfig } from "~/composables/useSiteConfig";

const container = ref<HTMLElement | null>(null);

onMounted(() => {
  const g = siteConfig.giscus;
  if (!g.enabled || !g.repo) return;
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", g.repo);
  script.setAttribute("data-repo-id", g.repoId);
  script.setAttribute("data-category", g.category);
  script.setAttribute("data-category-id", g.categoryId);
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", "transparent_dark");
  script.setAttribute("data-lang", "zh-CN");
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;
  container.value?.appendChild(script);
});
</script>
