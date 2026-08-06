<template>
  <div>
    <PageHeader eyebrow="Tags" :title="`# ${route.params.tag}`" :description="`关于「${route.params.tag}」的内容。`" accent="space" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <template v-if="items.length > 0">
        <div class="grid gap-6 md:grid-cols-2">
          <PostCard v-for="item in posts" :key="'p-' + item.path" :post="item" />
          <ProjectCard v-for="item in projects" :key="'j-' + item.path" :project="item" />
          <NoteCard v-for="item in notes" :key="'n-' + item.path" :note="item" />
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">该标签下还没有内容。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

import { getAllPublished } from "~/composables/useContent";

const { data } = await useAsyncData(`tag-${route.params.tag}`, async () => {
  const tag = route.params.tag as string;
  const [posts, projects, notes] = await Promise.all([
    getAllPublished("posts"),
    getAllPublished("projects"),
    getAllPublished("notes"),
  ]);
  return {
    posts: posts.filter((p: any) => (p.tags || []).includes(tag)),
    projects: projects.filter((p: any) => (p.tags || []).includes(tag)),
    notes: notes.filter((n: any) => (n.tags || []).includes(tag)),
  };
});

const posts = computed(() => data.value?.posts || []);
const projects = computed(() => data.value?.projects || []);
const notes = computed(() => data.value?.notes || []);
const items = computed(() => [...posts.value, ...projects.value, ...notes.value]);

useHead(() => ({ title: `# ${route.params.tag} · 星璃` }));
</script>
