<template>
  <div class="lightbox-overlay" :class="{ show: visible }" @click.self="close">
    <button class="lightbox-btn" style="top:1.25rem;right:1.25rem" aria-label="关闭" @click="close">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
    <button class="lightbox-btn" style="left:1.25rem;top:50%;transform:translateY(-50%)" aria-label="上一张" @click="show(index - 1)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="m15 6-6 6 6 6" />
      </svg>
    </button>
    <button class="lightbox-btn" style="right:1.25rem;top:50%;transform:translateY(-50%)" aria-label="下一张" @click="show(index + 1)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="m9 6 6 6-6 6" />
      </svg>
    </button>
    <figure class="flex max-w-[90vw] max-h-[88vh] flex-col items-center">
      <img :src="currentSrc" :alt="currentAlt" class="max-w-[90vw] max-h-[82vh] border border-white/10 object-contain" />
      <figcaption v-if="currentAlt" class="mt-3 text-sm text-star-400">{{ currentAlt }}</figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const items: HTMLElement[] = [];
const index = ref(0);
const currentSrc = ref("");
const currentAlt = ref("");

const collect = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-lightbox]")).filter(
    (el) => el.getAttribute("data-lightbox") !== "false",
  );

const show = (i: number) => {
  index.value = ((i % items.length) + items.length) % items.length;
  const el = items[index.value];
  const src = el.getAttribute("data-lb-src") || el.getAttribute("src") || "";
  const alt = el.getAttribute("data-lb-caption") || el.getAttribute("alt") || "";
  if (!src) return;
  currentSrc.value = src;
  currentAlt.value = alt;
};

const open = (el: HTMLElement) => {
  items.length = 0;
  items.push(...collect());
  const i = items.indexOf(el);
  show(i >= 0 ? i : 0);
  visible.value = true;
  document.body.style.overflow = "hidden";
};

const close = () => {
  visible.value = false;
  document.body.style.overflow = "";
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox]");
    if (target) {
      e.preventDefault();
      open(target);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!visible.value) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index.value - 1);
    if (e.key === "ArrowRight") show(index.value + 1);
  });
});
</script>

<style scoped>
.lightbox-btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-star-300);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.lightbox-btn:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}
</style>
