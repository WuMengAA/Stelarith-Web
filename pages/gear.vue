<template>
  <div>
    <PageHeader eyebrow="Gear" title="装 备" description="陪我探索星夜的伙伴。" accent="space" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <template v-if="gears.length > 0">
        <div class="grid gap-6 md:grid-cols-2">
          <div v-for="g in gears" :key="g.path" class="glass flex items-start gap-5 p-6">
            <div v-if="g.image" class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-space-500/20">
              <img :src="withBase(g.image)" :alt="g.name" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold text-star-100">{{ g.name }}</h3>
                <span class="shrink-0 text-[11px] tracking-wide text-star-400">{{ g.category }}</span>
              </div>
              <p v-if="g.description" class="mt-2 text-sm leading-relaxed text-star-400">{{ g.description }}</p>
              <a v-if="g.url" :href="g.url" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-xs tracking-widest text-star-300 transition-colors hover:text-star-100">
                了解更多 ↗
              </a>
            </div>
          </div>
        </div>
      </template>
      <EmptyState v-else message="装备清单还在整理中……" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllPublished, withBase } from "~/composables/useContent";

useHead({ title: "装备 · 星璃", meta: [{ name: "description", content: "星璃的装备" }] });
const { data: gears } = await useAsyncData("gears", async () => {
  const list = await getAllPublished("gears");
  return list.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
});
</script>
