<template>
  <p class="border border-dashed border-space-500/25 p-10 text-center text-star-400 md:p-16">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>
