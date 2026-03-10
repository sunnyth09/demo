<template>
  <div class="space-y-6">
     <!-- Thanh công cụ trên cùng -->
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

     <!-- Các thẻ chỉ số (KPI Cards) -->
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Thẻ Doanh thu -->
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

        <!-- Thẻ Số lượng đơn hàng -->
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

        <!-- Thẻ Giá trị trung bình (AOV) -->
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

        <!-- Thẻ Tỷ lệ hoàn thành -->
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

     <!-- Phần Biểu đồ (theo kiểu biểu đồ vùng shadcn-vue) -->
     <div class="bg-card rounded-2xl border pt-0 shadow-sm overflow-hidden">
        <div class="flex items-center gap-2 space-y-0 border-b py-5 px-6 flex-col sm:flex-row">
           <div class="grid flex-1 gap-1">
              <h3 class="text-lg font-bold tracking-tight">Biểu đồ tăng trưởng</h3>
              <div class="flex items-center gap-4 mt-1">
                 <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full" style="background: hsl(221, 83%, 53%)"></span>
                    <span class="text-xs text-muted-foreground">Doanh thu</span>
                 </div>
                 <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full" style="background: hsl(25, 95%, 53%)"></span>
                    <span class="text-xs text-muted-foreground">Đơn hàng</span>
                 </div>
              </div>
           </div>
        </div>
        <div class="px-2 pt-4 sm:px-6 sm:pt-6 pb-4">
           <ChartContainer v-if="chartData.length > 0" :config="analyticsChartConfig" class="aspect-auto h-[300px] w-full">
              <VisXYContainer
                 :data="chartData"
                 :svg-defs="analyticsSvgDefs"
                 :margin="{ left: 5, top: 10 }"
              >
                 <VisArea
                    :x="(d, i) => i"
                    :y="[(d) => d.orders, (d) => d.revenue]"
                    :color="(d, i) => ['url(#fillAnalyticsOrders)', 'url(#fillAnalyticsRevenue)'][i]"
                    :opacity="0.4"
                 />
                 <VisLine
                    :x="(d, i) => i"
                    :y="[(d) => d.orders, (d) => d.revenue]"
                    :color="(d, i) => [analyticsChartConfig.orders.color, analyticsChartConfig.revenue.color][i]"
                    :line-width="1"
                 />
                 <VisAxis
                    type="x"
                    :x="(d, i) => i"
                    :tick-line="false"
                    :domain-line="false"
                    :grid-line="false"
                    :num-ticks="Math.min(chartData.length, 10)"
                    :tick-format="(i) => chartData[Math.round(i)]?.label || ''"
                 />
                 <VisAxis
                    type="y"
                    :num-ticks="3"
                    :tick-line="false"
                    :domain-line="false"
                    :tick-format="() => ''"
                 />
                 <ChartTooltip />
                 <ChartCrosshair
                    :template="analyticsTooltipTemplate"
                    :color="(d, i) => [analyticsChartConfig.orders.color, analyticsChartConfig.revenue.color][i % 2]"
                 />
              </VisXYContainer>
           </ChartContainer>
           <div v-else class="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
              Không có dữ liệu trong khoảng thời gian này
           </div>
        </div>
     </div>

     <!-- Bảng Dữ liệu chi tiết -->
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
import { toast } from 'vue-sonner'
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, ChartLegendContent, componentToString } from '@/components/ui/chart'
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue'

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL

// Hàm hỗ trợ để lấy khoảng thời gian mặc định (30 ngày gần nhất)
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

// Cấu hình Biểu đồ phân tích (theo kiểu shadcn-vue)
const analyticsChartConfig = {
  revenue: {
    label: 'Doanh thu ',
    color: 'hsl(221, 83%, 53%)'
  },
  orders: {
    label: 'Đơn hàng',
    color: 'hsl(25, 95%, 53%)'
  }
}

const analyticsSvgDefs = `
  <linearGradient id="fillAnalyticsRevenue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stop-color="var(--color-revenue)" stop-opacity="0.8" />
    <stop offset="95%" stop-color="var(--color-revenue)" stop-opacity="0.1" />
  </linearGradient>
  <linearGradient id="fillAnalyticsOrders" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stop-color="var(--color-orders)" stop-opacity="0.8" />
    <stop offset="95%" stop-color="var(--color-orders)" stop-opacity="0.1" />
  </linearGradient>
`


const analyticsTooltipTemplate = componentToString(analyticsChartConfig, ChartTooltipContent, {
  labelFormatter: (x) => {
    const idx = Math.round(x)
    if (idx >= 0 && idx < chartData.value.length) {
      return chartData.value[idx]?.label || ''
    }
    return ''
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
     style: 'currency',
     currency: 'VND',
     maximumFractionDigits: 0
  }).format(value || 0)
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
     } else {
        toast.error(json.message)
     }
  } catch (e) {
     console.error(e)
     toast.error('Lỗi tải dữ liệu thống kê')
  } finally {
     loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})
</script>
