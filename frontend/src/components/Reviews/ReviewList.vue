<template>
  <div class="space-y-8">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Rating Summary Section -->
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h3>
        
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- Average Rating Circle -->
          <div class="flex flex-col items-center justify-center min-w-[150px]">
            <div class="text-5xl font-bold text-gray-900 mb-2">
              {{ averageRating }}<span class="text-2xl text-gray-400 font-normal">/5</span>
            </div>
            <div class="flex text-yellow-400 text-xl gap-1 mb-2">
              <span v-for="n in 5" :key="n">{{ n <= Math.round(averageRating) ? '★' : '☆' }}</span>
            </div>
            <div class="text-sm text-gray-500">({{ reviews.length }} đánh giá)</div>
          </div>

          <!-- Progress Bars -->
          <div class="flex-1 w-full space-y-3">
            <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-4 text-sm">
              <span class="w-12 font-medium text-gray-600">{{ star }} sao</span>
              <div class="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  :style="{ width: getPercentage(star) + '%' }"
                ></div>
              </div>
              <span class="w-10 text-right text-gray-500">{{ getPercentage(star) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Review List -->
      <div v-if="reviews.length > 0" class="space-y-6">
        <div v-for="review in reviews" :key="review.id" class="border-b border-gray-100 pb-6 last:border-0">
          <div class="flex items-start gap-4">
            <!-- Avatar Placeholder -->
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm shrink-0">
              {{ getInitials(review.user?.name) }}
            </div>
            
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-gray-900">{{ review.user?.name || 'Người dùng ẩn danh' }}</h4>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</span>
                  
                  <!-- Kebab Menu -->
                  <div v-if="authStore.isAuthenticated" class="relative group">
                    <button class="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    <!-- Dropdown -->
                    <div class="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block z-10">
                      <!-- Owner Actions -->
                      <template v-if="authStore.user?.id === review.user_id">
                        <button 
                          @click="$emit('edit-review', review)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          Sửa
                        </button>
                        <button 
                          @click="deleteReview(review.id)" 
                          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Xóa
                        </button>
                      </template>
                      
                      <!-- Other User Actions -->
                      <template v-else>
                        <button 
                          @click="reportReview(review.id)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          Báo cáo
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rating Stars for Review -->
              <div class="flex text-yellow-400 text-sm mb-2">
                <span v-for="n in 5" :key="n">{{ n <= review.rating ? '★' : '☆' }}</span>
              </div>
              
              <!-- Review Comment -->
              <p class="text-gray-700 text-sm leading-relaxed">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-6 text-gray-500">
        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        <p>Hãy là người đầu tiên đánh giá!</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const emit = defineEmits(['edit-review', 'refresh']);

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  },
  reviews: {
    type: Array,
    default: () => []
  }
});

const API_URL = import.meta.env.VITE_API_URL;

// Computed Statistics
const averageRating = computed(() => {
  if (props.reviews.length === 0) return 0;
  const total = props.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / props.reviews.length).toFixed(1).replace(/\.0$/, '');
});

const getPercentage = (star) => {
  if (props.reviews.length === 0) return 0;
  const count = props.reviews.filter(r => r.rating === star).length;
  return Math.round((count / props.reviews.length) * 100);
};

const getInitials = (name) => {
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const deleteReview = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
  
  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      toast.success('Đã xóa đánh giá');
      emit('refresh');
      // fetchReviews removed, relying on parent refresh
    } else {
      const data = await res.json();
      toast.error(data.message || 'Lỗi khi xóa đánh giá');
    }
  } catch (err) {
    console.error(err);
    toast.error('Lỗi kết nối');
  }
};

const reportReview = async (id) => {
  const reason = prompt('Nhập lý do báo cáo:');
  if (!reason) return;

  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/${id}/report`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ reason })
    });
    
    if (res.ok) {
      toast.success('Đã gửi báo cáo vi phạm');
    } else {
      const data = await res.json();
      toast.error(data.message || 'Lỗi khi gửi báo cáo');
    }
  } catch (err) {
    console.error(err);
    toast.error('Lỗi kết nối');
  }
};
</script>
