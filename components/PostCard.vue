<template>
  <NuxtLink :to="`/posts/${post._id}`" class="glass group flex flex-col p-6">
    <p class="text-xs tracking-wide text-star-400 transition-colors duration-300 group-hover:text-star-300">
      {{ fmtDate(post.pubDate, day) }}
    </p>
    <h3 class="mt-3 text-lg font-semibold leading-snug text-star-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-star-200">
      {{ post.title }}
    </h3>
    <p v-if="post.description" class="mt-2 line-clamp-2 text-sm text-star-400 transition-colors duration-300 group-hover:text-star-300">
      {{ post.description }}
    </p>
    <div v-if="post.tags && post.tags.length > 0" class="mt-auto">
      <TagList :tags="post.tags" :tone="tone" :limit="3" />
    </div>
    <span class="mt-4 text-xs tracking-widest text-gray-500 transition-colors duration-300 group-hover:text-accent-400">
      阅读 →
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { fmtDate } from "~/composables/useContent";

withDefaults(defineProps<{
  post: any;
  tone?: "space" | "twilight" | "glaze";
  day?: boolean;
}>(), { tone: "space", day: false });
</script>
