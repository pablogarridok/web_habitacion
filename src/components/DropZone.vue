<template>
  <div
    class="drop-zone"
    @dragover.prevent
    @drop="emit('drop')"
  >
    <slot />
  </div>
</template>

<script setup>
const emit = defineEmits(['drop'])
</script>
