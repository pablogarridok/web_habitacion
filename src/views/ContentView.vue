<template>
  <div class="layout">
    <SideBar @drag="onDrag" />

    <DropZone @drop="onDrop">
      <RoomArea ref="roomRef" />
    </DropZone>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import SideBar from '../components/SideBar.vue'
import RoomArea from '../components/RoomArea.vue'
import DropZone from '../components/DropZone.vue'

const roomRef = ref(null)
let dragged = null

function onDrag(item) {
  dragged = item
}

function onDrop(item, event) {

  const itemToDrop = item || dragged
  
  const pos = roomRef.value.getPosition(event)
  
  roomRef.value.addItem(itemToDrop, pos)
  dragged = null
}

</script>



<style scoped>
.layout {
  display: flex;
  height: calc(100vh - 60px);
}
</style>