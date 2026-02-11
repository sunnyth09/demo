<script setup>
import { ref, onErrorCaptured } from 'vue'
import Toaster from '@/components/ui/sonner/Sonner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const globalError = ref(null)

onErrorCaptured((err, instance, info) => {
  console.error('Global Error Captured:', err)
  if (err.message && (err.message.includes('Network Error') || err.message.includes('fetch'))) {
      globalError.value = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền hoặc thử lại sau.'
  } else {
      globalError.value = err.message || 'Đã có lỗi không mong muốn xảy ra.'
  }
  return false // Prevent crash
})

const reloadPage = () => {
  globalError.value = null
  window.location.reload()
}
</script>

<template>
  <div v-if="globalError" class="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
    <div class="bg-card p-8 rounded-xl shadow-2xl border max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
      <div class="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold mb-3 text-foreground">Rất tiếc, đã có lỗi xảy ra!</h3>
      <p class="text-muted-foreground mb-8 text-sm leading-relaxed overflow-hidden">
        {{ globalError }}
      </p>
      <button 
        @click="reloadPage" 
        class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
      >
        Tải lại trang ngay
      </button>
    </div>
  </div>

  <router-view v-else />
  <Toaster closeButton />
  <ConfirmDialog />
</template>
