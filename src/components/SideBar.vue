<template>
  <aside class="sidebar">
    <div
      v-for="item in items"
      :key="item.type"
      class="block"
      draggable="true"
      @dragstart="startDrag(item)"
    >
      {{ item.name }}
    </div>
  </aside>
</template>

<script setup>
const items = [
  { type: 'text', name: 'MESA' },
  { type: 'text', name: 'SILLA' },
  { type: 'text', name: 'TV' }
]

const emit = defineEmits(['drag'])

function startDrag(item) {
  emit('drag', item)
}
</script>


<style scoped>

</style>
