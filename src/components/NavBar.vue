<template>
  <nav class="navbar">
    <ul>
      <li><p>Diseñador de Habitaciones 3D</p></li>
      <li><button @click="clearRoom">Limpiar Todo</button></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../stores/itemsStore'

function clearRoom() {
  const itemsStore = useItemsStore()
  itemsStore.removeItems()
  window.location.reload();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.navbar {
  width: 100%;
  padding: 16px 32px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;

  position: sticky;
  top: 0;
  z-index: 1000;

  font-family: 'Inter', sans-serif;
}

.navbar ul {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar p {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.3px;
}

.navbar button {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid #d1d5db;

  background-color: #f9fafb;
  color: #111827;

  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  transition: all 0.2s ease;
}

.navbar button:hover {
  background-color: #111827;
  color: white;
  border-color: #111827;
}

.navbar button:active {
  transform: scale(0.97);
}
</style>
