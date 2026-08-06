<template>
  <header class="fixed left-0 right-0 top-0 z-50">
    <nav class="mx-auto max-w-5xl px-6">
      <div
        class="flex items-center justify-between border-b border-space-500/15 bg-space-900/40 py-5 backdrop-blur-xl"
        style="-webkit-backdrop-filter: blur(20px)"
      >
        <NuxtLink to="/" class="group flex items-center gap-3">
          <Logo />
          <span class="flex flex-col leading-tight">
            <span class="font-display text-sm font-semibold tracking-widest text-star-100">STELARITH</span>
            <span class="text-[11px] text-star-400/80">星 璃</span>
          </span>
        </NuxtLink>

        <div class="hidden items-center gap-7 md:flex">
          <NuxtLink
            v-for="item in siteConfig.nav"
            :key="item.label"
            :to="item.href"
            class="text-sm tracking-wide transition-colors duration-200"
            :class="isActive(item.href) ? 'text-star-100' : 'text-star-400 hover:text-star-100'"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            type="button"
            class="search-trigger flex items-center gap-2 text-sm tracking-wide text-star-400 transition-colors duration-200 hover:text-star-100"
            aria-label="搜索"
            @click="openSearch"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            搜索
          </button>
        </div>

        <div class="flex items-center gap-3 md:hidden">
          <button
            type="button"
            class="search-trigger flex h-10 w-10 items-center justify-center text-star-300 transition-colors hover:text-star-100"
            aria-label="搜索"
            @click="openSearch"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button
            class="flex h-10 w-10 items-center justify-center text-star-200 transition-colors hover:text-star-100"
            aria-label="打开菜单"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <div v-show="menuOpen" class="border-b border-space-500/15 bg-space-900/50 backdrop-blur-xl md:hidden">
        <div class="flex flex-col">
          <NuxtLink
            v-for="item in siteConfig.nav"
            :key="item.label"
            :to="item.href"
            class="border-b border-space-500/10 py-3.5 text-sm transition-colors last:border-b-0"
            :class="isActive(item.href) ? 'text-star-100' : 'text-star-400 hover:text-star-100'"
            @click="menuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            type="button"
            class="search-trigger border-b border-space-500/10 py-3.5 text-left text-sm text-star-400 transition-colors hover:text-star-100"
            @click="menuOpen = false; openSearch()"
          >
            搜索
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { siteConfig } from "~/composables/useSiteConfig";

const route = useRoute();
const menuOpen = ref(false);

const isActive = (href: string) =>
  route.path === href || (href !== "/" && route.path.startsWith(href));

const openSearch = () => {
  window.dispatchEvent(new CustomEvent("stelarith:open-search"));
};
</script>
