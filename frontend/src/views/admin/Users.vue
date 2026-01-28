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

    <div class="bg-card rounded-xl border overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-muted-foreground">
        Đang tải dữ liệu...
      </div>
      <table v-else class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-4 font-medium text-sm">Người dùng</th>
            <th class="text-left p-4 font-medium text-sm">Email</th>
            <th class="text-left p-4 font-medium text-sm">Vai trò</th>
            <th class="text-left p-4 font-medium text-sm">Ngày tạo</th>
            <th class="text-right p-4 font-medium text-sm">Thao tác</th>
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

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 class="text-xl font-bold mb-4">{{ isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng mới' }}</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Họ tên</label>
            <input 
              v-model="userForm.name" 
              type="text" 
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Nhập họ tên"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              v-model="userForm.email" 
              type="email" 
              required
              :disabled="isEditing"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="email@example.com"
            />
          </div>

          <div v-if="!isEditing" class="space-y-4">
             <div>
              <label class="block text-sm font-medium mb-1">Mật khẩu</label>
              <input 
                v-model="userForm.password" 
                type="password" 
                required
                minlength="6"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="********"
              />
            </div>
             <div>
              <label class="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
              <input 
                v-model="userForm.confirmPassword" 
                type="password" 
                required
                minlength="6"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="********"
              />
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
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const users = ref([])
const loading = ref(false)
const isLoadingAction = ref(false)

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

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/user/admin/users`, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    const data = await response.json()
    if (data.status) {
      users.value = data.data
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

const saveUser = async () => {
  if (!isEditing.value && userForm.password !== userForm.confirmPassword) {
    alert('Mật khẩu nhập lại không khớp!')
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
      fetchUsers()
      closeModal()
      alert(isEditing.value ? 'Cập nhật thành công' : 'Thêm thành công')
    } else {
      alert(json.message || (json.errors && json.errors[0]?.msg) || 'Có lỗi xảy ra')
    }
  } catch (error) {
      console.error(error)
      alert("Lỗi kết nối")
  } finally {
    isLoadingAction.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) return

  try {
    const res = await fetch(`${API_URL}/user/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    const json = await res.json()
    if (json.status) {
      fetchUsers()
    } else {
      alert(json.message || 'Không thể xóa người dùng')
    }
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
