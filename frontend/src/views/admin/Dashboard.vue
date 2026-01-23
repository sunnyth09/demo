<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        class="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">{{ stat.title }}</p>
            <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
            <p :class="['text-xs mt-1', stat.changeType === 'up' ? 'text-green-500' : 'text-red-500']">
              {{ stat.change }} so với tháng trước
            </p>
          </div>
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', stat.bgColor]">
            {{ stat.icon }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 bg-card rounded-xl border p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold">Doanh thu</h3>
          <select class="h-9 px-3 rounded-md border border-input bg-background text-sm">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>90 ngày qua</option>
          </select>
        </div>
        <div class="h-64 flex items-end gap-2">
          <div 
            v-for="(value, index) in revenueData" 
            :key="index"
            class="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-md relative group"
            :style="{ height: `${value}%` }"
          >
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ formatCurrency(value * 1000000) }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>T2</span>
          <span>T3</span>
          <span>T4</span>
          <span>T5</span>
          <span>T6</span>
          <span>T7</span>
          <span>CN</span>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-card rounded-xl border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Đơn hàng gần đây</h3>
          <router-link to="/admin/orders" class="text-sm text-primary hover:underline">
            Xem tất cả
          </router-link>
        </div>
        <div class="space-y-4">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            class="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              {{ order.customer.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ order.customer }}</p>
              <p class="text-xs text-muted-foreground">{{ order.items }} sản phẩm</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium">{{ formatCurrency(order.total) }}</p>
              <span :class="['text-xs px-2 py-0.5 rounded-full', getStatusClass(order.status)]">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Products -->
      <div class="bg-card rounded-xl border p-6">
        <h3 class="font-semibold mb-4">Sản phẩm bán chạy</h3>
        <div class="space-y-4">
          <div 
            v-for="(product, index) in topProducts" 
            :key="product.id"
            class="flex items-center gap-4"
          >
            <span class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
              {{ index + 1 }}
            </span>
            <div class="w-12 h-12 rounded-lg bg-muted"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ product.name }}</p>
              <p class="text-xs text-muted-foreground">{{ product.sold }} đã bán</p>
            </div>
            <p class="text-sm font-medium">{{ formatCurrency(product.revenue) }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-card rounded-xl border p-6">
        <h3 class="font-semibold mb-4">Hoạt động gần đây</h3>
        <div class="space-y-4">
          <div 
            v-for="activity in activities" 
            :key="activity.id"
            class="flex gap-4"
          >
            <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <div class="flex-1">
              <p class="text-sm">{{ activity.message }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { 
    title: 'Tổng doanh thu', 
    value: '125.5M', 
    change: '+12.5%', 
    changeType: 'up',
    icon: '💰', 
    bgColor: 'bg-green-100 dark:bg-green-900/30' 
  },
  { 
    title: 'Đơn hàng', 
    value: '1,234', 
    change: '+8.2%', 
    changeType: 'up',
    icon: '📦', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30' 
  },
  { 
    title: 'Khách hàng mới', 
    value: '456', 
    change: '+15.3%', 
    changeType: 'up',
    icon: '👥', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/30' 
  },
  { 
    title: 'Sản phẩm', 
    value: '892', 
    change: '-2.1%', 
    changeType: 'down',
    icon: '📚', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/30' 
  },
]

const revenueData = [65, 78, 52, 88, 95, 72, 85]

const recentOrders = [
  { id: 1, customer: 'Nguyễn Văn A', items: 3, total: 450000, status: 'Hoàn thành' },
  { id: 2, customer: 'Trần Thị B', items: 1, total: 189000, status: 'Đang giao' },
  { id: 3, customer: 'Lê Văn C', items: 5, total: 750000, status: 'Chờ xử lý' },
  { id: 4, customer: 'Phạm Thị D', items: 2, total: 320000, status: 'Hoàn thành' },
]

const topProducts = [
  { id: 1, name: 'Đắc Nhân Tâm', sold: 234, revenue: 20124000 },
  { id: 2, name: 'Nhà Giả Kim', sold: 189, revenue: 13041000 },
  { id: 3, name: 'Sapiens', sold: 156, revenue: 29484000 },
  { id: 4, name: 'Atomic Habits', sold: 143, revenue: 19877000 },
]

const activities = [
  { id: 1, message: 'Đơn hàng #1234 đã được giao thành công', time: '5 phút trước' },
  { id: 2, message: 'Khách hàng mới đăng ký: Nguyễn Văn E', time: '15 phút trước' },
  { id: 3, message: 'Sản phẩm "Clean Code" đã hết hàng', time: '1 giờ trước' },
  { id: 4, message: 'Đơn hàng #1233 đã được thanh toán', time: '2 giờ trước' },
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Đang giao': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Chờ xử lý': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>
