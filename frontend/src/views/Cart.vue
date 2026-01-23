<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Giỏ hàng</h1>

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
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="bg-card rounded-xl border p-4 flex gap-4"
          >
            <div class="w-24 h-24 rounded-lg bg-muted flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold truncate">{{ item.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ item.category }}</p>
              <p class="text-lg font-bold text-primary mt-2">{{ formatCurrency(item.price) }}</p>
            </div>
            <div class="flex flex-col items-end justify-between">
              <button @click="removeItem(item.id)" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
              <div class="flex items-center gap-2">
                <button @click="updateQuantity(item.id, -1)" class="w-8 h-8 rounded border border-input hover:bg-accent transition-colors">-</button>
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, 1)" class="w-8 h-8 rounded border border-input hover:bg-accent transition-colors">+</button>
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
            <router-link to="/checkout" class="block">
              <button :disabled="cartItems.length === 0" class="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                Thanh toán
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cartItems = ref([
  { id: 1, name: 'Đắc Nhân Tâm', category: 'Kỹ năng sống', price: 86000, quantity: 2 },
  { id: 2, name: 'Nhà Giả Kim', category: 'Văn học', price: 69000, quantity: 1 },
  { id: 3, name: 'Atomic Habits', category: 'Kỹ năng sống', price: 139000, quantity: 1 },
])

const couponCode = ref('')
const shippingFee = ref(0)
const discount = ref(20000)

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const total = computed(() => subtotal.value + shippingFee.value - discount.value)

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

const updateQuantity = (id, delta) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta)
  }
}

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}
</script>
