<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Thanh toán</h1>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Shipping Info -->
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
            Thông tin giao hàng
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Họ và tên</label>
              <input type="text" v-model="form.name" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nguyễn Văn A" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Số điện thoại</label>
              <input type="tel" v-model="form.phone" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="0901234567" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Email</label>
              <input type="email" v-model="form.email" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="email@example.com" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Địa chỉ</label>
              <input type="text" v-model="form.address" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Số nhà, tên đường, phường/xã" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Tỉnh / Thành phố</label>
              <select v-model="form.city" class="w-full h-10 px-4 rounded-md border border-input bg-background">
                <option value="">Chọn Tỉnh/Thành</option>
                <option value="HCM">TP. Hồ Chí Minh</option>
                <option value="HN">Hà Nội</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Quận / Huyện</label>
              <select v-model="form.district" class="w-full h-10 px-4 rounded-md border border-input bg-background">
                <option value="">Chọn Quận/Huyện</option>
                <option value="1">Quận 1</option>
                <option value="2">Quận 3</option>
              </select>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Ghi chú</label>
              <textarea v-model="form.note" class="w-full h-24 p-4 rounded-md border border-input bg-background resize-none" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
            Phương thức thanh toán
          </h2>
          <div class="space-y-4">
            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors" :class="form.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="cod" class="w-4 h-4 text-primary" />
              <span class="text-2xl">💵</span>
              <div class="flex-1">
                <p class="font-medium">Thanh toán khi nhận hàng (COD)</p>
                <p class="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</p>
              </div>
            </label>
            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors" :class="form.paymentMethod === 'banking' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="banking" class="w-4 h-4 text-primary" />
              <span class="text-2xl">🏦</span>
              <div class="flex-1">
                <p class="font-medium">Chuyển khoản ngân hàng</p>
                <p class="text-sm text-muted-foreground">Chuyển khoản qua Internet Banking / QR Code</p>
              </div>
            </label>
            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors" :class="form.paymentMethod === 'momo' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="momo" class="w-4 h-4 text-primary" />
              <span class="text-2xl">👛</span>
              <div class="flex-1">
                <p class="font-medium">Ví MoMo</p>
                <p class="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-card rounded-xl border p-6 sticky top-24">
          <h3 class="font-semibold text-lg mb-4">Đơn hàng của bạn</h3>
          
          <!-- Items Preview -->
          <div class="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-3">
              <div class="w-16 h-20 rounded bg-muted flex-shrink-0 relative">
                <span class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium line-clamp-2">{{ item.name }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ formatCurrency(item.price) }}</p>
              </div>
              <p class="text-sm font-medium">{{ formatCurrency(item.price * item.quantity) }}</p>
            </div>
          </div>

          <div class="space-y-3 text-sm border-t border-border pt-4">
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

          <button @click="handleCheckout" class="w-full mt-6 h-12 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Đặt hàng ({{ formatCurrency(total) }})
          </button>

          <p class="text-xs text-center text-muted-foreground mt-4">
            Bằng việc đặt hàng, bạn đồng ý với <a href="#" class="underline hover:text-foreground">Điều khoản dịch vụ</a> của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  note: '',
  paymentMethod: 'cod'
})

const cartItems = ref([
  { id: 1, name: 'Đắc Nhân Tâm', category: 'Kỹ năng sống', price: 86000, quantity: 2 },
  { id: 2, name: 'Nhà Giả Kim', category: 'Văn học', price: 69000, quantity: 1 },
  { id: 3, name: 'Atomic Habits', category: 'Kỹ năng sống', price: 139000, quantity: 1 },
])

const shippingFee = ref(0)
const discount = ref(20000)

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const total = computed(() => subtotal.value + shippingFee.value - discount.value)

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

const handleCheckout = () => {
  // Validate form
  if (!form.value.name || !form.value.phone || !form.value.address) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng')
    return
  }
  
  // Process checkout
  console.log('Checkout Order:', { ...form.value, items: cartItems.value, total: total.value })
  alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
  router.push('/')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
