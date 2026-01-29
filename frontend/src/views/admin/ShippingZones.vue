<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Quản lý phí vận chuyển</h1>
        <p class="text-muted-foreground">Cấu hình phí ship theo khu vực</p>
      </div>
      <button 
        @click="openCreateModal"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Thêm khu vực
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Zones Table -->
    <div v-else class="bg-card rounded-xl border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/50">
            <tr>
              <th class="text-left px-4 py-3 text-sm font-medium">Khu vực</th>
              <th class="text-left px-4 py-3 text-sm font-medium">Tỉnh/Thành</th>
              <th class="text-right px-4 py-3 text-sm font-medium">Phí ship</th>
              <th class="text-right px-4 py-3 text-sm font-medium">Miễn phí khi ≥</th>
              <th class="text-center px-4 py-3 text-sm font-medium">Thời gian</th>
              <th class="text-center px-4 py-3 text-sm font-medium">Trạng thái</th>
              <th class="text-center px-4 py-3 text-sm font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="zone in zones" :key="zone.id" class="hover:bg-muted/30">
              <td class="px-4 py-3">
                <div class="font-medium">{{ zone.name }}</div>
                <div class="text-xs text-muted-foreground">Ưu tiên: {{ zone.priority }}</div>
              </td>
              <td class="px-4 py-3 text-sm text-muted-foreground max-w-[200px]">
                <span v-if="zone.provinces?.length" class="truncate block">
                  {{ zone.provinces.slice(0, 3).join(', ') }}
                  <span v-if="zone.provinces.length > 3">...</span>
                </span>
                <span v-else class="text-gray-400">Tất cả</span>
              </td>
              <td class="px-4 py-3 text-right font-medium text-primary">
                {{ formatCurrency(zone.shipping_fee) }}
              </td>
              <td class="px-4 py-3 text-right text-green-600">
                {{ formatCurrency(zone.free_shipping_threshold) }}
              </td>
              <td class="px-4 py-3 text-center text-sm">
                {{ zone.estimated_days }}
              </td>
              <td class="px-4 py-3 text-center">
                <span 
                  :class="zone.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ zone.is_active ? 'Hoạt động' : 'Tắt' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="openEditModal(zone)"
                    class="p-2 hover:bg-primary/10 rounded text-primary"
                    title="Sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(zone)"
                    class="p-2 hover:bg-red-100 rounded text-red-600"
                    title="Xóa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold">{{ isEditing ? 'Sửa khu vực' : 'Thêm khu vực mới' }}</h2>
        </div>
        
        <form @submit.prevent="saveZone" class="p-6 space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium mb-1">Tên khu vực *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
              placeholder="VD: Nội thành Buôn Ma Thuột"
            />
          </div>

          <!-- Provinces -->
          <div>
            <label class="block text-sm font-medium mb-1">Tỉnh/Thành (mỗi dòng 1 tỉnh)</label>
            <textarea 
              v-model="provincesText" 
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
              placeholder="Đắk Lắk&#10;Gia Lai&#10;Kon Tum"
            ></textarea>
          </div>

          <!-- Districts -->
          <div>
            <label class="block text-sm font-medium mb-1">Quận/Huyện cụ thể (nếu có)</label>
            <textarea 
              v-model="districtsText" 
              rows="2"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
              placeholder="Thành phố Buôn Ma Thuột&#10;Huyện Cư M'gar"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Shipping Fee -->
            <div>
              <label class="block text-sm font-medium mb-1">Phí ship (VNĐ) *</label>
              <input 
                v-model.number="form.shipping_fee" 
                type="number" 
                required
                min="0"
                step="1000"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <!-- Free Threshold -->
            <div>
              <label class="block text-sm font-medium mb-1">Miễn phí khi ≥</label>
              <input 
                v-model.number="form.free_shipping_threshold" 
                type="number" 
                min="0"
                step="10000"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium mb-1">Độ ưu tiên</label>
              <input 
                v-model.number="form.priority" 
                type="number" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
              />
              <p class="text-xs text-muted-foreground mt-1">Số cao = ưu tiên cao hơn</p>
            </div>

            <!-- Estimated Days -->
            <div>
              <label class="block text-sm font-medium mb-1">Thời gian giao</label>
              <input 
                v-model="form.estimated_days" 
                type="text" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                placeholder="2-3 ngày"
              />
            </div>
          </div>

          <!-- Active -->
          <div class="flex items-center gap-2">
            <input 
              v-model="form.is_active" 
              type="checkbox" 
              id="is_active"
              class="w-4 h-4 rounded"
            />
            <label for="is_active" class="text-sm">Kích hoạt khu vực này</label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border rounded-lg hover:bg-muted"
            >
              Hủy
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {{ saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-2">Xác nhận xóa</h3>
        <p class="text-muted-foreground mb-4">
          Bạn có chắc muốn xóa khu vực "<strong>{{ zoneToDelete?.name }}</strong>"?
        </p>
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-muted"
          >
            Hủy
          </button>
          <button 
            @click="deleteZone"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL

const zones = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const zoneToDelete = ref(null)

const form = ref({
  name: '',
  provinces: [],
  districts: [],
  shipping_fee: 30000,
  free_shipping_threshold: 300000,
  priority: 0,
  estimated_days: '2-3 ngày',
  is_active: true
})

const provincesText = computed({
  get: () => (form.value.provinces || []).join('\n'),
  set: (val) => {
    form.value.provinces = val.split('\n').map(s => s.trim()).filter(Boolean)
  }
})

const districtsText = computed({
  get: () => (form.value.districts || []).join('\n'),
  set: (val) => {
    form.value.districts = val.split('\n').map(s => s.trim()).filter(Boolean)
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value || 0)
}

const fetchZones = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/shipping/admin/zones`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    const data = await res.json()
    if (data.status) {
      zones.value = data.data
    }
  } catch (error) {
    console.error('Error fetching zones:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    provinces: [],
    districts: [],
    shipping_fee: 30000,
    free_shipping_threshold: 300000,
    priority: 0,
    estimated_days: '2-3 ngày',
    is_active: true
  }
  showModal.value = true
}

const openEditModal = (zone) => {
  isEditing.value = true
  form.value = { ...zone }
  showModal.value = true
}

const saveZone = async () => {
  saving.value = true
  try {
    const url = isEditing.value 
      ? `${API_URL}/shipping/admin/zones/${form.value.id}`
      : `${API_URL}/shipping/admin/zones`
    
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
      await fetchZones()
    } else {
      alert(data.message || 'Có lỗi xảy ra')
    }
  } catch (error) {
    console.error('Error saving zone:', error)
    alert('Lỗi khi lưu dữ liệu')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (zone) => {
  zoneToDelete.value = zone
  showDeleteModal.value = true
}

const deleteZone = async () => {
  try {
    const res = await fetch(`${API_URL}/shipping/admin/zones/${zoneToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    
    const data = await res.json()
    if (data.status) {
      showDeleteModal.value = false
      zoneToDelete.value = null
      await fetchZones()
    } else {
      alert(data.message || 'Có lỗi xảy ra')
    }
  } catch (error) {
    console.error('Error deleting zone:', error)
    alert('Lỗi khi xóa dữ liệu')
  }
}

onMounted(() => {
  fetchZones()
})
</script>
