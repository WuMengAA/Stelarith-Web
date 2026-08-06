<template>
  <div class="flex items-baseline justify-between border-b border-space-500/10 pb-4">
    <div>
      <p class="font-display text-xs uppercase tracking-[0.4em]" :class="accents[accent]">{{ eyebrow }}</p>
      <h2 class="mt-3 text-2xl font-light text-star-100 md:text-3xl">{{ title }}</h2>
    </div>
    <NuxtLink v-if="href" :to="href" class="text-sm tracking-widest text-star-400 transition-colors hover:text-star-100">
      {{ hrefLabel }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string;
  title: string;
  accent?: "space" | "twilight" | "glaze";
  href?: string;
  hrefLabel?: string;
}>(), { accent: "space", hrefLabel: "全部 →" });

const accents = {
  space: "text-space-400",
  twilight: "text-twilight-400",
  glaze: "text-gold-400",
} as const;
</script>
