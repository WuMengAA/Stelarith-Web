<template>
  <NuxtLink :to="`/notes/${note._id}`" class="glass group flex flex-col p-5 md:p-6">
    <div class="flex items-start gap-4 md:gap-5">
      <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-star-100 transition-all duration-300 group-hover:scale-125 group-hover:bg-white" />
      <div class="flex-1">
        <h3 class="text-base font-medium text-star-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-star-200">
          {{ note.title }}
        </h3>
        <p v-if="note.description" class="mt-1.5 line-clamp-1 text-sm text-star-400 transition-colors duration-300 group-hover:text-star-300">
          {{ note.description }}
        </p>
        <time class="mt-2.5 block text-xs text-star-400 transition-colors duration-300 group-hover:text-star-300">
          {{ fmtDate(note.pubDate) }}
        </time>
      </div>
    </div>
    <div v-if="note.tags && note.tags.length > 0" class="mt-4">
      <TagList :tags="note.tags" tone="glaze" :limit="3" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { fmtDate } from "~/composables/useContent";

defineProps<{ note: any }>();
</script>
