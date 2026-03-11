<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý người dùng</h2>
        <p class="text-muted-foreground">Quản lý tài khoản người dùng</p>
      </div>
      <button 
        @click="openAddModal"
        class="h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        + Thêm người dùng
      </button>
    </div>

    <!-- Search Bar -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
      <div class="w-full md:w-72 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm tên hoặc email..." 
          class="w-full h-10 pl-10 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          @input="debouncedSearch"
        />
        <button v-if="searchQuery" @click="searchQuery = ''; fetchUsers(1)" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">✕</button>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          <select 
            v-model="filterRole"
            @change="fetchUsers(1)"
            class="h-10 pl-9 pr-8 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none text-sm font-medium"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">Thành viên</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-card rounded-xl border overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-muted-foreground">
        Đang tải dữ liệu...
      </div>
      <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Người dùng</th>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Email</th>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Vai trò</th>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Ngày tạo</th>
            <th class="text-right p-4 font-medium text-sm whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t border-border hover:bg-muted/50 transition-colors">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {{ user.name?.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td class="p-4 text-sm">{{ user.email }}</td>
            <td class="p-4">
              <span 
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                ]"
              >
                {{ user.role === 'admin' ? 'Admin' : 'Thành viên' }}
              </span>
            </td>
            <td class="p-4 text-sm text-muted-foreground">{{ formatDate(user.created_at || user.createdAt) }}</td>
            <td class="p-4 text-right">
              <button 
                @click="openEditModal(user)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent text-primary transition-colors"
                title="Sửa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button 
                v-if="user.role !== 'admin'"
                @click="deleteUser(user.id)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-red-50 text-red-500 transition-colors ml-1"
                title="Xóa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
              <span v-else class="inline-block w-8 h-8 ml-1"></span>
            </td>
          </tr>
          <tr v-if="users.length === 0" class="border-t border-border">
            <td colspan="5" class="p-8 text-center text-muted-foreground">
              Không tìm thấy người dùng nào.
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalUsers > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hiển thị {{ (currentPage - 1) * limit + 1 }}-{{ Math.min(currentPage * limit, totalUsers) }} trong tổng số {{ totalUsers }} người dùng
      </p>
      <div class="flex items-center gap-1">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-sm border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trước
        </button>
        <template v-for="p in displayedPages" :key="p">
          <span v-if="p === '...'" class="px-2 text-muted-foreground">...</span>
          <button
            v-else
            @click="goToPage(p)"
            :class="[
              'w-9 h-9 text-sm rounded-lg transition-colors',
              p === currentPage 
                ? 'bg-primary text-primary-foreground font-bold' 
                : 'hover:bg-muted border'
            ]"
          >
            {{ p }}
          </button>
        </template>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-sm border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
        </button>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 class="text-xl font-bold mb-4">{{ isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng mới' }}</h3>
        
        <form @submit.prevent="saveUser" novalidate class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Họ tên <span class="text-red-500">*</span></label>
            <input 
              v-model="userForm.name" 
              type="text" 
              :class="errors.name ? 'border-red-500' : 'focus:border-primary'"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Nhập họ tên"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Email <span class="text-red-500">*</span></label>
            <input 
              v-model="userForm.email" 
              type="email" 
              :disabled="isEditing"
              :class="errors.email ? 'border-red-500' : 'focus:border-primary'"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="email@example.com"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
          </div>

          <div v-if="!isEditing" class="space-y-4">
             <div>
              <label class="block text-sm font-medium mb-1">Mật khẩu <span class="text-red-500">*</span></label>
              <input 
                v-model="userForm.password" 
                type="password" 
                :class="errors.password ? 'border-red-500' : 'focus:border-primary'"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="********"
                @input="clearError('password')"
              />
              <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
            </div>
             <div>
              <label class="block text-sm font-medium mb-1">Xác nhận mật khẩu <span class="text-red-500">*</span></label>
              <input 
                v-model="userForm.confirmPassword" 
                type="password" 
                :class="errors.confirmPassword ? 'border-red-500' : 'focus:border-primary'"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="********"
                @input="clearError('confirmPassword')"
              />
              <p v-if="errors.confirmPassword" class="text-sm text-red-500 mt-1">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <div>
             <label class="block text-sm font-medium mb-1">Vai trò</label>
             <select 
               v-model="userForm.role"
               class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
             >
                <option value="user">Thành viên (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
             </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              @click="closeModal" 
              class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              :disabled="isLoadingAction"
            >
              {{ isLoadingAction ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>




</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const authStore = useAuthStore()
const { confirm } = useConfirmDialog()
const users = ref([])
const loading = ref(false)
const isLoadingAction = ref(false)

// Search & Pagination
const searchQuery = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalUsers = ref(0)
const limit = 10

let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchUsers(1)
  }, 300)
}

const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchUsers(page)
}

// Modal State
const showModal = ref(false)
const isEditing = ref(false)
const userForm = reactive({
  id: null,
  name: '',
  email: '',
  role: 'user',
  password: '',
  confirmPassword: ''
})

const API_URL = import.meta.env.VITE_API_URL

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    let url = `${API_URL}/user/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery.value)}`
    if (filterRole.value) {
      url += `&role=${filterRole.value}`
    }
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    const data = await response.json()
    if (data.status) {
      users.value = data.data
      if (data.pagination) {
        currentPage.value = data.pagination.page
        totalPages.value = data.pagination.totalPages
        totalUsers.value = data.pagination.total
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  Object.assign(userForm, {
    id: null,
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  })
  showModal.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  Object.assign(userForm, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    password: '', // Password update not handled here to keep simple/secure
    confirmPassword: ''
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const clearError = (field) => {
  errors[field] = ''
}

const validateUserForm = () => {
  let isValid = true
  
  if (!userForm.name.trim()) {
    errors.name = 'Vui lòng nhập họ tên'
    isValid = false
  }
  
  if (!userForm.email.trim()) {
    errors.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!emailRegex.test(userForm.email)) {
    errors.email = 'Email không hợp lệ'
    isValid = false
  }

  if (!isEditing.value) {
    if (!userForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu'
      isValid = false
    } else if (userForm.password.length < 6) {
      errors.password = 'Mật khẩu phải từ 6 ký tự'
      isValid = false
    }

    if (!userForm.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      isValid = false
    } else if (userForm.password !== userForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      isValid = false
    }
  }

  return isValid
}

const saveUser = async () => {
  if (!validateUserForm()) {
    return
  }

  isLoadingAction.value = true
  try {
    const url = isEditing.value 
      ? `${API_URL}/user/admin/users/${userForm.id}`
      : `${API_URL}/user/admin/users`
    
    const method = isEditing.value ? 'PUT' : 'POST'
    
    const body = {
      name: userForm.name,
      email: userForm.email,
      role: userForm.role
    }

    if (!isEditing.value) {
      body.password = userForm.password
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(body)
    })

    const json = await res.json()
    
    if (json.status) {
      fetchUsers(currentPage.value)
      closeModal()
      toast.success(isEditing.value ? 'Cập nhật thành công' : 'Thêm thành công')
    } else {
      toast.error(json.message || (json.errors && json.errors[0]?.msg) || 'Có lỗi xảy ra')
    }
  } catch (error) {
      console.error(error)
      toast.error("Lỗi kết nối")
  } finally {
    isLoadingAction.value = false
  }
}

const deleteUser = async (id) => {
  const ok = await confirm('Xóa người dùng', 'Bạn có chắc chắn muốn xóa người dùng này? Người dùng sẽ được chuyển vào thùng rác.', { actionLabel: 'Xóa', actionClass: 'bg-red-100 text-red-600 hover:bg-red-200' })
  if (!ok) return

  try {
    const res = await fetch(`${API_URL}/user/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    const json = await res.json()
    if (json.status) {
      fetchUsers(currentPage.value)
      toast.success('Xóa người dùng thành công')
    } else {
      toast.error(json.message || 'Không thể xóa người dùng')
    }
  } catch (error) {
    console.error(error)
    toast.error('Có lỗi xảy ra')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
