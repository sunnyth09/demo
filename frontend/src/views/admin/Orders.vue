<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý đơn hàng</h2>
        <p class="text-muted-foreground">Theo dõi và xử lý đơn hàng</p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Tổng đơn hàng</p>
        <p class="text-2xl font-bold mt-1">{{ stats.totalOrders }}</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Chờ xử lý</p>
        <p class="text-2xl font-bold mt-1">{{ stats.pending }}</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Đang đóng gói</p>
        <p class="text-2xl font-bold mt-1">{{ stats.processing }}</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Đang giao</p>
        <p class="text-2xl font-bold mt-1">{{ stats.shipping }}</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Hoàn thành</p>
        <p class="text-2xl font-bold mt-1">{{ stats.completed }}</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Doanh thu</p>
        <p class="text-2xl font-bold mt-1">{{ formatCurrency(stats.totalRevenue) }}</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border">
      <div class="w-full md:w-auto flex items-center gap-2">
         <span class="text-sm font-medium">Trạng thái:</span>
         <select v-model="filterStatus" @change="fetchOrders(1)" class="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="packing">Đang đóng gói</option>
            <option value="picked_up">Đã giao ĐVVC</option>
            <option value="in_transit">Đang vận chuyển</option>
            <option value="arrived_hub">Đã đến kho</option>
            <option value="out_for_delivery">Đang giao hàng</option>
            <option value="delivered">Giao thành công</option>
            <option value="cancelled">Đã hủy</option>
            <option value="request_cancel">Đang yêu cầu hủy</option>
         </select>
      </div>
      <div class="w-full md:w-72 relative">
         <input 
           v-model="searchQuery" 
           @keyup.enter="fetchOrders(1)"
           type="text" 
           placeholder="Tìm tên KH, SĐT hoặc Mã đơn..." 
           class="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
         />
         <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         <button v-if="searchQuery" @click="searchQuery = ''; fetchOrders(1)" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black">✕</button>
      </div>
    </div>

    <div class="bg-card rounded-xl border overflow-hidden overflow-x-auto">
      <div v-if="loading" class="p-8 text-center text-muted-foreground">
        Đang tải dữ liệu...
      </div>
      <table v-else class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-4 font-medium text-sm">Mã đơn</th>
            <th class="text-left p-4 font-medium text-sm">Khách hàng</th>
            <th class="text-left p-4 font-medium text-sm">Tổng tiền</th>
            <th class="text-left p-4 font-medium text-sm">Trạng thái</th>
            <th class="text-left p-4 font-medium text-sm">Ngày đặt</th>
            <th class="text-right p-4 font-medium text-sm">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-t border-border hover:bg-muted/50 transition-colors">
            <td class="p-4 font-mono text-sm" :title="order.order_code">#{{ order.order_code ? order.order_code.slice(0, 8).toUpperCase() : order.id }}</td>
            <td class="p-4 text-sm">{{ order.customer_name }}</td>
            <td class="p-4 text-sm font-medium">{{ formatCurrency(order.total_amount) }}</td>
            <td class="p-4">
               <span :class="['px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap', getStatusClass(order.status)]">
                 {{ getStatusLabel(order.status) }}
               </span>
            </td>
            <td class="p-4 text-sm text-muted-foreground">{{ formatDate(order.createdAt) }}</td>
            <td class="p-4 text-right">
              <router-link :to="`/admin/orders/${order.id}`" class="text-sm text-primary hover:underline">Chi tiết</router-link>
            </td>
          </tr>
          <tr v-if="orders.length === 0" class="border-t border-border">
             <td colspan="6" class="p-8 text-center text-muted-foreground">Không tìm thấy đơn hàng phù hợp</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="p-4 border-t flex items-center justify-center gap-2">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <span class="text-sm font-medium px-2">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>
  </div>

  <!-- Order Detail Modal -->
  <div v-if="showOrderModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showOrderModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 m-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
           <h3 class="text-xl font-bold">Chi tiết đơn hàng #{{ selectedOrder?.order_code ? selectedOrder?.order_code.slice(0, 8).toUpperCase() : selectedOrder?.id }}</h3>
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
              {{ selectedOrder?.status === 'pending' ? 'Chờ xử lý' : selectedOrder?.status }}
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
                     <img v-if="item.product?.thumbnail" :src="item.product.thumbnail" :alt="item.product_name" class="w-full h-full object-cover" />
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
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const orders = ref([])
const stats = ref({ pending: 0, processing: 0, shipping: 0, completed: 0, totalRevenue: 0, totalOrders: 0 })
const showOrderModal = ref(false)
const selectedOrder = ref(null)
const loading = ref(false)

// Pagination and Filters
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10
const searchQuery = ref('')
const filterStatus = ref('')

const API_URL = import.meta.env.VITE_API_URL

const fetchOrders = async (page = 1) => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/orders/admin?page=${page}&limit=${limit}&search=${searchQuery.value}&status=${filterStatus.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    const json = await res.json()
    if (json.status) {
      orders.value = json.data
      
      // Handle pagination logic if backend provides it
      if (json.pagination) {
        currentPage.value = json.pagination.page
        totalPages.value = json.pagination.totalPages
      }
    } else {
      toast.error(json.message || 'Lỗi tải danh sách đơn hàng')
    }
  } catch (e) {
    console.error(e)
    toast.error('Lỗi kết nối khi tải đơn hàng')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchOrders(page)
  }
}

const fetchStats = async () => {
  try {
    const res = await fetch(`${API_URL}/orders/admin/stats`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      stats.value = json.data.counts
    }
  } catch (e) {
    console.error(e)
  }
}

const openOrderModal = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const getStatusClass = (status) => {
  const map = {
    'pending': 'bg-gray-100 text-gray-700',
    'confirmed': 'bg-blue-100 text-blue-700',
    'packing': 'bg-yellow-100 text-yellow-700',
    'picked_up': 'bg-orange-100 text-orange-700',
    'in_transit': 'bg-indigo-100 text-indigo-700',
    'arrived_hub': 'bg-purple-100 text-purple-700',
    'out_for_delivery': 'bg-cyan-100 text-cyan-700',
    'delivered': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700',
    'request_cancel': 'bg-orange-100 text-orange-700',
    // Legacy status support
    'processing': 'bg-yellow-100 text-yellow-700',
    'shipped': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const map = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'packing': 'Đang đóng gói',
    'picked_up': 'Đã giao ĐVVC',
    'in_transit': 'Đang vận chuyển',
    'arrived_hub': 'Đã đến kho',
    'out_for_delivery': 'Đang giao hàng',
    'delivered': 'Giao thành công',
    'cancelled': 'Đã hủy',
    'request_cancel': 'Đang yêu cầu hủy',
    // Legacy status support
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao hàng',
    'completed': 'Hoàn thành'
  }
  return map[status] || status
}

const updateStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    const json = await res.json()
    if (json.status) {
      fetchOrders(currentPage.value) // Refresh list at current page
      fetchStats()  // Refresh stats
      toast.success('Cập nhật trạng thái thành công')
    } else {
      toast.error(json.message)
    }
  } catch (e) {
    toast.error('Có lỗi xảy ra')
  }
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0)
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN')

onMounted(() => {
  fetchOrders()
  fetchStats()
})
</script>
