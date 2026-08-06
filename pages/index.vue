<template>
  <div>
    <!-- HERO -->
    <section class="relative flex min-h-[88vh] items-center justify-center px-6 pt-20">
      <div class="mx-auto max-w-3xl text-center">
        <p class="font-display text-xs uppercase tracking-[0.5em] text-star-400">White · Gray · Black</p>
        <h1 class="mt-8 font-display text-5xl font-extralight leading-tight md:text-7xl">
          <span class="glaze-text">星 璃</span>
        </h1>
        <p class="mt-4 font-display text-lg tracking-[0.4em] text-star-300 md:text-xl">STELARITH</p>
        <p class="mx-auto mt-10 max-w-xl text-base leading-loose text-star-400">
          黑白之间的纯粹空间，光与影界定每一层层次。<br class="hidden md:block" />
          写点文章，做点项目，记点笔记——星光不问归处，我陪你找答案。
        </p>
        <div class="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <NuxtLink to="/posts" class="btn-glaze px-10 py-3.5 text-sm font-normal tracking-widest">阅读文章</NuxtLink>
          <NuxtLink to="/about" class="border border-space-500/30 px-10 py-3.5 text-sm font-normal tracking-widest text-star-300 transition-colors hover:border-space-400 hover:text-star-100">
            认识星璃
          </NuxtLink>
        </div>
      </div>
      <a href="#brand" class="absolute bottom-10 left-1/2 -translate-x-1/2 text-star-400/60" aria-label="向下滚动">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="animate-bounce">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>

    <!-- 品牌介绍 -->
    <section id="brand" class="px-6 py-28">
      <div class="mx-auto max-w-3xl">
        <p class="font-display text-xs uppercase tracking-[0.4em] text-star-400">About</p>
        <h2 class="mt-5 text-2xl font-light text-star-100 md:text-3xl">
          关于 <span class="glaze-text">星璃</span>
        </h2>
        <div class="mt-6 max-w-xl space-y-6 leading-loose text-star-400">
          <p>
            星璃（Stelarith）——"在星光中流淌的真理之光"。
            一个共同的空间：我写东西，AI 辅助，视觉统一由星璃呈现。
            黑白是底色，光影界定层次，克制与纯粹是语言。
          </p>
          <p>
            这里存放文章、项目与笔记：关于技术、关于创作、关于在深夜里亮起的一颗星。
          </p>
        </div>

        <div class="mt-14 grid gap-8 border-t border-space-500/10 pt-12 sm:grid-cols-3">
          <div>
            <span class="block h-8 w-8 border border-white/60" />
            <p class="mt-4 text-sm text-star-200">纯白</p>
            <p class="mt-1 text-xs text-star-400">高光 · #FFFFFF</p>
          </div>
          <div>
            <span class="block h-8 w-8 border border-[#a3a3a3]" />
            <p class="mt-4 text-sm text-star-200">中灰</p>
            <p class="mt-1 text-xs text-star-400">层次 · #A3A3A3</p>
          </div>
          <div>
            <span class="block h-8 w-8 border border-[#4a4a4a]" />
            <p class="mt-4 text-sm text-star-200">暗灰</p>
            <p class="mt-1 text-xs text-star-400">阴影 · #4A4A4A</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最近文章 -->
    <section class="px-6 py-12">
      <div class="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Writings" title="最近文章" accent="space" href="/posts" />
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <template v-if="posts.length > 0">
            <PostCard v-for="post in posts" :key="post.path" :post="post" />
          </template>
          <div v-else class="col-span-full">
            <EmptyState message="还没有文章，第一篇文章正在赶来的路上……" />
          </div>
        </div>
      </div>
    </section>

    <!-- 项目 -->
    <section class="px-6 py-12">
      <div class="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Projects" title="进行中的项目" accent="twilight" href="/projects" />
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <template v-if="projects.length > 0">
            <ProjectCard v-for="project in projects" :key="project.path" :project="project" />
          </template>
          <div v-else class="col-span-full">
            <EmptyState message="项目空间还在探索中……" />
          </div>
        </div>
      </div>
    </section>

    <!-- 笔记 -->
    <section class="px-6 py-12">
      <div class="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Notes" title="随记" accent="glaze" href="/notes" />
        <div class="mt-8 grid gap-4">
          <template v-if="notes.length > 0">
            <NoteCard v-for="note in notes" :key="note.path" :note="note" />
          </template>
          <EmptyState v-else message="这里是一些零碎的星屑……" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { siteConfig } from "~/composables/useSiteConfig";

const { data: posts } = await useAsyncData("home-posts", () => getPublished("posts", 3));
const { data: projects } = await useAsyncData("home-projects", () => getPublished("projects", 3));
const { data: notes } = await useAsyncData("home-notes", () => getPublished("notes", 3));

useHead({
  title: "星璃 · Stelarith",
  meta: [{ name: "description", content: siteConfig.description }],
});
</script>
