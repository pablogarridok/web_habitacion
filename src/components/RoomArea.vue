<template>
  <div ref="contenedor" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const props = defineProps({ items: Array })
const emit = defineEmits(['floor-click'])

const contenedor = ref(null)

let escena, camara, renderizador, controles, suelo

const listaMuebles = []
const cargador = new GLTFLoader()

let posicionInicialRaton = { x: 0, y: 0 }
let muebleArrastrando = null
let estaArrastrando = false
const DISTANCIA_ARRASTRE = 5  

const raycaster = new THREE.Raycaster()
const posRaton = new THREE.Vector2()


function getPuntoEnSuelo(clientX, clientY) {
  const rect = contenedor.value.getBoundingClientRect()
  posRaton.x = ((clientX - rect.left) / rect.width) * 2 - 1
  posRaton.y = -((clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(posRaton, camara)
  const colisiones = raycaster.intersectObject(suelo)
  return colisiones.length > 0 ? colisiones[0].point : null
}


function getMuebleClickado(clientX, clientY) {
  const rect = contenedor.value.getBoundingClientRect()
  posRaton.x = ((clientX - rect.left) / rect.width) * 2 - 1
  posRaton.y = -((clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(posRaton, camara)

  const meshes = []
  for (const mueble of listaMuebles) {
    mueble.traverse(hijo => {
      if (hijo.isMesh) meshes.push(hijo)
    })
  }

  const colisiones = raycaster.intersectObjects(meshes, false)
  if (colisiones.length === 0) return null

  const meshGolpeado = colisiones[0].object
  for (const mueble of listaMuebles) {
    let encontrado = false
    mueble.traverse(hijo => {
      if (hijo === meshGolpeado) encontrado = true
    })
    if (encontrado) return mueble
  }

  return null
}


function alPresionarRaton(event) {
  if (event.button !== 0) return  

  posicionInicialRaton = { x: event.clientX, y: event.clientY }
  estaArrastrando = false

  const mueble = getMuebleClickado(event.clientX, event.clientY)
  if (mueble) {
    muebleArrastrando = mueble
    controles.enabled = false  
  }
}

function alMoverRaton(event) {
  if (!muebleArrastrando) return

  const dx = event.clientX - posicionInicialRaton.x
  const dy = event.clientY - posicionInicialRaton.y
  const distancia = Math.sqrt(dx * dx + dy * dy)

  if (distancia > DISTANCIA_ARRASTRE) {
    estaArrastrando = true
    const punto = getPuntoEnSuelo(event.clientX, event.clientY)
    if (punto) {
      muebleArrastrando.position.set(punto.x, 0, punto.z)
    }
  }
}

function alSoltarRaton(event) {
  const eraMueble = muebleArrastrando

  if (eraMueble && !estaArrastrando) {
    eraMueble.rotation.y += Math.PI / 2
  }

  if (!eraMueble) {
    const punto = getPuntoEnSuelo(event.clientX, event.clientY)
    if (punto) emit('floor-click', { x: punto.x, z: punto.z })
  }

  muebleArrastrando = null
  estaArrastrando = false
  controles.enabled = true
}


function addItem(item, pos) {
  cargador.load(
    item.modelPath,
    (gltf) => {
      const modelo = gltf.scene
      modelo.position.set(pos.x, 0, pos.z)
      modelo.scale.set(5, 5, 5)
      listaMuebles.push(modelo)
      escena.add(modelo)
    },
    undefined,
    (error) => console.error('Error al cargar el modelo:', error)
  )
}


function getPosition(event) {
  const punto = getPuntoEnSuelo(event.clientX, event.clientY)
  return punto ? { x: punto.x, z: punto.z } : null
}

defineExpose({ addItem, getPosition })


function animar() {
  requestAnimationFrame(animar)
  controles.update()
  renderizador.render(escena, camara)
}


onMounted(() => {
  escena = new THREE.Scene()
  escena.background = new THREE.Color(0xdddddf)

  camara = new THREE.PerspectiveCamera(75, contenedor.value.clientWidth / contenedor.value.clientHeight, 0.1, 1000)
  camara.position.set(0, 10, 15)
  camara.lookAt(0, 0, 0)

  renderizador = new THREE.WebGLRenderer({ antialias: true })
  renderizador.setSize(contenedor.value.clientWidth, contenedor.value.clientHeight)
  renderizador.shadowMap.enabled = true
  contenedor.value.appendChild(renderizador.domElement)

  controles = new OrbitControls(camara, renderizador.domElement)

  const luzDireccional = new THREE.DirectionalLight(0xfff8f0, 1.2)
  luzDireccional.position.set(40, 40, 40)
  luzDireccional.castShadow = true
  escena.add(luzDireccional)
  escena.add(new THREE.AmbientLight(0xffffff, 0.9))

  const geometriaSuelo = new THREE.PlaneGeometry(15, 15)
  const materialSuelo = new THREE.MeshStandardMaterial({ color: 0xD4C8A8, roughness: 0.85 })
  suelo = new THREE.Mesh(geometriaSuelo, materialSuelo)
  suelo.rotation.x = -Math.PI / 2
  suelo.receiveShadow = true
  escena.add(suelo)

  const cuadricula = new THREE.GridHelper(15, 15, 0xbbaa88, 0xccbb99)
  cuadricula.position.y = 0.01
  escena.add(cuadricula)

  const materialPared = new THREE.MeshStandardMaterial({ color: 0xffffff })

  const paredFondo = new THREE.Mesh(new THREE.PlaneGeometry(15, 8), materialPared)
  paredFondo.position.set(0, 4, -7.5)
  escena.add(paredFondo)

  const paredDerecha = new THREE.Mesh(new THREE.PlaneGeometry(15, 8), materialPared)
  paredDerecha.position.set(7.5, 4, 0)
  paredDerecha.rotation.y = -Math.PI / 2
  escena.add(paredDerecha)

  const paredIzquierda = new THREE.Mesh(new THREE.PlaneGeometry(15, 8), materialPared)
  paredIzquierda.position.set(-7.5, 4, 0)
  paredIzquierda.rotation.y = Math.PI / 2
  escena.add(paredIzquierda)

  const paredDelantera = new THREE.Mesh(new THREE.PlaneGeometry(15, 8), materialPared)
  paredDelantera.position.set(0, 4, 7.5)
  paredDelantera.rotation.y = Math.PI
  escena.add(paredDelantera)

  renderizador.domElement.addEventListener('mousedown', alPresionarRaton)
  renderizador.domElement.addEventListener('mousemove', alMoverRaton)
  renderizador.domElement.addEventListener('mouseup', alSoltarRaton)

  animar()
})
</script>