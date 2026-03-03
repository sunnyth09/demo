import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import router from './router'
import { toast } from 'vue-sonner'
import { getImageUrl } from './utils/format'

// --- Global Fetch Interceptor ---
// Automatically clean up absolute image URLs with hardcoded IPs 
// to relative paths so they work via Vite proxy correctly
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  // We only care about modifying the .json() parsing
  const originalJson = response.json.bind(response);
  response.json = async () => {
    const data = await originalJson();
    
    // Deeply traverse and fix image URLs
    const fixUrls = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => fixUrls(item));
      }
      
      const newObj = { ...obj };
      for (const [key, value] of Object.entries(newObj)) {
        if (value && typeof value === 'string') {
          // Fields known to contain image URLs
          if (['thumbnail', 'image', 'avatar'].includes(key) || (key === 'images' && Array.isArray(value))) {
            newObj[key] = getImageUrl(value);
          }
        } else if (value && typeof value === 'object') {
             // Special case for array of images
             if (key === 'images' && Array.isArray(value)) {
                 newObj[key] = value.map(img => typeof img === 'string' ? getImageUrl(img) : img)
             } else {
                 newObj[key] = fixUrls(value);
             }
        }
      }
      return newObj;
    };

    return fixUrls(data);
  };

  return response;
};

// --- Global Axios Interceptor ---
import axios from 'axios';
axios.interceptors.response.use((response) => {
  if (response.data) {
    const fixUrls = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(item => fixUrls(item));
      
      const newObj = { ...obj };
      for (const [key, value] of Object.entries(newObj)) {
        if (value && typeof value === 'string') {
          if (['thumbnail', 'image', 'avatar'].includes(key) || (key === 'images' && Array.isArray(value))) {
            newObj[key] = getImageUrl(value);
          }
        } else if (value && typeof value === 'object') {
           if (key === 'images' && Array.isArray(value)) {
               newObj[key] = value.map(img => typeof img === 'string' ? getImageUrl(img) : img)
           } else {
               newObj[key] = fixUrls(value);
           }
        }
      }
      return newObj;
    };
    response.data = fixUrls(response.data);
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});
// --------------------------------

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
