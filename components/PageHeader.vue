<template>
  <section class="mx-auto max-w-5xl px-6 pb-16 pt-36">
    <p class="font-display text-xs uppercase tracking-[0.4em]" :class="accents[accent]">{{ eyebrow }}</p>
    <h1 class="mt-5 text-4xl font-extralight text-star-100 md:text-6xl">{{ title }}</h1>
    <p v-if="description" class="mt-5 text-base text-star-400">{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string;
  title: string;
  description?: string;
  accent?: "space" | "twilight" | "glaze";
}>(), { accent: "space" });

const accents = {
  space: "text-gray-400",
  twilight: "text-gray-300",
  glaze: "text-accent-400",
} as const;
</script>
