<template>
  <div ref="container" class="room3d"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useItemsStore } from '../stores/itemsStore'
import { storeToRefs } from 'pinia'

const container = ref(null)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let scene, camera, renderer, controls, floor
const loader = new GLTFLoader()

const props = defineProps({
  items: Array
})
const emit = defineEmits(['floor-click'])

defineExpose({ addItem, getPosition})

function getPosition(event) {
  const react = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - react.left) / react.width) * 2 - 1
  mouse.y = -((event.clientY - react.top) / react.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(floor)
  if (intersects.length > 0) {
    const point = intersects[0].point
    return { x: point.x, z: point.z }
  }
  return null
} 

function addItem(item, pos) {

  loader.load(item.modelPath, 
    (gltf) => {
      const model = gltf.scene
      model.position.set(pos.x, 0, pos.z)
      model.scale.set(5, 5, 5)
      model.castShadow = true
      model.receiveShadow = true
      scene.add(model)
      console.log('Modelo añadido correctamente')
    },
    undefined,
    (error) => {
      console.error('Error cargando modelo:', error)
    }
  )
}

function Animate() {
  requestAnimationFrame(Animate)
  controls.update()
  renderer.render(scene, camera)
}

function onCanvasClick(event) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(floor)
  
  if (intersects.length > 0) {
    const point = intersects[0].point
    emit('floor-click', { x: point.x, z: point.z })
  }
}

onMounted(() => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xdddddd)
  
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
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 60
  dirLight.shadow.camera.left = -15
  dirLight.shadow.camera.right = 15
  dirLight.shadow.camera.top = 15
  dirLight.shadow.camera.bottom = -15
  dirLight.shadow.mapSize.set(2048, 2048)
  scene.add(dirLight)
  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
  const fill = new THREE.DirectionalLight(0xd0e8ff, 0.35)
  fill.position.set(-5, 8, -5)
  scene.add(fill)
  

  const floorGeo = new THREE.PlaneGeometry(15, 15)
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xD4C8A8, roughness: 0.85 })
  floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const grid = new THREE.GridHelper(15, 15, 0xbbaa88, 0xccbb99)
  grid.position.y = 0.01
  scene.add(grid)

  const wallHeight = 8
  const wallThickness = 15
  const size = 8
  
  const pared1 = new THREE.PlaneGeometry(wallThickness, wallHeight, size)
  const pared1Material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const pared1Mesh = new THREE.Mesh(pared1, pared1Material)
  pared1Mesh.position.set(0, 4, -7.5)
  scene.add(pared1Mesh)

  const pared2 = new THREE.PlaneGeometry(wallThickness, wallHeight, size)
  const pared2Material = new THREE.MeshStandardMaterial({ color: 0xffffff })  
  const pared2Mesh = new THREE.Mesh(pared2, pared2Material)
  pared2Mesh.position.set(7.5, 4, 0)
  pared2Mesh.rotation.y = -Math.PI / 2
  scene.add(pared2Mesh)

  const pared3 = new THREE.PlaneGeometry(wallThickness, wallHeight, size)
  const pared3Material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const pared3Mesh = new THREE.Mesh(pared3, pared3Material)
  pared3Mesh.position.set(-7.5, 4, 0)
  pared3Mesh.rotation.y = Math.PI / 2
  scene.add(pared3Mesh)

  const pared4 = new THREE.PlaneGeometry(wallThickness, wallHeight, size)
  const pared4Material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const pared4Mesh = new THREE.Mesh(pared4, pared4Material)
  pared4Mesh.position.set(0, 4, 7.5)
  pared4Mesh.rotation.y = Math.PI 
  scene.add(pared4Mesh)
  
  renderer.domElement.addEventListener('click', onCanvasClick)
  
  Animate()
})
</script>

<style scoped>
.room3d {
  width: 100%;
  height: 100%;
}
</style>