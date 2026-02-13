<template>
  <aside class="sidebar">
    <h3 class="sidebar-title">Muebles</h3>
    <p class="sidebar-hint">Arrastra dentro de la habitacion para colocarlos</p>
    <div
      v-for="item in catalog"
      :key="item.id"
      draggable="true"
      class="items-card"
      @dragstart="onDragStart($event, item)"
      @dragend="onDragEnd"
    >
      <img v-if="item.icon" :src="item.icon" width="32" alt="" />
      <span class="items-name">{{ item.name }}</span>
    </div>
  </aside>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../stores/itemsStore'
const emit = defineEmits(['drag'])

const { catalog } = storeToRefs(useItemsStore())

function onDragStart(event, item) {

  const jsonData = JSON.stringify(item)
  
  event.dataTransfer.setData('item', jsonData)
  
  emit('drag', item)
}

function onDragEnd(event) {
  console.log('dragend')
}
</script>
<style scoped>
.sidebar {
  width: 200px;
  min-width: 200px;
  background: #1e1e2e;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid #333;
  overflow-y: auto;
}

.sidebar-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.sidebar-hint {
  color: #888;
  font-size: 12px;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.items-card {
  background: #2a2a3e;
  border: 1px solid #3a3a55;
  border-radius: 8px;
  padding: 12px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.15s;
  user-select: none;
}

.items-card:hover {
  background: #35355a;
  border-color: #6666aa;
  transform: translateX(2px);
}

.items-card:active {
  cursor: grabbing;
  transform: scale(0.97);
}

.items-name {
  color: #ddd;
  font-size: 14px;
  font-weight: 500;
}
</style>