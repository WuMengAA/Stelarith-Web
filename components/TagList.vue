<template>
  <div v-if="shown.length > 0" class="border-t border-dashed border-space-500/20 pt-3">
    <span class="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <template v-for="(tag, i) in shown" :key="tag">
        <span v-if="i > 0" class="select-none text-[10px] tracking-widest text-star-400/50">{{ separator }}</span>
        <TagBadge :tag="tag" :tone="tone" />
      </template>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  tags: string[];
  tone?: "space" | "twilight" | "glaze";
  separator?: string;
  limit?: number;
}>(), { tone: "space", separator: "---", limit: undefined });

const shown = computed(() => props.limit ? props.tags.slice(0, props.limit) : props.tags);
</script>
