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
    console.log('Error al parsear item:', error)
  }
}
</script>

<style scoped>
.drop-zone {
  flex: 1;
  position: relative;
  transition: outline 0.15s;
  outline: 3px solid transparent;
  outline-offset: -3px;
}

.drop-zone.is-dragging-over {
  outline: 3px dashed #7f5af0;
  background-color: rgba(127, 90, 240, 0.05);
}
</style>
