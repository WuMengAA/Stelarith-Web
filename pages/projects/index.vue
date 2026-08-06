<template>
  <div>
    <PageHeader eyebrow="Projects" title="项 目" description="正在点亮的光，可以运行的创造。" accent="twilight" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
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
useHead({ title: "项目 · 星璃", meta: [{ name: "description", content: "星璃的项目" }] });
const { data: projects } = await useAsyncData("projects", () => getAllPublished("projects"));
</script>
