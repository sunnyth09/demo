<template>
  <div class="container max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-xl font-bold mb-8">Giỏ hàng</h1>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-if="cartItems.length === 0" class="bg-card rounded-xl border p-12 text-center">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
          <p class="text-muted-foreground mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <router-link to="/products">
            <button class="h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium">
              Tiếp tục mua sắm
            </button>
          </router-link>
        </div>

        <div v-else>
          <!-- Select All Header -->
          <div class="bg-card rounded-xl border p-4 mb-4 flex items-center gap-4">
             <input 
               type="checkbox" 
               :checked="isAllSelected"
               @change="toggleAll($event.target.checked)"
               class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
             />
             <span class="font-medium text-sm">Chọn tất cả ({{ cartItems.length }} sản phẩm)</span>
          </div>

          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="bg-card rounded-xl border p-3 flex gap-3 items-start transition-all duration-300"
            :class="{ 
               'border-border': !item.stock || item.quantity <= item.stock,
               'border-red-500 bg-red-50/10': item.stock && item.quantity > item.stock 
            }"
          >
            <!-- Checkbox (Centered vertically relative to image approx) -->
            <div class="flex-shrink-0 pt-10 sm:pt-0 sm:self-center">
               <input 
                 type="checkbox" 
                 :checked="item.selected !== false"
                 @change="toggleSelection(item.id)"
                 class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
               />
            </div>
            
            <!-- Image (Portrait aspect) -->
            <div class="w-24 h-32 sm:w-28 sm:h-36 rounded-md border bg-muted flex-shrink-0 overflow-hidden relative">
               <img :src="item.thumbnail || 'https://via.placeholder.com/100'" class="w-full h-full object-cover" />
            </div>

            <!-- Content Column -->
            <div class="flex-1 min-w-0 flex flex-col justify-between min-h-[128px] sm:min-h-[144px]">
              <!-- Top Info -->
              <div>
                <div class="flex justify-between items-start gap-2">
                   <h3 class="font-medium text-sm sm:text-base line-clamp-2 text-foreground leading-snug">{{ item.name }}</h3>
                </div>
                <!-- Category/Author if needed -->
                <p class="text-xs text-muted-foreground mt-1">{{ item.category || 'Sách' }}</p>
                
                <!-- Price -->
                <div class="flex flex-wrap items-baseline gap-2 mt-2">
                   <p class="text-base sm:text-lg font-bold text-primary">{{ formatCurrency(item.price) }}</p>
                   <p v-if="item.original_price" class="text-xs text-muted-foreground line-through decoration-gray-400">
                     {{ formatCurrency(item.original_price) }}
                   </p>
                </div>
              </div>

              <!-- Bottom Actions (Qty & Delete) -->
              <div class="flex items-center justify-between mt-3">
                 <!-- Quantity Control -->
                 <div class="flex items-center border border-gray-200 rounded-lg bg-background">
                    <button 
                      @click="updateQuantity(item.id, -1)" 
                      class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 rounded-l-lg"
                      :disabled="item.quantity <= 1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    <div class="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200 bg-gray-50/50">
                      {{ item.quantity }}
                    </div>
                    <button 
                      @click="item.quantity < (item.stock || 9999) && updateQuantity(item.id, 1)" 
                      class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="item.quantity >= (item.stock || 9999)"
                      :title="item.stock ? `Còn ${item.stock} sản phẩm` : ''"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                 </div>

                 <!-- Delete Button -->
                 <button 
                  @click="removeItem(item)" 
                  class="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                  title="Xóa sản phẩm"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
      <div class="bg-card rounded-xl border p-6 sticky top-24">
        <h3 class="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Tạm tính</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>
          <!--
          <div v-if="discount > 0" class="flex justify-between">
             <span class="text-muted-foreground">Giảm giá</span>
             <span class="text-green-600">-{{ formatCurrency(discount) }}</span>
          </div>
          -->
          <div class="border-t border-border pt-3 flex justify-between font-semibold text-lg">
             <span>Tổng cộng</span>
             <span class="text-primary">{{ formatCurrency(total) }}</span>
          </div>
          <p class="text-xs text-muted-foreground italic text-right mt-1">
            * Phí vận chuyển sẽ được tính tại trang thanh toán
          </p>
        </div>

          <!-- Warning for invalid items -->
          <div v-if="hasInvalidItems" class="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
             <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
             <span class="text-xs text-red-600 font-medium">Một số sản phẩm vượt quá số lượng tồn kho. Vui lòng điều chỉnh trước khi thanh toán.</span>
          </div>

          <button 
            @click="goToCheckout"
            :disabled="subtotal === 0 || hasInvalidItems" 
            class="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thanh toán
          </button>

      </div>
    </div>
    </div>
  </div>


</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const router = useRouter()
const cartStore = useCartStore()
const { items: cartItems, subtotal } = storeToRefs(cartStore)
const { confirm } = useConfirmDialog()

const couponCode = ref('')
const shippingFee = ref(0)
const discount = ref(0) // Tạm thời để 0

// Total in cart only includes subtotal - discount (shipping added at checkout)
const total = computed(() => subtotal.value - discount.value)

const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.selected !== false)
})

const hasInvalidItems = computed(() => {
  return cartItems.value.some(item => item.stock !== undefined && item.quantity > item.stock)
})

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

const updateQuantity = async (id, delta) => {
const success = await cartStore.updateQuantity(id, delta)
if (!success) {
  toast.error('Không thể cập nhật số lượng (đã đạt giới hạn tồn kho hoặc lỗi)')
}
}

const removeItem = async (item) => {
  const ok = await confirm('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?', { actionLabel: 'Xóa', actionClass: 'bg-red-100 text-red-600 hover:bg-red-200' })
  if (ok) cartStore.removeItem(item.id)
}

const toggleSelection = (id) => {
cartStore.toggleSelection(id)
}

const toggleAll = (checked) => {
cartStore.toggleAll(checked)
}

const goToCheckout = () => {
if (subtotal.value > 0) {
  router.push('/checkout')
}
}
</script>
