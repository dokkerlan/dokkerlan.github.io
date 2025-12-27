<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'radix-vue'

const speed = defineModel<number>('speed', { required: true })
const followDuration = defineModel<number>('followDuration', { required: true })

const updateSpeed = (v: number[] | undefined) => {
  if (v?.[0] !== undefined) speed.value = v[0]
}

const updateDuration = (v: number[] | undefined) => {
  if (v?.[0] !== undefined) followDuration.value = v[0]
}
</script>

<template>
  <div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 w-[300px] flex flex-col gap-4 text-slate-700 z-50">
    <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Controls</h3>
    
    <!-- Speed Control -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs font-medium">
        <span>Speed</span>
        <span>{{ speed.toFixed(1) }}</span>
      </div>
      <SliderRoot
        :model-value="[speed]"
        @update:model-value="updateSpeed"
        :max="20"
        :min="1"
        :step="0.5"
        class="relative flex items-center select-none touch-none w-full h-5"
      >
        <SliderTrack class="bg-gray-200 relative grow rounded-full h-[3px]">
          <SliderRange class="absolute bg-slate-800 rounded-full h-full" />
        </SliderTrack>
        <SliderThumb
          class="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black/20 rounded-full hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Speed"
        />
      </SliderRoot>
    </div>

    <!-- Duration Control -->
    <div class="flex flex-col gap-2">
       <div class="flex justify-between text-xs font-medium">
        <span>Boredom Delay (ms)</span>
        <span>{{ followDuration }}</span>
      </div>
      <SliderRoot
         :model-value="[followDuration]"
         @update:model-value="updateDuration"
        :max="5000"
        :min="500"
        :step="100"
        class="relative flex items-center select-none touch-none w-full h-5"
      >
        <SliderTrack class="bg-gray-200 relative grow rounded-full h-[3px]">
          <SliderRange class="absolute bg-slate-800 rounded-full h-full" />
        </SliderTrack>
        <SliderThumb
          class="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black/20 rounded-full hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Duration"
        />
      </SliderRoot>
    </div>
  </div>
</template>
