<template>
  <div>
    <PageHeader eyebrow="Gallery" title="图 库" description="光与影的收藏。" accent="glaze" />
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <template v-if="images.length > 0">
        <div class="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            class="border px-3 py-1.5 text-xs tracking-widest transition-colors"
            :class="activeFilter === 'all' ? 'border-star-400/60 text-star-100' : 'border-space-500/25 text-star-400 hover:border-space-400/50 hover:text-star-100'"
            @click="activeFilter = 'all'"
          >
            全部 ({{ images.length }})
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            type="button"
            class="border px-3 py-1.5 text-xs tracking-widest transition-colors"
            :class="activeFilter === tag ? 'border-star-400/60 text-star-100' : 'border-space-500/25 text-star-400 hover:border-space-400/50 hover:text-star-100'"
            @click="activeFilter = tag"
          >
            {{ tag }} ({{ tagCount[tag] }})
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <a
            v-for="(img, i) in filteredImages"
            :key="img.src"
            :href="img.src"
            data-lightbox
            :data-lb-caption="img.title"
            :data-tags="(img.tags || []).join(',')"
            class="group relative block overflow-hidden border border-space-500/10"
            :style="{ transitionDelay: `${i * 20}ms` }"
          >
            <img
              :src="img.src"
              :alt="img.alt"
              loading="lazy"
              class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span v-if="img.title" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-xs text-star-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {{ img.title }}
            </span>
          </a>
        </div>
      </template>
      <p v-else class="border border-dashed border-space-500/25 p-10 text-center text-star-400">
        图库还空着，等待第一批星光。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getAllPublished, withBase } from "~/composables/useContent";

useHead({ title: "图库 · 星璃", meta: [{ name: "description", content: "星璃的图库" }] });

const { data } = await useAsyncData("gallery", () => getAllPublished("gallery"));
const images = computed(() => (data.value || []).map((entry: any) => ({ ...entry, src: withBase(entry.src) })));

const tagCount = computed(() => {
  const m = new Map<string, number>();
  for (const img of images.value) {
    for (const t of img.tags || []) m.set(t, (m.get(t) || 0) + 1);
  }
  return Object.fromEntries(m);
});
const allTags = computed(() => Object.keys(tagCount.value));

const activeFilter = ref("all");
const filteredImages = computed(() =>
  activeFilter.value === "all" ? images.value : images.value.filter((img: any) => (img.tags || []).includes(activeFilter.value)),
);
</script>
