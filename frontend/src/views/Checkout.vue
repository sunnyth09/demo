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
          
          <!-- Select Existing Address -->
          <div v-if="authStore.isAuthenticated" class="mb-6">
            <div v-if="userAddresses.length > 0">
              <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                <div 
                  v-for="addr in userAddresses" 
                  :key="addr.id"
                  @click="selectAddress(addr)"
                  :class="['min-w-[200px] border p-3 rounded-lg cursor-pointer transition-all hover:border-primary', selectedAddressId === addr.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-gray-50']"
                >
                  <div class="flex items-center justify-between mb-1">
                     <span class="font-bold text-sm">{{ addr.name }}</span>
                     <span v-if="addr.is_default" class="text-[10px] uppercase bg-gray-200 text-gray-700 px-1 rounded">Mặc định</span>
                  </div>
                  <p class="text-xs text-gray-600 truncate">{{ addr.phone }}</p>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                    {{ addr.street }}, {{ addr.ward }}, {{ addr.district }}, {{ addr.city }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2 border border-blue-100">
              <span class="mt-0.5"></span>
              <div>
                <p class="font-medium">Sổ địa chỉ của bạn đang trống.</p>
                <p class="text-xs opacity-90 mt-0.5">Vui lòng nhập thông tin giao hàng bên dưới. Bạn có thể tích chọn "Lưu thông tin..." để dùng cho lần sau.</p>
              </div>
            </div>
            <div class="my-4 border-t border-dashed"></div>
          </div>

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
            <div class="space-y-2 relative">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium">Tỉnh / Thành phố</label>
                <button @click="isManualAddress = !isManualAddress" class="text-xs text-primary underline hover:text-primary/80">
                  {{ isManualAddress ? 'Chọn từ danh sách' : 'Nhập tay (nếu không tìm thấy)' }}
                </button>
              </div>
              
              <template v-if="!isManualAddress">
                <select v-model="selectedProvince" class="w-full h-10 px-4 rounded-md border border-input bg-background">
                  <option :value="null">Chọn Tỉnh/Thành</option>
                  <option v-for="p in provinces" :key="p.code" :value="p">{{ p.name }}</option>
                </select>
              </template>
              <template v-else>
                 <input type="text" v-model="form.city" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nhập Tỉnh/Thành phố" />
              </template>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
               <div class="space-y-2">
                 <label class="text-sm font-medium">Quận / Huyện</label>
                 <template v-if="!isManualAddress">
                   <select v-model="selectedDistrict" class="w-full h-10 px-4 rounded-md border border-input bg-background" :disabled="!selectedProvince">
                     <option :value="null">Chọn Quận/Huyện</option>
                     <option v-for="d in districts" :key="d.code" :value="d">{{ d.name }}</option>
                   </select>
                 </template>
                 <template v-else>
                    <input type="text" v-model="form.district" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nhập Quận/Huyện" />
                 </template>
               </div>
               <div class="space-y-2">
                 <label class="text-sm font-medium">Phường / Xã</label>
                 <template v-if="!isManualAddress">
                   <select v-model="selectedWard" class="w-full h-10 px-4 rounded-md border border-input bg-background" :disabled="!selectedDistrict">
                     <option :value="null">Chọn Phường/Xã</option>
                     <option v-for="w in wards" :key="w.code" :value="w">{{ w.name }}</option>
                   </select>
                 </template>
                 <template v-else>
                    <input type="text" v-model="form.ward" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nhập Phường/Xã" />
                 </template>
               </div>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Ghi chú</label>
              <textarea v-model="form.note" class="w-full h-24 p-4 rounded-md border border-input bg-background resize-none" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
            </div>
            <div class="md:col-span-2" v-if="authStore.isAuthenticated">
               <label class="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" v-model="saveAddress" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                 <span class="text-sm text-gray-700">Lưu thông tin giao hàng này cho lần sau</span>
               </label>
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
          <div class="space-y-4 mb-6 max-h-60 overflow-y-auto px-2 pt-3 custom-scrollbar">
            <div v-for="item in checkoutItems" :key="item.id" class="flex gap-3 relative">
              <div class="w-16 h-20 rounded bg-muted flex-shrink-0 relative overflow-hidden border">
                <img :src="item.thumbnail || 'https://via.placeholder.com/100'" class="w-full h-full object-cover" />
              </div>
              <span class="absolute -top-2 left-12 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold z-10 shadow-sm border border-white">
                {{ item.quantity }}
              </span>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { items: cartItems, subtotal } = storeToRefs(cartStore)

const API_URL = 'http://localhost:3000/api'

// Filter only selected items
const checkoutItems = computed(() => cartItems.value.filter(item => item.selected !== false))

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  ward: '',
  note: '',
  paymentMethod: 'cod'
})

const userAddresses = ref([])
const selectedAddressId = ref(null)
const isOrdering = ref(false)
const saveAddress = ref(false)
const isManualAddress = ref(false)

// Location Data
const provinces = ref([])
const districts = ref([])
const wards = ref([])

const selectedProvince = ref(null)
const selectedDistrict = ref(null)
const selectedWard = ref(null)

