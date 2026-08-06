<template>
  <div>
    <PageHeader eyebrow="Projects" title="项 目" description="正在点亮的光，可以运行的创造。" accent="twilight" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <!-- 统计条（仅后端可用） -->
      <div v-if="stats" class="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ stats.projectStatus?.active || 0 }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">进行中项目</p>
        </div>
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ stats.collections?.projects || 0 }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">全部项目</p>
        </div>
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ stats.uploads || 0 }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">图库上传</p>
        </div>
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ stats.collections?.posts || 0 }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">文章</p>
        </div>
      </div>

      <template v-if="projects.length > 0">
        <div class="grid gap-6 md:grid-cols-2">
          <ProjectCard v-for="project in projects" :key="project.path" :project="project" />
        </div>
      </template>
      <EmptyState v-else message="项目空间还在探索中……" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllPublished } from "~/composables/useContent";
import { isBackendAvailable, fetchStats } from "~/composables/useApi";

useHead({ title: "项目 · 星璃", meta: [{ name: "description", content: "星璃的项目" }] });
const { data: projects } = await useAsyncData("projects", () => getAllPublished("projects"));

const stats = ref<Record<string, any> | null>(null);
onMounted(async () => {
  if (isBackendAvailable()) {
    stats.value = await fetchStats();
  }
});
</script>
