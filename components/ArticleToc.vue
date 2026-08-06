<template>
  <aside class="toc-panel">
    <p class="toc-title">目录</p>
    <nav>
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        class="toc-link"
        :class="{ 'toc-h2': item.depth === 2, 'toc-h3': item.depth === 3 }"
      >
        {{ item.text }}
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ items: any[] }>();
</script>

<style scoped>
.toc-panel {
  position: fixed;
  top: 160px;
  left: calc(50% - 560px);
  width: 200px;
  max-height: 60vh;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding-left: 16px;
  display: none;
}
@media (min-width: 1280px) {
  .toc-panel { display: block; }
}
.toc-title {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-star-400);
  margin-bottom: 10px;
}
.toc-link {
  display: block;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--color-space-400);
  padding: 3px 0;
  transition: color 0.2s;
  text-decoration: none;
}
.toc-link:hover { color: var(--color-star-300); }
.toc-h2 { padding-left: 0; }
.toc-h3 { padding-left: 12px; font-size: 11.5px; }
</style>
