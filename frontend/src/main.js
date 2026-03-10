import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import router from './router'
import { toast } from 'vue-sonner'
import { getImageUrl } from './utils/format'

// --- Interceptor Fetch Global ---
// Tự động chuyển đổi các URL ảnh tuyệt đối có IP cứng 
// sang đường dẫn tương đối để proxy của Vite hoạt động chuẩn xác
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  // Chúng ta chỉ cần thay đổi phần parse .json()
  const originalJson = response.json.bind(response);
  response.json = async () => {
    const data = await originalJson();
    
    // Duyệt sâu và sửa URL ảnh
    const fixUrls = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => fixUrls(item));
      }
      
      const newObj = { ...obj };
      for (const [key, value] of Object.entries(newObj)) {
        if (value && typeof value === 'string') {
          // Các trường chứa URL ảnh
          if (['thumbnail', 'image', 'avatar'].includes(key) || (key === 'images' && Array.isArray(value))) {
            newObj[key] = getImageUrl(value);
          }
        } else if (value && typeof value === 'object') {
             // Trường hợp đặc biệt cho mảng ảnh
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

// --- Interceptor Axios Global ---
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

// Global error handler — Bắt lỗi Vue không được xử lý
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err, info)
  if (import.meta.env.DEV) {
    toast.error(`Lỗi: ${err.message}`)
  } else {
    toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.')
  }
}

// Bắt các promise rejection chưa được xử lý
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Rejection]', event.reason)
})

app.use(pinia)
app.use(router)
app.mount('#app')
