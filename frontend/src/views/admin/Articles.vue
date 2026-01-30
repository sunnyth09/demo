<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Quản lý bài viết</h2>
        <p class="text-sm text-muted-foreground mt-1">Quản lý danh sách tin tức, bài viết</p>
      </div>
      <router-link 
        to="/admin/articles/create"
        class="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        Viết bài mới
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
          placeholder="Tìm kiếm bài viết..." 
          class="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          @input="debouncedSearch"
        />
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
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Bài viết</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Views</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Ngày tạo</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Trạng thái</th>
              <th class="text-center p-4 font-semibold text-sm text-foreground/80 w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr 
              v-for="article in articles" 
              :key="article.id"
              class="hover:bg-muted/20 transition-colors group"
            >
              <td class="p-4 text-center">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              </td>
              <td class="p-4">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-12 rounded bg-muted flex-shrink-0 overflow-hidden border shadow-sm">
                    <img 
                      v-if="article.thumbnail" 
                      :src="article.thumbnail" 
                      :alt="article.title"
                      class="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <image x="4" y="4" width="16" height="16" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer" @click="navigateToEdit(article.id)">
                      {{ article.title }}
                    </h3>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="text-sm text-muted-foreground">{{ article.views || 0 }}</span>
              </td>
              <td class="p-4">
                <span class="text-sm text-muted-foreground">
                  {{ formatDate(article.createdAt) }}
                </span>
              </td>
              <td class="p-4">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    article.status === 'published' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  ]"
                >
                  {{ article.status === 'published' ? 'Đã đăng' : 'Bản nháp' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="navigateToEdit(article.id)"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-600 transition-all" 
                    title="Sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(article)"
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
            <tr v-if="articles.length === 0">
              <td colspan="6" class="p-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-foreground">Không tìm thấy bài viết nào</h3>
                  <router-link 
                    to="/admin/articles/create"
                    class="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Viết bài mới
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="articles.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hiển thị <span class="font-medium text-foreground">{{ offset + 1 }}-{{ Math.min(offset + limit, totalArticles) }}</span> trong tổng số <span class="font-medium text-foreground">{{ totalArticles }}</span> bài viết
      </p>
      
      <div class="flex items-center gap-1">
        <button 
          @click="prevPage"
          :disabled="offset === 0"
          class="min-w-[70px] px-3 py-1.5 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        
        <button 
          @click="nextPage"
          :disabled="offset + limit >= totalArticles"
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
        <h3 class="text-xl font-bold mb-2 text-center">Xóa bài viết</h3>
        <p class="text-muted-foreground mb-6 text-center text-sm">
          Bạn có chắc muốn xóa bài viết "<strong>{{ articleToDelete?.title }}</strong>" không?
        </p>
        <div class="flex gap-3">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2.5 border rounded-lg hover:bg-accent transition-colors font-medium text-sm"
          >
            Hủy bỏ
          </button>
          <button 
            @click="deleteArticle"
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
        <p class="font-medium text-sm">{{ toast.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const articles = ref([])
const loading = ref(true)
const deleting = ref(false)

const searchQuery = ref('')
const limit = ref(10)
const offset = ref(0)
const totalArticles = ref(0)

const showDeleteModal = ref(false)
const articleToDelete = ref(null)

const toast = ref({ show: false, message: '', type: 'success' })

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    offset.value = 0
    fetchArticles()
  }, 300)
}

const navigateToEdit = (id) => {
  router.push(`/admin/articles/edit/${id}`)
}

const fetchArticles = async () => {
  loading.value = true
  try {
    let url = `${API_URL}/articles?limit=${limit.value}&offset=${offset.value}`
    if (searchQuery.value.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.value.trim())}`
    }
    
    const res = await fetch(url)
    const json = await res.json()
    
    if (json.status) {
      articles.value = json.data
      if (json.meta) {
        totalArticles.value = json.meta.total
      } else {
         // Fallback if meta missing
         totalArticles.value = articles.value.length
      }
    } else {
      showToast(json.message || 'Lỗi tải bài viết', 'error')
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    showToast('Lỗi khi tải bài viết', 'error')
  } finally {
    loading.value = false
  }
}

const prevPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    fetchArticles()
  }
}

const nextPage = () => {
  offset.value += limit.value
  fetchArticles()
}

const confirmDelete = (article) => {
  articleToDelete.value = article
  showDeleteModal.value = true
}

const deleteArticle = async () => {
  if (!articleToDelete.value) return
  deleting.value = true
  try {
    const res = await fetch(`${API_URL}/articles/${articleToDelete.value.id}`, {
      method: 'DELETE'
    })
    const json = await res.json()
    if (json.status) {
      showToast('Xóa thành công!')
      showDeleteModal.value = false
      articleToDelete.value = null
      await fetchArticles()
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error(error)
    showToast('Lỗi khi xóa bài viết', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchArticles()
})
</script>
