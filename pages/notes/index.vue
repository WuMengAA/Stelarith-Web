<template>
  <div>
    <PageHeader eyebrow="Notes" title="随 记" description="灵感的星屑，零散但真实。" accent="glaze" />
    <section class="mx-auto max-w-3xl px-6 pb-28">
      <template v-if="notes.length > 0">
        <div class="grid gap-4">
          <NoteCard v-for="note in notes" :key="note.path" :note="note" />
        </div>
      </template>
      <EmptyState v-else message="这里是一些零碎的星屑……" />
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "笔记 · 星璃", meta: [{ name: "description", content: "星璃的笔记" }] });
const { data: notes } = await useAsyncData("notes", () => getAllPublished("notes"));
</script>
