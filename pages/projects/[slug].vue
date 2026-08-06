<template>
  <article class="mx-auto max-w-3xl px-6 pb-28 pt-36">
    <template v-if="project">
      <header>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-star-400">
          <span>{{ metaText }}</span>
          <span class="px-2 py-0.5 text-[11px] tracking-wide" :class="projectStatusClass(project.status)">
            {{ projectStatusText[project.status] || project.status }}
          </span>
        </div>
        <h1 class="mt-5 text-3xl font-light leading-tight text-star-100 md:text-4xl">{{ project.title }}</h1>
        <p v-if="project.description" class="mt-5 text-base leading-relaxed text-star-400">{{ project.description }}</p>
        <div v-if="project.tags?.length" class="mt-5">
          <TagList :tags="project.tags" tone="twilight" />
        </div>
      </header>

      <div class="my-10 h-px bg-space-500/15" />

      <div class="prose-stelarith" v-html="project.bodyHtml" />

      <div class="mt-10 flex gap-5 text-sm">
        <NuxtLink to="/projects" class="tracking-widest text-gray-400 transition-colors hover:text-accent-400">← 返回项目列表</NuxtLink>
        <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener noreferrer" class="text-gray-400 transition-colors hover:text-accent-400">源码 ↗</a>
        <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer" class="text-gray-400 transition-colors hover:text-accent-400">演示 ↗</a>
      </div>
    </template>
    <div v-else class="py-20 text-center text-star-400">项目不存在</div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { fmtDate, projectStatusClass, projectStatusText, getBySlug } from "~/composables/useContent";

const route = useRoute();
const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
  getBySlug("projects", route.params.slug as string),
);

const metaText = computed(() => project.value ? `发布于 ${fmtDate(project.value.pubDate, true)}` : "");

useHead(() => ({
  title: project.value ? `${project.value.title} · 星璃` : "项目",
  meta: [{ name: "description", content: project.value?.description || siteConfig.description }],
}));
</script>
