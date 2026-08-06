<template>
  <div>
    <PageHeader eyebrow="Guestbook" title="留 言 板" description="留下你想说的话，星光会转达。" accent="space" />
    <section class="mx-auto max-w-3xl px-6 pb-28">
      <Giscus v-if="siteConfig.giscus.enabled" />
      <div v-else class="border border-space-500/15 p-10 text-center">
        <p class="text-star-300">留言功能正在准备中。</p>
        <p class="mt-3 text-sm text-star-400">配置好 GitHub Discussions 后即可开启评论。在此之前，可以写信到：</p>
        <a :href="`mailto:${siteConfig.links.email}?subject=留言板`" class="mt-5 inline-block border-b border-star-400/40 pb-0.5 text-sm tracking-widest text-star-200 transition-colors hover:border-star-100 hover:text-star-100">
          {{ siteConfig.links.email }}
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "留言板 · 星璃", meta: [{ name: "description", content: "给星璃留言" }] });
</script>
