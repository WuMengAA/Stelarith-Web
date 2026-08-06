<template>
  <div>
    <PageHeader eyebrow="Docs" title="文 档" description="技术方案、使用说明与设计思路。" accent="space" />
    <section class="mx-auto max-w-4xl px-6 pb-28">
      <template v-if="docs.length > 0">
        <div class="space-y-10">
          <div v-for="(list, group) in groups" :key="group">
            <h2 class="mb-5 border-b border-space-500/10 pb-3 text-xs uppercase tracking-[0.4em] text-space-400">{{ group }}</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <NuxtLink v-for="doc in list" :key="doc._id" :to="`/docs/${doc._id}`" class="glass group flex flex-col p-5">
                <p class="text-sm text-star-100 transition-colors duration-300 group-hover:text-white">{{ doc.title }}</p>
                <p v-if="doc.description" class="mt-1.5 line-clamp-1 text-xs text-star-400">{{ doc.description }}</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">还没有文档。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllPublished } from "~/composables/useContent";

useHead({ title: "文档 · 星璃", meta: [{ name: "description", content: "星璃的文档" }] });

const { data } = await useAsyncData("docs", async () => {
  const list = await getAllPublished("docs");
  return list.sort((a: any, b: any) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
});

const docs = computed(() => data.value || []);
const groups = computed(() => {
  const m = new Map<string, any[]>();
  for (const doc of docs.value) {
    const group = doc.group || "通用";
    if (!m.has(group)) m.set(group, []);
    m.get(group)!.push(doc);
  }
  return Object.fromEntries(m);
});
</script>
