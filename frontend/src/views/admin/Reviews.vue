<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý Đánh giá & Bình luận</h2>
        <p class="text-muted-foreground">Xem và quản lý đánh giá từ khách hàng</p>
      </div>
    </div>

    <!-- Tabs và Thanh tìm kiếm -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
      <div class="flex gap-2 w-full md:w-auto overflow-x-auto">
        <button 
          @click="currentTab = 'all'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors', currentTab === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted']"
        >
          Tất cả đánh giá
        </button>
        <button 
          @click="currentTab = 'reported'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors', currentTab === 'reported' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted']"
        >
          Báo cáo vi phạm
        </button>
      </div>

      <div class="w-full md:w-72 relative" v-if="currentTab === 'all'">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm người dùng, sản phẩm..." 
          class="w-full h-10 pl-10 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          @input="debouncedSearch"
        />
        <button v-if="searchQuery" @click="searchQuery = ''; fetchReviews(1)" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">✕</button>
      </div>
    </div>

    <div class="bg-card rounded-xl border overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-muted-foreground">
        Đang tải dữ liệu...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <!-- TODO: Change table headers based on standard reviews or reported reviews -->
          <thead class="bg-muted/50" v-if="currentTab === 'all'">
            <tr>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Người dùng</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Sản phẩm</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Đánh giá</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Nội dung</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Ngày tạo</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <thead class="bg-muted/50" v-else>
            <tr>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Người báo cáo</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Lý do</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Đánh giá gốc</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Người bị báo cáo</th>
              <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          
          <tbody v-if="currentTab === 'all'">
            <tr v-if="reviews.length === 0">
              <td colspan="6" class="p-8 text-center text-muted-foreground">Không có đánh giá nào</td>
            </tr>
            <tr v-for="review in reviews" :key="review.id" class="border-t border-border hover:bg-muted/50 transition-colors text-sm">
              <td class="p-4">
                <div class="font-medium">{{ review.user?.name || 'Unknown' }}</div>
                <div class="text-xs text-muted-foreground">{{ review.user?.email }}</div>
              </td>
              <td class="p-4">
                <router-link :to="`/san-pham/${review.product?.slug || review.product?.id}`" target="_blank" class="text-primary hover:underline">
                  {{ review.product?.name || 'Sản phẩm đã xóa' }}
                </router-link>
              </td>
              <td class="p-4">
                <div class="flex text-yellow-400">
                  <span v-for="n in 5" :key="n">{{ n <= review.rating ? '★' : '☆' }}</span>
                </div>
              </td>
              <td class="p-4 max-w-xs truncate" :title="review.comment">
                {{ review.comment }}
              </td>
              <td class="p-4 text-muted-foreground whitespace-nowrap">
                {{ formatReviewDate(review.created_at) }}
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1">
                  <div class="relative">
                    <select 
                      :value="review.is_hidden" 
                      @change="handleStatusChange(review, $event)"
                      class="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold border outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all"
                      :class="review.is_hidden 
                        ? 'bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-200' 
                        : 'bg-green-50 text-green-700 border-green-200 focus:ring-green-200'"
                    >
                      <option :value="false" class="bg-white text-gray-900 font-medium">Đang hiện</option>
                      <option :value="true" class="bg-white text-gray-900 font-medium">Đang ẩn</option>
                      <option value="DELETE" class="bg-white text-red-600 font-bold">Xóa vĩnh viễn</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" :class="review.is_hidden ? 'text-gray-500' : 'text-green-600'">
                      <svg class="h-3 w-3 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Reported Reviews Table Body -->
          <tbody v-else>
            <tr v-if="reportedReviews.length === 0">
              <td colspan="5" class="p-8 text-center text-muted-foreground">Không có báo cáo vi phạm nào</td>
            </tr>
            <tr v-for="report in reportedReviews" :key="report.id" class="border-t border-border hover:bg-muted/50 transition-colors text-sm">
               <td class="p-4">
                <div class="font-medium">{{ report.reporter?.name || 'Unknown' }}</div>
                <div class="text-xs text-muted-foreground">{{ formatReviewDate(report.created_at) }}</div>
              </td>
              <td class="p-4 max-w-[200px] break-words">
                <span class="font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs">{{ report.reason }}</span>
              </td>
              <td class="p-4 max-w-xs">
                <div class="text-xs text-muted-foreground mb-1">Trên sản phẩm: 
                  <router-link :to="`/san-pham/${report.review?.product?.id}`" target="_blank" class="text-primary hover:underline">
                    {{ report.review?.product?.name || 'Sản phẩm' }}
                  </router-link>
                </div>
                <div class="italic border-l-2 border-gray-200 pl-2 text-gray-600 truncate" :title="report.review?.comment">
                  "{{ report.review?.comment || '(Trống)' }}"
                </div>
              </td>
              <td class="p-4">
                <div class="font-medium">{{ report.review?.user?.name || 'Unknown' }}</div>
              </td>
              <td class="p-4">
                <!-- Tái sử dụng select ẩn/hiện, xóa cho review gốc -->
                <div class="flex items-center gap-1" v-if="report.review">
                  <div class="relative">
                    <select 
                      :value="report.review.is_hidden" 
                      @change="handleStatusChange(report.review, $event)"
                      class="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold border outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all"
                      :class="report.review.is_hidden 
                        ? 'bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-200' 
                        : 'bg-green-50 text-green-700 border-green-200 focus:ring-green-200'"
                    >
                      <option :value="false" class="bg-white text-gray-900 font-medium">Đang hiện</option>
                      <option :value="true" class="bg-white text-gray-900 font-medium">Đang ẩn</option>
                      <option value="DELETE" class="bg-white text-red-600 font-bold">Xóa vĩnh viễn</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" :class="report.review.is_hidden ? 'text-gray-500' : 'text-green-600'">
                      <svg class="h-3 w-3 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div v-else class="text-xs text-gray-400">Đánh giá đã bị xóa</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Phân trang -->
    <div v-if="totalReviews > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hiển thị {{ (currentPage - 1) * limit + 1 }}-{{ Math.min(currentPage * limit, totalReviews) }} trong tổng số {{ totalReviews }} đánh giá
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

  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { formatDate } from '@/utils/format';
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;
const { confirm } = useConfirmDialog()

