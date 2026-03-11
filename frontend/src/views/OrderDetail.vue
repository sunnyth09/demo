<template>
  <div class="container max-w-7xl mx-auto px-4 py-8">
    <!-- Back Button -->
    <router-link 
      to="/orders"
      class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
      </svg>
      Quay lại danh sách đơn hàng
    </router-link>

    <div v-if="loading" class="text-center py-12 text-muted-foreground">
      Đang tải...
    </div>

    <div v-else-if="order" class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-card rounded-xl border p-6 mb-6">
        <div class="flex flex-col gap-4">
          <!-- Row thông tin đơn hàng -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl font-bold">
                Đơn hàng #{{ order.order_code ? order.order_code.slice(0, 8).toUpperCase() : order.id }}
              </h1>
              <!-- Copy Button -->
              <button 
                @click="copyOrderCode"
                class="p-1.5 rounded hover:bg-gray-100 text-muted-foreground hover:text-primary transition-colors"
                title="Sao chép mã đơn hàng"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </button>
              <!-- Status Badge -->
              <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <p class="text-muted-foreground text-sm">Đặt ngày {{ formatDate(order.createdAt) }}</p>
          </div>
          
          <!-- Row các nút hành động -->
          <div class="flex flex-wrap gap-3">
            <!-- Mua lại button -->
            <button 
              @click="repurchase"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                <path d="M16 16h5v5"/>
              </svg>
              Mua lại
            </button>
            
            <!-- Liên hệ Shop button -->
            <a 
              href="/contact"
              class="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Liên hệ Shop
            </a>
            
            <!-- Hủy đơn button -->
            <button 
              v-if="order.status === 'pending'"
              @click="openCancelModal"
              :disabled="cancelling"
              class="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg v-if="!cancelling" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
              <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ cancelling ? 'Đang gửi...' : 'Yêu cầu hủy' }}</span>
            </button>
            
            <div v-if="order.status === 'request_cancel'" class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg font-medium flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
               </svg>
               Đang chờ duyệt hủy
            </div>
          </div>
        </div>
      </div>


      <!-- Lịch sử đơn hàng -->
      <div class="bg-card rounded-xl border p-6 mb-6">
        <h2 class="text-lg font-bold mb-6">Trạng thái đơn hàng</h2>
        
        <div v-if="order.status !== 'cancelled'" class="mb-8">
          <div class="relative">
            <!-- Background của thanh tiến hành đơn hàng -->
            <div class="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
            
            <!-- Active Progress Bar -->
            <div 
              class="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500 ease-out"
              :style="{ width: mainProgress + '%' }"
            ></div>

            <!-- Bước tiến hành đơn hàng -->
            <div class="flex justify-between relative">
              <div v-for="(step, index) in mainSteps" :key="index" class="flex flex-col items-center">
                <div 
                  class="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10"
                  :class="getMainStepClass(index)"
                >
                  <!-- Icon for each step -->
                  <!-- Step 1: Đặt hàng - Clipboard -->
                  <svg v-if="index === 0" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                  </svg>
                  <!-- Step 2: Xác nhận - Dollar/Payment -->
                  <svg v-else-if="index === 1" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  <!-- Step 3: Đã giao ĐVVC - Truck -->
                  <svg v-else-if="index === 2" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/>
                    <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/>
                    <circle cx="7" cy="18" r="2"/>
                    <circle cx="17" cy="18" r="2"/>
                  </svg>
                  <!-- Step 4: Đang giao - Package -->
                  <svg v-else-if="index === 3" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/>
                    <path d="M12 22V12"/>
                  </svg>
                  <!-- Step 5: Hoàn thành - Star -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <span class="text-xs font-medium mt-2 text-center max-w-[80px]" :class="index <= mainStepIndex ? 'text-primary' : 'text-muted-foreground'">
                  {{ step.label }}
                </span>
                <span v-if="step.time" class="text-[10px] text-muted-foreground">{{ step.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Đơn hàng đã hủy -->
        <div v-else class="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-xl">✕</div>
            <div>
              <h4 class="font-bold">Đơn hàng đã bị hủy</h4>
              <p class="text-sm opacity-90">{{ formatDateTime(order.cancelled_at) }}</p>
              <p v-if="order.cancel_reason" class="text-sm mt-1 italic">
                 Lý do: "{{ order.cancel_reason }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Chi tiết vận chuyển -->
        <div class="border-t pt-6">
          <h4 class="font-medium mb-4">Chi tiết vận chuyển</h4>
          <div class="space-y-0 max-h-[400px] overflow-y-auto">
            <div v-for="(event, index) in statusHistory" :key="index" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div 
                  class="w-3 h-3 rounded-full shrink-0"
                  :class="index === 0 ? 'bg-primary' : 'bg-gray-300'"
                ></div>
                <div v-if="index < statusHistory.length - 1" class="w-0.5 h-12 bg-gray-200"></div>
              </div>
              <div class="pb-4">
                <p class="text-sm font-medium" :class="index === 0 ? 'text-primary' : 'text-gray-700'">{{ event.label }}</p>
                <p class="text-xs text-muted-foreground">{{ event.time }}</p>
                <p v-if="event.description" class="text-xs text-gray-500 mt-1">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Thông tin giao hàng -->
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-lg font-bold mb-4">Địa chỉ nhận hàng</h2>
          <div class="space-y-2 text-sm">
            <p class="font-medium text-base">{{ order.customer_name }}</p>
            <p class="text-muted-foreground">{{ order.customer_phone }}</p>
            <p class="text-muted-foreground">{{ order.shipping_address }}</p>
            <p v-if="order.note" class="text-yellow-700 bg-yellow-50 px-2 py-1 rounded mt-2">
              Ghi chú: {{ order.note }}
            </p>
          </div>
        </div>

        <!-- Thông tin thanh toán -->
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-lg font-bold mb-4">Thanh toán</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Phương thức:</span>
              <span class="font-medium uppercase">{{ order.payment_method }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Trạng thái:</span>
              <span :class="order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'" class="font-medium">
                {{ order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách sản phẩm trong đơn hàng -->
      <div class="bg-card rounded-xl border p-6 mt-6">
        <h2 class="text-lg font-bold mb-4">Sản phẩm ({{ order.items?.length || 0 }})</h2>
        <div class="space-y-4">
          <router-link 
            v-for="item in order.items" 
            :key="item.id" 
            :to="`/san-pham/${item.product?.slug || item.product_id}`"
            class="flex items-center gap-4 p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
          >
            <div class="w-20 h-20 bg-gray-100 rounded-md shrink-0 overflow-hidden">
              <img v-if="item.product?.thumbnail" :src="item.product.thumbnail" :alt="item.product_name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-3xl">📦</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium group-hover:text-primary transition-colors">{{ item.product_name }}</p>
              <p class="text-sm text-muted-foreground">SL: {{ item.quantity }} × {{ formatCurrency(item.price) }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-primary text-lg">{{ formatCurrency(item.total_price) }}</p>
            </div>
          </router-link>
        </div>

        <!-- tóm tắt đơn hàng -->
        <div class="border-t mt-6 pt-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Tổng tiền hàng</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Phí vận chuyển</span>
            <span :class="shippingFee === 0 ? 'text-green-600' : ''">
              {{ shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee) }}
            </span>
          </div>
          <div v-if="discount > 0" class="flex justify-between text-sm">
            <span class="text-muted-foreground">Giảm giá</span>
            <span class="text-green-600">-{{ formatCurrency(discount) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Thành tiền</span>
            <span class="text-primary text-xl">{{ formatCurrency(order.total_amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">Không tìm thấy đơn hàng</p>
      <router-link to="/orders" class="text-primary hover:underline mt-2 inline-block">Quay lại</router-link>
    </div>

    <!-- Hủy đơn hàng modal -->
    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-card rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button @click="showCancelModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h3 class="text-xl font-bold mb-4">Lý do hủy đơn hàng</h3>
        <p class="text-sm text-muted-foreground mb-4">Vui lòng chọn lý do bạn muốn hủy đơn.</p>

        <div class="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
          <label v-for="(reason, index) in cancelReasons" :key="index" class="flex items-start gap-3 cursor-pointer">
            <input type="radio" :value="reason" v-model="cancelReason" name="cancel_reason" class="mt-1 flex-shrink-0" />
            <span class="text-sm">{{ reason }}</span>
          </label>

          <div v-if="cancelReason === 'Lý do khác'" class="pl-7 mt-2">
            <textarea 
              v-model="otherCancelReason" 
              placeholder="Nhập lý do cụ thể..." 
              class="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button 
            @click="showCancelModal = false" 
            class="px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
          >
            Quay lại
          </button>
          <button 
            @click="submitCancelOrder" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2 transition-colors"
            :disabled="cancelling"
          >
            <svg v-if="cancelling" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>Xác nhận hủy</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { toast } from 'vue-sonner'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const API_URL = import.meta.env.VITE_API_URL
const { confirm } = useConfirmDialog()

const order = ref(null)
const loading = ref(true)
const cancelling = ref(false)
const showCancelModal = ref(false)
const cancelReason = ref('')
const otherCancelReason = ref('')

const cancelReasons = [
  'Muốn thay đổi địa chỉ giao hàng',
  'Muốn thay đổi sản phẩm trong đơn hàng (Màu sắc, số lượng...)',
  'Tìm thấy giá rẻ hơn ở chỗ khác',
  'Thời gian giao hàng quá lâu',
  'Đổi ý, không muốn mua nữa',
  'Lý do khác'
]

// Check if order can be cancelled
const canCancel = computed(() => {
  if (!order.value) return false
  return order.value.status === 'pending'
})

// Payment breakdown
const subtotal = computed(() => {
  if (!order.value?.items) return 0
  return order.value.items.reduce((sum, item) => sum + (item.total_price || 0), 0)
})

const shippingFee = computed(() => {
  if (!order.value) return 0
  return order.value.shipping_fee || 0
})

const discount = computed(() => {
  if (!order.value) return 0
  if (order.value.discount_amount && order.value.discount_amount > 0) {
    return order.value.discount_amount
  }
  
  // Fallback calculation for old orders or missing discount_amount
  const calcTotal = (subtotal.value || 0) + (shippingFee.value || 0)
  const actualTotal = Number(order.value.total_amount) || 0
  
  if (calcTotal > actualTotal) {
    return calcTotal - actualTotal
  }
  
  return 0
})

// Status badge styling
const getStatusBadgeClass = (status) => {
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
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao hàng',
    'completed': 'Hoàn thành'
  }
  return map[status] || status
}

// Copy order code
const copyOrderCode = async () => {
  const code = order.value?.order_code || order.value?.id
  try {
    await navigator.clipboard.writeText(code)
    toast.success('Đã sao chép mã đơn hàng!')
  } catch {
    toast.error('Không thể sao chép')
  }
}

// Main timeline steps (5 steps)
const mainSteps = computed(() => {
  if (!order.value) return []
  const o = order.value
  return [
    { key: 'pending', label: 'Đặt hàng', time: formatTime(o.createdAt) },
    { key: 'confirmed', label: 'Xác nhận', time: formatTime(o.confirmed_at) },
    { key: 'picked_up', label: 'Đã giao ĐVVC', time: formatTime(o.picked_up_at) },
    { key: 'out_for_delivery', label: 'Đang giao', time: formatTime(o.out_for_delivery_at) },
    { key: 'delivered', label: 'Hoàn thành', time: formatTime(o.delivered_at) }
  ]
})

const mainStepIndex = computed(() => {
  if (!order.value) return 0
  const status = order.value.status
  const map = {
    'pending': 0,
    'confirmed': 1,
    'packing': 1,
    'picked_up': 2,
    'in_transit': 2,
    'arrived_hub': 2,
    'out_for_delivery': 3,
    'delivered': 4,
    // Legacy
    'processing': 1,
    'shipped': 3,
    'completed': 4
  }
  return map[status] ?? 0
})

const mainProgress = computed(() => {
  return (mainStepIndex.value / 4) * 100
})

// Vertical timeline - status history
const statusHistory = computed(() => {
  if (!order.value) return []
  const o = order.value
  const history = []
  
  const statusMap = [
    { key: 'delivered', field: 'delivered_at', label: 'Giao hàng thành công', desc: 'Đơn hàng đã được giao đến bạn' },
    { key: 'out_for_delivery', field: 'out_for_delivery_at', label: 'Đang giao hàng', desc: 'Shipper đang trên đường giao đến bạn' },
    { key: 'arrived_hub', field: 'arrived_hub_at', label: 'Đã đến kho', desc: 'Đơn hàng đã đến kho gần địa chỉ của bạn' },
    { key: 'in_transit', field: 'in_transit_at', label: 'Đang vận chuyển', desc: 'Đơn hàng đang trên đường vận chuyển' },
    { key: 'picked_up', field: 'picked_up_at', label: 'Đã giao cho đơn vị vận chuyển', desc: 'Đơn hàng đã được giao cho đơn vị vận chuyển' },
    { key: 'packing', field: 'packing_at', label: 'Đang đóng gói', desc: 'Shop đang chuẩn bị đơn hàng của bạn' },
    { key: 'confirmed', field: 'confirmed_at', label: 'Đã xác nhận', desc: 'Shop đã xác nhận đơn hàng' },
    { key: 'request_cancel', field: 'created_at', label: 'Đang yêu cầu hủy', desc: 'Đang chờ Admin duyệt hủy đơn' },
    { key: 'pending', field: 'createdAt', label: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo' }
  ]

  // Add cancelled if applicable
  if (o.cancelled_at) {
    history.push({
      label: 'Đã hủy đơn hàng',
      time: formatDateTime(o.cancelled_at),
      description: 'Đơn hàng đã bị hủy'
    })
  }

  statusMap.forEach(item => {
    if (o[item.field]) {
      history.push({
        label: item.label,
        time: formatDateTime(o[item.field]),
        description: item.desc
      })
    }
  })

  return history
})

const getMainStepClass = (index) => {
  if (index < mainStepIndex.value) return 'border-primary bg-primary text-white'
  if (index === mainStepIndex.value) return 'border-primary bg-white text-primary ring-4 ring-primary/20'
  return 'border-gray-200 bg-white text-gray-400'
}

const fetchOrder = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/orders/my-orders/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      order.value = json.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openCancelModal = () => {
  cancelReason.value = ''
  otherCancelReason.value = ''
  showCancelModal.value = true
}

const submitCancelOrder = async () => {
  let finalReason = cancelReason.value
  
  if (!finalReason) {
    toast.error('Vui lòng chọn lý do hủy đơn hàng')
    return
  }
  
  if (finalReason === 'Lý do khác') {
    if (!otherCancelReason.value.trim()) {
      toast.error('Vui lòng nhập lý do cụ thể')
      return
    }
    finalReason = otherCancelReason.value.trim()
  }

  showCancelModal.value = false
  cancelling.value = true
  try {
    const res = await fetch(`${API_URL}/orders/my-orders/${order.value.id}/cancel`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cancel_reason: finalReason })
    })
    const json = await res.json()
    if (json.status) {
      await fetchOrder()
      toast.success(json.message || 'Đã hủy đơn hàng')
    } else {
      toast.error(json.message || 'Có lỗi xảy ra')
    }
  } catch (e) {
    toast.error('Có lỗi xảy ra')
  } finally {
    cancelling.value = false
  }
}

const repurchase = () => {
  if (!order.value || !order.value.items) return
  
  order.value.items.forEach(item => {
    const product = {
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      thumbnail: item.product?.thumbnail
    }
    cartStore.addToCart(product, item.quantity)
  })
  
  router.push('/cart')
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0)
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : ''
const formatTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''
const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${d.toLocaleDateString('vi-VN')}`
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    fetchOrder()
  }
})
</script>
