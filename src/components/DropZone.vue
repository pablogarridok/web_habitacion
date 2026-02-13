<template>
  <div
    class="drop-zone"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
  >
  <slot />
  </div>
</template>

<script setup>
const emit = defineEmits(['drop'])

function onDragOver(e) {
  e.preventDefault()
}

function onDrop(e) {
  e.preventDefault()
  
  const data = e.dataTransfer.getData('item')
  
  try {
    const item = JSON.parse(data)
    emit('drop', item, e)
  } catch (error) {
    console.error('Error al parsear item:', error)
  }
}
</script>

<style scoped>
.drop-zone {
  flex: 1;
  position: relative;
}
</style>