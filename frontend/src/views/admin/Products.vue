<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Quản lý sản phẩm</h2>
        <p class="text-sm text-muted-foreground mt-1">Quản lý tất cả sản phẩm trong hệ thống</p>
      </div>
      <router-link 
        to="/admin/products/create"
        class="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        Thêm sản phẩm
      </router-link>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
      <div class="flex-1 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          class="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          @input="debouncedSearch"
        />
      </div>
      <div class="flex gap-3">
        <select 
          v-model="filterCategoryId"
          @change="fetchProducts()"
          class="h-10 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-[180px]"
        >
          <option :value="null">Tất cả danh mục</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        
        <select 
          class="h-10 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-[150px]"
        >
          <option value="all">Trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p class="mt-4 text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/30 border-b">
              <th class="w-12 p-4 text-center">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              </th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Sản phẩm</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Danh mục</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Giá</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Tồn kho</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Trạng thái</th>
              <th class="text-center p-4 font-semibold text-sm text-foreground/80 w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr 
              v-for="product in products" 
              :key="product.id"
              class="hover:bg-muted/20 transition-colors group"
            >
              <td class="p-4 text-center">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              </td>
              <td class="p-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-16 rounded bg-muted flex-shrink-0 overflow-hidden border shadow-sm">
                    <img 
                      v-if="product.thumbnail" 
                      :src="product.thumbnail" 
                      :alt="product.name"
                      class="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <image x="4" y="4" width="16" height="16" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer" @click="navigateToEdit(product.id)">
                      {{ product.name }}
                    </h3>
                    <p class="text-xs text-muted-foreground mt-0.5 font-mono">
                      SKU: {{ product.slug || '---' }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="text-sm text-muted-foreground">
                  {{ product.category_name || '---' }}
                </span>
              </td>
              <td class="p-4">
                <span class="font-medium text-foreground">
                  {{ formatCurrency(product.price) }}
                </span>
              </td>
              <td class="p-4">
                <span :class="['text-sm', product.quantity > 0 ? 'text-foreground' : 'text-destructive font-medium']">
                  {{ product.quantity || 0 }}
                </span>
              </td>
              <td class="p-4">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    product.status === 'active' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  ]"
                >
                  {{ product.status === 'active' ? 'Đang bán' : 'Ngừng bán' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    class="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" 
                    title="Xem chi tiết"
                    disabled
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    @click="navigateToEdit(product.id)"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-600 transition-all" 
                    title="Sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(product)"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all" 
                    title="Xóa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr v-if="products.length === 0">
              <td colspan="7" class="p-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="m21 21-4.343-4.343"/><circle cx="10" cy="10" r="8"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-foreground">Không tìm thấy sản phẩm nào</h3>
                  <p class="text-muted-foreground mt-1 max-w-sm mx-auto">
                    Thử thay đổi bộ lọc hoặc thêm sản phẩm mới vào hệ thống.
                  </p>
                  <router-link 
                    to="/admin/products/create"
                    class="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Thêm sản phẩm mới
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="products.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hiển thị <span class="font-medium text-foreground">{{ offset + 1 }}-{{ Math.min(offset + limit, totalProducts) }}</span> trong tổng số <span class="font-medium text-foreground">{{ totalProducts }}</span> sản phẩm
      </p>
      
      <div class="flex items-center gap-1">
        <button 
          @click="prevPage"
          :disabled="offset === 0"
          class="min-w-[70px] px-3 py-1.5 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        
        <div class="flex items-center gap-1 mx-2">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-8 h-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center',
              currentPage === page 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="nextPage"
          :disabled="offset + limit >= totalProducts"
          class="min-w-[70px] px-3 py-1.5 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-sm p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2 text-center">Xóa sản phẩm</h3>
        <p class="text-muted-foreground mb-6 text-center text-sm">
          Bạn có chắc muốn xóa sản phẩm "<strong>{{ productToDelete?.name }}</strong>" không? Hành động này không thể hoàn tác.
        </p>
        <div class="flex gap-3">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2.5 border rounded-lg hover:bg-accent transition-colors font-medium text-sm"
          >
            Hủy bỏ
          </button>
          <button 
            @click="deleteProduct"
            :disabled="deleting"
            class="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 font-medium text-sm"
          >
            {{ deleting ? 'Đang xóa...' : 'Xóa ngay' }}
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
          'fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 border',
          toast.type === 'success' ? 'bg-background border-green-200 text-green-700' : 'bg-background border-red-200 text-red-700'
        ]"
      >
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', toast.type === 'success' ? 'bg-green-100' : 'bg-red-100']">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="font-medium text-sm">{{ toast.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const API_URL = 'http://localhost:3000/api'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const deleting = ref(false)

const searchQuery = ref('')
const filterCategoryId = ref(null)

const limit = ref(10)
const offset = ref(0)
const totalProducts = ref(0)

const showDeleteModal = ref(false)
const productToDelete = ref(null)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)
const totalPages = computed(() => Math.ceil(totalProducts.value / limit.value))

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

// Show toast
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Debounce search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    offset.value = 0
    fetchProducts()
  }, 300)
}

// Navigate to edit
const navigateToEdit = (id) => {
  router.push({
    path: `/admin/products/edit/${id}`,
    query: { page: currentPage.value }
  })
}

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  try {
    let url = `${API_URL}/products?limit=${limit.value}&offset=${offset.value}`
    if (filterCategoryId.value) {
      url += `&category_id=${filterCategoryId.value}`
    }
    if (searchQuery.value.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.value.trim())}`
    }
    
    const res = await fetch(url)
    const json = await res.json()
    
    if (json.status) {
      products.value = json.data
      // Estimate total for pagination (simple approach)
      if (json.data.length < limit.value) {
        totalProducts.value = offset.value + json.data.length
      } else {
        totalProducts.value = offset.value + limit.value + 1
      }
    } else {
      showToast(json.message || 'Lỗi tải sản phẩm', 'error')
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    showToast('Lỗi khi tải sản phẩm', 'error')
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`)
    const json = await res.json()
    if (json.status) {
      categories.value = json.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Pagination
const prevPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    fetchProducts()
    updateUrlPage()
  }
}

const nextPage = () => {
  offset.value += limit.value
  fetchProducts()
  updateUrlPage()
}

const goToPage = (page) => {
  offset.value = (page - 1) * limit.value
  fetchProducts()
  updateUrlPage()
}

// Update URL with current page (optional but good for UX)
const updateUrlPage = () => {
  const page = Math.floor(offset.value / limit.value) + 1
  router.replace({ query: { ...route.query, page } })
}

// Confirm delete
const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

// Delete product
const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  deleting.value = true
  try {
    const res = await fetch(`${API_URL}/products/${productToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    
    const json = await res.json()
    
    if (json.status) {
      showToast('Xóa thành công!')
      showDeleteModal.value = false
      productToDelete.value = null
      await fetchProducts()
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    showToast('Lỗi khi xóa sản phẩm', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  // Check for page in query
  if (route.query.page) {
    const page = parseInt(route.query.page)
    if (!isNaN(page) && page > 1) {
      offset.value = (page - 1) * limit.value
    }
  }
  
  fetchCategories()
  fetchProducts()
})
</script>
