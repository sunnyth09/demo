<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link 
        to="/admin/articles"
        class="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
      </router-link>
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          {{ isEditMode ? 'Sửa bài viết' : 'Viết bài mới' }}
        </h2>
      </div>
    </div>

    <form @submit.prevent="saveArticle" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column (Main Content) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Tiêu đề bài viết <span class="text-red-500">*</span></label>
            <input 
              v-model="form.title"
              type="text" 
              required
              class="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              placeholder="Nhập tiêu đề..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Mô tả ngắn (Excerpt)</label>
            <textarea 
              v-model="form.excerpt"
              rows="3"
              class="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none"
              placeholder="Mô tả ngắn gọn về bài viết..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Nội dung</label>
            <QuillEditor 
              v-model="form.content" 
              placeholder="Nhập nội dung bài viết..." 
            />
          </div>
        </div>
      </div>

      <!-- Right Column (Settings) -->
      <div class="space-y-6">
        <div class="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 class="font-semibold text-sm text-foreground/80 mb-2">Cài đặt bài viết</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1.5">Trạng thái</label>
            <select 
              v-model="form.status"
              class="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Công khai</option>
            </select>
          </div>
        </div>

        <div class="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 class="font-semibold text-sm text-foreground/80 mb-2">Hình ảnh đại diện</h3>
          
          <div class="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors bg-muted/10 cursor-pointer">
            <input 
              type="file" 
              accept="image/*"
              class="absolute inset-0 opacity-0 cursor-pointer z-10"
              @change="handleFileUpload" 
            />
            
            <img 
              v-if="previewImage" 
              :src="previewImage" 
              class="absolute inset-0 w-full h-full object-cover" 
            />
            
            <div v-else class="flex flex-col items-center justify-center p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <p class="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Tải ảnh lên</p>
              <p class="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (Max 2MB)</p>
            </div>
            
            <div v-if="previewImage" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p class="text-white font-medium text-sm">Thay đổi ảnh</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button 
            type="submit" 
            :disabled="saving"
            class="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {{ saving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật bài viết' : 'Đăng bài viết') }}
          </button>
          
          <router-link 
            to="/admin/articles"
            class="w-full py-2.5 rounded-lg border bg-background text-center font-medium hover:bg-accent hover:text-accent-foreground transition-all"
          >
            Hủy bỏ
          </router-link>
        </div>
      </div>
    </form>

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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuillEditor from '@/components/QuillEditor.vue'

const route = useRoute()
const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const isEditMode = computed(() => !!route.params.id)
const saving = ref(false)
const previewImage = ref(null)
const selectedFile = ref(null)

const form = ref({
  title: '',
  content: '',
  excerpt: '',
  status: 'draft'
})

const toast = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showToast('File ảnh quá lớn (max 5MB)', 'error')
      return
    }
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const fetchArticle = async (id) => {
  try {
    const res = await fetch(`${API_URL}/articles/${id}`)
    const json = await res.json()
    if (json.status) {
      const data = json.data
      form.value = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status
      }
      if (data.thumbnail) {
        previewImage.value = data.thumbnail
      }
    } else {
      showToast('Không tìm thấy bài viết', 'error')
      router.push('/admin/articles')
    }
  } catch (error) {
    showToast('Lỗi khi tải bài viết', 'error')
  }
}

const saveArticle = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    formData.append('excerpt', form.value.excerpt)
    formData.append('status', form.value.status)
    
    if (selectedFile.value) {
      formData.append('thumbnail', selectedFile.value)
    }

    let url = `${API_URL}/articles`
    let method = 'POST'
    
    if (isEditMode.value) {
      url = `${API_URL}/articles/${route.params.id}`
      method = 'PUT'
    }

    const res = await fetch(url, {
      method,
      body: formData // No headers needed, browser sets Content-Type for FormData
    })
    
    const json = await res.json()
    
    if (json.status) {
      showToast(isEditMode.value ? 'Cập nhật thành công!' : 'Tạo bài viết thành công!')
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1000)
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error(error)
    showToast('Lỗi khi lưu bài viết', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    fetchArticle(route.params.id)
  }
})
</script>
