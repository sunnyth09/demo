<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        Thùng rác
      </h2>
      <p class="text-muted-foreground">Các dữ liệu đã được xóa tạm thời. Bạn có thể khôi phục hoặc xóa vĩnh viễn.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 flex-wrap">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === tab.key 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border hover:bg-accent'
        ]"
      >
        {{ tab.label }}
        <span 
          v-if="trashData[tab.key]?.length > 0"
          class="px-1.5 py-0.5 text-xs rounded-full"
          :class="activeTab === tab.key ? 'bg-white/20 text-primary-foreground' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
        >
          {{ trashData[tab.key].length }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-2 text-muted-foreground">Đang tải...</p>
    </div>

    <!-- Trash Table -->
    <div v-else class="bg-card rounded-xl border overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b font-medium text-sm text-muted-foreground">
        <div class="col-span-1">ID</div>
        <div class="col-span-4">Tên</div>
        <div class="col-span-3">Ngày xóa</div>
        <div class="col-span-4 text-right">Thao tác</div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-border">
        <div 
          v-for="item in currentItems" 
          :key="item.id"
          class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
        >
          <div class="col-span-1 text-muted-foreground font-mono text-sm">#{{ item.id }}</div>
          <div class="col-span-4">
            <span class="font-medium">{{ item.name || item.title || item.code || item.email || `#${item.id}` }}</span>
            <span v-if="item.slug" class="block text-xs text-muted-foreground">{{ item.slug }}</span>
            <span v-if="item.email && item.name" class="block text-xs text-muted-foreground">{{ item.email }}</span>
          </div>
          <div class="col-span-3 text-sm text-muted-foreground">
            {{ formatDate(item.deleted_at) }}
          </div>
          <div class="col-span-4 flex items-center justify-end gap-2">
            <button 
              @click="restoreItem(item.id)"
              :disabled="actionLoading"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Khôi phục
            </button>
            <button 
              @click="confirmForceDelete(item)"
              :disabled="actionLoading"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
              Xóa vĩnh viễn
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="currentItems.length === 0" class="px-6 py-16 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          <p class="font-medium text-lg">Thùng rác trống</p>
          <p class="text-sm mt-1">Không có {{ currentTabLabel }} nào bị xóa</p>
        </div>
      </div>
    </div>

    <!-- Force Delete Confirmation Modal -->
    <div v-if="showForceDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForceDeleteModal = false"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-sm p-6 m-4">
        <h3 class="text-xl font-bold mb-2 text-red-600">⚠️ Xóa vĩnh viễn</h3>
        <p class="text-muted-foreground mb-2">
          Bạn có chắc muốn <strong class="text-red-600">xóa vĩnh viễn</strong> "{{ itemToDelete?.name || itemToDelete?.title || itemToDelete?.code || itemToDelete?.email }}"?
        </p>
        <p class="text-sm text-red-500 mb-4">Hành động này KHÔNG THỂ hoàn tác.</p>
        <div class="flex gap-3">
          <button 
            @click="showForceDeleteModal = false"
            class="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="forceDeleteItem"
            :disabled="actionLoading"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ actionLoading ? 'Đang xóa...' : 'Xóa vĩnh viễn' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div 
        v-if="toast.show" 
        :class="[
          'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const API_BASE = import.meta.env.VITE_API_URL

const loading = ref(false)
const actionLoading = ref(false)
const activeTab = ref('categories')
const showForceDeleteModal = ref(false)
const itemToDelete = ref(null)

const tabs = [
  { key: 'categories', label: 'Danh mục', api: '/categories' },
  { key: 'products', label: 'Sản phẩm', api: '/products' },
  { key: 'users', label: 'Người dùng', api: '/user/admin/users' },
  { key: 'articles', label: 'Bài viết', api: '/articles' },
]

const trashData = ref({
  categories: [],
  products: [],
  users: [],
  articles: [],
})

const toast = ref({ show: false, message: '', type: 'success' })

const currentItems = computed(() => trashData.value[activeTab.value] || [])
const currentTabLabel = computed(() => tabs.find(t => t.key === activeTab.value)?.label || '')
const currentTabApi = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value)
  if (!tab) return ''
  return tab.api
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN', { 
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  })
}

const headers = () => ({ 'Authorization': `Bearer ${authStore.accessToken}` })

// Fetch trashed items for active tab
const fetchTrashed = async (tabKey) => {
  const tab = tabs.find(t => t.key === tabKey)
  if (!tab) return
  
  try {
    const res = await fetch(`${API_BASE}${tab.api}/trash`, { headers: headers() })
    const json = await res.json()
    if (json.status) {
      trashData.value[tabKey] = json.data
    }
  } catch (error) {
    console.error(`Error fetching trashed ${tabKey}:`, error)
  }
}

// Fetch all tabs
const fetchAllTrashed = async () => {
  loading.value = true
  await Promise.all(tabs.map(tab => fetchTrashed(tab.key)))
  loading.value = false
}

// Restore item
const restoreItem = async (id) => {
  actionLoading.value = true
  try {
    const method = activeTab.value === 'products' ? 'PUT' : 'PATCH'
    const restorePath = `${API_BASE}${currentTabApi.value}/${id}/restore`
    
    const res = await fetch(restorePath, { method, headers: headers() })
    const json = await res.json()
    if (json.status) {
      showToast('Khôi phục thành công!')
      await fetchTrashed(activeTab.value)
    } else {
      showToast(json.message || 'Lỗi khi khôi phục', 'error')
    }
  } catch (error) {
    showToast('Lỗi khi khôi phục', 'error')
  } finally {
    actionLoading.value = false
  }
}

// Confirm force delete
const confirmForceDelete = (item) => {
  itemToDelete.value = item
  showForceDeleteModal.value = true
}

// Force delete
const forceDeleteItem = async () => {
  if (!itemToDelete.value) return
  actionLoading.value = true
  try {
    const deletePath = `${API_BASE}${currentTabApi.value}/${itemToDelete.value.id}/force`

    const res = await fetch(deletePath, { method: 'DELETE', headers: headers() })
    const json = await res.json()
    if (json.status) {
      showToast('Đã xóa vĩnh viễn!')
      showForceDeleteModal.value = false
      itemToDelete.value = null
      await fetchTrashed(activeTab.value)
    } else {
      showToast(json.message || 'Lỗi khi xóa', 'error')
    }
  } catch (error) {
    showToast('Lỗi khi xóa vĩnh viễn', 'error')
  } finally {
    actionLoading.value = false
  }
}

// Reload when tab changes
watch(activeTab, async (newTab) => {
  if (trashData.value[newTab].length === 0) {
    loading.value = true
    await fetchTrashed(newTab)
    loading.value = false
  }
})

onMounted(() => {
  fetchAllTrashed()
})
</script>