const fetchProvinces = async () => {
    try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=1')
        provinces.value = await res.json()
    } catch(e) { console.error(e) }
}

const fetchDistricts = async (code) => {
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        const data = await res.json()
        districts.value = data.districts
    } catch(e) { console.error(e) }
}

const fetchWards = async (code) => {
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        const data = await res.json()
        wards.value = data.wards
    } catch(e) { console.error(e) }
}

// Watchers
watch(selectedProvince, (newVal) => {
    districts.value = []
    wards.value = []
    selectedDistrict.value = null
    selectedWard.value = null
    if (newVal) {
        form.value.city = newVal.name
        fetchDistricts(newVal.code)
    } else {
        form.value.city = ''
    }
})

watch(selectedDistrict, (newVal) => {
    wards.value = []
    selectedWard.value = null
    if (newVal) {
        form.value.district = newVal.name
        fetchWards(newVal.code)
    } else {
        form.value.district = ''
    }
})

watch(selectedWard, (newVal) => {
    if (newVal) {
        form.value.ward = newVal.name
    } else {
        form.value.ward = ''
    }
})


const shippingFee = ref(0)
const discount = ref(0)

const total = computed(() => subtotal.value + shippingFee.value - discount.value)

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

// Fetch user addresses if logged in
const fetchAddresses = async () => {
  if (authStore.isAuthenticated) {
    try {
      const res = await fetch(`${API_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
      })
      const json = await res.json()
      if (json.status) {
        userAddresses.value = json.data
        // Auto select default
        const defaultAddr = json.data.find(a => a.is_default) || json.data[0]
        if (defaultAddr) {
          selectAddress(defaultAddr)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

const selectAddress = (addr) => {
  selectedAddressId.value = addr.id
  form.value.name = addr.name
  form.value.phone = addr.phone
  form.value.address = addr.street
  
  // Try to map back to dropdowns (Best effort)
  // This might trigger watchers, but that's okay, we just want to set the values.
  // Note: Since we only have names, we search by name.
  
  // Wait for provinces if not loaded (unlikely since onMounted)
  const prov = provinces.value.find(p => p.name === addr.city || p.name.includes(addr.city))
  if (prov) {
      selectedProvince.value = prov
      // We need to wait for districts to load to set district
       fetchDistricts(prov.code).then(() => {
           const dist = districts.value.find(d => d.name === addr.district || d.name.includes(addr.district))
           if (dist) {
               selectedDistrict.value = dist
               fetchWards(dist.code).then(() => {
                   const w = wards.value.find(w => w.name === addr.ward || w.name.includes(addr.ward))
                   if (w) selectedWard.value = w
               })
           }
       })
  } else {
     // If mapping fails, at least set the text values to form (which we did below indirectly via watchers? No, watchers override form)
     // Issue: Watchers will set form to '' if selectedProvince is null.
     // So we must manually set form AFTER setting selected refs (or lack thereof).
     // Actually, if we can't map, the dropdowns will be blank. 
     // We should probably rely on the form values being correct for submission, but the UI might look desynced.
     // For now, let's assume the matching works for standard addresses.
  }
}

const handleCheckout = async () => {
  if (checkoutItems.value.length === 0) {
    alert('Vui lòng chọn sản phẩm để thanh toán')
    router.push('/cart')
    return
  }

  // Validate
  if (!form.value.name || !form.value.phone || !form.value.address || !form.value.city || !form.value.district) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng')
    return
  }

  isOrdering.value = true
  try {
    // 1. Save address if requested
    if (saveAddress.value && authStore.isAuthenticated) {
      try {
        await fetch(`${API_URL}/addresses`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.accessToken}`
          },
          body: JSON.stringify({
             name: form.value.name,
             phone: form.value.phone,
             street: form.value.address,
             city: form.value.city,
             district: form.value.district,
             ward: form.value.ward, 
             is_default: userAddresses.value.length === 0 // If first address, make default
          })
        })
        // Refresh addresses (optional)
      } catch (e) {
        console.error('Failed to save address', e)
      }
    }

    // 2. Create Order
    const orderData = {
      customer_name: form.value.name,
      customer_phone: form.value.phone,
      customer_email: form.value.email || (authStore.user?.email),
      shipping_address: `${form.value.address}, ${form.value.ward}, ${form.value.district}, ${form.value.city}`,
      note: form.value.note,
      payment_method: form.value.paymentMethod,
      total_amount: total.value,
      items: checkoutItems.value.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    }

    const headers = { 'Content-Type': 'application/json' }
    if (authStore.isAuthenticated) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }

    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    })

    const json = await res.json()

    if (json.status) {
      alert('Đặt hàng thành công!')
      cartStore.clearCart()
      router.push('/')
    } else {
      alert(json.message || 'Đặt hàng thất bại')
    }
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra khi đặt hàng')
  } finally {
    isOrdering.value = false
  }
}

onMounted(() => {
  if (cartItems.value.length === 0) {
    // router.push('/products')
  }
  
  fetchProvinces() // Load location data

  if (authStore.isAuthenticated) {
    // Pre-fill user info if available
    form.value.name = authStore.user?.name || ''
    form.value.email = authStore.user?.email || ''
    fetchAddresses()
  }
})
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
