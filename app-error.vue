<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <p class="font-display text-xs uppercase tracking-[0.5em] text-star-400">404 · Lost in the void</p>
    <h1 class="mt-6 text-6xl font-extralight text-star-100">404</h1>
    <p class="mt-4 text-base text-star-400">这里没有光，只有虚空。也许那颗星不在这条路上。</p>
    <NuxtLink to="/" class="mt-10 inline-block border-b border-star-400/40 pb-1 text-sm tracking-widest text-star-200 transition-colors hover:border-star-100 hover:text-star-100">
      返回首页
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "404 · 星璃" });
</script>
