<template>
  <article class="glass group flex flex-col p-6">
    <div class="flex items-center justify-between">
      <time class="text-xs tracking-wide text-star-400 transition-colors duration-300 group-hover:text-star-300">
        {{ fmtDate(project.pubDate) }}
      </time>
      <span class="px-2 py-0.5 text-[11px] tracking-wide" :class="projectStatusClass(project.status)">
        {{ projectStatusText[project.status] || project.status }}
      </span>
    </div>

    <h3 class="mt-3 text-lg font-semibold text-star-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-star-200">
      {{ project.title }}
    </h3>
    <p class="mt-2 line-clamp-2 text-sm text-star-400 transition-colors duration-300 group-hover:text-star-300">
      {{ project.description }}
    </p>

    <div v-if="project.tags && project.tags.length > 0" class="mt-auto">
      <TagList :tags="project.tags" tone="twilight" :limit="3" />
    </div>

    <div class="mt-4 flex gap-5 text-sm">
      <NuxtLink
        :to="`/projects/${project._id}`"
        class="border-b border-transparent pb-0.5 tracking-widest text-accent-400 transition-all duration-300 hover:border-accent-500 hover:text-accent-300"
      >
        详情
      </NuxtLink>
      <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener noreferrer" class="text-gray-400 transition-colors duration-300 hover:text-accent-400">
        源码 ↗
      </a>
      <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer" class="text-gray-400 transition-colors duration-300 hover:text-accent-400">
        演示 ↗
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { fmtDate, projectStatusText, projectStatusClass } from "~/composables/useContent";

defineProps<{ project: any }>();
</script>
