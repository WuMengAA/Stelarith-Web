<template>
  <div class="my-6">
    <div class="relative aspect-video overflow-hidden border border-space-500/15">
      <video v-if="type === 'video'" :src="url" controls playsinline class="h-full w-full bg-black" />
      <iframe
        v-else
        :src="url"
        :title="title || '视频'"
        class="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
    <p v-if="title" class="mt-2 text-center text-xs text-star-400">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ src: string; title?: string }>();

function embedUrl(src: string): { url: string; type: "youtube" | "bilibili" | "video" } {
  const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return { url: `https://www.youtube.com/embed/${yt[1]}`, type: "youtube" };
  const bili = src.match(/bilibili\.com\/video\/(BV[\w]+)/);
  if (bili) return { url: `https://player.bilibili.com/player.html?bvid=${bili[1]}&page=1`, type: "bilibili" };
  return { url: src, type: "video" };
}

const { url, type } = embedUrl(props.src);
</script>
