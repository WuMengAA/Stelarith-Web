<template>
  <a
    :href="href"
    class="group mb-6 mt-6 flex items-center gap-4 border border-space-500/15 p-5 transition-colors hover:border-space-400/40"
    :target="safe ? undefined : '_blank'"
    :rel="safe ? undefined : 'noopener noreferrer'"
  >
    <span class="flex h-12 w-12 shrink-0 items-center justify-center border border-space-500/15 text-star-300 transition-colors group-hover:text-star-100">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
    </span>
    <span class="min-w-0 flex-1">
      <span class="block text-sm text-star-100">{{ title }}</span>
      <span v-if="desc || size" class="mt-1 block text-xs text-star-400">
        {{ desc ? `${desc}${size ? ` · ${size}` : ""}` : size }}
      </span>
    </span>
    <span class="shrink-0 text-sm text-star-400 transition-colors group-hover:text-star-100">下载 →</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "~/composables/useContent";

const props = withDefaults(defineProps<{
  title: string;
  url: string;
  size?: string;
  desc?: string;
  safe?: boolean;
}>(), { safe: true });

const href = computed(() =>
  props.safe && !props.url.startsWith("/")
    ? withBase(`/go?to=${encodeURIComponent(props.url)}`)
    : withBase(props.url),
);
</script>
