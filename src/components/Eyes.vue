<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  targetX: number
  targetY: number
}>()

// Calculate eye movement
const useEyeStyle = (offsetX: number, offsetY: number) => {
  return computed(() => {
    // Current eye center position (approximate, assumed centered on screen)
    // For a more robust solution, we would need element ref and getBoundingClientRect
    // But for this simple centered background design, we can assume center.
    const eyeCenterX = window.innerWidth / 2 + offsetX
    const eyeCenterY = window.innerHeight / 2 + offsetY
    
    // Vector to target
    const dx = props.targetX - eyeCenterX
    const dy = props.targetY - eyeCenterY
    const angle = Math.atan2(dy, dx)
    
    // Limit pupil distance
    const dist = Math.min(10, Math.sqrt(dx * dx + dy * dy) / 20)
    
    const pupilX = Math.cos(angle) * dist
    const pupilY = Math.sin(angle) * dist
    
    return {
      transform: `translate(${pupilX}px, ${pupilY}px)`
    }
  })
}

const leftPupilStyle = useEyeStyle(-30, 0)
const rightPupilStyle = useEyeStyle(30, 0)

</script>

<template>
  <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-4 pointer-events-none z-10">
    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-200">
      <div class="w-6 h-6 bg-slate-800 rounded-full transition-transform duration-75" :style="leftPupilStyle"></div>
    </div>
    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-200">
       <div class="w-6 h-6 bg-slate-800 rounded-full transition-transform duration-75" :style="rightPupilStyle"></div>
    </div>
  </div>
</template>
