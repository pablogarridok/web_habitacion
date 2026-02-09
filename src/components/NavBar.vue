<template>
  <nav class="navbar">
    <ul>
      <li><p>Diseñador de Habitaciones 3D</p></li>
      <li><button>Limpiar Todo</button></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

.navbar {
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  padding: 18px 28px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgb(255, 255, 255);
  position: sticky;
  top: 0;
  z-index: 999;
  font-family: 'Inter', sans-serif;
}

.navbar ul {
  display: flex;
  justify-content: left;
  gap: 35px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar a {
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 500;
  transition:
    color 0.2s ease,
    text-shadow 0.3s ease;
}

.navbar button {
  padding: 8px 16px;
  background: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}
.navbar button:hover {
  background: #cc0000;
  transition: background-color 0.2s ease, text-shadow 0.3s ease;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.7);
}
</style>
