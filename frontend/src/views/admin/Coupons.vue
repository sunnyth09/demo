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

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
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
               <div>{{ formatDate(coupon.start_date) }}</div>
               <div class="text-center font-bold">⬇</div>
               <div>{{ formatDate(coupon.end_date) }}</div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL

const coupons = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const couponToDelete = ref(null)

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
  is_active: true
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
    is_active: true
  }
  showModal.value = true
}

const openEditModal = (coupon) => {
  isEditing.value = true
  form.value = { 
    ...coupon,
    start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
    end_date: coupon.end_date ? coupon.end_date.split('T')[0] : ''
  }
  showModal.value = true
}

const saveCoupon = async () => {
  if (!form.value.code) return alert('Vui lòng nhập mã voucher')
  
  // Validation
  if (form.value.value < 0) return alert('Giá trị giảm không được âm')
  if (form.value.min_order_amount < 0) return alert('Đơn tối thiểu không được âm')
  if (form.value.quantity < 1) return alert('Số lượng phát hành phải lớn hơn 0')

  if (form.value.type === 'percentage') {
    if (form.value.value > 100) return alert('Giảm giá theo % không thể vượt quá 100%')
  }

  if (form.value.start_date && form.value.end_date) {
    const start = new Date(form.value.start_date)
    const end = new Date(form.value.end_date)
    if (end <= start) return alert('Ngày kết thúc phải sau ngày bắt đầu')
  }
  
  saving.value = true
  try {
    const url = isEditing.value 
      ? `${API_URL}/coupons/${form.value.id}`
      : `${API_URL}/coupons`
    
    const res = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(form.value)
    })
    
    const data = await res.json()
    if (data.status) {
      showModal.value = false
      await fetchCoupons()
    } else {
      alert(data.message || 'Có lỗi xảy ra')
    }
  } catch (error) {
    console.error('Error saving coupon:', error)
    alert('Lỗi kết nối')
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
      await fetchCoupons()
    } else {
      alert(data.message)
    }
  } catch (error) {
    alert('Lỗi khi xóa')
  }
}

onMounted(() => {
  fetchCoupons()
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
