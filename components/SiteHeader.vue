<template>
  <header class="fixed left-0 right-0 top-0 z-50" :class="scrolled ? 'header-scrolled' : ''">
    <nav class="mx-auto max-w-5xl px-4 sm:px-6">
      <div
        class="flex items-center justify-between border-b py-4 sm:py-5 transition-colors duration-300"
        :class="scrolled ? 'border-space-500/15 bg-space-900/70' : 'border-transparent bg-transparent'"
        style="-webkit-backdrop-filter: blur(20px)"
      >
        <NuxtLink to="/" class="group flex items-center gap-3" @click="menuOpen = false">
          <Logo />
          <span class="flex flex-col leading-tight">
            <span class="font-display text-sm font-semibold tracking-widest text-star-100">STELARITH</span>
            <span class="text-[11px] text-star-400/80">星 璃</span>
          </span>
        </NuxtLink>

        <!-- 桌面导航：≥lg 显示（避免导航项过多时在小屏拥挤） -->
        <div class="hidden items-center gap-1 lg:flex">
          <NuxtLink
            v-for="item in mainNav"
            :key="item.label"
            :to="item.href"
            class="relative rounded-md px-3 py-1.5 text-sm tracking-wide transition-colors duration-200"
            :class="isActive(item.href) ? 'text-accent-400 nav-active' : 'text-gray-400 hover:text-accent-400 hover:bg-white/5'"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            type="button"
            class="search-trigger ml-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm tracking-wide text-gray-400 transition-colors duration-200 hover:text-accent-400 hover:bg-white/5"
            aria-label="搜索"
            @click="openSearch"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            搜索
          </button>
        </div>

        <!-- 移动端：图标按钮 -->
        <div class="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            class="search-trigger flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition-colors hover:text-accent-400"
            aria-label="搜索"
            @click="openSearch"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button
            class="flex h-10 w-10 items-center justify-center rounded-md text-star-200 transition-colors hover:text-star-100"
            aria-label="打开菜单"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <!-- 汉堡 / 关闭 图标切换 -->
            <svg v-if="!menuOpen" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
            <svg v-else width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端菜单：与主导航同步，滚动锁定 -->
      <transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div v-show="menuOpen" class="border-b border-space-500/15 bg-space-900/60 backdrop-blur-xl lg:hidden">
          <div class="flex flex-col px-2 py-2">
            <NuxtLink
              v-for="item in mainNav"
              :key="item.label"
              :to="item.href"
              class="rounded-lg px-3 py-3 text-sm transition-colors"
              :class="isActive(item.href) ? 'bg-white/5 text-accent-400' : 'text-gray-400 hover:text-accent-400 hover:bg-white/5'"
              @click="menuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
            <button
              type="button"
              class="search-trigger flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm text-star-400 transition-colors hover:text-star-100"
              @click="menuOpen = false; openSearch()"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              搜索
            </button>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { mainNav } from "~/composables/useSiteConfig";

const route = useRoute();
const menuOpen = ref(false);
const scrolled = ref(false);

const isActive = (href: string) =>
  route.path === href || (href !== "/" && route.path.startsWith(href));

const openSearch = () => {
  window.dispatchEvent(new CustomEvent("stelarith:open-search"));
};

// 滚动超过一定距离时给导航加背景阴影，提升可读性
const onScroll = () => {
  scrolled.value = window.scrollY > 12;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.header-scrolled {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}
.nav-active {
  position: relative;
}
/* 当前页指示点（星璃紫） */
.nav-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 2px;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: var(--stellaria);
}
</style>
