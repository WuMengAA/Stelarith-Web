<template>
  <div>
    <PageHeader eyebrow="Tags" title="标 签" description="按主题聚合的星空碎片。" accent="space" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <template v-if="tags.length > 0">
        <p class="flex flex-wrap items-baseline gap-x-4 gap-y-3 leading-relaxed">
          <NuxtLink
            v-for="[tag, count] in tags"
            :key="tag"
            :to="`/tags/${tag}`"
            class="underline-offset-4 transition-colors duration-300 hover:text-accent-400 hover:underline"
            :class="count >= 3 ? 'text-lg text-star-200' : count === 2 ? 'text-base text-star-300' : 'text-sm text-star-400'"
          >
            #{{ tag }}
            <span class="ml-1.5" :class="count >= 3 ? 'text-xs text-star-400' : 'text-[10px] text-star-400/70'">{{ count }}</span>
          </NuxtLink>
        </p>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">还没有标签。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllPublished } from "~/composables/useContent";

useHead({ title: "标签 · 星璃", meta: [{ name: "description", content: "所有内容的标签" }] });

const { data: all } = await useAsyncData("tags", async () => {
  const [posts, projects, notes] = await Promise.all([
    getAllPublished("posts"),
    getAllPublished("projects"),
    getAllPublished("notes"),
  ]);
  return [...posts, ...projects, ...notes];
});

const tags = computed(() => {
  const count = new Map<string, number>();
  for (const item of all.value || []) {
    for (const t of item.tags || []) count.set(t, (count.get(t) || 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]);
});
</script>
