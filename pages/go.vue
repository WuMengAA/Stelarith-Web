<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 pt-32">
    <template v-if="target">
      <p class="text-xs uppercase tracking-[0.4em] text-star-400">Security Redirect</p>
      <h1 class="mt-5 text-2xl font-light text-star-100">即将跳转到外部链接</h1>
      <p class="mt-4 max-w-md break-all text-center text-sm text-star-400">{{ target }}</p>
      <div class="mt-8 flex items-center gap-4">
        <a :href="target" target="_blank" rel="noopener noreferrer" class="btn-glaze px-8 py-3 text-sm tracking-widest">安全跳转</a>
        <NuxtLink to="/" class="border border-space-500/30 px-8 py-3 text-sm tracking-widest text-gray-300 transition-colors hover:border-accent-500 hover:text-accent-400">返回首页</NuxtLink>
      </div>
    </template>
    <template v-else>
      <h1 class="mt-6 text-3xl font-extralight text-gray-100">无效的跳转地址</h1>
      <NuxtLink to="/" class="mt-10 border border-space-500/30 px-8 py-3 text-sm tracking-widest text-gray-300 transition-colors hover:border-accent-500 hover:text-accent-400">返回首页</NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const target = computed(() => {
  const t = route.query.to as string | undefined;
  if (!t) return "";
  // 只允许 http(s) 协议
  return /^https?:\/\//.test(t) ? t : "";
});
</script>
