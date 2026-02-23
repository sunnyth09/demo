<template>
  <Teleport to="body">
    <nav 
      v-if="isVisible"
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[999] lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
    >
      <div class="flex items-center justify-around h-14 max-w-lg mx-auto">
        <!-- Trang chủ -->
        <router-link 
          to="/" 
          class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors"
          :class="isActive('/') ? 'text-primary' : 'text-gray-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="text-[10px] font-medium leading-tight">Trang chủ</span>
        </router-link>

        <!-- Sản phẩm -->
        <router-link 
          to="/san-pham" 
          class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors"
          :class="isActive('/san-pham') ? 'text-primary' : 'text-gray-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
          </svg>
          <span class="text-[10px] font-medium leading-tight">Sản phẩm</span>
        </router-link>

        <!-- Giỏ hàng -->
        <router-link 
          to="/cart" 
          class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors relative"
          :class="isActive('/cart') ? 'text-primary' : 'text-gray-400'"
        >
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span 
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2.5 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1"
            >
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </div>
          <span class="text-[10px] font-medium leading-tight">Giỏ hàng</span>
        </router-link>

        <!-- Tài khoản -->
        <router-link 
          :to="authStore.isAuthenticated ? '/profile' : '/login'" 
          class="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors"
          :class="isActive('/profile') || isActive('/login') || isActive('/orders') ? 'text-primary' : 'text-gray-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span class="text-[10px] font-medium leading-tight">
            {{ authStore.isAuthenticated ? 'Tài khoản' : 'Đăng nhập' }}
          </span>
        </router-link>
      </div>
      <!-- Safe area for iOS home indicator -->
      <div class="h-[env(safe-area-inset-bottom)]"></div>
    </nav>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartCount = computed(() => cartStore.totalItems)

// Hide on certain pages (checkout, admin, order-success)
const hiddenPaths = ['/checkout', '/admin', '/order-success']
const isVisible = computed(() => {
  return !hiddenPaths.some(p => route.path.startsWith(p))
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
