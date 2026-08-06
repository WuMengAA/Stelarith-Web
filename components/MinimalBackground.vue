<template>
  <div class="minimal-bg" aria-hidden="true">
    <span class="mb-blob mb-blob-1"></span>
    <span class="mb-blob mb-blob-2"></span>
    <span class="mb-blob mb-blob-3"></span>
  </div>
</template>

<style scoped>
.minimal-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background: var(--color-space-900);
  overflow: hidden;
}
.mb-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}
.mb-blob-1 {
  width: 42vmax;
  height: 42vmax;
  top: -12vmax;
  right: -8vmax;
  background: rgba(255, 255, 255, 0.07);
}
.mb-blob-2 {
  width: 34vmax;
  height: 34vmax;
  bottom: -14vmax;
  left: -6vmax;
  background: rgba(255, 255, 255, 0.05);
}
.mb-blob-3 {
  width: 26vmax;
  height: 26vmax;
  top: 42%;
  left: 32%;
  background: rgba(255, 255, 255, 0.03);
}
</style>
