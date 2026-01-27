<template>
  <div class="container mx-auto px-4 py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <div class="md:col-span-1">
        <div class="bg-card rounded-xl border p-6 text-center mb-6">
          <div class="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl mx-auto mb-4 font-bold">
            {{ userInitial }}
          </div>
          <h2 class="font-bold text-lg">{{ authStore.user?.name || 'Người dùng' }}</h2>
          <p class="text-sm text-muted-foreground">{{ authStore.user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên' }}</p>
        </div>

        <nav class="bg-card rounded-xl border overflow-hidden">
          <button 
            @click="activeTab = 'profile'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'profile' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Thông tin tài khoản
          </button>
          <button 
            @click="activeTab = 'orders'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'orders' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
            Đơn hàng của tôi
          </button>
          <button 
            @click="activeTab = 'wishlist'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'wishlist' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Sản phẩm yêu thích
          </button>
          <button 
            @click="activeTab = 'address'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'address' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Sổ địa chỉ
          </button>
          <router-link 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2 border-transparent hover:bg-muted/50 text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Quản trị Admin
          </router-link>
          <button 
            @click="handleLogout" 
            class="flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2 border-transparent hover:bg-destructive/10 text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Đăng xuất
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="md:col-span-3 space-y-6">
        <!-- Profile Info -->
        <div v-if="activeTab === 'profile'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Thông tin cá nhân</h2>
            <button @click="openProfileModal" class="text-sm text-primary hover:underline">Chỉnh sửa</button>
          </div>
          <div class="grid sm:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Họ và tên</p>
              <p class="font-medium">{{ authStore.user?.name || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Email</p>
              <p class="font-medium">{{ authStore.user?.email || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Vai trò</p>
              <p class="font-medium">
                <span v-if="authStore.user?.role === 'admin'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                  Quản trị viên
                </span>
                <span v-else class="text-muted-foreground">Thành viên</span>
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Ngày tạo tài khoản</p>
              <p class="font-medium">{{ formatDate(authStore.user?.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div v-if="activeTab === 'profile' || activeTab === 'orders'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">{{ activeTab === 'orders' ? 'Tất cả đơn hàng' : 'Đơn hàng gần đây' }}</h2>
            <a v-if="activeTab === 'profile'" href="#" @click.prevent="activeTab = 'orders'" class="text-sm text-primary hover:underline">Xem tất cả</a>
          </div>
          <div v-if="recentOrders.length > 0" class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id" class="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div class="flex items-center gap-2">
                  <span class="font-mono font-medium">#{{ order.id }}</span>
                  <span class="text-muted-foreground text-sm">• {{ order.date }}</span>
                </div>
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(order.status)]">
                  {{ order.status }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground">{{ order.items }} sản phẩm</p>
                <p class="font-bold text-primary">{{ formatCurrency(order.total) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
            <p class="text-muted-foreground">Bạn chưa có đơn hàng nào</p>
            <router-link to="/" class="inline-block mt-4 text-primary hover:underline">Mua sắm ngay</router-link>
          </div>
        </div>

        <!-- Wishlist -->
        <div v-if="activeTab === 'wishlist'" class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-bold mb-6">Sản phẩm yêu thích</h2>
          <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <p class="text-muted-foreground">Chưa có sản phẩm yêu thích</p>
            <router-link to="/" class="inline-block mt-4 text-primary hover:underline">Khám phá sản phẩm</router-link>
          </div>
        </div>

        <!-- Address Book -->
        <div v-if="activeTab === 'address'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Sổ địa chỉ</h2>
            <button 
              @click="openAddAddressModal"
              class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + Thêm địa chỉ mới
            </button>
          </div>
          <div v-if="addresses.length > 0" class="space-y-4">
             <div v-for="addr in addresses" :key="addr.id" class="border rounded-lg p-4 relative group">
                <div class="flex justify-between items-start">
                   <div>
                      <p class="font-bold text-gray-900">{{ addr.name }} <span class="font-normal text-gray-500 text-sm">| {{ addr.phone }}</span></p>
                      <p class="text-gray-600 mt-1">{{ addr.street }}</p>
                      <p class="text-gray-600">{{ addr.ward }}, {{ addr.district }}, {{ addr.city }}</p>
                      <span v-if="addr.is_default" class="inline-block mt-2 px-2 py-0.5 border border-primary text-primary text-xs rounded">Mặc định</span>
                   </div>
                   <div class="flex gap-2">
                      <button @click="openEditAddressModal(addr)" class="text-primary hover:underline text-sm">Sửa</button>
                      <button @click="deleteAddress(addr.id)" class="text-red-500 hover:underline text-sm">Xóa</button>
                   </div>
                </div>
             </div>
          </div>
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p class="text-muted-foreground">Chưa có địa chỉ nào</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Profile Modal -->
  <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showProfileModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
       <h3 class="text-lg font-bold mb-4">Chỉnh sửa thông tin</h3>
       <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Họ và tên</label>
            <input v-model="profileForm.name" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>
          <!-- <div><label>Phone...</label>...</div> -->
       </div>
       <div class="flex justify-end gap-3 mt-6">
          <button @click="showProfileModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="updateProfile" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Lưu thay đổi</button>
       </div>
    </div>
  </div>

  <!-- Address Modal -->
  <div v-if="showAddressModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAddressModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
       <h3 class="text-lg font-bold mb-4">{{ isEditingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới' }}</h3>
       <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium mb-1">Họ và tên</label>
               <input v-model="addressForm.name" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
             </div>
             <div>
               <label class="block text-sm font-medium mb-1">Số điện thoại</label>
               <input v-model="addressForm.phone" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
             </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tỉnh / Thành phố</label>
            <input v-model="addressForm.city" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium mb-1">Quận / Huyện</label>
               <input v-model="addressForm.district" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
             </div>
             <div>
               <label class="block text-sm font-medium mb-1">Phường / Xã</label>
               <input v-model="addressForm.ward" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
             </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Địa chỉ cụ thể</label>
            <input v-model="addressForm.street" type="text" placeholder="Số nhà, tên đường..." class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>
          <div class="flex items-center gap-2">
             <input v-model="addressForm.is_default" type="checkbox" id="dafaultAddr" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
             <label for="dafaultAddr" class="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
          </div>
       </div>
       <div class="flex justify-end gap-3 mt-6">
          <button @click="showAddressModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="saveAddress" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Lưu địa chỉ</button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const API_URL = 'http://localhost:3000/api'

const activeTab = ref('profile')
const recentOrders = ref([])

// Profile Management
const showProfileModal = ref(false)
const profileForm = reactive({
  name: '',
  phone: '' // Nếu user model có phone
})

const openProfileModal = () => {
  profileForm.name = authStore.user?.name || ''
  showProfileModal.value = true
}

const updateProfile = async () => {
  // Demo update profile - cần backend API update user
  // Tạm thời chỉ cập nhật store
  authStore.user.name = profileForm.name
  showProfileModal.value = false
  // TODO: Call API /api/user/profile
}

// Address Management
const addresses = ref([])
const showAddressModal = ref(false)
const isEditingAddress = ref(false)
const addressForm = reactive({
  id: null,
  name: '',
  phone: '',
  city: '',
  district: '',
  ward: '',
  street: '',
  is_default: false
})

const fetchAddresses = async () => {
  try {
    const res = await fetch(`${API_URL}/addresses`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      addresses.value = json.data
    }
  } catch (error) {
    console.error(error)
  }
}

const openAddAddressModal = () => {
  isEditingAddress.value = false
  Object.assign(addressForm, {
    id: null, name: '', phone: '', city: '', district: '', ward: '', street: '', is_default: false
  })
  showAddressModal.value = true
}

const openEditAddressModal = (addr) => {
  isEditingAddress.value = true
  Object.assign(addressForm, addr)
  showAddressModal.value = true
}

const saveAddress = async () => {
  try {
    const url = isEditingAddress.value 
      ? `${API_URL}/addresses/${addressForm.id}` 
      : `${API_URL}/addresses`
    
    const method = isEditingAddress.value ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(addressForm)
    })
    
    const json = await res.json()
    if (json.status) {
      showAddressModal.value = false
      fetchAddresses()
    } else {
      alert(json.message) // Simple alert for now
    }
  } catch (error) {
    alert('Có lỗi xảy ra')
  }
}

const deleteAddress = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return
  try {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      fetchAddresses()
    }
  } catch (error) {
    console.error(error)
  }
}

// Redirect nếu chưa đăng nhập
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    fetchAddresses()
  }
})

// Lấy chữ cái đầu của tên
const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || 'U'
})

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

const formatDate = (dateStr) => {
  if (!dateStr) return 'Chưa cập nhật'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
  } catch {
    return dateStr
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Đang giao': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
