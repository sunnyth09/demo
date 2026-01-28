<template>
  <div class="space-y-6">
     <!-- Top Bar -->
     <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 class="text-2xl font-bold">Thống kê doanh thu</h2>
           <p class="text-muted-foreground">Phân tích chi tiết hiệu quả kinh doanh</p>
        </div>
        <div class="flex items-center gap-2 bg-card p-1.5 rounded-lg border shadow-sm">
           <div class="relative">
              <input type="date" v-model="filter.startDate" class="px-3 py-1.5 bg-background rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-primary/20" />
           </div>
           <span class="text-muted-foreground text-sm">-</span>
           <div class="relative">
              <input type="date" v-model="filter.endDate" class="px-3 py-1.5 bg-background rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-primary/20" />
           </div>
           <button @click="fetchAnalytics" class="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm">
              Xem báo cáo
           </button>
        </div>
     </div>

     <!-- KPI Cards -->
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Revenue Card -->
        <div class="bg-card rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 group">
           <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-green-100 text-green-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">+12.5%</span>
           </div>
           <p class="text-sm text-muted-foreground font-medium uppercase tracking-wide">Tổng doanh thu</p>
           <h3 class="text-3xl font-bold mt-1 tracking-tight text-green-600">{{ formatCurrency(summary.totalRevenue) }}</h3>
        </div>

        <!-- Orders Card -->
        <div class="bg-card rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 group">
           <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Tổng số</span>
           </div>
           <p class="text-sm text-muted-foreground font-medium uppercase tracking-wide">Số lượng đơn hàng</p>
           <h3 class="text-3xl font-bold mt-1 tracking-tight">{{ summary.totalOrders }}</h3>
        </div>

        <!-- AOV Card -->
        <div class="bg-card rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 group">
           <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-full">TB/Đơn</span>
           </div>
           <p class="text-sm text-muted-foreground font-medium uppercase tracking-wide">Giá trị trung bình</p>
           <h3 class="text-3xl font-bold mt-1 tracking-tight">{{ formatCurrency(summary.aov) }}</h3>
        </div>

        <!-- Completion Rate Card -->
        <div class="bg-card rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 group">
           <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <span :class="['text-xs font-bold px-2 py-1 rounded-full', summary.completionRate >= 80 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
                 {{ summary.completionRate }}%
              </span>
           </div>
           <p class="text-sm text-muted-foreground font-medium uppercase tracking-wide">Tỷ lệ hoàn thành</p>
           <h3 class="text-3xl font-bold mt-1 tracking-tight">{{ summary.completionRate }}%</h3>
           <p class="text-xs text-muted-foreground mt-1">{{ summary.cancelledOrders }} đơn đã hủy</p>
        </div>
     </div>

     <!-- Chart Section -->
     <div class="bg-card rounded-2xl border p-6 shadow-sm">
        <h3 class="text-lg font-bold mb-6">Biểu đồ tăng trưởng</h3>
        <!-- Custom CSS Chart Implementation -->
        <div class="relative h-80 flex items-end gap-2 sm:gap-4 px-2">
           <!-- Y-Axis Grid -->
           <div class="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none opacity-10">
              <div v-for="i in 5" :key="i" class="border-t border-foreground w-full"></div>
           </div>

           <div 
             v-for="(item, index) in chartData" 
             :key="index" 
             class="flex-1 relative group h-full flex items-end justify-center"
           >
              <!-- Bar -->
              <div 
                 class="w-full max-w-[40px] bg-blue-600 rounded-t-sm transition-all duration-500 hover:opacity-80 relative min-h-[1px]"
                 :style="{ height: `${calculateHeight(item.revenue)}%` }"
              >
                  <!-- Tooltip -->
                 <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border">
                    <p class="font-bold">{{ item.label }}</p>
                    <p class="text-green-600 font-bold">{{ formatCurrency(item.revenue) }}</p>
                    <p class="text-muted-foreground text-[10px]">{{ item.orders }} đơn hàng</p>
                 </div>
              </div>
              
              <!-- Date Label -->
              <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                 {{ item.label }}
              </div>
           </div>
        </div>
        <br class="mb-4"/>
     </div>

     <!-- Detailed Data Table -->
     <div class="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div class="p-6 border-b">
           <h3 class="text-lg font-bold">Dữ liệu chi tiết</h3>
        </div>
        <div class="overflow-x-auto">
           <table class="w-full">
              <thead class="bg-muted/30">
                 <tr>
                    <th class="text-left p-4 font-medium text-sm">Thời gian</th>
                    <th class="text-right p-4 font-medium text-sm">Doanh thu</th>
                    <th class="text-right p-4 font-medium text-sm">Số đơn hàng</th>
                    <th class="text-right p-4 font-medium text-sm">Đơn hủy</th>
                    <th class="text-right p-4 font-medium text-sm">TB/Đơn (AOV)</th>
                 </tr>
              </thead>
              <tbody>
                 <tr v-for="row in chartData" :key="row.date" class="border-t hover:bg-muted/10 transition-colors">
                    <td class="p-4 text-sm font-medium">{{ row.date }}</td>
                    <td class="p-4 text-sm text-right font-bold text-green-600">{{ formatCurrency(row.revenue) }}</td>
                    <td class="p-4 text-sm text-right">{{ row.orders }}</td>
                    <td class="p-4 text-sm text-right text-red-500">{{ row.cancelled }}</td>
                    <td class="p-4 text-sm text-right">{{ formatCurrency(row.orders > 0 ? row.revenue / row.orders : 0) }}</td>
                 </tr>
                 <tr v-if="chartData.length === 0">
                    <td colspan="5" class="p-8 text-center text-muted-foreground">Không có dữ liệu trong khoảng thời gian này</td>
                 </tr>
              </tbody>
           </table>
        </div>
     </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const API_URL = 'http://localhost:3000/api'

// Helper to get default date range (Last 30 days)
const getDefaultRange = () => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
     start: start.toISOString().split('T')[0],
     end: end.toISOString().split('T')[0]
  }
}

const defaultRange = getDefaultRange()

const filter = ref({
  startDate: defaultRange.start,
  endDate: defaultRange.end,
  type: 'daily'
})

const summary = ref({
  totalRevenue: 0,
  totalOrders: 0,
  aov: 0,
  completionRate: 0,
  cancelledOrders: 0
})

const chartData = ref([])
const loading = ref(false)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
     style: 'currency',
     currency: 'VND',
     maximumFractionDigits: 0
  }).format(value || 0)
}

const calculateHeight = (value) => {
  if (!chartData.value.length) return 0
  const max = Math.max(...chartData.value.map(item => parseFloat(item.revenue) || 0))
  return max > 0 ? (parseFloat(value) / max) * 100 : 0
}

const fetchAnalytics = async () => {
  loading.value = true
  try {
     const query = new URLSearchParams(filter.value).toString()
     const res = await fetch(`${API_URL}/revenue/analytics?${query}`, {
        headers: {
           'Authorization': `Bearer ${authStore.accessToken}`
        }
     })
     const json = await res.json()
     
     if (json.status) {
        summary.value = json.data.summary
        chartData.value = json.data.chartData
        console.log('Chart Data:', chartData.value)
     } else {
        alert(json.message)
     }
  } catch (e) {
     console.error(e)
     alert('Lỗi tải dữ liệu thống kê')
  } finally {
     loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})
</script>
