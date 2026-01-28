<template>
  <div class="space-y-6 relative min-h-[600px]">
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm font-bold text-muted-foreground animate-pulse">Đang đồng bộ dữ liệu...</p>
      </div>
    </div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        class="group relative bg-card rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      >
        <!-- Background Accent Glow -->
        <div :class="['absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150', stat.bgColor]"></div>
        
        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">{{ stat.title }}</p>
            <div class="flex items-baseline gap-2 mt-2">
              <p class="text-3xl font-bold tracking-tight">{{ stat.value }}</p>
            </div>
            <div class="flex items-center gap-1.5 mt-2">
              <span :class="['flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full', 
                stat.changeType === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">
                {{ stat.changeType === 'up' ? '↑' : '↓' }} {{ stat.change }}
              </span>
              <span class="text-[10px] text-muted-foreground font-medium">vs tháng trước</span>
            </div>
          </div>
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12', stat.bgColor]" v-html="stat.iconRaw">
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 bg-card rounded-2xl border p-6 shadow-sm">
        <div class="flex items-center justify-between mb-16">
          <div>
            <h3 class="text-lg font-bold">Phân tích doanh thu</h3>
            <p class="text-sm text-muted-foreground">Thống kê giao dịch hoàn tất {{ chartDays }} ngày qua</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 p-1 bg-muted rounded-lg text-xs font-medium">
              <button 
                @click="setChartDays(7)"
                :class="['px-3 py-1.5 rounded-md transition-all', chartDays === 7 ? 'bg-background border shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']">
                7D
              </button>
              <button 
                @click="setChartDays(30)"
                :class="['px-3 py-1.5 rounded-md transition-all', chartDays === 30 ? 'bg-background border shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']">
                30D
              </button>
            </div>
          </div>
        </div>
        
        <div class="relative h-80 flex items-end gap-3 px-2">
          <!-- Grid Lines -->
          <div class="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none opacity-[0.03]">
            <div v-for="i in 4" :key="i" class="border-t border-foreground w-full"></div>
            <div class="w-full"></div>
          </div>

          <div 
            v-for="(item, index) in revenueChartData" 
            :key="index"
            class="group/bar flex-1 relative flex flex-col items-center h-full justify-end"
          >
            <div 
              class="w-full bg-gradient-to-t from-primary/40 to-primary/80 hover:to-primary transition-all duration-500 rounded-t-lg relative flex flex-col justify-end"
              :style="{ height: `${Math.max(item.percent, 5)}%` }"
            >
              <!-- Bar Tip Glow -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-lg"></div>
              
              <!-- Tooltip Premium -->
              <div class="absolute -top-14 left-1/2 -translate-x-1/2 bg-foreground/90 backdrop-blur-md text-background text-[10px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover/bar:opacity-100 group-hover/bar:-top-16 transition-all duration-300 whitespace-nowrap z-20 shadow-xl border border-white/10">
                <div class="text-muted-foreground text-[8px] uppercase tracking-tighter mb-0.5">Doanh thu {{ item.label }}</div>
                <div>{{ formatCurrency(item.value) }}</div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/90 rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between mt-4 px-2">
          <span 
            v-for="(item, index) in revenueChartData" 
            :key="index"
            class="text-[10px] font-bold text-muted-foreground uppercase tracking-tight"
          >
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- Recent Orders List -->
      <div class="bg-card rounded-2xl border p-6 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">Đơn hàng hiện tại</h3>
          <router-link to="/admin/orders" class="p-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </router-link>
        </div>
        <div class="space-y-3">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            @click="openOrderModal(order)"
            class="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-border cursor-pointer"
          >
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-sm font-black text-primary border border-primary/10 transition-transform group-hover:scale-110">
              {{ order.customer.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate group-hover:text-primary transition-colors">{{ order.customer }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] text-muted-foreground font-medium uppercase">{{ order.itemCount }} sản phẩm</span>
                <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                <span class="text-[10px] text-muted-foreground font-medium">{{ formatCurrency(order.total) }}</span>
              </div>
            </div>
            <div class="text-right">
              <span :class="['text-[9px] font-black uppercase px-2 py-1 rounded-lg tracking-wider border', getStatusClass(order.rawStatus)]">
                {{ order.statusLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Products -->
      <div class="bg-card rounded-2xl border p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">Sản phẩm bán chạy</h3>
          <button class="text-xs text-primary font-bold hover:underline">Sắp xếp: Doanh số</button>
        </div>
        <div class="space-y-5">
          <div 
            v-for="(product, index) in topProducts" 
            :key="product.id"
            class="flex items-center gap-4 group cursor-pointer"
          >
            <div class="relative">
              <span class="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black z-10 shadow-sm">
                {{ index + 1 }}
              </span>
              <div class="w-14 h-14 rounded-xl bg-muted overflow-hidden flex-shrink-0 border transition-transform duration-300 group-hover:scale-105">
                <img 
                  v-if="product.thumbnail"
                  :src="product.thumbnail" 
                  class="w-full h-full object-cover"
                  :alt="product.name"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-xl">📚</div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate group-hover:text-primary transition-colors">{{ product.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="h-1.5 flex-1 bg-muted rounded-full overflow-hidden max-w-[100px]">
                  <div class="h-full bg-primary rounded-full transition-all duration-1000" :style="{ width: topProducts.length > 0 ? `${(product.sold / topProducts[0].sold) * 100}%` : '0%' }"></div>
                </div>
                <span class="text-[10px] font-bold text-muted-foreground uppercase">{{ product.sold }} đã bán</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-black">{{ formatCurrency(product.revenue) }}</p>
              <p class="text-[10px] text-green-500 font-bold uppercase mt-0.5">Đã thanh toán</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities Timeline -->
      <div class="bg-card rounded-2xl border p-6 shadow-sm">
        <h3 class="text-lg font-bold mb-6">Thông báo hệ thống</h3>
        <div class="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted before:rounded-full">
          <div 
            v-for="activity in activities" 
            :key="activity.id"
            class="relative flex gap-6 pl-2 group"
          >
            <div class="absolute left-0 w-4 h-4 rounded-full border-2 border-background bg-primary mt-1 z-10 transition-transform group-hover:scale-125 shadow-sm shadow-primary/50"></div>
            <div class="flex-1 pb-1">
              <p class="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors leading-relaxed">{{ activity.message }}</p>
              <div class="flex items-center gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Order Detail Modal -->
  <div v-if="showOrderModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showOrderModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 m-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
           <h3 class="text-xl font-bold">Chi tiết đơn hàng #{{ selectedOrder?.id }}</h3>
           <p class="text-sm text-muted-foreground">{{ formatDate(selectedOrder?.createdAt) }}</p>
        </div>
        <button @click="showOrderModal = false" class="p-2 hover:bg-gray-100 rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div class="space-y-6">
         <!-- Status -->
         <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Trạng thái:</span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(selectedOrder?.status)]">
              {{ mapStatusName(selectedOrder?.status) }}
            </span>
         </div>

         <!-- Shipping Info -->
         <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-bold text-sm mb-3">Thông tin giao hàng</h4>
            <div class="space-y-1 text-sm">
               <p><span class="font-medium">Người nhận:</span> {{ selectedOrder?.customer_name }}</p>
               <p><span class="font-medium">Số điện thoại:</span> {{ selectedOrder?.customer_phone }}</p>
               <p><span class="font-medium">Địa chỉ:</span> {{ selectedOrder?.shipping_address }}</p>
               <p v-if="selectedOrder?.note"><span class="font-medium">Ghi chú:</span> {{ selectedOrder?.note }}</p>
            </div>
         </div>

         <!-- Order Items -->
         <div>
            <h4 class="font-bold text-sm mb-3">Sản phẩm</h4>
            <div class="border rounded-lg overflow-hidden">
               <div v-for="item in selectedOrder?.items" :key="item.id" class="flex items-center gap-4 p-3 border-b last:border-0">
                  <div class="w-16 h-16 bg-gray-200 rounded-md shrink-0 overflow-hidden border">
                     <img v-if="item.product && item.product.thumbnail" :src="item.product.thumbnail" :alt="item.product_name" class="w-full h-full object-cover" />
                     <svg v-else class="w-full h-full text-gray-400 p-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
                  </div>
                  <div class="flex-1">
                     <p class="font-medium line-clamp-2">{{ item.product_name }}</p>
                     <p class="text-sm text-muted-foreground">x{{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                     <p class="font-medium">{{ formatCurrency(item.price) }}</p>
                     <p class="text-sm text-primary font-bold">{{ formatCurrency(item.total_price) }}</p>
                  </div>
               </div>
            </div>
         </div>

         <!-- Summary -->
         <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between text-sm">
               <span class="text-muted-foreground">Phương thức thanh toán</span>
               <span class="font-medium uppercase">{{ selectedOrder?.payment_method }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold">
               <span>Tổng cộng</span>
               <span class="text-primary">{{ formatCurrency(selectedOrder?.total_amount) }}</span>
            </div>
         </div>
      </div>
      
      <div class="mt-8 flex justify-end">
         <button @click="showOrderModal = false" class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const loading = ref(true)
const chartDays = ref(7)

// SVG Icons
const icons = {
  revenue: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  order: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  product: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
}

const stats = ref([
  { 
    title: 'Tổng doanh thu', 
    value: '0đ', 
    change: '---', 
    changeType: 'up',
    iconRaw: icons.revenue, 
    bgColor: 'bg-green-100 dark:bg-green-900/30 text-green-600' 
  },
  { 
    title: 'Đơn hàng', 
    value: '0', 
    change: '---', 
    changeType: 'up',
    iconRaw: icons.order, 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
  },
  { 
    title: 'Khách hàng', 
    value: '0', 
    change: '---', 
    changeType: 'up',
    iconRaw: icons.user, 
    bgColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' 
  },
  { 
    title: 'Sản phẩm', 
    value: '0', 
    change: '---', 
    changeType: 'up',
    iconRaw: icons.product, 
    bgColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' 
  },
])

const revenueChartData = ref([])
const recentOrders = ref([])
const topProducts = ref([])
const activities = ref([])

// Order Modal Refs
const showOrderModal = ref(false)
const selectedOrder = ref(null)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

const formatRelativeTime = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date // milliseconds
  
  if (diff < 60000) return 'Vừa xong'
  if (diff < 3600000) return `${Math.floor(diff/60000)} phút trước`
  if (diff < 86400000) return `${Math.floor(diff/3600000)} giờ trước`
  return date.toLocaleDateString('vi-VN')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'processing': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const mapStatusName = (status) => {
  const map = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang đóng gói',
    'shipped': 'Đang giao',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return map[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/orders/admin/stats?days=${chartDays.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    const json = await res.json()
    
    if (json.status) {
      const data = json.data
      
      // Update Stats
      if (data.counts) {
        stats.value[0].value = formatCurrency(data.counts.totalRevenue || 0)
        stats.value[1].value = (data.counts.totalOrders || 0).toLocaleString()
        stats.value[2].value = (data.counts.totalUsers || 0).toLocaleString()
        stats.value[3].value = (data.counts.totalProducts || 0).toLocaleString()
      }
      
      // Update Recent Orders
      if (data.recentOrders) {
        recentOrders.value = data.recentOrders.map(order => ({
          ...order, // Keep all properties for modal
          customer: order.customer_name,
          itemCount: order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0,
          total: order.total_amount,
          statusLabel: mapStatusName(order.status),
          rawStatus: order.status
        }))
      }

      // Update Top Products
      if (data.topProducts) {
        topProducts.value = data.topProducts.map((p, index) => ({
          id: p.product_id,
          name: p.product_name,
          sold: p.sold,
          revenue: p.revenue,
          thumbnail: p.product?.thumbnail
        }))
      }

      // Update Revenue Chart
      if (data.revenueChart && data.revenueChart.length > 0) {
        const maxRevenue = Math.max(...data.revenueChart.map(d => d.revenue), 1)
        
        revenueChartData.value = data.revenueChart.map(d => ({
          label: d.day,
          value: d.revenue,
          percent: (d.revenue / maxRevenue) * 100
        }))
      }
      
      // Update Activities
      if (data.recentOrders) {
        activities.value = data.recentOrders.map((order) => {
          let message = ''
          if (order.status === 'completed') message = `Đơn hàng #${order.id} đã hoàn thành`
          else if (order.status === 'pending') message = `Đơn hàng mới #${order.id} từ ${order.customer_name}`
          else message = `Đơn hàng #${order.id} cập nhật trạng thái: ${mapStatusName(order.status)}`
          
          return {
            id: order.id,
            message,
            time: formatRelativeTime(order.createdAt)
          }
        })
      }
    } else {
      console.error('API Error:', json.message)
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const setChartDays = (days) => {
  chartDays.value = days
  fetchData()
}

const openOrderModal = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

onMounted(() => {
  fetchData()
})
</script>
