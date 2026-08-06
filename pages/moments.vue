<template>
  <div>
    <PageHeader eyebrow="Moments" title="瞬 间" description="一些转瞬即逝的光，和一些想被记住的瞬间。" accent="glaze" />
    <section class="mx-auto max-w-3xl px-6 pb-28">
      <template v-if="moments.length > 0">
        <div class="relative space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-space-500/20">
          <article v-for="m in moments" :key="m.path" class="relative pl-9">
            <span class="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border border-accent-500/60 bg-space-900"></span>
            <div class="glass p-5">
              <div class="flex items-center justify-between">
                <time class="text-xs text-gray-400">{{ fmtDate(m.pubDate, true) }}</time>
                <span v-if="m.mood" class="text-xs text-accent-400">{{ m.mood }}</span>
              </div>
              <div class="prose-stelarith mt-3" v-html="m.bodyHtml" />
              <div v-if="m.type === 'image' && m.images?.length" class="mt-4 grid gap-2" :class="m.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
                <img
                  v-for="img in m.images"
                  :key="img"
                  :src="withBase(img)"
                  alt=""
                  data-lightbox
                  :data-lb-caption="m.title || '瞬间'"
                  class="w-full border border-space-500/10 object-cover"
                  loading="lazy"
                />
              </div>
              <a v-if="m.type === 'link' && m.linkUrl" :href="m.linkUrl" target="_blank" rel="noopener noreferrer" class="mt-4 block border border-space-500/15 p-4 transition-colors hover:border-space-400/40">
                <p class="text-sm text-star-100">{{ m.linkTitle || m.linkUrl }}</p>
                <p class="mt-1 line-clamp-1 text-xs text-star-400">{{ m.linkUrl }}</p>
              </a>
            </div>
          </article>
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">
        还没有瞬间。此刻就是第一个。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fmtDate, getAllPublished, withBase } from "~/composables/useContent";

useHead({ title: "瞬间 · 星璃", meta: [{ name: "description", content: "星璃的轻动态" }] });
const { data: moments } = await useAsyncData("moments", () => getAllPublished("moments"));
</script>
