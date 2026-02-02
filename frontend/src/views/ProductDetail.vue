<template>
  <div class="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <!-- Reduced Container Width (max-w-5xl) -->
    <div v-else-if="product" class="space-y-6 max-w-5xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500">
        <router-link to="/" class="hover:text-primary transition-colors">Trang chủ</router-link>
        <span class="mx-2">/</span>
        <router-link to="/products" class="hover:text-primary transition-colors">Sản phẩm</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900 font-medium truncate max-w-xs">{{ product.name }}</span>
      </nav>

      <!-- Main Content -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <div class="grid md:grid-cols-12 gap-8">
          <!-- Gallery / Image (5 columns) -->
          <div class="md:col-span-5 space-y-4">
            <!-- Main Image -->
            <div class="aspect-[3/4] bg-white rounded-lg overflow-hidden border border-gray-100 relative group">
               <img 
                :src="activeImage || product.thumbnail || 'https://via.placeholder.com/600x800?text=No+Image'" 
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <!-- Sale Badge -->
              <div v-if="calculateDiscount(product.price, product.original_price) > 0" class="absolute top-3 left-3 z-10">
                 <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                   -{{ calculateDiscount(product.price, product.original_price) }}%
                 </span>
              </div>
            </div>

            <!-- Thuimbnails List -->
            <div v-if="galleryImages.length > 0" class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
               <button 
                v-for="(img, idx) in galleryImages" 
                :key="idx"
                @click="activeImage = img"
                :class="['w-16 h-20 flex-shrink-0 border rounded overflow-hidden p-1', activeImage === img ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300']"
               >
                 <img :src="img" class="w-full h-full object-contain mix-blend-multiply" />
               </button>
            </div>
          </div>

          <!-- Product Info (7 columns) -->
          <div class="md:col-span-7 flex flex-col">
            <h1 class="text-2xl font-bold text-gray-900 leading-tight mb-2">
              {{ product.name }}
            </h1>

            <div class="flex items-center gap-4 mb-4">
              <div class="flex items-center gap-1">
                <div class="flex text-yellow-400 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span class="text-sm text-gray-500">(0 đánh giá)</span>
              </div>
              <div class="h-4 w-px bg-gray-300"></div>
              <span class="text-sm text-green-600 font-medium">Còn hàng</span>
              <div class="h-4 w-px bg-gray-300"></div>
              <button @click="toggleFavorite(product)" class="flex items-center gap-1 text-sm font-medium transition-colors" :class="isFavorited(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isFavorited(product.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isFavorited(product.id) ? 'Đã thích' : 'Yêu thích' }}
              </button>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-6">
               <div class="flex items-baseline gap-3">
                 <span class="text-3xl font-bold text-primary">{{ formatCurrency(product.price) }}</span>
                 <span v-if="product.original_price" class="text-lg text-gray-400 line-through">
                    {{ formatCurrency(product.original_price) }}
                 </span>
               </div>
            </div>

            <!-- Product Details -->
            <div class="space-y-3 mb-8 text-sm text-gray-700 bg-white/50 rounded-lg">
               <div v-if="product.author" class="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span class="w-28 text-gray-500">Tác giả:</span>
                  <span class="font-medium text-gray-900 flex-1">{{ product.author }}</span>
               </div>
               <div v-if="product.publisher" class="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span class="w-28 text-gray-500">Nhà xuất bản:</span>
                  <span class="font-medium text-gray-900 flex-1">{{ product.publisher }}</span>
               </div>
               <div v-if="product.publication_year" class="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span class="w-28 text-gray-500">Năm xuất bản:</span>
                  <span class="font-medium text-gray-900 flex-1">{{ product.publication_year }}</span>
               </div>
               <div class="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span class="w-28 text-gray-500">Mã sản phẩm:</span>
                  <span class="font-medium text-gray-900 flex-1">#{{ product.id }}</span>
               </div>
               <div class="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span class="w-28 text-gray-500">Danh mục:</span>
                  <span class="font-medium text-primary flex-1">{{ product.category_name || 'Khác' }}</span>
               </div>
            </div>

            <!-- Actions -->
            <div class="mt-auto space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex items-center border rounded-lg bg-white">
                  <button @click="quantity > 1 && quantity--" class="p-2.5 hover:text-primary transition-colors disabled:opacity-50" :disabled="quantity <= 1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                  </button>
                  <input type="number" v-model="quantity" class="w-12 text-center border-none focus:ring-0 p-0 text-gray-900 font-medium bg-transparent" min="1" />
                  <button @click="quantity++" class="p-2.5 hover:text-primary transition-colors">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
                <span class="text-sm text-gray-500">{{ product.quantity }} sản phẩm có sẵn</span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button @click="addToCart" class="h-11 flex items-center justify-center rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Thêm vào giỏ hàng
                </button>
                <button @click="buyNow" class="h-11 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all transform hover:-translate-y-0.5">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Detailed Specs / Description Tabs -->
      <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="border-b px-6">
           <div class="flex gap-8">
             <button class="py-3 text-primary font-bold border-b-2 border-primary text-sm uppercase">Mô tả sản phẩm</button>
             <button class="py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors text-sm uppercase">Đánh giá (0)</button>
           </div>
        </div>
        <div class="p-6">
           <div class="relative">
             <div 
               :class="['product-content max-w-none text-gray-700 text-sm overflow-hidden transition-all duration-500', isExpanded ? 'max-h-full' : 'max-h-[300px]']" 
               v-html="product.description || 'Nội dung đang cập nhật...'"
             ></div>
             
             <!-- Fade Effect -->
             <div v-if="!isExpanded" class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
           </div>

           <!-- Toggle Button -->
           <div class="text-center mt-4">
             <button 
               @click="isExpanded = !isExpanded" 
               class="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors border border-primary/30 px-6 py-2 rounded-full hover:bg-primary/5 text-sm"
             >
               {{ isExpanded ? 'Thu gọn' : 'Xem thêm' }}
               <svg v-if="!isExpanded" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
               </svg>
               <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
               </svg>
             </button>
           </div>
        </div>
      </div>
    </div>
    
    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <h2 class="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
      <router-link to="/products" class="text-primary hover:underline mt-4 inline-block text-sm">Quay lại danh sách</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useFavoriteStore } from '@/stores/favorite'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const isFavorited = (id) => favoriteStore.isFavorited(id)
