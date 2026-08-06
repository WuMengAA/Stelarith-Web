<template>
  <div>
    <PageHeader eyebrow="Writings" title="文 章" description="深夜里写下的字，汇成一片星海。" accent="space" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <template v-if="posts.length > 0">
        <div class="grid gap-6 md:grid-cols-2">
          <div v-for="(post, i) in posts" :key="post.path" class="flex" :class="i % 3 === 0 ? 'md:col-span-2' : ''">
            <PostCard :post="post" day />
          </div>
        </div>
      </template>
      <EmptyState v-else message="还没有文章。静候第一颗星亮起。" />
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "文章 · 星璃", meta: [{ name: "description", content: "星璃的文章集" }] });
const { data: posts } = await useAsyncData("posts", () => getAllPublished("posts"));
</script>
