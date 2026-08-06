<template>
  <article class="mx-auto px-6 pb-28 pt-36" :class="post?.layout === 'wide' ? 'max-w-5xl' : 'max-w-3xl'">
    <template v-if="post">
      <header>
        <p v-if="eyebrow" class="font-display text-xs uppercase tracking-[0.4em] text-star-400">{{ eyebrow }}</p>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-star-400">
          <span>{{ metaText }}</span>
          <TagList :tags="post.tags" />
        </div>
        <h1 class="mt-5 text-3xl font-light leading-tight text-star-100 md:text-4xl">{{ post.title }}</h1>
        <p v-if="post.description" class="mt-5 text-base leading-relaxed text-star-400">{{ post.description }}</p>
      </header>

      <div class="my-10 h-px bg-space-500/15" />

      <div class="prose-stelarith" v-html="post.bodyHtml" />

      <!-- 目录 TOC（桌面端侧边） -->
      <ArticleToc v-if="tocItems.length" :items="tocItems" />

      <nav class="mt-20 border-t border-space-500/10 pt-6 text-sm">
        <NuxtLink to="/posts" class="tracking-widest text-star-400 transition-colors hover:text-star-100">
          ← 返回文章列表
        </NuxtLink>
      </nav>

      <!-- giscus 评论 -->
      <Giscus v-if="giscusEnabled" />
    </template>
    <div v-else class="py-20 text-center text-star-400">文章不存在</div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { fmtDate, getBySlug } from "~/composables/useContent";

const route = useRoute();
const { data: post } = await useAsyncData(`post-${route.params.slug}`, () =>
  getBySlug("posts", route.params.slug as string),
);

const eyebrow = "Writings";
const metaText = computed(() => {
  if (!post.value) return "";
  const parts = [`发布于 ${fmtDate(post.value.pubDate, true)}`];
  if (post.value.updatedDate) parts.push(`更新于 ${fmtDate(post.value.updatedDate, true)}`);
  return parts.join(" · ");
});

// 从渲染后的 HTML 提取标题做 TOC
const tocItems = computed(() => {
  if (!post.value?.bodyHtml) return [];
  const items: any[] = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(post.value.bodyHtml)) !== null) {
    items.push({ depth: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return items;
});

const giscusEnabled = siteConfig.giscus.enabled;

useHead(() => ({
  title: post.value ? `${post.value.title} · 星璃` : "文章",
  meta: [{ name: "description", content: post.value?.description || siteConfig.description }],
}));
</script>
