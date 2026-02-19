import { defineStore } from "pinia";
import { ref } from "vue";


export const useItemsStore = defineStore("furniture", () => {
  const catalog = ref([
  {
    id: "escritorio",
    name: "Escritorio",
    modelPath: "/models/desk.glb",
    icon: "/icons/desk.png"
  },
  {
    id: "silla",
    name: "Silla",
    modelPath: "/models/chair.glb",
    icon: "/icons/chair.png"
  },
  {
    id: "mesa",
    name: "Mesa",
    modelPath: "/models/table.glb",
    icon: "/icons/table.png"
  },
  {
    id: "sofa",
    name: "Sofá",
    modelPath: "/models/loungeSofa.glb",
    icon: "/icons/sofa.png"
  },
  {
    id: "lavabo",
    name: "Lavabo",
    modelPath: "/models/toilet.glb",
    icon: "/icons/toilet.png"
  },
  {
    id: "lampara",
    name: "Lámpara",
    modelPath: "/models/lampRoundFloor.glb",
    icon: "/icons/lamp.png"
  },
  {
    id: "planta",
    name: "planta",
    modelPath: "/models/pottedPlant.glb",
    icon: "/icons/plant.png"
  },
  {
    id: "televisión",
    name: "Televisión",
    modelPath: "/models/televisionVintage.glb",
    icon: "/icons/television.png"
  },
  {
    id: "SofaGorila",
    name: "Sofá Gorila",
    modelPath: "/models/gorila2.glb",
    icon: "/icons/gorila.png"
  },
  {
    id: "alfombra",
    name: "Alfombra",
    modelPath: "/models/rugRectangle.glb",
    icon: "/icons/carpet.png"
  },
  {
    id: "sandro",
    name: "Sandro",
    modelPath: "/models/sandro2.glb",
    icon: "/icons/sandro.png"
  }
])

  const placedItems = ref([]);

  const addItem = (item) => {
  placedItems.value.push(item);
}

  function removeLastItem(id) {
    placedItems.value.pop();
  }

  function removeItems() {
    placedItems.value = [];
  }

  return {
    catalog,
    placedItems,
    addItem,
    removeLastItem,
    removeItems
  };
});
