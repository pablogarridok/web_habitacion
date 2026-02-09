<template>
  <div class="layout">
    <SideBar @drag="onDrag" />

    <DropZone
      zone-id="room"
      :items="canvas"
      accept="any"
      @drop="onDrop"
    >
      <RoomArea :items="canvas" />
    </DropZone>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBar from '../components/SideBar.vue'
import RoomArea from '../components/RoomArea.vue'
import DropZone from '../components/DropZone.vue'

const canvas = ref([])
let dragged = null

function onDrag(item) {
  dragged = item
}

function onDrop() {
  if (dragged) {
    canvas.value.push({ ...dragged, id: Date.now() })
    dragged = null
  }
}
</script>


<style scoped>
.layout {
  display: flex;
  height: calc(100vh - 60px);
}

.drop-zone {
  flex: 1;
  border: 2px dashed #999;
  padding: 20px;
}

.room-item {
  background: white;
  margin-bottom: 8px;
  padding: 10px;
}

</style>