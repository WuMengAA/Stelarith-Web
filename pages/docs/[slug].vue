<template>
  <div class="mx-auto max-w-5xl px-6 pb-28 pt-36">
    <div class="grid gap-10 lg:grid-cols-[220px_1fr]">
      <!-- 侧栏文档导航 -->
      <aside class="hidden lg:block">
        <nav class="sticky top-32 space-y-1 border-l border-space-500/15 pl-4">
          <p class="mb-3 text-xs uppercase tracking-[0.3em] text-star-400">文档</p>
          <NuxtLink
            v-for="d in allDocs"
            :key="d._id"
            :to="`/docs/${d._id}`"
            class="block py-1 text-sm transition-colors"
            :class="d._id === doc?._id ? 'text-accent-400' : 'text-gray-400 hover:text-accent-400'"
          >
            {{ d.title }}
          </NuxtLink>
        </nav>
      </aside>

      <article class="min-w-0">
        <template v-if="doc">
          <header>
            <p class="font-display text-xs uppercase tracking-[0.4em] text-star-400">Docs</p>
            <h1 class="mt-4 text-3xl font-light leading-tight text-star-100 md:text-4xl">{{ doc.title }}</h1>
            <p v-if="doc.description" class="mt-4 text-base leading-relaxed text-star-400">{{ doc.description }}</p>
          </header>
          <div class="my-8 h-px bg-space-500/15" />
          <div class="prose-stelarith" v-html="doc.bodyHtml" />
          <nav class="mt-16 border-t border-space-500/10 pt-6 text-sm">
            <NuxtLink to="/docs" class="tracking-widest text-gray-400 transition-colors hover:text-accent-400">← 返回文档列表</NuxtLink>
          </nav>
        </template>
        <div v-else class="py-20 text-center text-star-400">文档不存在</div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllPublished } from "~/composables/useContent";

const route = useRoute();

const { data: allDocs } = await useAsyncData("docs-all", () => getAllPublished("docs"));

const doc = computed(() => {
  const target = route.params.slug as string;
  return (allDocs.value || []).find((d: any) => d._id === target) || null;
});

useHead(() => ({
  title: doc.value ? `${doc.value.title} · 星璃` : "文档",
  meta: [{ name: "description", content: doc.value?.description || siteConfig.description }],
}));
</script>
