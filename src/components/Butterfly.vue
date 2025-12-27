<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

interface Props {
  speed: number
  followDuration: number
  mousePos: { x: number; y: number }
  isMouseActive: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:position', pos: { x: number; y: number }): void
}>()

const { width: windowWidth, height: windowHeight } = useWindowSize()

// State
const x = ref(window.innerWidth / 2)
const y = ref(window.innerHeight / 2)
const vx = ref(0)
const vy = ref(0)
const angle = ref(0)
const lastMouseActiveTime = ref(Date.now())
const isFleeing = ref(false)
let lastMouseX = 0
let lastMouseY = 0

// Constants
const WANDER_STRENGTH = 0.5
const TURN_SPEED = 0.1

// Animation loop
let animationFrameId: number

const update = () => {
  const now = Date.now()
  const targetX = props.mousePos.x
  const targetY = props.mousePos.y
  
  // Check if mouse actually moved
  const distMoved = Math.sqrt(Math.pow(targetX - lastMouseX, 2) + Math.pow(targetY - lastMouseY, 2))
  if (distMoved > 0.5 && props.isMouseActive) {
    lastMouseActiveTime.value = now
    isFleeing.value = false
  }
  
  lastMouseX = targetX
  lastMouseY = targetY

  const timeSinceActive = now - lastMouseActiveTime.value
  const shouldFollow = props.isMouseActive && timeSinceActive < props.followDuration && !isFleeing.value
  
  if (timeSinceActive > props.followDuration && props.isMouseActive) {
    isFleeing.value = true
  }
  
  if (!props.isMouseActive) {
     isFleeing.value = false
  }

  // Calculate forces
  let ax = 0
  let ay = 0

  if (shouldFollow) {
    // Seek mouse
    const dx = targetX - x.value
    const dy = targetY - y.value
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    // Orbit behavior if too close
    if (dist < 100) {
       // Perpendicular force to orbit
       ax += -dy * 0.05
       ay += dx * 0.05
    } else {
       ax += dx * 0.005
       ay += dy * 0.005
    }
  } else if (isFleeing) {
    // Flee mouse
    const dx = x.value - targetX
    const dy = y.value - targetY
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 500) { // Flee radius
        ax += dx * 0.01
        ay += dy * 0.01
    } else {
        // Wander if far enough
        ax += (Math.random() - 0.5) * WANDER_STRENGTH
        ay += (Math.random() - 0.5) * WANDER_STRENGTH
    }
  } else {
    // Wander
    ax += (Math.random() - 0.5) * WANDER_STRENGTH
    ay += (Math.random() - 0.5) * WANDER_STRENGTH
    
    // Stay on screen force
    const margin = 100
    if (x.value < margin) ax += 0.5
    if (x.value > windowWidth.value - margin) ax -= 0.5
    if (y.value < margin) ay += 0.5
    if (y.value > windowHeight.value - margin) ay -= 0.5
  }

  // Update velocity
  vx.value += ax
  vy.value += ay

  // Limit speed
  const currentSpeed = Math.sqrt(vx.value * vx.value + vy.value * vy.value)
  const maxSpeed = props.speed
  if (currentSpeed > maxSpeed) {
    vx.value = (vx.value / currentSpeed) * maxSpeed
    vy.value = (vy.value / currentSpeed) * maxSpeed
  }

  // Update position
  x.value += vx.value
  y.value += vy.value

  // Update angle (smooth rotation)
  const targetAngle = Math.atan2(vy.value, vx.value) * (180 / Math.PI) + 90
  
  // Smooth angle transition
  let diff = targetAngle - angle.value
  while (diff < -180) diff += 360
  while (diff > 180) diff -= 360
  angle.value += diff * TURN_SPEED

  // Bounds wrapping (safety)
  if (x.value < -100) x.value = windowWidth.value + 100
  if (x.value > windowWidth.value + 100) x.value = -100
  if (y.value < -100) y.value = windowHeight.value + 100
  if (y.value > windowHeight.value + 100) y.value = -100

  // Emit position
  emit('update:position', { x: x.value, y: y.value })

  animationFrameId = requestAnimationFrame(update)
}

onMounted(() => {
  update()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})

const style = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px) rotate(${angle.value}deg)`,
  width: '60px',
  height: '60px',
  willChange: 'transform'
}))

</script>

<template>
  <div class="fixed top-0 left-0 -ml-[30px] -mt-[30px] z-50 pointer-events-none drop-shadow-xl" :style="style">
    <svg viewBox="0 0 100 100" class="w-full h-full butterfly-anim">
      <g fill="none" class="butterfly-body">
         <!-- Left Wing -->
        <path d="M 50 50 Q 20 10 10 40 Q 5 70 40 80 Q 50 60 50 50" fill="url(#wingGradientL)" stroke="white" stroke-width="1" />
        <!-- Right Wing -->
        <path d="M 50 50 Q 80 10 90 40 Q 95 70 60 80 Q 50 60 50 50" fill="url(#wingGradientR)" stroke="white" stroke-width="1" />
        <!-- Body -->
        <ellipse cx="50" cy="50" rx="3" ry="20" fill="#444" />
        <!-- Antennae -->
        <path d="M 50 30 Q 40 10 30 15" stroke="#444" stroke-width="2" fill="none" />
        <path d="M 50 30 Q 60 10 70 15" stroke="#444" stroke-width="2" fill="none" />
      </g>
      <defs>
        <linearGradient id="wingGradientL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
        </linearGradient>
         <linearGradient id="wingGradientR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.butterfly-anim {
  animation: flutter 0.2s infinite ease-in-out alternate;
}

@keyframes flutter {
  0% { transform: scaleX(1); }
  100% { transform: scaleX(0.8); }
}
</style>
