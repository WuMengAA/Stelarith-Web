<template>
  <footer class="mt-24 border-t border-space-500/10">
    <div class="mx-auto max-w-5xl px-6 py-12">
      <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        <div class="text-center md:text-left">
          <p class="font-display text-sm tracking-[0.3em] text-accent-400">STELARITH</p>
          <p class="mt-2 text-sm text-gray-500">黑白之间的星夜空间</p>
        </div>

        <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-12">
          <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <NuxtLink
              v-for="link in siteConfig.footerLinks"
              :key="link.label"
              :to="link.href"
              class="text-sm tracking-widest text-gray-400 transition-colors hover:text-accent-400"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-6">
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
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-center gap-2 border-t border-space-500/10 pt-6 text-xs text-star-400/60 md:flex-row md:justify-between">
        <p>© {{ new Date().getFullYear() }} {{ siteConfig.author }} · Stelarith. 保留所有权利。</p>
        <p>在黑与白之间，做一颗发光的星。</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { siteConfig } from "~/composables/useSiteConfig";
</script>
