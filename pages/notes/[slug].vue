<template>
  <article class="mx-auto max-w-3xl px-6 pb-28 pt-36">
    <template v-if="note">
      <header>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-star-400">
          <span>{{ metaText }}</span>
          <TagList :tags="note.tags" tone="glaze" />
        </div>
        <h1 class="mt-5 text-3xl font-light leading-tight text-star-100 md:text-4xl">{{ note.title }}</h1>
        <p v-if="note.description" class="mt-5 text-base leading-relaxed text-star-400">{{ note.description }}</p>
      </header>

      <div class="my-10 h-px bg-space-500/15" />

      <div class="prose-stelarith" v-html="note.bodyHtml" />

      <nav class="mt-20 border-t border-space-500/10 pt-6 text-sm">
        <NuxtLink to="/notes" class="tracking-widest text-gray-400 transition-colors hover:text-accent-400">
          ← 返回随记
        </NuxtLink>
      </nav>
    </template>
    <div v-else class="py-20 text-center text-star-400">笔记不存在</div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { fmtDate, getBySlug } from "~/composables/useContent";

const route = useRoute();
const { data: note } = await useAsyncData(`note-${route.params.slug}`, () =>
  getBySlug("notes", route.params.slug as string),
);

const metaText = computed(() => note.value ? `发布于 ${fmtDate(note.value.pubDate, true)}` : "");

useHead(() => ({
  title: note.value ? `${note.value.title} · 星璃` : "笔记",
  meta: [{ name: "description", content: note.value?.description || siteConfig.description }],
}));
</script>
