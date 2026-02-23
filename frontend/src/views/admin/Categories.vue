<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý danh mục</h2>
        <p class="text-muted-foreground">Quản lý các danh mục sản phẩm theo cấu trúc phân cấp</p>
      </div>
      <button 
        @click="openAddModal()"
        class="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        Thêm danh mục
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-2 text-muted-foreground">Đang tải...</p>
    </div>

    <!-- Tree Table -->
    <div v-else class="bg-card rounded-xl border overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b font-medium text-sm text-muted-foreground">
        <div class="col-span-5">Tên danh mục</div>
        <div class="col-span-2">Icon</div>
        <div class="col-span-2 text-center">Sản phẩm</div>
        <div class="col-span-1 text-center">Trạng thái</div>
        <div class="col-span-2 text-right">Thao tác</div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-border">
        <template v-for="item in treeData" :key="item.id">
          <div 
            class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
            :class="{ 'bg-muted/20': item.level === 0 }"
          >
            <!-- Name with indent -->
            <div class="col-span-5 flex items-center gap-2">
              <!-- Expand/Collapse button for parents -->
              <button 
                v-if="hasChildren(item.id)"
                @click="toggleExpand(item.id)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-accent transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform"
                  :class="{ 'rotate-90': expandedIds.includes(item.id) }"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <div v-else class="w-6"></div>

              <!-- Indent lines -->
              <div 
                class="flex items-center text-muted-foreground"
                :style="{ paddingLeft: (item.level * 20) + 'px' }"
              >
                <span v-if="item.level > 0" class="text-muted-foreground/50 mr-2">└─</span>
                <span class="font-medium" :class="{ 'text-primary': item.level === 0 }">
                  {{ item.name }}
                </span>
              </div>
            </div>

            <!-- Icon -->
            <div class="col-span-2">
              <span class="text-xl">{{ getIconEmoji(item.icon) }}</span>
            </div>

            <!-- Product Count -->
            <div class="col-span-2 text-center">
              <span class="px-2 py-1 rounded-full bg-muted text-sm">
                {{ item.productCount || 0 }} sản phẩm
              </span>
            </div>

            <!-- Status -->
            <div class="col-span-1 text-center">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                item.status 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              ]">
                {{ item.status ? 'Hiện' : 'Ẩn' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="col-span-2 flex items-center justify-end gap-1">
              <!-- Add child button -->
              <button 
                @click="openAddModal(item.id)"
                class="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
                title="Thêm danh mục con"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
              </button>
              
              <!-- Edit button -->
              <button 
                @click="openEditModal(item)"
                class="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-blue-500"
                title="Sửa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                </svg>
              </button>
              
              <!-- Delete button -->
              <button 
                @click="confirmDelete(item)"
                class="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Xóa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </template>

        <!-- Empty state -->
        <div v-if="treeData.length === 0" class="px-6 py-12 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <p class="font-medium">Chưa có danh mục nào</p>
          <p class="text-sm">Nhấn "Thêm danh mục" để tạo danh mục đầu tiên</p>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-card rounded-xl border p-4">
        <div class="text-2xl font-bold text-primary">{{ rootCategories.length }}</div>
        <div class="text-sm text-muted-foreground">Danh mục gốc</div>
      </div>
      <div class="bg-card rounded-xl border p-4">
        <div class="text-2xl font-bold text-blue-500">{{ categories.length }}</div>
        <div class="text-sm text-muted-foreground">Tổng danh mục</div>
      </div>
      <div class="bg-card rounded-xl border p-4">
        <div class="text-2xl font-bold text-green-500">{{ activeCategories }}</div>
        <div class="text-sm text-muted-foreground">Đang hoạt động</div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-md p-6 m-4">
        <h3 class="text-xl font-bold mb-4">
          {{ isEditing ? 'Sửa danh mục' : 'Thêm danh mục mới' }}
        </h3>
        
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tên danh mục *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập tên danh mục"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Slug URL</label>
            <input 
              v-model="form.slug" 
              type="text" 
              class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="Tự động tạo từ tên"
            />
            <p class="text-xs text-muted-foreground mt-1">Tự sinh từ tên danh mục. Có thể chỉnh sửa thủ công.</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Mô tả</label>
            <textarea 
              v-model="form.description" 
              rows="3"
              class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập mô tả danh mục"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Icon</label>
            <select 
              v-model="form.icon"
              class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Chọn icon</option>
              <option value="book">📚 Sách</option>
              <option value="globe">🌍 Quốc tế</option>
              <option value="pencil">✏️ Văn phòng phẩm</option>
              <option value="puzzle">🧩 Đồ chơi</option>
              <option value="heart">❤️ Yêu thích</option>
              <option value="star">⭐ Nổi bật</option>
              <option value="folder">📁 Thư mục</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Danh mục cha</label>
            <select 
              v-model="form.parent_id"
              class="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option :value="null">📂 Danh mục gốc</option>
              <option 
                v-for="cat in parentCategories" 
                :key="cat.id" 
                :value="cat.id"
                :disabled="cat.disabled"
              >
                {{ cat.prefix }}{{ cat.name }}
              </option>
            </select>
          </div>
          
          <div class="flex items-center gap-2">
            <input 
              v-model="form.status" 
              type="checkbox" 
              id="status"
              class="rounded border-gray-300"
            />
            <label for="status" class="text-sm">Hiển thị danh mục</label>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-sm p-6 m-4">
        <h3 class="text-xl font-bold mb-2 text-destructive">Xác nhận xóa</h3>
        <p class="text-muted-foreground mb-4">
          Bạn có chắc muốn xóa danh mục "<strong>{{ categoryToDelete?.name }}</strong>"?
        </p>
        <div v-if="hasChildren(categoryToDelete?.id)" class="p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p class="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ Danh mục này có {{ countChildren(categoryToDelete?.id) }} danh mục con. Các danh mục con sẽ bị mất liên kết cha.
          </p>
        </div>
        <div class="flex gap-3">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="deleteCategory"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {{ deleting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Message -->
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

const API_URL = `${import.meta.env.VITE_API_URL}/categories`

const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const expandedIds = ref([])

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const categoryToDelete = ref(null)

const form = ref({
  name: '',
  slug: '',
  description: '',
  icon: '',
  parent_id: null,
  status: true
})

// Auto-generate slug từ tên
const slugManuallyEdited = ref(false)

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

watch(() => form.value.name, (newName) => {
  if (!slugManuallyEdited.value && newName) {
    form.value.slug = generateSlug(newName)
  }
})

// Detect manual slug edit
watch(() => form.value.slug, (newSlug) => {
  const autoSlug = generateSlug(form.value.name)
  if (newSlug !== autoSlug) {
    slugManuallyEdited.value = true
  }
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed: Root categories
const rootCategories = computed(() => {
  return categories.value.filter(c => c.parent_id === null)
})

// Computed: Active categories count
const activeCategories = computed(() => {
  return categories.value.filter(c => c.status).length
})

// Build tree data for display
const treeData = computed(() => {
  const result = []
  
  const buildTree = (parentId, level) => {
    const children = categories.value.filter(cat => cat.parent_id === parentId)
    
    children.forEach(cat => {
      // Check if parent is expanded or it's root level
      const parentExpanded = parentId === null || expandedIds.value.includes(parentId)
      
      if (parentExpanded) {
        result.push({
          ...cat,
          level
        })
        
        // If this item is expanded, add its children
        if (expandedIds.value.includes(cat.id)) {
          buildTree(cat.id, level + 1)
        }
      }
    })
  }
  
  buildTree(null, 0)
  return result
})

// Build parent categories for dropdown
const parentCategories = computed(() => {
  const result = []
  
  const buildTree = (parentId, level) => {
    const children = categories.value.filter(cat => cat.parent_id === parentId)
    
    children.forEach(cat => {
      const isCurrentOrDescendant = isDescendantOf(cat.id, editingId.value)
      
      result.push({
        id: cat.id,
        name: cat.name,
        prefix: '── '.repeat(level),
        disabled: cat.id === editingId.value || isCurrentOrDescendant
      })
      
      buildTree(cat.id, level + 1)
    })
  }
  
  buildTree(null, 0)
  return result
})

// Check if categoryId is descendant of ancestorId
const isDescendantOf = (categoryId, ancestorId) => {
  if (!ancestorId) return false
  
  const children = categories.value.filter(cat => cat.parent_id === ancestorId)
  
  for (const child of children) {
    if (child.id === categoryId) return true
    if (isDescendantOf(categoryId, child.id)) return true
  }
  
  return false
}

// Toggle expand/collapse
const toggleExpand = (id) => {
  const index = expandedIds.value.indexOf(id)
  if (index === -1) {
    expandedIds.value.push(id)
  } else {
    expandedIds.value.splice(index, 1)
  }
}

// Check if has children
const hasChildren = (categoryId) => {
  return categories.value.some(c => c.parent_id === categoryId)
}

// Count children
const countChildren = (categoryId) => {
  return categories.value.filter(c => c.parent_id === categoryId).length
}

// Get icon emoji
const getIconEmoji = (icon) => {
  const icons = {
    book: '📚',
    globe: '🌍',
    pencil: '✏️',
    puzzle: '🧩',
    heart: '❤️',
    star: '⭐',
    folder: '📁'
  }
  return icons[icon] || '📁'
}

// Show toast
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Fetch categories
const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await fetch(API_URL)
    const json = await res.json()
    if (json.status) {
      categories.value = json.data
      // Expand root categories by default
      expandedIds.value = categories.value
        .filter(c => c.parent_id === null)
        .map(c => c.id)
    } else {
      showToast(json.message || 'Lỗi tải danh mục', 'error')
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    showToast('Lỗi khi tải danh mục', 'error')
  } finally {
    loading.value = false
  }
}

// Open add modal
const openAddModal = (parentId = null) => {
  isEditing.value = false
  editingId.value = null
  slugManuallyEdited.value = false
  form.value = {
    name: '',
    slug: '',
    description: '',
    icon: '',
    parent_id: parentId,
    status: true
  }
  showModal.value = true
}

// Open edit modal
const openEditModal = (category) => {
  isEditing.value = true
  editingId.value = category.id
  slugManuallyEdited.value = true // Khi edit, giữ slug hiện có
  form.value = {
    name: category.name,
    slug: category.slug || '',
    description: category.description || '',
    icon: category.icon || '',
    parent_id: category.parent_id,
    status: category.status
  }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
}

// Confirm delete
const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

// Save category
const saveCategory = async () => {
  if (!form.value.name.trim()) {
    showToast('Vui lòng nhập tên danh mục', 'error')
    return
  }

  saving.value = true
  try {
    const url = isEditing.value ? `${API_URL}/${editingId.value}` : API_URL
    const method = isEditing.value ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(form.value)
    })
    
    const json = await res.json()
    
    if (json.status) {
      showToast(isEditing.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!')
      closeModal()
      await fetchCategories()
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error('Error saving category:', error)
    showToast('Lỗi khi lưu danh mục', 'error')
  } finally {
    saving.value = false
  }
}

// Delete category
const deleteCategory = async () => {
  if (!categoryToDelete.value) return
  
  deleting.value = true
  try {
    const res = await fetch(`${API_URL}/${categoryToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    
    const json = await res.json()
    
    if (json.status) {
      showToast('Xóa thành công!')
      showDeleteModal.value = false
      categoryToDelete.value = null
      await fetchCategories()
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    showToast('Lỗi khi xóa danh mục', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
