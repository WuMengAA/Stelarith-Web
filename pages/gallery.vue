<template>
  <div>
    <PageHeader eyebrow="Gallery" title="图 库" description="光与影的收藏。" accent="glaze" />

    <section class="mx-auto max-w-5xl px-6 pb-28">
      <!-- 标签过滤 -->
      <div v-if="images.length > 0" class="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          class="border px-3 py-1.5 text-xs tracking-widest transition-colors"
          :class="activeFilter === 'all' ? 'border-accent-500/70 text-accent-400' : 'border-space-500/25 text-gray-400 hover:border-accent-500/40 hover:text-accent-400'"
          @click="activeFilter = 'all'"
        >
          全部 ({{ images.length }})
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="border px-3 py-1.5 text-xs tracking-widest transition-colors"
          :class="activeFilter === tag ? 'border-accent-500/70 text-accent-400' : 'border-space-500/25 text-gray-400 hover:border-accent-500/40 hover:text-accent-400'"
          @click="activeFilter = tag"
        >
          {{ tag }} ({{ tagCount[tag] }})
        </button>
      </div>

      <!-- 内容图库 -->
      <template v-if="images.length > 0">
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

      <!-- 上传管理（仅后端可用） -->
      <div v-if="backend" class="mt-16 border border-space-500/15 p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-display text-sm tracking-[0.25em] text-accent-400">图库管理</h2>
          <span class="text-xs text-gray-500">{{ deployTarget === 'local' ? '本地自托管' : '云全栈' }} · {{ uploaded.length }} 个上传文件</span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <label class="btn-glaze cursor-pointer px-4 py-2 text-sm">
            <span v-if="!uploading">选择图片上传</span>
            <span v-else>上传中 {{ progress }}%…</span>
            <input
              type="file"
              accept="image/*,.pdf,.zip,.txt,.md,.json"
              class="hidden"
              :disabled="uploading"
              @change="onPickFile"
            />
          </label>
          <span v-if="uploadMsg" class="text-xs" :class="uploadError ? 'text-red-400' : 'text-gray-400'">
            {{ uploadMsg }}
          </span>
        </div>

        <div v-if="uploaded.length > 0" class="mt-6 grid grid-cols-3 gap-3 md:grid-cols-4">
          <div
            v-for="f in uploaded"
            :key="f.key"
            class="group relative overflow-hidden border border-space-500/10"
          >
            <img
              v-if="isImage(f.key)"
              :src="f.url"
              :alt="f.key"
              loading="lazy"
              class="aspect-square w-full object-cover"
            />
            <div v-else class="flex aspect-square w-full items-center justify-center bg-space-900 text-xs text-gray-400">
              {{ f.key.split('/').pop() }}
            </div>
            <button
              type="button"
              class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-black/60 text-[11px] text-gray-200 opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              title="删除"
              @click="onDelete(f.key)"
            >
              ✕
            </button>
          </div>
        </div>
        <p v-else class="mt-6 border border-dashed border-space-500/20 p-6 text-center text-sm text-gray-500">
          还没有上传文件。选择图片即可上传到图库。
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getAllPublished, withBase } from "~/composables/useContent";
import {
  isBackendAvailable,
  useDeployTarget,
  uploadFile,
  listFiles,
  deleteFile,
  fileUrl,
} from "~/composables/useApi";

useHead({ title: "图库 · 星璃", meta: [{ name: "description", content: "星璃的图库" }] });

const backend = isBackendAvailable();
const deployTarget = useDeployTarget();

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

// ===== 上传管理 =====
const uploaded = ref<{ key: string; url: string }[]>([]);
const uploading = ref(false);
const progress = ref(0);
const uploadMsg = ref("");
const uploadError = ref(false);

const isImage = (key: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(key);

async function loadUploads() {
  if (!backend) return;
  const files = await listFiles();
  uploaded.value = files.map((f) => ({ ...f, url: fileUrl(f.key) }));
}

async function onPickFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  uploading.value = true;
  uploadError.value = false;
  uploadMsg.value = "";
  progress.value = 0;
  const timer = setInterval(() => {
    if (progress.value < 90) progress.value += 10;
  }, 120);
  try {
    await uploadFile(file);
    clearInterval(timer);
    progress.value = 100;
    uploadMsg.value = `已上传 ${file.name}`;
    await loadUploads();
  } catch (err: any) {
    clearInterval(timer);
    uploadError.value = true;
    uploadMsg.value = `上传失败：${err?.message || err}`;
  } finally {
    uploading.value = false;
    input.value = "";
    setTimeout(() => { progress.value = 0; }, 1200);
  }
}

async function onDelete(key: string) {
  if (!confirm(`确定删除 ${key.split('/').pop()} ？`)) return;
  const ok = await deleteFile(key);
  uploadMsg.value = ok ? "已删除" : "删除失败";
  uploadError.value = !ok;
  await loadUploads();
}

onMounted(loadUploads);
</script>
