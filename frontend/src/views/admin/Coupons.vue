<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Quản lý Mã giảm giá</h1>
      <button 
        @click="openCreateModal"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Thêm mã mới
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b">
      <button 
        @click="activeTab = 'list'" 
        :class="['px-4 py-2 font-medium transition-colors', activeTab === 'list' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700']"
      >
        Danh sách mã
      </button>
      <button 
        @click="activeTab = 'stats'" 
        :class="['px-4 py-2 font-medium transition-colors', activeTab === 'stats' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700']"
      >
        Thống kê hiệu quả
      </button>
    </div>

    <!-- Table -->
    <div v-show="activeTab === 'list'" class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
      
      <table v-else class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-500 font-medium border-b">
          <tr>
            <th class="px-6 py-4">Mã Voucher</th>
            <th class="px-6 py-4">Loại & Giá trị</th>
            <th class="px-6 py-4">Đơn tối thiểu</th>
            <th class="px-6 py-4">Số lượng</th>
            <th class="px-6 py-4">Thời gian</th>
            <th class="px-6 py-4">Trạng thái</th>
            <th class="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">
               <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded border font-mono">{{ coupon.code }}</span>
               <div class="text-xs text-gray-500 mt-1">{{ coupon.description }}</div>
            </td>
            <td class="px-6 py-4">
               <div class="font-medium text-green-600">
                  <span v-if="coupon.type === 'fixed'">-{{ formatCurrency(coupon.value) }}</span>
                  <span v-else-if="coupon.type === 'percentage'">-{{ coupon.value }}%</span>
                  <span v-else>Miễn phí vận chuyển</span>
               </div>
               <div v-if="coupon.type === 'percentage' && coupon.max_discount_amount" class="text-xs text-gray-500">
                  Tối đa {{ formatCurrency(coupon.max_discount_amount) }}
               </div>
            </td>
            <td class="px-6 py-4 text-gray-600">
               {{ formatCurrency(coupon.min_order_amount) }}
            </td>
            <td class="px-6 py-4">
               <div>{{ coupon.quantity - coupon.used_count }} / {{ coupon.quantity }}</div>
               <div class="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: Math.min((coupon.used_count / coupon.quantity) * 100, 100) + '%' }"></div>
               </div>
            </td>
            <td class="px-6 py-4 text-xs text-gray-500">
               <div class="flex items-center gap-1">
                 <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                 </svg>
                 {{ formatDate(coupon.start_date) }}
               </div>
               <div class="flex justify-center my-0.5">
                 <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                 </svg>
               </div>
               <div class="flex items-center gap-1">
                 <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                 </svg>
                 {{ formatDate(coupon.end_date) }}
               </div>
            </td>
            <td class="px-6 py-4">
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]"
              >
                {{ coupon.is_active ? 'Hoạt động' : 'Tạm khóa' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button 
                  @click="openEditModal(coupon)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button 
                  @click="confirmDelete(coupon)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="coupons.length === 0">
             <td colspan="7" class="p-8 text-center text-gray-500">Chưa có mã giảm giá nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 class="text-xl font-bold">{{ isEditing ? 'Chỉnh sửa mã' : 'Thêm mã mới' }}</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium mb-1">Mã Voucher (Code)</label>
               <input 
                  v-model="form.code" 
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none uppercase font-bold text-primary"
                  :disabled="isEditing"
                  placeholder="VD: SALE50"
               />
             </div>
             <div>
               <label class="block text-sm font-medium mb-1">Mô tả ngắn</label>
               <input v-model="form.description" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Giảm giá mùa hè" />
             </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
             <div>
                <label class="block text-sm font-medium mb-1">Loại giảm giá</label>
                <select v-model="form.type" class="w-full px-3 py-2 border rounded-lg outline-none">
                   <option value="fixed">Giảm tiền (VNĐ)</option>
                   <option value="percentage">Giảm theo %</option>
                   <option value="free_shipping">Miễn phí ship</option>
                </select>
             </div>
             <div v-if="form.type !== 'free_shipping'" class="col-span-2">
                <label class="block text-sm font-medium mb-1">Giá trị giảm</label>
                <div class="relative">
                   <input v-model.number="form.value" type="number" min="0" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                   <span class="absolute right-3 top-2 text-gray-500 font-bold">
                      {{ form.type === 'percentage' ? '%' : 'đ' }}
                   </span>
                </div>
             </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="block text-sm font-medium mb-1">Đơn tối thiểu</label>
                <input v-model.number="form.min_order_amount" type="number" min="0" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
             </div>
             <div v-if="form.type === 'percentage'">
                <label class="block text-sm font-medium mb-1">Giảm tối đa</label>
                <input v-model.number="form.max_discount_amount" type="number" min="0" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Không giới hạn nếu để trống" />
             </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
             <div>
                <label class="block text-sm font-medium mb-1">Số lượng phát hành</label>
                <input v-model.number="form.quantity" type="number" min="0" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
             </div>
             <div>
                <label class="block text-sm font-medium mb-1">Bắt đầu</label>
                <input v-model="form.start_date" type="date" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
             </div>
             <div>
                <label class="block text-sm font-medium mb-1">Kết thúc</label>
                <input v-model="form.end_date" type="date" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
             </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
             <input id="active" type="checkbox" v-model="form.is_active" class="w-4 h-4 text-primary rounded border-gray-300" />
             <label for="active" class="text-sm font-medium text-gray-700">Kích hoạt ngay</label>
          </div>

          <!-- New Fields -->
          <div class="border-t pt-4 mt-2">
            <p class="text-xs text-gray-500 uppercase font-semibold mb-3">Tùy chọn nâng cao</p>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-2">
                <input id="is_public" type="checkbox" v-model="form.is_public" class="w-4 h-4 text-red-500 rounded border-gray-300" />
                <label for="is_public" class="text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>
                  Công khai trên Săn Voucher
                </label>
              </div>
              
              <div v-if="!isEditing" class="col-span-2 flex items-center gap-2 ml-6 text-indigo-600 bg-indigo-50 p-2 rounded-lg transition-all animate-fade-in">
                <input id="notify" type="checkbox" v-model="form.notifyUsers" class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <label for="notify" class="text-sm font-bold cursor-pointer select-none flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Gửi email thông báo cho tất cả người dùng ngay lập tức
                </label>
              </div>
              <div class="flex items-center gap-2">
                <input id="first_order" type="checkbox" v-model="form.for_first_order_only" class="w-4 h-4 text-orange-500 rounded border-gray-300" />
                <label for="first_order" class="text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  Chỉ cho đơn đầu tiên
                </label>
              </div>
            </div>
            <div class="mt-3">
              <label class="block text-sm font-medium mb-1">Áp dụng cho danh mục (tùy chọn)</label>
              <select v-model="form.category_id" class="w-full px-3 py-2 border rounded-lg outline-none">
                <option :value="null">-- Tất cả sản phẩm --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button @click="showModal = false" class="px-4 py-2 border rounded-lg hover:bg-white transition-colors">Hủy</button>
          <button 
            @click="saveCoupon" 
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
        <p class="text-gray-500 mb-6">Bạn có chắc muốn xóa mã <strong class="text-gray-900">{{ couponToDelete?.code }}</strong> không?</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDeleteModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="deleteCoupon" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Xóa vĩnh viễn</button>
        </div>
      </div>
    </div>

    <!-- Stats Tab -->
    <div v-show="activeTab === 'stats'" class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div v-if="loadingStats" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
      <table v-else class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-500 font-medium border-b">
          <tr>
            <th class="px-6 py-4">Mã Voucher</th>
            <th class="px-6 py-4">Mô tả</th>
            <th class="px-6 py-4">Lượt sử dụng</th>
            <th class="px-6 py-4">Tổng tiền giảm</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="stat in couponStats" :key="stat.coupon_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-mono font-bold text-primary">{{ stat.coupon?.code }}</td>
            <td class="px-6 py-4 text-gray-600">{{ stat.coupon?.description }}</td>
            <td class="px-6 py-4">
              <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{{ stat.usage_count }} lần</span>
            </td>
            <td class="px-6 py-4 text-green-600 font-semibold">{{ formatCurrency(stat.total_discount) }}</td>
          </tr>
          <tr v-if="couponStats.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-500">Chưa có dữ liệu sử dụng</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL

const coupons = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const couponToDelete = ref(null)
const activeTab = ref('list')
const categories = ref([])
const couponStats = ref([])
const loadingStats = ref(false)

const form = ref({
  code: '',
  description: '',
  type: 'fixed',
  value: 0,
  min_order_amount: 0,
  max_discount_amount: null,
  quantity: 100,
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  is_active: true,
  is_public: false,
  for_first_order_only: false,
  category_id: null
})

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
const formatDate = (dateStr) => {
   if (!dateStr) return '--'
   return new Date(dateStr).toLocaleDateString('vi-VN')
}

const fetchCoupons = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/coupons`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    const data = await res.json()
    if (data.status) {
      coupons.value = data.data
    }
  } catch (error) {
    console.error('Error fetching coupons:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    code: '',
    description: '',
    type: 'fixed',
    value: 0,
    min_order_amount: 0,
    max_discount_amount: null,
    quantity: 100,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    is_public: false,
    for_first_order_only: false,
    category_id: null,
    notifyUsers: false
  }
  showModal.value = true
}

const openEditModal = (coupon) => {
  isEditing.value = true
  form.value = { 
    ...coupon,
    start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
    end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
    notifyUsers: false 
  }
  showModal.value = true
}

const saveCoupon = async () => {
  if (!form.value.code) return toast.warning('Vui lòng nhập mã voucher')
  
  // Validation
  if (form.value.value < 0) return toast.warning('Giá trị giảm không được âm')
  if (form.value.min_order_amount < 0) return toast.warning('Đơn tối thiểu không được âm')
  if (form.value.quantity < 1) return toast.warning('Số lượng phát hành phải lớn hơn 0')

  if (form.value.type === 'percentage') {
    if (form.value.value > 100) return toast.warning('Giảm giá theo % không thể vượt quá 100%')
  }

  if (form.value.start_date && form.value.end_date) {
    const start = new Date(form.value.start_date)
    const end = new Date(form.value.end_date)
    if (end <= start) return toast.warning('Ngày kết thúc phải sau ngày bắt đầu')
  }
  
  saving.value = true
  try {
    const url = isEditing.value 
      ? `${API_URL}/coupons/${form.value.id}`
      : `${API_URL}/coupons`
    
    const payload = { ...form.value }
    if (!payload.start_date) payload.start_date = null
    if (!payload.end_date) payload.end_date = null
    
    // Convert numbers
    payload.value = Number(payload.value)
    payload.min_order_amount = Number(payload.min_order_amount)
    if (payload.max_discount_amount) payload.max_discount_amount = Number(payload.max_discount_amount)
    else payload.max_discount_amount = null
    
    const res = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    if (data.status) {
      showModal.value = false
      toast.success(isEditing.value ? 'Cập nhật thành công' : 'Thêm mới thành công')
      await fetchCoupons()
    } else {
      toast.error(data.message || 'Có lỗi xảy ra')
    }
  } catch (error) {
    console.error('Error saving coupon:', error)
    toast.error('Lỗi kết nối')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (coupon) => {
  couponToDelete.value = coupon
  showDeleteModal.value = true
}

const deleteCoupon = async () => {
  try {
    const res = await fetch(`${API_URL}/coupons/${couponToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    
    const data = await res.json()
    if (data.status) {
      showDeleteModal.value = false
      toast.success('Xóa thành công')
      await fetchCoupons()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error('Lỗi khi xóa')
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`)
    const data = await res.json()
    if (data.status) {
      categories.value = data.data
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchStats = async () => {
  loadingStats.value = true
  try {
    const res = await fetch(`${API_URL}/coupons/stats`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    const data = await res.json()
    if (data.status) {
      couponStats.value = data.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingStats.value = false
  }
}

import { watch } from 'vue'

watch(activeTab, (newTab) => {
  if (newTab === 'stats' && couponStats.value.length === 0) {
    fetchStats()
  }
})

onMounted(() => {
  fetchCoupons()
  fetchCategories()
})
</script>

<style scoped>
/* Hide number input spinners */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
