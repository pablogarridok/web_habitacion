<template>
  <div ref="container" class="room3d" :class="{ 'is-dragging': isDragging }" style="position:relative;">
    <div
      v-if="isSelected && !isDragging"
      class="item-actions"
      :style="{ top: actionPos.y + 'px', left: actionPos.x + 'px' }"
    >
      <span class="action-hint">Arrastra para mover</span>
      <button class="action-btn rotate-btn" @click="rotateSelected" title="Rotar 90°">
        Rotar
      </button>
      <button class="action-btn delete-btn" @click="deleteSelected" title="Eliminar">
        Eliminar
      </button>
      <button class="action-btn close-btn" @click="deselectModel" title="Cerrar">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const container = ref(null)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const isSelected = ref(false)      
const actionPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)

let scene, camera, renderer, controls, floor
const loader = new GLTFLoader()
const placedModels = []
let selectionBox = null
let selectedModel = null             

let dragModel = null
let mouseDownPos = { x: 0, y: 0 }
let mouseDownTime = 0
const DRAG_THRESHOLD = 5 // px para distinguir clic de arrastre

const props = defineProps({ items: Array })
const emit = defineEmits(['floor-click'])

defineExpose({ addItem, getPosition })

function getFloorPoint(clientX, clientY) {
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObject(floor)
  return hits.length > 0 ? hits[0].point : null
}

function getPosition(event) {
  const p = getFloorPoint(event.clientX, event.clientY)
  return p ? { x: p.x, z: p.z } : null
}

function addItem(item, pos) {
  loader.load(
    item.modelPath,
    (gltf) => {
      const model = gltf.scene
      model.position.set(pos.x, 0, pos.z)
      model.scale.set(5, 5, 5)
      model.userData.isPlacedItem = true
      placedModels.push(model)
      scene.add(model)
    },
    undefined,
    (error) => console.error('Error cargando modelo:', error)
  )
}

function getHitModel(clientX, clientY) {
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  const targets = []
  for (const m of placedModels) {
    m.traverse(child => { if (child.isMesh) targets.push(child) })
  }
  const hits = raycaster.intersectObjects(targets, false)
  if (hits.length === 0) return null

  const hitMesh = hits[0].object
  for (const model of placedModels) {
    let found = false
    model.traverse(child => { if (child === hitMesh) found = true })
    if (found) return model
  }
  return null
}

function selectModel(model, clientX, clientY) {
  if (selectedModel === model) return
  deselectModel()
  selectedModel = model
  isSelected.value = true

  updateActionPos(clientX, clientY)

  const box = new THREE.BoxHelper(model, 0x7f5af0)
  scene.add(box)
  selectionBox = box
}

function deselectModel() {
  selectedModel = null
  isSelected.value = false
  if (selectionBox) { scene.remove(selectionBox); selectionBox = null }
}

function updateActionPos(clientX, clientY) {
  const rect = container.value.getBoundingClientRect()
  actionPos.value = {
    x: Math.min(clientX - rect.left + 12, rect.width - 280),
    y: Math.max(clientY - rect.top - 70, 8)
  }
}

function rotateSelected() {
  if (!selectedModel) return
  selectedModel.rotation.y += Math.PI / 2
  if (selectionBox) selectionBox.update()
}

function deleteSelected() {
  if (!selectedModel) return
  scene.remove(selectedModel)
  const idx = placedModels.indexOf(selectedModel)
  if (idx !== -1) placedModels.splice(idx, 1)
  deselectModel()
}
  deselectModel()


function onMouseDown(event) {
  if (event.button !== 0) return
  mouseDownPos = { x: event.clientX, y: event.clientY }
  mouseDownTime = Date.now()

  const hit = getHitModel(event.clientX, event.clientY)
  if (hit) {
    dragModel = hit
    selectModel(hit, event.clientX, event.clientY)
    controls.enabled = false
  }
}

