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
  space: "text-space-400 hover:text-star-100",
  twilight: "text-twilight-300 hover:text-star-100",
  glaze: "text-gold-400 hover:text-star-100",
}[props.tone] || "text-space-400 hover:text-star-100"));
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
