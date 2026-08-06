<template>
  <footer class="mt-24 border-t border-space-500/10">
    <div class="mx-auto max-w-5xl px-6 py-12">
      <!-- 顶部：品牌 + 主导航（与导航栏同步）+ 联系 -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div class="md:col-span-4">
          <p class="font-display text-sm tracking-[0.3em] text-accent-400">STELARITH</p>
          <p class="mt-2 text-sm text-gray-500">{{ siteConfig.brand.slogan }}</p>
        </div>

        <!-- 主导航栏目：与 header 完全同步（页末同步） -->
        <div class="md:col-span-5">
          <p class="mb-3 text-xs font-medium tracking-widest text-gray-500">导航</p>
          <div class="flex flex-wrap gap-x-5 gap-y-2">
            <NuxtLink
              v-for="item in mainNav"
              :key="item.label"
              :to="item.href"
              class="text-sm tracking-widest text-gray-400 transition-colors hover:text-accent-400"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- 联系 + 次级导航 -->
        <div class="md:col-span-3">
          <p class="mb-3 text-xs font-medium tracking-widest text-gray-500">连接</p>
          <div class="flex flex-wrap gap-x-5 gap-y-2">
            <NuxtLink
              :to="`/go?to=${encodeURIComponent(siteConfig.links.github)}`"
              class="text-sm tracking-widest text-gray-400 transition-colors hover:text-accent-400"
              aria-label="GitHub"
            >
              GitHub
            </NuxtLink>
            <a
              :href="`mailto:${siteConfig.links.email}`"
              class="text-sm tracking-widest text-gray-400 transition-colors hover:text-accent-400"
              aria-label="邮箱"
            >
              邮箱
            </a>
            <NuxtLink
              v-for="link in secondaryNav"
              :key="link.label"
              :to="link.href"
              class="text-sm tracking-widest text-gray-400 transition-colors hover:text-accent-400"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 底部：版权 + 标语 -->
      <div
        class="mt-10 flex flex-col items-center gap-2 border-t border-space-500/10 pt-6 text-xs text-star-400/60 md:flex-row md:justify-between"
      >
        <p>© {{ new Date().getFullYear() }} {{ siteConfig.author }} · Stelarith. 保留所有权利。</p>
        <p>{{ siteConfig.brand.footerNote }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { siteConfig, mainNav, secondaryNav } from "~/composables/useSiteConfig";
</script>