const toggleFavorite = (p) => favoriteStore.toggleFavorite(p)
const API_URL = import.meta.env.VITE_API_URL

const product = ref(null)

// ... existing refs ...

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value)
    alert('Đã thêm vào giỏ hàng')
  }
}

const buyNow = () => {
  if (product.value) {
    cartStore.buyNow(product.value, quantity.value)
    router.push('/checkout')
  }
}
const loading = ref(true)
const quantity = ref(1)
const activeImage = ref('')
const galleryImages = ref([])
const isExpanded = ref(false)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

const calculateDiscount = (price, original) => {
  if (!original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}

const fetchProductDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const res = await fetch(`${API_URL}/products/${id}`)
    const json = await res.json()
    
    if (json.status) {
      const data = json.data
      product.value = data
      
      // Setup Gallery
      const images = []
      if (data.thumbnail) images.push(data.thumbnail)
      if (Array.isArray(data.images) && data.images.length > 0) {
        images.push(...data.images)
      } else if (typeof data.images === 'string') {
         // Case: images might be stringified JSON
         try {
            const parsed = JSON.parse(data.images)
            if (Array.isArray(parsed)) images.push(...parsed)
         } catch(e) {}
      }
      
      // Remove duplicates
      galleryImages.value = [...new Set(images)]
      
      // Set active
      activeImage.value = data.thumbnail || galleryImages.value[0] || ''
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

// Watch params change to reload
watch(() => route.params.id, () => {
  fetchProductDetail()
})

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
/* CSS xử lý nội dung HTML từ Editor */
.product-content {
  line-height: 1.6;
  font-size: 1rem;
  color: #374151;
  word-wrap: break-word; /* Xuống dòng nếu chữ quá dài */
}

/* Ép buộc xuống dòng cho mọi thẻ p, div */
.product-content :deep(p),
.product-content :deep(div) {
  display: block !important;
  margin-bottom: 0.8rem;
  margin-top: 0;
}

/* Xử lý thẻ br - Nguyên nhân chính gây mất xuống dòng */
.product-content :deep(br) {
  display: block !important;
  content: "";
  margin-bottom: 0.5rem; /* Tạo khoảng hở khi enter 1 lần soft-break */
}

/* Các thẻ tiêu đề */
.product-content :deep(h1), 
.product-content :deep(h2), 
.product-content :deep(h3),
.product-content :deep(h4) {
  display: block !important;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
  line-height: 1.3;
  clear: both;
}

.product-content :deep(h1) { font-size: 1.5rem; }
.product-content :deep(h2) { font-size: 1.25rem; }
.product-content :deep(h3) { font-size: 1.1rem; }

/* Danh sách */
.product-content :deep(ul), 
.product-content :deep(ol) {
  display: block !important;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.product-content :deep(ul) { list-style-type: disc; }
.product-content :deep(ol) { list-style-type: decimal; }

.product-content :deep(li) {
  display: list-item !important;
  margin-bottom: 0.25rem;
}

/* Định dạng chữ */
.product-content :deep(strong), 
.product-content :deep(b) {
  font-weight: 700 !important;
  color: #111827;
}

.product-content :deep(em), 
.product-content :deep(i) {
  font-style: italic;
}

.product-content :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}

/* Trích dẫn */
.product-content :deep(blockquote) {
  display: block !important;
  border-left: 4px solid #e5e7eb;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background-color: #f9fafb;
  font-style: italic;
  color: #4b5563;
}

/* Hình ảnh */
.product-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  display: block;
}
</style>
