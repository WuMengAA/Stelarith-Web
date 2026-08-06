<template>
  <figure class="my-6">
    <img :src="withBase(src)" :alt="alt || ''" data-lightbox :data-lb-caption="caption" class="w-full border border-space-500/10" loading="lazy" />
    <figcaption v-if="caption" class="mt-2 text-center text-xs text-star-400">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ src: string; alt?: string; caption?: string }>(), { alt: "" });
</script>
