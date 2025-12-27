<script setup lang="ts">
import { ref } from 'vue'
import { useMouse } from '@vueuse/core'
import Butterfly from './components/Butterfly.vue'
import Eyes from './components/Eyes.vue'
import ControlPanel from './components/ControlPanel.vue'

// Mouse tracking
const { x: mouseX, y: mouseY } = useMouse()

// State
const speed = ref(5)
const followDuration = ref(2000)
const butterflyPos = ref({ x: 0, y: 0 })

const updateButterflyPos = (pos: { x: number, y: number }) => {
  butterflyPos.value = pos
}
</script>

<template>
  <div class="relative w-screen h-screen bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden flex items-center justify-center">
    
    <!-- Background Watermark -->
    <h1 class="absolute text-9xl font-black text-white opacity-20 select-none pointer-events-none tracking-tighter">
      BUTTERFLY
    </h1>

    <!-- Components -->
    <Eyes :targetX="butterflyPos.x" :targetY="butterflyPos.y" />
    
    <Butterfly 
      :speed="speed"
      :followDuration="followDuration"
      :mousePos="{ x: mouseX, y: mouseY }"
      :isMouseActive="true"
      @update:position="updateButterflyPos"
    />
    
    <ControlPanel 
      v-model:speed="speed"
      v-model:followDuration="followDuration"
    />
    
    <div class="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
       Pos: {{ Math.round(butterflyPos.x) }}, {{ Math.round(butterflyPos.y) }}
    </div>
  </div>
</template>
