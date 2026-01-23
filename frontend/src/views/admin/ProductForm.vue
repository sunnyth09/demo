<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link 
        to="/admin/products"
        class="p-2 rounded-full hover:bg-accent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
      </router-link>
      <div>
        <h2 class="text-2xl font-bold">
          {{ isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
        </h2>
        <p class="text-muted-foreground">
          {{ isEditing ? 'Cập nhật thông tin sản phẩm' : 'Điền thông tin sản phẩm mới vào hệ thống' }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-card rounded-xl border shadow-sm p-6">
      <form @submit.prevent="saveProduct" class="space-y-6 max-w-4xl">
        <!-- Main Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name -->
          <div class="col-span-2">
            <label class="block text-sm font-medium mb-2">Tên sản phẩm <span class="text-destructive">*</span></label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập tên sản phẩm"
              @input="autoGenerateSlug"
            />
          </div>

          <!-- Slug -->
          <div class="col-span-2">
            <label class="block text-sm font-medium mb-2">
              Slug (URL thân thiện)
              <span class="text-xs text-muted-foreground ml-1">- tự động tạo từ tên</span>
            </label>
            <input 
              v-model="form.slug" 
              type="text" 
              class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="vd: sach-dac-nhan-tam"
            />
          </div>
          
          <!-- Price -->
          <div>
            <label class="block text-sm font-medium mb-2">Giá bán (VNĐ) <span class="text-destructive">*</span></label>
            <input 
              v-model.number="form.price" 
              type="number" 
              min="0"
              required
              class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0"
            />
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium mb-2">Số lượng tồn kho</label>
            <input 
              v-model.number="form.quantity" 
              type="number" 
              min="0"
              class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0"
            />
          </div>
          
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium mb-2">Danh mục <span class="text-destructive">*</span></label>
            <select 
              v-model="form.category_id"
              class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option :value="null">Chọn danh mục</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Status (Only Show When Editing) -->
          <div v-if="isEditing">
            <label class="block text-sm font-medium mb-2">Trạng thái</label>
            <select 
              v-model="form.status"
              class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold mb-4">Thông tin chi tiết</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Author -->
            <div>
              <label class="block text-sm font-medium mb-2">Tác giả</label>
              <input 
                v-model="form.author" 
                type="text" 
                class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nhập tên tác giả"
              />
            </div>

            <!-- Publisher -->
            <div>
              <label class="block text-sm font-medium mb-2">Nhà xuất bản</label>
              <input 
                v-model="form.publisher" 
                type="text" 
                class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nhập nhà xuất bản"
              />
            </div>

            <!-- Publication Year -->
            <div>
              <label class="block text-sm font-medium mb-2">Năm xuất bản</label>
              <input 
                v-model.number="form.publication_year" 
                type="number" 
                min="1900"
                class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Năm XB"
              />
            </div>
          </div>
        </div>
        
        <!-- Description -->
        <div class="border-t pt-6">
          <label class="block text-sm font-medium mb-2">Mô tả sản phẩm</label>
          <textarea 
            v-model="form.description" 
            rows="5"
            class="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nhập mô tả chi tiết sản phẩm..."
          ></textarea>
        </div>
        
        <!-- Thumbnail Upload -->
        <div class="border-t pt-6">
          <label class="block text-sm font-medium mb-2">Ảnh đại diện</label>
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <div class="w-40 h-40 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted flex-shrink-0 relative group">
              <img v-if="thumbnailPreview" :src="thumbnailPreview" class="w-full h-full object-cover" />
              <div v-else class="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <span class="text-xs text-muted-foreground">Chưa có ảnh</span>
              </div>
              
              <!-- Hover Overlay -->
              <div v-if="thumbnailPreview" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  @click.stop="removeThumbnail" 
                  class="p-2 bg-destructive text-white rounded-full hover:bg-destructive/90"
                  title="Xóa ảnh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex-1 max-w-md">
              <label class="block w-full">
                <span class="sr-only">Chọn ảnh</span>
                <input 
                  type="file"
                  accept="image/*"
                  @change="handleThumbnailChange"
                  class="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90
                    cursor-pointer file:cursor-pointer
                  "
                />
              </label>
              <p class="mt-2 text-sm text-muted-foreground">
                Định dạng hỗ trợ: PNG, JPG, GIF. <br>
                Dung lượng tối đa: 5MB. <br>
                Kích thước khuyến nghị: 600x600px trở lên.
              </p>
            </div>
          </div>
        </div>

        <!-- Gallery Upload -->
        <div class="border-t pt-6">
          <label class="block text-sm font-medium mb-2">Thư viện ảnh (Gallery)</label>
          <div class="space-y-4">
            <!-- Existing Images (View Only) -->
            <div v-if="existingImages.length > 0 && imageFiles.length === 0" class="space-y-2">
              <p class="text-sm text-muted-foreground">Ảnh hiện tại:</p>
              <div class="flex flex-wrap gap-4">
                <div v-for="(img, idx) in existingImages" :key="idx" class="w-24 h-24 rounded-lg border overflow-hidden relative group bg-muted">
                  <img :src="img" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- Warning if replacing -->
            <div v-if="existingImages.length > 0 && imageFiles.length > 0" class="p-3 rounded-md bg-yellow-50 text-yellow-800 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Lưu ý: Các ảnh cũ sẽ bị thay thế bởi danh sách ảnh mới này.</span>
            </div>

            <!-- New Images Preview -->
            <div v-if="imagePreviews.length > 0" class="space-y-2">
              <div class="flex flex-wrap gap-4">
                <div v-for="(img, idx) in imagePreviews" :key="idx" class="w-24 h-24 rounded-lg border overflow-hidden relative group bg-muted">
                  <img :src="img.url" class="w-full h-full object-cover" />
                  <button 
                    type="button"
                    @click="removeImage(idx)"
                    class="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                
                <!-- Add More Button -->
                 <label class="w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span class="text-xs text-muted-foreground mt-1">Thêm</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    class="hidden"
                    @change="handleImagesChange"
                  />
                </label>
              </div>
              <button 
                type="button" 
                @click="clearNewImages"
                class="text-sm text-destructive hover:underline"
              >
                Hủy bỏ thay đổi
              </button>
            </div>

            <!-- Upload Input (Initial) -->
            <div v-else>
              <label class="block w-full">
                <span class="sr-only">Chọn ảnh</span>
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImagesChange"
                  class="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90
                    cursor-pointer file:cursor-pointer
                  "
                />
              </label>
              <p class="mt-2 text-sm text-muted-foreground">
                Chọn nhiều ảnh để tạo thư viện ( tối đa 10 ảnh).
              </p>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-4 pt-6 border-t mt-8">
          <router-link 
            to="/admin/products"
            class="px-6 py-2.5 border rounded-md hover:bg-accent transition-colors font-medium"
          >
            Hủy bỏ
          </router-link>
          <button 
            type="submit"
            :disabled="saving"
            class="px-8 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium ml-auto flex items-center gap-2"
          >
            <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm') }}
          </button>
        </div>
      </form>
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
          'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]"
      >
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const API_URL = 'http://localhost:3000/api'

const isEditing = computed(() => route.params.id !== undefined)
const productId = computed(() => route.params.id)

const categories = ref([])
const saving = ref(false)
const loading = ref(false)

const thumbnailFile = ref(null)
const thumbnailPreview = ref('')

const imageFiles = ref([])
const imagePreviews = ref([])
const existingImages = ref([]) // Ảnh cũ từ server

const form = ref({
  name: '',
  slug: '',
  price: 0,
  quantity: 0,
  description: '',
  category_id: null,
  status: 'active',
  author: '',
  publisher: '',
  publication_year: null
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Auto generate slug from name
const autoGenerateSlug = () => {
  if (!isEditing.value || !form.value.slug) {
    form.value.slug = form.value.name
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

// Fetch product detail (for edit mode)
const fetchProductDetail = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/products/${productId.value}`)
    const json = await res.json()
    if (json.status) {
      const p = json.data
      form.value = {
        name: p.name,
        slug: p.slug || '',
        price: p.price,
        quantity: p.quantity || 0,
        description: p.description || '',
        category_id: p.category_id,
        status: p.status || 'active',
        author: p.author || '',
        publisher: p.publisher || '',
        publication_year: p.publication_year || null
      }
      thumbnailPreview.value = p.thumbnail || ''
      existingImages.value = p.images || []
    } else {
      showToast('Không tìm thấy sản phẩm', 'error')
      router.push('/admin/products')
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    showToast('Lỗi khi tải thông tin sản phẩm', 'error')
  } finally {
    loading.value = false
  }
}

// Handle thumbnail change
const handleThumbnailChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    thumbnailFile.value = file
    thumbnailPreview.value = URL.createObjectURL(file)
  }
}

// Remove thumbnail
const removeThumbnail = () => {
  thumbnailFile.value = null
  thumbnailPreview.value = ''
}

// Handle gallery images change
const handleImagesChange = (e) => {
  const files = Array.from(e.target.files)
  if (files.length > 0) {
    files.forEach(file => {
      imageFiles.value.push(file)
      imagePreviews.value.push({
        url: URL.createObjectURL(file),
        file: file
      })
    })
  }
  // Reset input
  e.target.value = ''
}

// Remove gallery image (newly selected)
const removeImage = (index) => {
  URL.revokeObjectURL(imagePreviews.value[index].url)
  imagePreviews.value.splice(index, 1)
  imageFiles.value.splice(index, 1)
}

// Clear all new images
const clearNewImages = () => {
  imagePreviews.value.forEach(img => URL.revokeObjectURL(img.url))
  imagePreviews.value = []
  imageFiles.value = []
}

// Save product
const saveProduct = async () => {
  if (!form.value.name || !form.value.price) {
    showToast('Vui lòng nhập tên và giá sản phẩm', 'error')
    return
  }

  // Validate category
  if (!form.value.category_id) {
    showToast('Vui lòng chọn danh mục', 'error')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('price', form.value.price)
    formData.append('quantity', form.value.quantity)
    formData.append('description', form.value.description || '')
    formData.append('status', form.value.status)
    formData.append('author', form.value.author || '')
    formData.append('publisher', form.value.publisher || '')
    
    if (form.value.publication_year) {
      formData.append('publication_year', form.value.publication_year)
    }
    
    if (form.value.slug) {
      formData.append('slug', form.value.slug)
    }
    
    if (form.value.category_id) {
      formData.append('category_id', form.value.category_id)
    }
    
    if (thumbnailFile.value) {
      formData.append('thumbnail', thumbnailFile.value)
    }

    // Append images gallery
    if (imageFiles.value.length > 0) {
      imageFiles.value.forEach(file => {
        formData.append('images', file)
      })
    }
    
    const url = isEditing.value 
      ? `${API_URL}/products/${productId.value}` 
      : `${API_URL}/products`
    const method = isEditing.value ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: formData
    })
    
    const json = await res.json()
    
    if (json.status) {
      showToast(isEditing.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!')
      // Redirect back to list after short delay
      setTimeout(() => {
        router.push('/admin/products')
      }, 1000)
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error('Error saving product:', error)
    showToast('Lỗi khi lưu sản phẩm', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchProductDetail()
})
</script>
