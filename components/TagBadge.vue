<template>
  <NuxtLink :to="`/tags/${tag}`" class="tag-badge" :class="toneClass">{{ '#' + tag }}</NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  tag: string;
  tone?: "space" | "twilight" | "glaze";
}>(), { tone: "space" });

const toneClass = computed(() => ({
  space: "text-gray-400 hover:text-accent-500",
  twilight: "text-gray-300 hover:text-accent-500",
  glaze: "text-accent-400 hover:text-accent-300",
}[props.tone] || "text-gray-400 hover:text-accent-500"));
</script>

<style scoped>
.tag-badge {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-underline-offset: 4px;
  transition: color 0.3s;
}
.tag-badge:hover { text-decoration: underline; }
</style>
