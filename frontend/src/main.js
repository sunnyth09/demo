import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import router from './router'
import { toast } from 'vue-sonner'

const app = createApp(App)
const pinia = createPinia()

// Global error handler — catch unhandled Vue errors
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err, info)
  if (import.meta.env.DEV) {
    toast.error(`Lỗi: ${err.message}`)
  } else {
    toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.')
  }
}

// Catch unhandled promise rejections globally
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Rejection]', event.reason)
})

app.use(pinia)
app.use(router)
app.mount('#app')
