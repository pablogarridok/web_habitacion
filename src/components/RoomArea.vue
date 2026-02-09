<template>
  <div ref="container" class="room3d"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref(null)

let scene, camera, renderer, controls

onMounted(() => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xdddddd)
    
    camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
    camera.position.set(0, 10, 15)
    camera.lookAt(0, 0, 0)
    
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    container.value.appendChild(renderer.domElement)
    
    controls = new OrbitControls(camera, renderer.domElement)
    
    const Light = new THREE.AmbientLight(0xffffff, 0.5)
    Light.position.set(5, 10, 5)
    scene.add(Light)
    
    const ambient = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambient)

    const floorGeometry = new THREE.PlaneGeometry(15, 15)
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)
  
    const wallHeight = 8
    const wallThickness = 15
    const size = 8
    
    const pared1 = new THREE.PlaneGeometry(wallThickness, wallHeight, size)
    const pared1Material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const pared1Mesh = new THREE.Mesh(pared1, pared1Material)
    pared1Mesh.position.set(0, 4 , -7.5)
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
   



    
    Animate()
})

    function Animate() {
        requestAnimationFrame(Animate)
        controls.update()
        renderer.render(scene, camera)
    }
</script>

<style scoped>
.room3d {
  width: 100%;
  height: 100%;
}
</style>