<template>
  <div>
    <PageHeader eyebrow="Software" title="软 件" description="我做的、可以带走用的小东西。" accent="space" />

    <section class="mx-auto max-w-5xl px-6 pb-28">
      <!-- 统计条（仅后端可用） -->
      <div v-if="backend" class="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ softwares.length }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">发布软件</p>
        </div>
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ totalDownloads }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">累计下载</p>
        </div>
        <div class="glass p-4">
          <p class="text-2xl font-semibold text-star-100">{{ backend ? '在线' : '静态' }}</p>
          <p class="mt-1 text-xs tracking-wide text-gray-500">分发节点</p>
        </div>
      </div>

      <template v-if="softwares.length > 0">
        <div class="flex flex-col gap-4">
          <div v-for="s in softwares" :key="s.path" class="glass flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <!-- 图标占位 -->
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-space-500/20 bg-space-900 text-xl text-accent-400">
              {{ (s.icon || '⬡') }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base font-semibold text-star-100">{{ s.name }}</h3>
                <span class="text-xs text-gray-500">v{{ s.version }}</span>
                <span class="rounded border border-space-500/25 px-1.5 py-0.5 text-[10px] tracking-wide text-gray-400">{{ s.platform }}</span>
                <span v-if="s.category" class="rounded border border-accent-500/30 px-1.5 py-0.5 text-[10px] tracking-wide text-accent-400">{{ s.category }}</span>
              </div>
              <p v-if="s.description" class="mt-1 line-clamp-2 text-sm text-star-400">{{ s.description }}</p>
            </div>

            <div class="flex shrink-0 items-center gap-4">
              <span class="text-xs text-gray-500">⬇ {{ s.downloads ?? 0 }} 次 · {{ s.size || '—' }}</span>
              <a
                :href="downloadHref(s)"
                class="btn-glaze px-4 py-2 text-sm"
                :download="s.file ? s.file.split('/').pop() : undefined"
              >
                {{
                  backend && !s.file
                    ? '待上传'
                    : backend
                      ? '下载'
                      : '了解更多'
                }}
              </a>
            </div>
          </div>
        </div>
      </template>
      <EmptyState v-else message="软件仓库正在打磨，敬请期待……" />

      <!-- 软件发布管理（仅后端可用） -->
      <div v-if="backend" class="mt-16 border border-space-500/15 p-6">
        <div class="mb-4">
          <h2 class="font-display text-sm tracking-[0.25em] text-accent-400">软件发布管理</h2>
          <p class="mt-1 text-xs text-gray-500">上传软件文件 → 复制返回的 key → 填入 content/software 对应记录的 file 字段，即可挂到下载按钮。</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <label class="btn-glaze cursor-pointer px-4 py-2 text-sm">
            <span v-if="!publishing">上传软件文件</span>
            <span v-else>上传中…</span>
            <input type="file" class="hidden" :disabled="publishing" @change="onPublish" />
          </label>
          <span v-if="pubMsg" class="text-xs" :class="pubError ? 'text-red-400' : 'text-gray-400'">{{ pubMsg }}</span>
        </div>
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
  fetchStats,
  downloadUrl,
} from "~/composables/useApi";

useHead({ title: "软件 · 星璃", meta: [{ name: "description", content: "星璃的软件" }] });

const backend = isBackendAvailable();
const deployTarget = useDeployTarget();

const { data } = await useAsyncData("software", () => getAllPublished("software"));
const softwares = ref<any[]>([]);

const downloadMap = ref<Record<string, number>>({});
const totalDownloads = computed(() =>
  Object.values(downloadMap.value).reduce((a, b) => a + b, 0),
);

function downloadHref(s: any): string {
  if (backend && s.file) return downloadUrl(s.file);
  // 静态部署下退化为链接到详情或占位
  return s.demo || "#";
}

onMounted(async () => {
  const list = [...(data.value || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  // 挂上下载计数
  if (backend) {
    const stats = await fetchStats();
    downloadMap.value = stats?.softwareDownloads || {};
    list.forEach((s: any) => {
      s.downloads = downloadMap.value[s._id || s.id] ?? 0;
    });
  }
  softwares.value = list;
});

// ===== 发布管理 =====
const publishing = ref(false);
const pubMsg = ref("");
const pubError = ref(false);

async function onPublish(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  publishing.value = true;
  pubError.value = false;
  pubMsg.value = "";
  try {
    const url = await uploadFile(file);
    pubMsg.value = `上传成功！file key = ${url}`;
  } catch (err: any) {
    pubError.value = true;
    pubMsg.value = `上传失败：${err?.message || err}`;
  } finally {
    publishing.value = false;
    input.value = "";
  }
}
</script>
