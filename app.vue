<template>
  <div class="min-h-screen">
    <MinimalBackground />
    <BlackHoleBackground />
    <SiteHeader />
    <main class="min-h-screen">
      <NuxtPage />
    </main>
    <SiteFooter />
    <SearchDialog />
    <Lightbox />
    <button id="bh-toggle" class="bh-toggle" type="button" aria-label="切换黑洞彩蛋背景（B）" title="黑洞彩蛋 · B" :class="{ 'is-active': bhActive }" @click="toggleBlackhole">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4.2" transform="rotate(-24 12 12)" />
        <circle cx="4.5" cy="6" r="1" />
        <circle cx="20" cy="16" r="1.2" />
        <circle cx="17" cy="5" r="0.7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const bhActive = ref(false);

const toggleBlackhole = () => {
  // B 键已在 BlackHoleBackground 组件内监听；此处只负责按钮触发
  window.dispatchEvent(new CustomEvent("stelarith:toggle-blackhole"));
  bhActive.value = !bhActive.value;
};
</script>