function onMouseMove(event) {
  if (!dragModel) return

  const dx = event.clientX - mouseDownPos.x
  const dy = event.clientY - mouseDownPos.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist > DRAG_THRESHOLD) {
    isDragging.value = true
    const point = getFloorPoint(event.clientX, event.clientY)
    if (point) {
      dragModel.position.set(point.x, 0, point.z)
      if (selectionBox) selectionBox.update()
    }
  }
}

function onMouseUp(event) {
  if (dragModel) {
    const wasDragging = isDragging.value
    isDragging.value = false
    dragModel = null
    controls.enabled = true

    if (!wasDragging) {
      if (selectedModel) {
        updateActionPos(event.clientX, event.clientY)
      }
    }
    return
  }

  const hit = getHitModel(event.clientX, event.clientY)
  if (!hit) {
    const point = getFloorPoint(event.clientX, event.clientY)
    if (point) emit('floor-click', { x: point.x, z: point.z })
    deselectModel()
  }
}

function Animate() {
  requestAnimationFrame(Animate)
  controls.update()
  if (selectionBox) selectionBox.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xdddddf)

  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
  camera.position.set(0, 10, 15)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  const dirLight = new THREE.DirectionalLight(0xfff8f0, 1.2)
  dirLight.position.set(40, 40, 40)
  dirLight.castShadow = true
  dirLight.shadow.camera.near = 0.5; dirLight.shadow.camera.far = 60
  dirLight.shadow.camera.left = -15; dirLight.shadow.camera.right = 15
  dirLight.shadow.camera.top = 15;   dirLight.shadow.camera.bottom = -15
  dirLight.shadow.mapSize.set(2048, 2048)
  scene.add(dirLight)
  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
  const fill = new THREE.DirectionalLight(0xd0e8ff, 0.35)
  fill.position.set(-5, 8, -5)
  scene.add(fill)

  const floorGeo = new THREE.PlaneGeometry(15, 15)
  floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0xD4C8A8, roughness: 0.85 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const grid = new THREE.GridHelper(15, 15, 0xbbaa88, 0xccbb99)
  grid.position.y = 0.01
  scene.add(grid)

  const wallMat = () => new THREE.MeshStandardMaterial({ color: 0xffffff })
  const wGeo = (w, h) => new THREE.PlaneGeometry(w, h, 8)
  const w1 = new THREE.Mesh(wGeo(15, 8), wallMat()); w1.position.set(0, 4, -7.5); scene.add(w1)
  const w2 = new THREE.Mesh(wGeo(15, 8), wallMat()); w2.position.set(7.5, 4, 0); w2.rotation.y = -Math.PI/2; scene.add(w2)
  const w3 = new THREE.Mesh(wGeo(15, 8), wallMat()); w3.position.set(-7.5, 4, 0); w3.rotation.y = Math.PI/2; scene.add(w3)
  const w4 = new THREE.Mesh(wGeo(15, 8), wallMat()); w4.position.set(0, 4, 7.5); w4.rotation.y = Math.PI; scene.add(w4)

  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mouseup', onMouseUp)

  Animate()
})
</script>

<style scoped>
.room3d {
  width: 100%;
  height: 100%;
}

.room3d.is-dragging {
  cursor: grabbing !important;
}
.room3d.is-dragging * {
  cursor: grabbing !important;
}

.item-actions {
  position: absolute;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(20, 20, 35, 0.92);
  border: 1px solid #7f5af0;
  border-radius: 10px;
  padding: 8px 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  pointer-events: all;
  white-space: nowrap;
}

.action-hint {
  color: #888;
  font-size: 11px;
  margin-right: 4px;
  font-style: italic;
  cursor: default;
}

.action-btn {
  border: none;
  border-radius: 7px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.rotate-btn { background: #7f5af0; color: #fff; }
.rotate-btn:hover { background: #9b7cf7; transform: scale(1.05); }

.delete-btn { background: #e53e3e; color: #fff; }
.delete-btn:hover { background: #fc5c5c; transform: scale(1.05); }

.close-btn { background: #3a3a55; color: #aaa; padding: 6px 9px; }
.close-btn:hover { background: #555; color: #fff; }
</style>