const currentTab = ref('all') // 'all' or 'reported'
const reviews = ref([]);
const reportedReviews = ref([]);
const loading = ref(false);

// Tìm kiếm & Phân trang
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalReviews = ref(0)
const limit = 10

watch(currentTab, () => {
  searchQuery.value = ''
  fetchReviews(1)
})

let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchReviews(1)
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
  fetchReviews(page)
}

const formatReviewDate = (dateString) => {
  return formatDate(dateString);
};

const fetchReviews = async (page = 1) => {
  loading.value = true;
  try {
    const token = authStore.accessToken;
    let url = ''
    
    if (currentTab.value === 'reported') {
      url = `${API_URL}/reviews/admin/reported?page=${page}&limit=${limit}`
    } else {
      url = `${API_URL}/reviews/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery.value)}`
    }

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.status) {
      if (currentTab.value === 'reported') {
        reportedReviews.value = json.data;
      } else {
        reviews.value = json.data;
      }
      
      if (json.pagination) {
        currentPage.value = json.pagination.page
        totalPages.value = json.pagination.totalPages
        totalReviews.value = json.pagination.total
      }
    }
  } catch (error) {
    console.error('Lỗi tải đánh giá:', error);
  } finally {
    loading.value = false;
  }
};

const handleStatusChange = async (review, event) => {
  const newValue = event.target.value;
  
  if (newValue === 'DELETE') {
    deleteReview(review.id);
    return;
  }

  const boolValue = newValue === 'true';
  
  if (boolValue !== review.is_hidden) {
    await toggleVisibility(review);
  }
};

const toggleVisibility = async (review) => {
  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/${review.id}/visibility`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      const data = await res.json();
      review.is_hidden = data.data.is_hidden;
      toast.success('Cập nhật trạng thái thành công');
    } else {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteReview = async (id) => {
  const ok = await confirm('Xóa đánh giá', 'Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn? Hành động này không thể hoàn tác.', { actionLabel: 'Xóa vĩnh viễn' })
  if (!ok) return
  
  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      toast.success('Đã xóa đánh giá');
      await fetchReviews(currentPage.value);
    } else {
      toast.error('Lỗi khi xóa');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchReviews();
});
</script>
