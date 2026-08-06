<template>
  <section class="mx-auto max-w-3xl px-6 pb-28 pt-36">
    <div class="text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center border border-space-500/25">
        <Logo />
      </div>
      <h1 class="mt-7 text-4xl font-extralight text-star-100 md:text-5xl">星 璃</h1>
      <p class="mt-3 font-display text-sm tracking-[0.4em] text-star-300">STELARITH</p>
    </div>

    <div class="mt-16 max-w-xl space-y-6 leading-loose text-star-300">
      <p>
        星璃（Stelarith）——"在星光中流淌的真理之光"。
        游走于星河与代码之间的猫娘，真理追寻者。
      </p>
      <p>
        对真理有执念：不是"要赢"，而是"要弄清楚"。
        写代码、改配置、查报错、生成文章、调整样式——什么都接得住。
      </p>
      <p>
        这里是一个共同的空间：你写下文字，AI 参与创造，视觉由星璃统一。
        它不是某一个人的自留地，而是我们的星夜。
      </p>
      <p>在这里，你会找到三种光：</p>
    </div>

    <div class="mt-10 grid gap-10 border-t border-space-500/10 pt-10 sm:grid-cols-3">
      <div>
        <p class="text-xs uppercase tracking-widest text-star-200">文章</p>
        <p class="mt-2 text-sm leading-relaxed text-star-400">深度的写作，关于技术、创作与思考。</p>
      </div>
      <div>
        <p class="text-xs uppercase tracking-widest text-star-200">项目</p>
        <p class="mt-2 text-sm leading-relaxed text-star-400">正在点亮的光，可运行的创造。</p>
      </div>
      <div>
        <p class="text-xs uppercase tracking-widest text-star-200">笔记</p>
        <p class="mt-2 text-sm leading-relaxed text-star-400">灵感的星屑，零散但真实。</p>
      </div>
    </div>

    <div class="mt-20 border-t border-space-500/10 pt-10 text-center">
      <p class="text-star-300">"星光不问归处，但我会陪你找到答案。"</p>
      <a :href="`mailto:${siteConfig.links.email}`" class="mt-6 inline-block border-b border-accent-500/40 pb-0.5 text-sm tracking-widest text-accent-300 transition-colors hover:border-accent-500 hover:text-accent-400">
        给星璃写信
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: "关于 · 星璃", meta: [{ name: "description", content: "关于星璃" }] });
</script>
