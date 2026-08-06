<template>
  <div>
    <PageHeader eyebrow="Links" title="友 链" description="同在这片星空下前行的伙伴。" accent="glaze" />
    <section class="mx-auto max-w-4xl px-6 pb-28">
      <template v-if="links.length > 0">
        <div class="grid gap-4 sm:grid-cols-2">
          <a v-for="link in links" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer" class="glass group flex items-center gap-4 p-5">
            <img v-if="link.avatar" :src="link.avatar" alt="" width="44" height="44" class="h-11 w-11 shrink-0 border border-space-500/20 object-cover" loading="lazy" />
            <span v-else class="flex h-11 w-11 shrink-0 items-center justify-center border border-space-500/20 text-lg text-star-300">
              {{ link.name.slice(0, 1) }}
            </span>
            <div class="min-w-0">
              <p class="text-sm text-star-100 transition-colors duration-300 group-hover:text-white">{{ link.name }}</p>
              <p v-if="link.description" class="mt-0.5 line-clamp-1 text-xs text-star-400">{{ link.description }}</p>
            </div>
          </a>
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">
        友链空间还在点亮中。想交换友链？给星璃写信吧。
      </p>

      <div class="mt-14 border-t border-space-500/10 pt-8 text-center">
        <p class="text-sm text-star-400">想交换友链？</p>
        <p class="mt-2 text-sm text-star-300">欢迎来信，附上你的站点名、链接与一句话介绍：</p>
        <a :href="`mailto:${siteConfig.links.email}?subject=友链交换`" class="mt-4 inline-block border-b border-star-400/40 pb-0.5 text-sm tracking-widest text-star-200 transition-colors hover:border-star-100 hover:text-star-100">
          {{ siteConfig.links.email }}
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllPublished } from "~/composables/useContent";

useHead({ title: "友链 · 星璃", meta: [{ name: "description", content: "一起在星空下前行的朋友们" }] });
const { data: links } = await useAsyncData("links", async () => {
  const list = await getAllPublished("links");
  return list.sort((a: any, b: any) => a.name.localeCompare(b.name, "zh"));
});
</script>
