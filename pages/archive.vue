<template>
  <div>
    <PageHeader eyebrow="Archive" title="归 档" description="所有内容，按时间排序。" accent="space" />
    <section class="mx-auto max-w-3xl px-6 pb-28">
      <template v-if="items.length > 0">
        <div class="space-y-8">
          <div v-for="item in items" :key="`${item.kind}-${item.title}`">
            <NuxtLink :to="item.url" class="group flex items-baseline justify-between gap-4 border-b border-space-500/10 py-3 transition-colors hover:border-star-400/40">
              <span class="flex items-baseline gap-3">
                <span class="shrink-0 text-[10px] uppercase tracking-widest text-star-400">{{ item.kind }}</span>
                <span class="text-sm text-star-200 transition-colors group-hover:text-white">{{ item.title }}</span>
              </span>
              <time class="shrink-0 text-xs text-star-400">{{ item.date }}</time>
            </NuxtLink>
          </div>
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">归档还是空的。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fmtDate, withBase, getAllPublished } from "~/composables/useContent";

useHead({ title: "归档 · 星璃", meta: [{ name: "description", content: "所有内容归档" }] });

const { data } = await useAsyncData("archive", async () => {
  const [posts, projects, notes] = await Promise.all([
    getAllPublished("posts"),
    getAllPublished("projects"),
    getAllPublished("notes"),
  ]);
  const all = [
    ...posts.map((p: any) => ({ title: p.title, date: fmtDate(p.pubDate), url: withBase(`/posts/${p._id}`), kind: "文章" })),
    ...projects.map((p: any) => ({ title: p.title, date: fmtDate(p.pubDate), url: withBase(`/projects/${p._id}`), kind: "项目" })),
    ...notes.map((n: any) => ({ title: n.title, date: fmtDate(n.pubDate), url: withBase(`/notes/${n._id}`), kind: "笔记" })),
  ];
  return all.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
});

const items = computed(() => data.value || []);
</script>
