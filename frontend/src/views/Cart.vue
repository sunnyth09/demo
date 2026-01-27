<template>
  <div class="container mx-auto px-4 py-12">
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
            class="bg-card rounded-xl border p-4 flex gap-4 items-center"
          >
            <!-- Checkbox -->
            <input 
               type="checkbox" 
               :checked="item.selected !== false"
               @change="toggleSelection(item.id)"
               class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
             />
            
            <div class="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden border">
               <img :src="item.thumbnail || 'https://via.placeholder.com/100'" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold truncate">{{ item.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ item.category }}</p>
              <p class="text-lg font-bold text-primary mt-2">{{ formatCurrency(item.price) }}</p>
            </div>
            <div class="flex flex-col items-end justify-between self-stretch">
              <button @click="removeItem(item.id)" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
              <div class="flex items-center gap-1">
                <button @click="updateQuantity(item.id, -1)" class="w-6 h-6 text-sm rounded border border-input hover:bg-accent transition-colors">-</button>
                <span class="w-6 text-center text-sm font-medium">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, 1)" class="w-6 h-6 text-sm rounded border border-input hover:bg-accent transition-colors">+</button>
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
          <div class="flex justify-between">
            <span class="text-muted-foreground">Phí vận chuyển</span>
            <span>{{ shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee) }}</span>
          </div>
          <div class="flex justify-between">
             <span class="text-muted-foreground">Giảm giá</span>
             <span class="text-green-600">-{{ formatCurrency(discount) }}</span>
          </div>
          <div class="border-t border-border pt-3 flex justify-between font-semibold text-lg">
             <span>Tổng cộng</span>
             <span class="text-primary">{{ formatCurrency(total) }}</span>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <div class="flex gap-2">
            <input type="text" v-model="couponCode" placeholder="Mã giảm giá" class="flex-1 h-10 px-4 rounded-md border border-input bg-background" />
            <button class="h-10 px-4 rounded-md border border-input hover:bg-accent transition-colors">Áp dụng</button>
          </div>
          <button 
            @click="goToCheckout"
            :disabled="subtotal === 0" 
            class="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thanh toán
          </button>
        </div>
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

const router = useRouter()
const cartStore = useCartStore()
const { items: cartItems, subtotal } = storeToRefs(cartStore)

const couponCode = ref('')
const shippingFee = ref(0)
const discount = ref(0) // Tạm thời để 0

const total = computed(() => subtotal.value + shippingFee.value - discount.value)

const isAllSelected = computed(() => {
return cartItems.value.length > 0 && cartItems.value.every(item => item.selected !== false)
})

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

const updateQuantity = (id, delta) => {
cartStore.updateQuantity(id, delta)
}

const removeItem = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    cartStore.removeItem(id)
  }
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
