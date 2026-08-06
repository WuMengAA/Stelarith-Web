<template>
  <div>
    <PageHeader eyebrow="Timeline" title="大 事 记" description="一路走来的痕迹，按时间排列。" accent="space" />
    <section class="mx-auto max-w-3xl px-6 pb-28">
      <template v-if="milestones.length > 0">
        <div class="relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-space-500/20">
          <article v-for="m in milestones" :key="m.path" class="relative mb-10 pl-9 last:mb-0">
            <span class="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-star-400/50 bg-space-900">
              <span class="absolute inset-[4px] rounded-full" :class="typeDot[m.type] || 'bg-star-400'" />
            </span>
            <time class="text-xs tracking-widest text-star-400">{{ fmtDate(m.date, true) }}</time>
            <h2 class="mt-2 text-lg font-medium text-star-100">{{ m.title }}</h2>
            <div class="prose-stelarith mt-2 text-sm" v-html="m.bodyHtml" />
          </article>
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">
        时间线还在书写中。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fmtDate, getAllPublished } from "~/composables/useContent";

const typeDot: Record<string, string> = {
  milestone: "bg-star-100",
  project: "bg-space-500",
  note: "bg-star-400",
};

useHead({ title: "大事记 · 星璃", meta: [{ name: "description", content: "星璃的成长时间线" }] });
const { data: milestones } = await useAsyncData("milestones", async () => {
  const list = await getAllPublished("milestones");
  return list.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
});
</script>
