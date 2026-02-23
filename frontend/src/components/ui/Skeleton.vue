<template>
  <div class="animate-pulse" :class="containerClass">
    <!-- Single line skeleton -->
    <div 
      v-if="type === 'line'" 
      class="bg-gray-200 rounded"
      :class="sizeClass"
    ></div>

    <!-- Circle (avatar) skeleton -->
    <div 
      v-else-if="type === 'circle'" 
      class="bg-gray-200 rounded-full"
      :style="{ width: size + 'px', height: size + 'px' }"
    ></div>

    <!-- Image/Card skeleton -->
    <div 
      v-else-if="type === 'card'" 
      class="bg-gray-200 rounded-lg"
      :class="sizeClass"
    ></div>

    <!-- Product card skeleton -->
    <div v-else-if="type === 'product'" class="border rounded-xl overflow-hidden">
      <div class="bg-gray-200 aspect-[3/4]"></div>
      <div class="p-4 space-y-3">
        <div class="bg-gray-200 h-4 rounded w-3/4"></div>
        <div class="bg-gray-200 h-3 rounded w-1/2"></div>
        <div class="bg-gray-200 h-5 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Text block skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div class="bg-gray-200 h-4 rounded w-full"></div>
      <div class="bg-gray-200 h-4 rounded w-5/6"></div>
      <div class="bg-gray-200 h-4 rounded w-4/6"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'line',
    validator: v => ['line', 'circle', 'card', 'product', 'text'].includes(v)
  },
  size: {
    type: [Number, String],
    default: 40
  },
  height: {
    type: String,
    default: 'h-4'
  },
  width: {
    type: String,
    default: 'w-full'
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  if (props.type === 'line') return `${props.height} ${props.width}`
  if (props.type === 'card') return `${props.height} ${props.width}`
  return ''
})
</script>
