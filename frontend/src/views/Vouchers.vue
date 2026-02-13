<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
    <div class="container max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          Săn Voucher
        </h1>
        <p class="text-gray-600">Lưu mã giảm giá và sử dụng khi thanh toán</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="coupons.length === 0" class="text-center py-20">
        <div class="flex justify-center mb-4">
          <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Chưa có mã giảm giá</h3>
        <p class="text-gray-500">Hãy quay lại sau nhé!</p>
      </div>

      <!-- Voucher Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="coupon in coupons" 
          :key="coupon.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Coupon Header -->
          <div class="flex">
            <!-- Left Side - Value Badge -->
            <div 
              :class="[
                'w-28 flex flex-col items-center justify-center p-4',
                coupon.type === 'free_shipping' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-primary to-pink-600'
              ]"
            >
              <span v-if="coupon.type === 'free_shipping'" class="text-white text-xs font-medium">MIỄN PHÍ</span>
              <span v-else class="text-white text-xs font-medium">GIẢM</span>
              
              <span class="text-white text-2xl font-black mt-1">
                <template v-if="coupon.type === 'percentage'">{{ Number(coupon.value) }}%</template>
                <template v-else-if="coupon.type === 'fixed'">{{ formatShortCurrency(coupon.value) }}</template>
                <template v-else>SHIP</template>
              </span>
            </div>

            <!-- Right Side - Details -->
            <div class="flex-1 p-4">
              <h3 class="font-bold text-gray-900 line-clamp-1">{{ coupon.description || coupon.code }}</h3>
              
              <div class="flex items-center gap-2 mt-1">
                <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">{{ coupon.code }}</span>
                <span v-if="coupon.category" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                  {{ coupon.category.name }}
                </span>
              </div>

              <p v-if="coupon.min_order_amount > 0" class="text-xs text-gray-500 mt-2">
                Đơn tối thiểu: {{ formatCurrency(coupon.min_order_amount) }}
              </p>
              <p v-if="coupon.for_first_order_only" class="text-xs text-orange-500 font-medium mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                Chỉ cho đơn hàng đầu tiên
              </p>
            </div>
          </div>

          <!-- Coupon Footer -->
          <div class="px-4 pb-4 flex items-center justify-between border-t border-dashed border-gray-200 pt-3 mt-0">
            <!-- Countdown / Expiry -->
            <div class="text-xs">
              <div v-if="getCountdown(coupon.end_date, coupon.start_date).isUpcoming" class="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ getCountdown(coupon.end_date, coupon.start_date).text }}</span>
              </div>
              <div v-else-if="getCountdown(coupon.end_date).isUrgent" class="flex items-center gap-1 text-red-500 font-medium animate-pulse">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ getCountdown(coupon.end_date).text }}</span>
              </div>
              <div v-else class="text-gray-500 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                HSD: {{ formatDate(coupon.end_date) }}
              </div>
            </div>

            <!-- Action Button -->
            <button
              v-if="coupon.isClaimed"
              disabled
              class="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 cursor-default flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> 
              Đã lưu
            </button>
            <button
              v-else
              @click="handleClaim(coupon)"
              :disabled="claiming === coupon.id || getCountdown(coupon.end_date, coupon.start_date).isUpcoming"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1',
                getCountdown(coupon.end_date, coupon.start_date).isUpcoming ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white hover:bg-primary/90'
              ]"
            >
              <template v-if="claiming === coupon.id">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </template>
              <template v-else-if="getCountdown(coupon.end_date, coupon.start_date).isUpcoming">Sắp mở</template>
              <template v-else>Lưu mã</template>
            </button>
          </div>
        </div>
      </div>

      <!-- My Coupons Section -->
      <div v-if="authStore.isAuthenticated && myCoupons.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
          Mã của tôi
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="coupon in myCoupons" 
            :key="coupon.id"
            :class="[
              'bg-white rounded-xl border p-4 flex items-center gap-4',
              coupon.is_used ? 'opacity-50' : ''
            ]"
          >
            <div 
              :class="[
                'w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold',
                coupon.type === 'free_shipping' ? 'bg-green-500' : 'bg-primary'
              ]"
            >
              <template v-if="coupon.type === 'percentage'">{{ Number(coupon.value) }}%</template>
              <template v-else-if="coupon.type === 'fixed'">{{ formatShortCurrency(coupon.value) }}</template>
              <template v-else>FREE</template>
            </div>
            
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 line-clamp-1">{{ coupon.description || coupon.code }}</h4>
              <p class="text-xs text-gray-500">{{ coupon.code }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="coupon.is_used" class="text-xs text-red-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  Đã sử dụng
                </span>
                <span v-else class="text-xs text-green-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  Còn hiệu lực
                </span>
                <span class="text-xs text-gray-400">|</span>
                <span class="text-xs text-gray-500">{{ getSourceLabel(coupon.source) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Đăng nhập để lưu mã</h3>
        <p class="text-gray-500 mb-6">Bạn cần đăng nhập để lưu mã giảm giá vào tài khoản</p>
        <div class="flex gap-3">
          <button @click="showLoginModal = false" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <router-link to="/login" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Đăng nhập</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL

const coupons = ref([])
const myCoupons = ref([])
const loading = ref(true)
const claiming = ref(null)
const showLoginModal = ref(false)

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const formatShortCurrency = (value) => {
  const num = Number(value)
  if (num >= 1000000) return `${(num / 1000000).toFixed(0)}TR`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

const formatDate = (dateStr) => {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const getCountdown = (endDate, startDate = null) => {
  const now = new Date()
  
  // Check if upcoming (Flash Sale)
  if (startDate) {
    const start = new Date(startDate)
    if (start > now) {
      const diffMs = start - now
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      
      let text = ''
      if (diffHours > 24) text = `Mở sau ${Math.ceil(diffHours / 24)} ngày`
      else text = `Mở sau ${diffHours}h ${diffMinutes}p`
      
      return { isUrgent: false, isUpcoming: true, text }
    }
  }

  if (!endDate) return { isUrgent: false, isUpcoming: false, text: '' }
  
  const end = new Date(endDate)
  const diffMs = end - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 0) return { isUrgent: true, isUpcoming: false, text: 'Hết hạn hôm nay!' }
  if (diffDays === 1) return { isUrgent: true, isUpcoming: false, text: 'Còn 1 ngày!' }
  if (diffDays <= 3) return { isUrgent: true, isUpcoming: false, text: `Còn ${diffDays} ngày` }
  
  return { isUrgent: false, isUpcoming: false, text: `Còn ${diffDays} ngày` }
}

const getSourceLabel = (source) => {
  const labels = {
    'claim': 'Đã lưu',
    'welcome': 'Chào mừng',
    'first_order': 'Đơn đầu tiên',
    'manual': 'Được tặng'
  }
  return labels[source] || source
}

const fetchPublicCoupons = async () => {
  try {
    const headers = {}
    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    
    const res = await fetch(`${API_URL}/coupons/public`, { headers })
    const data = await res.json()
    if (data.status) {
      coupons.value = data.data
    }
  } catch (error) {
    console.error('Error fetching coupons:', error)
  }
}

const fetchMyCoupons = async () => {
  if (!authStore.isAuthenticated) return
  
  try {
    const res = await fetch(`${API_URL}/coupons/my`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    const data = await res.json()
    if (data.status) {
      myCoupons.value = data.data
    }
  } catch (error) {
    console.error('Error fetching my coupons:', error)
  }
}

const handleClaim = async (coupon) => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  try {
    claiming.value = coupon.id
    
    // Check Flash Sale logic first
    const { isUpcoming } = getCountdown(coupon.end_date, coupon.start_date)
    if (isUpcoming && !authStore.isAdmin) {
       toast.error('Chương trình chưa bắt đầu!')
       return
    }

    const res = await fetch(`${API_URL}/coupons/claim/${coupon.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    const data = await res.json()
    
    if (data.status) {
      toast.success('Lưu mã thành công!')
      // Refresh list
      await Promise.all([fetchPublicCoupons(), fetchMyCoupons()])
    } else {
      toast.error(data.message || 'Không thể lưu mã')
    }
  } catch (error) {
    toast.error('Lỗi kết nối')
  } finally {
    claiming.value = null
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchPublicCoupons(), fetchMyCoupons()])
  loading.value = false
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
