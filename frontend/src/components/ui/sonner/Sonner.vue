<script setup>
import { Toaster as Sonner } from 'vue-sonner'

const props = defineProps({
  position: { type: String, default: 'top-right' },
  expand: { type: Boolean, default: false },
  visibleToasts: { type: Number, default: 3 },
  closeButton: { type: Boolean, default: false },
  toastOptions: { type: Object, default: () => ({}) },
  theme: { type: String, default: 'system' },
  richColors: { type: Boolean, default: false },
})
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg  data-[type=success]:!text-blue-700 data-[type=success]:!bg-blue-50 data-[type=success]:!border-blue-200 data-[type=info]:!text-blue-700 data-[type=info]:!bg-blue-50 data-[type=info]:!border-blue-200 data-[type=error]:!text-red-700 data-[type=error]:!bg-red-50 data-[type=error]:!border-red-200 data-[type=warning]:!text-red-700 data-[type=warning]:!bg-red-50 data-[type=warning]:!border-red-200',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
